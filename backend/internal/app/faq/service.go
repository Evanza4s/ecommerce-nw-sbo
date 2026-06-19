package faq

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/faq/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
)

type Service interface {
	GetAllPagination(payload *model.JwtPayload, req *schemas.GetAllPagination) (int, interface{})
	GetAll(payload *model.JwtPayload, req *schemas.GetAll) (int, interface{})
	GetById(payload *model.JwtPayload, id string) (int, interface{})
	Create(payload *model.JwtPayload, req *schemas.FAQRequest) (int, interface{})
	Update(payload *model.JwtPayload, id string, req *schemas.FAQRequest) (int, interface{})
	Delete(payload *model.JwtPayload, id string) (int, interface{})
}
