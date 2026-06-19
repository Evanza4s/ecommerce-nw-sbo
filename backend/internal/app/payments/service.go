package payments

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/payments/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
)

type Service interface {
	HandleMidtransWebhook(req *schemas.MidtransNotificationRequest) error
	GetAllPagination(payload *model.JwtPayload, req *schemas.GetAllPagination) (int, interface{})
}
