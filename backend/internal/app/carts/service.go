package carts

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/carts/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
)

type Service interface {
	GetCart(payload *model.JwtPayload, userID string) (int, interface{})
	AddToCart(payload *model.JwtPayload, userID string, req *schemas.AddToCartRequest) (int, interface{})
	UpdateCartItem(payload *model.JwtPayload, userID string, itemID string, req *schemas.UpdateCartItemRequest) (int, interface{})
	RemoveItem(payload *model.JwtPayload, userID string, itemID string) (int, interface{})
	ClearCart(payload *model.JwtPayload, userID string) (int, interface{})
}
