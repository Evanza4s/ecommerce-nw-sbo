package refunds

import (
	"fmt"
	"math/rand"
	"net/http"
	"time"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/refunds/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/repository"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/repository/repository_impl"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/res"
	"github.com/google/uuid"
)

type ServiceImpl struct {
	refundRepo repository.RefundRepository
	orderRepo  repository.OrderRepository
	roleRepo   repository.RolesRepository
	userRepo   repository.UserRepository
	notifRepo  repository.NotificationRepository
}

func NewServiceImpl() *ServiceImpl {
	return &ServiceImpl{
		refundRepo: repository_impl.NewRefundRepositoryImpl(),
		orderRepo:  repository_impl.NewOrderRepositoryImpl(),
		roleRepo:   repository_impl.NewRolesRepositoryImpl(),
		userRepo:   repository_impl.NewUserRepositoryImpl(),
		notifRepo:  repository_impl.NewNotificationRepositoryImpl(),
	}
}

func generateRefundNumber() string {
	return fmt.Sprintf("REF-%s-%04d", time.Now().Format("20060102"), rand.Intn(9999))
}

func (s ServiceImpl) Create(payload *model.JwtPayload, req *schemas.CreateRefundRequest) (int, interface{}) {
	parsedOrderID, err := uuid.Parse(req.OrderID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid order id"}, "Failed to create refund", nil)
	}

	order, err := s.orderRepo.FindOrderByID(parsedOrderID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusNotFound, []string{"order not found"}, "Failed to create refund", nil)
	}

	// Update order status to indicate refund is pending/requested
	_ = s.orderRepo.UpdateOrderStatus(parsedOrderID, "Refund")

	now, _ := util.GetTimeNow("Asia/Jakarta")
	refund := &model.TrxRefund{
		OrderID:      parsedOrderID,
		UserID:       payload.UserID,
		RefundNumber: generateRefundNumber(),
		RefundType:   "full",
		RefundReason: req.Reason,
		RefundAmount: order.GrandTotal,
		RefundStatus: "pending_confirmation",
	}
	refund.CreatedAt = now

	createdRefund, err := s.refundRepo.CreateRefund(refund)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, "Failed to create refund", nil)
	}

	// If evidence URL provided, you might want to save it to TrxRefundEvidence
	// Assuming TrxRefundEvidence is handled elsewhere or you add it here

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusCreated, nil, "Refund requested successfully", schemas.RefundResponse{
		ID:           createdRefund.ID.String(),
		OrderID:      createdRefund.OrderID.String(),
		RefundNumber: createdRefund.RefundNumber,
		RefundStatus: createdRefund.RefundStatus,
		Reason:       createdRefund.RefundReason,
		RefundAmount: createdRefund.RefundAmount,
		CreatedAt:    createdRefund.CreatedAt.Format(time.RFC3339),
	})
}

func (s ServiceImpl) GetAll(payload *model.JwtPayload, req *schemas.GetAllPagination) (int, interface{}) {
	var refunds []model.TrxRefund
	var err error
	var total int64

	isAdmin := false
	if role, rErr := s.roleRepo.FindById(payload.RoleID); rErr == nil && role != nil {
		if role.IsAdmin || role.IsSuperadmin {
			isAdmin = true
		}
	}

	if !isAdmin && payload.UserID == uuid.Nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusUnauthorized, []string{"unauthorized"}, "Unauthorized access", nil)
	}

	offset := (req.Page - 1) * req.PageSize

	if isAdmin {
		refunds, total, err = s.refundRepo.FindAllRefunds(req.PageSize, offset, req.Search, req.RefundStatus)
	} else {
		// For customer, simple find all for now (could add pagination later if needed)
		refunds, err = s.refundRepo.FindRefundsByUserID(payload.UserID)
		total = int64(len(refunds))
	}

	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, "Failed to get refunds", nil)
	}

	var responseList []schemas.RefundResponse
	for _, r := range refunds {
		customerName := ""
		if r.UserRef != nil {
			customerName = r.UserRef.Fullname
			if customerName == "" {
				customerName = r.UserRef.Username
			}
		}
		evidenceURL := ""
		if len(r.Evidences) > 0 {
			evidenceURL = r.Evidences[0].FileURL
		}
		responseList = append(responseList, schemas.RefundResponse{
			ID:           r.ID.String(),
			OrderID:      r.OrderID.String(),
			RefundNumber: r.RefundNumber,
			RefundStatus: r.RefundStatus,
			Reason:       r.RefundReason,
			RefundAmount: r.RefundAmount,
			CustomerName: customerName,
			EvidenceURL:  evidenceURL,
			CreatedAt:    r.CreatedAt.Format(time.RFC3339),
		})
	}

	if responseList == nil {
		responseList = []schemas.RefundResponse{}
	}

	pageInfo := &utils.PaginationInfoDTO{
		PageSize:   req.PageSize,
		Page:       req.Page,
		Count:      total,
		TotalPages: utils.CalculateTotalPages(total, req.PageSize),
	}

	return res.BuildCustomResponsePagination(res.StatusSuccess, http.StatusOK, nil, "Refunds retrieved successfully", responseList, pageInfo)
}

func (s ServiceImpl) GetByID(payload *model.JwtPayload, id string) (int, interface{}) {
	parsedID, err := uuid.Parse(id)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid refund id"}, "Failed to get refund", nil)
	}

	refund, err := s.refundRepo.FindRefundByID(parsedID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusNotFound, []string{"refund not found"}, "Failed to get refund", nil)
	}

	isAdmin := false
	if role, rErr := s.roleRepo.FindById(payload.RoleID); rErr == nil && role != nil {
		if role.IsAdmin || role.IsSuperadmin {
			isAdmin = true
		}
	}

	if !isAdmin && refund.UserID != payload.UserID {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusForbidden, []string{"unauthorized to view this refund"}, "Failed to get refund", nil)
	}

	customerName := ""
	if refund.UserRef != nil {
		customerName = refund.UserRef.Fullname
		if customerName == "" {
			customerName = refund.UserRef.Username
		}
	}
	evidenceURL := ""
	if len(refund.Evidences) > 0 {
		evidenceURL = refund.Evidences[0].FileURL
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, "Refund retrieved successfully", schemas.RefundResponse{
		ID:           refund.ID.String(),
		OrderID:      refund.OrderID.String(),
		RefundNumber: refund.RefundNumber,
		RefundStatus: refund.RefundStatus,
		Reason:       refund.RefundReason,
		RefundAmount: refund.RefundAmount,
		CustomerName: customerName,
		EvidenceURL:  evidenceURL,
		CreatedAt:    refund.CreatedAt.Format(time.RFC3339),
	})
}

func (s ServiceImpl) UpdateStatus(payload *model.JwtPayload, id string, req *schemas.UpdateRefundStatusRequest) (int, interface{}) {
	role, err := s.roleRepo.FindById(payload.RoleID)
	if err != nil || role == nil || (!role.IsAdmin && !role.IsSuperadmin) {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusForbidden, []string{"unauthorized admin operation"}, "Failed to update refund status", nil)
	}

	parsedRefundID, err := uuid.Parse(id)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid refund id"}, "Failed to update refund status", nil)
	}

	refund, err := s.refundRepo.FindRefundByID(parsedRefundID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusNotFound, []string{"refund request not found"}, "Failed to update refund status", nil)
	}

	if err := s.refundRepo.UpdateRefundStatus(parsedRefundID, req.RefundStatus); err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, "Failed to update refund status", nil)
	}

	if req.RefundStatus == "completed" {
		_ = s.orderRepo.UpdateOrderStatus(refund.OrderID, "Refunded")
	} else if req.RefundStatus == "rejected" {
		_ = s.orderRepo.UpdateOrderStatus(refund.OrderID, "Delivered")
	}
	
	// Create Notification
	s.notifRepo.Save(model.TrxNotification{
		UserID:  refund.UserID,
		Title:   "Update Status Refund",
		Message: fmt.Sprintf("Pengajuan refund %s untuk pesanan Anda kini berstatus: %s", refund.RefundNumber, req.RefundStatus),
		Type:    "refund",
		IsRead:  false,
	})

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, "Refund status updated successfully", nil)
}
