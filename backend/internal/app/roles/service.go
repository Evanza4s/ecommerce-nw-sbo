package roles

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/roles/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
)

type Service interface {
	GetAllPagination(payload *model.JwtPayload, req *schemas.GetAllPagination) (int, interface{})
	GetAll(payload *model.JwtPayload, req *schemas.GetAll) (int, interface{})
	GetByID(payload *model.JwtPayload, id string) (int, interface{})
	Create(payload *model.JwtPayload, req *schemas.RequestRoles) (int, interface{})
	Update(payload *model.JwtPayload, id string, req *schemas.RequestRoles) (int, interface{})
	Delete(payload *model.JwtPayload, id string) (int, interface{})
}
