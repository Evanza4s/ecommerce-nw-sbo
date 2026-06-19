package orders

import (
	"fmt"
	"math/rand"
	"net/http"
	"time"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/orders/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/repository"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/repository/repository_impl"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/db"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/midtrans"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/rajaongkir"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/res"
	"github.com/google/uuid"
	midtransSnap "github.com/midtrans/midtrans-go/snap"
	midtransCore "github.com/midtrans/midtrans-go"
)

type ServiceImpl struct {
	orderRepo   repository.OrderRepository
	cartRepo    repository.CartRepository
	productRepo repository.ProductRepository
	addressRepo repository.AddressRepository
	notifRepo   repository.NotificationRepository
	voucherRepo repository.VoucherRepository
}

func NewServiceImpl() *ServiceImpl {
	return &ServiceImpl{
		orderRepo:   repository_impl.NewOrderRepositoryImpl(),
		cartRepo:    repository_impl.NewCartRepositoryImpl(),
		productRepo: repository_impl.NewProductRepositoryImpl(),
		addressRepo: repository_impl.NewAddressRepositoryImpl(),
		notifRepo:   repository_impl.NewNotificationRepositoryImpl(),
		voucherRepo: repository_impl.NewVoucherRepositoryImpl(),
	}
}

func generateOrderNumber() string {
	return fmt.Sprintf("ORD-%s-%04d", time.Now().Format("20060102"), rand.Intn(9999))
}

func (s ServiceImpl) Checkout(payload *model.JwtPayload, userID string, req *schemas.CheckoutRequest) (int, interface{}) {
	parsedUserID, err := uuid.Parse(userID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id"}, "Failed checkout", nil)
	}

	parsedAddressID, err := uuid.Parse(req.AddressID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid address id"}, "Failed checkout", nil)
	}

	// 1. Dapatkan Cart
	cart, err := s.cartRepo.FindCartByUserID(parsedUserID)
	if err != nil || len(cart.Items) == 0 {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"cart is empty"}, "Failed checkout", nil)
	}

	// 2. Dapatkan Address (untuk City ID RajaOngkir, sementara asumsikan alamat ada)
	address, err := s.addressRepo.FindByID(parsedAddressID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"address not found"}, "Failed checkout", nil)
	}

	// 3. Hitung Subtotal dan Berat
	var subtotal float64
	var totalWeight int
	var orderItems []model.MstOrderItem

	for _, item := range cart.Items {
		variant := item.ProductVariantRef
		product := variant.ProductRef

		if variant.Stock < item.Quantity {
			return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{fmt.Sprintf("insufficient stock for %s", product.ProductName)}, "Failed checkout", nil)
		}

		price := product.Price
		if product.DiscountPrice > 0 {
			price = product.DiscountPrice
		}
		price += variant.PriceAdjustment

		subtotal += price * float64(item.Quantity)
		
		// asumsi berat varian dalam gram
		weight := int(variant.Weight * 1000) 
		if weight == 0 {
			weight = 1000 // default 1kg jika 0
		}
		totalWeight += weight * item.Quantity

		orderItems = append(orderItems, model.MstOrderItem{
			ProductVariantID: variant.ID,
			Quantity:         item.Quantity,
			Price:            price,
			Subtotal:         price * float64(item.Quantity),
		})
	}

	// 4. Hitung Ongkir dari RajaOngkir
	// FIXME: Gunakan City ID valid untuk Origin dan Destination. 
	// Karena MstAddress saat ini menyimpan nama kota string,
	// kita membutuhkan mapping atau input City ID yang valid dari frontend.
	// Asumsi untuk saat ini: req.Destination bisa dipassing by frontend atau menggunakan 1 default "114" (Denpasar).
	// Di sini kita coba pakai 114 (Denpasar) sebagai tujuan jika `address.City` bukan numeric ID.
	originCityID := "153" // Jakarta Selatan
	destCityID := "114"   // Default Denpasar

	if resolvedID, err := rajaongkir.GetCityIDByName(address.City); err == nil && resolvedID != "" {
		destCityID = resolvedID
	}

	roReq := &rajaongkir.CostRequest{
		Origin:      originCityID,
		Destination: destCityID,
		Weight:      totalWeight,
		Courier:     req.Courier,
	}

	roRes, err := rajaongkir.CalculateCost(roReq)
	var shippingCost float64 = 0

	if err == nil && len(roRes.RajaOngkir.Results) > 0 {
		for _, cost := range roRes.RajaOngkir.Results[0].Costs {
			if cost.Service == req.ShippingService && len(cost.Cost) > 0 {
				shippingCost = float64(cost.Cost[0].Value)
				break
			}
		}
	}

	if shippingCost == 0 {
		shippingCost = 15000 // Fallback sementara jika api key rajaongkir error/limit
	}

	// 5. Validasi Voucher
	var discountAmount float64 = 0
	var appliedVoucher *model.MstVoucher
	if req.VoucherCode != "" {
		voucher, err := s.voucherRepo.GetByCode(db.GetManager(), req.VoucherCode)
		if err == nil && voucher.IsActive {
			nowTime := time.Now()
			isValidDate := true
			if voucher.StartDate != nil && voucher.StartDate.After(nowTime) {
				isValidDate = false
			}
			if voucher.EndDate != nil && voucher.EndDate.Before(nowTime) {
				isValidDate = false
			}

			isValidQuota := true
			if voucher.MaxUsage > 0 && voucher.UsedCount >= voucher.MaxUsage {
				isValidQuota = false
			}

			if isValidDate && isValidQuota && subtotal >= voucher.MinimumPurchase {
				if voucher.DiscountType == "Percentage" {
					discountAmount = (voucher.DiscountValue / 100.0) * subtotal
				} else if voucher.DiscountType == "Nominal" {
					discountAmount = voucher.DiscountValue
				}

				if discountAmount > subtotal {
					discountAmount = subtotal
				}

				appliedVoucher = voucher
			}
		}
	}

	grandTotal := subtotal + shippingCost - discountAmount

	// 6. Buat Order
	now, _ := util.GetTimeNow("Asia/Jakarta")
	orderNumber := generateOrderNumber()

	order := &model.MstOrders{
		OrderNumber:    orderNumber,
		UserID:         parsedUserID,
		AddressID:      parsedAddressID,
		SubtotalAmount: subtotal,
		DiscountAmount: discountAmount,
		ShippingCost:   shippingCost,
		GrandTotal:     grandTotal,
		OrderStatus:    "Pending",
		PaymentStatus:  "Pending",
		Items:          orderItems,
		Payment: &model.MstPayment{
			Amount:        grandTotal,
			PaymentStatus: "Pending",
		},
		Shipping: &model.MstShipping{
			CourierName:    req.Courier,
			ServiceName:    req.ShippingService,
			ShippingStatus: "Pending",
		},
	}
	order.CreatedAt = now
	if payload != nil {
		order.CreatedBy = payload.UserID
	}

	savedOrder, err := s.orderRepo.CreateOrder(order)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, "Failed checkout", nil)
	}

	// Update voucher usage if applied
	if appliedVoucher != nil {
		appliedVoucher.UsedCount += 1
		_ = s.voucherRepo.Update(db.GetManager(), appliedVoucher)
	}

	// 6. Integrasi Midtrans Snap
	snapReq := &midtransSnap.Request{
		TransactionDetails: midtransCore.TransactionDetails{
			OrderID:  savedOrder.ID.String(),
			GrossAmt: int64(grandTotal),
		},
		CreditCard: &midtransSnap.CreditCardDetails{
			Secure: true,
		},
		CustomerDetail: &midtransCore.CustomerDetails{
			FName: address.ReceiverName,
			Email: "customer@example.com", // Get real email from user
			Phone: address.PhoneNumber,
		},
	}

	snapResp, midtransErr := midtrans.CreateSnapTransaction(snapReq)
	if midtransErr != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{midtransErr.Message}, "Failed midtrans", nil)
	}

	// Update Payment Reference with Snap Token
	_ = s.orderRepo.UpdatePaymentReference(savedOrder.ID, snapResp.Token)

	// 7. Kosongkan Cart
	_ = s.cartRepo.ClearCart(cart.ID)

	// 8. Return Redirect URL
	return res.BuildCustomResponse(res.StatusSuccess, http.StatusCreated, nil, "Checkout success", schemas.CheckoutResponse{
		OrderID:     savedOrder.ID.String(),
		OrderNumber: orderNumber,
		RedirectURL: snapResp.RedirectURL,
		SnapToken:   snapResp.Token,
	})
}

func (s ServiceImpl) GetAllOrders(page, limit int, search string, status string) (int, interface{}) {
	offset := (page - 1) * limit
	orders, total, err := s.orderRepo.FindAllOrders(limit, offset, search, status)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, "Failed to get orders", nil)
	}

	pageInfo := &utils.PaginationInfoDTO{
		PageSize:   limit,
		Page:       page,
		Count:      total,
		TotalPages: utils.CalculateTotalPages(total, limit),
	}

	return res.BuildCustomResponsePagination(res.StatusSuccess, http.StatusOK, nil, "Orders fetched successfully", orders, pageInfo)
}

func (s ServiceImpl) GetOrderByID(id string) (int, interface{}) {
	orderID, err := uuid.Parse(id)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"Invalid Order ID"}, "Invalid request", nil)
	}

	order, err := s.orderRepo.FindOrderByID(orderID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusNotFound, []string{err.Error()}, "Order not found", nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, "Get order success", order)
}

func (s ServiceImpl) GetSnapToken(orderID string, userID string) (int, interface{}) {
	oID, err := uuid.Parse(orderID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"Invalid Order ID"}, "Invalid request", nil)
	}

	uID, err := uuid.Parse(userID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"Invalid User ID"}, "Invalid request", nil)
	}

	order, err := s.orderRepo.FindOrderByID(oID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusNotFound, []string{err.Error()}, "Order not found", nil)
	}

	// Make sure the order belongs to the user requesting it
	if order.UserID != uID {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusForbidden, []string{"Access denied"}, "You don't have permission to pay for this order", nil)
	}

	// Check if order is still pending
	if order.PaymentStatus != "Pending" {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"Order is not pending"}, "Cannot pay for non-pending order", nil)
	}

	// Return token from PaymentReference
	if order.Payment == nil || order.Payment.PaymentReference == "" {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusNotFound, []string{"Snap token not found"}, "Failed to retrieve payment token", nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, "Get snap token success", map[string]string{
		"snap_token": order.Payment.PaymentReference,
	})
}

func (s ServiceImpl) UpdateOrderStatus(id string, req *schemas.UpdateOrderStatusRequest) (int, interface{}) {
	parsedID, err := uuid.Parse(id)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid order id"}, "Failed to update order", nil)
	}

	order, err := s.orderRepo.FindOrderByID(parsedID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusNotFound, []string{"order not found"}, "Failed to get order", nil)
	}

	if req.OrderStatus != "" {
		if err := s.orderRepo.UpdateOrderStatus(parsedID, req.OrderStatus); err != nil {
			return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, "Failed to update order status", nil)
		}
		
		// Create notification
		s.notifRepo.Save(model.TrxNotification{
			UserID:  order.UserID,
			Title:   "Update Status Pesanan",
			Message: fmt.Sprintf("Pesanan %s Anda kini berstatus: %s", order.OrderNumber, req.OrderStatus),
			Type:    "order",
			IsRead:  false,
		})
	}

	if req.PaymentStatus != "" {
		if err := s.orderRepo.UpdatePaymentStatus(parsedID, req.PaymentStatus); err != nil {
			return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, "Failed to update payment status", nil)
		}

		if req.PaymentStatus == "paid" {
			s.notifRepo.Save(model.TrxNotification{
				UserID:  order.UserID,
				Title:   "Pembayaran Diterima",
				Message: fmt.Sprintf("Pembayaran untuk pesanan %s telah berhasil diterima.", order.OrderNumber),
				Type:    "payment",
				IsRead:  false,
			})
		}
	}

	if req.ShippingStatus != "" || req.TrackingNumber != "" {
		if err := s.orderRepo.UpdateShippingStatus(parsedID, req.ShippingStatus, req.TrackingNumber); err != nil {
			return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, "Failed to update shipping status", nil)
		}
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, "Order status updated successfully", nil)
}

func (s ServiceImpl) GetMyOrders(userID string) (int, interface{}) {
	parsedID, err := uuid.Parse(userID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id"}, "Failed to get orders", nil)
	}

	orders, err := s.orderRepo.FindOrdersByUserID(parsedID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, "Failed to get orders", nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, "Orders fetched successfully", orders)
}
