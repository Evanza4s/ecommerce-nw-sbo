package vouchers

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/vouchers/schemas"
)

type Service interface {
	GetAll(req *schemas.GetAllPagination) (int, interface{})
	GetAllNoPagination(req *schemas.GetAllPagination) (int, interface{})
	GetByID(id string) (int, interface{})
	Create(req *schemas.CreateVoucher) (int, interface{})
	Update(id string, req *schemas.UpdateVoucher) (int, interface{})
	Delete(id string) (int, interface{})
	Validate(req *schemas.ValidateVoucherRequest) (int, interface{})
}
