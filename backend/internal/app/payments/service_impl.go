package payments

import (
	"errors"
	"log"
	"net/http"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/payments/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/repository"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/repository/repository_impl"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/res"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ServiceImpl struct {
	orderRepo   repository.OrderRepository
	paymentRepo repository.PaymentRepository
}

func NewServiceImpl() *ServiceImpl {
	return &ServiceImpl{
		orderRepo:   repository_impl.NewOrderRepositoryImpl(),
		paymentRepo: repository_impl.NewPaymentRepositoryImpl(),
	}
}

func (s ServiceImpl) GetAllPagination(payload *model.JwtPayload, req *schemas.GetAllPagination) (int, interface{}) {
	data, err := util.StructToMap(req)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgGetFailed, nil)
	}

	mapper := util.MapToCriteriaObject(data, "mst_payment")
	criteria := utils.CustomCriteria(mapper)
	pagination, pageInfo := utils.Paginate(data)

	dPayment, count, errGet := s.paymentRepo.GetAllPagination(criteria, pagination)
	if errGet != nil {
		if errors.Is(errGet, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, []string{errGet.Error()}, res.MsgGetFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{errGet.Error()}, res.MsgGetFailed, nil)
	}

	pageInfo.Count = count
	return res.BuildCustomResponsePagination(res.StatusSuccess, http.StatusOK, nil, res.MsgGetSuccess, dPayment, pageInfo)
}

func (s ServiceImpl) HandleMidtransWebhook(req *schemas.MidtransNotificationRequest) error {
	orderID, err := uuid.Parse(req.OrderID)
	if err != nil {
		return err
	}

	orderStatus := "Pending"
	paymentStatus := "Pending"

	switch req.TransactionStatus {
	case "capture":
		if req.FraudStatus == "challenge" {
			paymentStatus = "Challenge"
		} else if req.FraudStatus == "accept" {
			paymentStatus = "Success"
			orderStatus = "Processing"
		}
	case "settlement":
		paymentStatus = "Success"
		orderStatus = "Processing"
	case "cancel", "deny", "expire":
		paymentStatus = "Failed"
		orderStatus = "Canceled"
	case "pending":
		paymentStatus = "Pending"
		orderStatus = "Pending"
	}

	log.Printf("Webhook received for order %s. Status: %s\n", req.OrderID, paymentStatus)

	_ = s.orderRepo.UpdatePaymentStatus(orderID, paymentStatus)
	_ = s.orderRepo.UpdateOrderStatus(orderID, orderStatus)

	return nil
}
