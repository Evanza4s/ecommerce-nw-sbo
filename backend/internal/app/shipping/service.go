package shipping

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/shipping/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
)

type Service interface {
	GetRates(req *schemas.ShippingRatesRequest) (int, interface{})
	GetAllPagination(payload *model.JwtPayload, req *schemas.GetAllPagination) (int, interface{})
}
