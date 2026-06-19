package addresses

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/addresses/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
)

type Service interface {
	GetAddresses(payload *model.JwtPayload, userID string) (int, interface{})
	GetAddressByID(payload *model.JwtPayload, userID string, addressID string) (int, interface{})
	CreateAddress(payload *model.JwtPayload, userID string, req *schemas.CreateAddress) (int, interface{})
	UpdateAddress(payload *model.JwtPayload, userID string, addressID string, req *schemas.UpdateAddress) (int, interface{})
	DeleteAddress(payload *model.JwtPayload, userID string, addressID string) (int, interface{})
	SetDefaultAddress(payload *model.JwtPayload, userID string, addressID string) (int, interface{})
}
