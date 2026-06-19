package repository

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/google/uuid"
)

type CartRepository interface {
	FindCartByUserID(userID uuid.UUID) (*model.MstCart, error)
	CreateCart(cart *model.MstCart) (*model.MstCart, error)
	ClearCart(cartID uuid.UUID) error

	// Cart Items
	FindCartItemByVariantID(cartID uuid.UUID, variantID uuid.UUID) (*model.MstCartItem, error)
	FindCartItemByID(itemID uuid.UUID) (*model.MstCartItem, error)
	SaveCartItem(item *model.MstCartItem) (*model.MstCartItem, error)
	UpdateCartItem(item *model.MstCartItem) (*model.MstCartItem, error)
	DeleteCartItem(itemID uuid.UUID) error
}
