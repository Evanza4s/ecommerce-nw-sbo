package refunds

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/refunds/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
)

type Service interface {
	Create(payload *model.JwtPayload, req *schemas.CreateRefundRequest) (int, interface{})
	GetAll(payload *model.JwtPayload, req *schemas.GetAllPagination) (int, interface{})
	GetByID(payload *model.JwtPayload, id string) (int, interface{})
	UpdateStatus(payload *model.JwtPayload, id string, req *schemas.UpdateRefundStatusRequest) (int, interface{})
}
