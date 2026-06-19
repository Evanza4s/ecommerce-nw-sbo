package model

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/google/uuid"
)

type MstCartItem struct {
	utils.DefaultModel
	CartID            uuid.UUID         `json:"cart_id" gorm:"type:uuid;not null"`
	ProductVariantID  uuid.UUID         `json:"product_variant_id" gorm:"type:uuid;not null"`
	Quantity          int               `json:"quantity" gorm:"not null"`
	CartRef           *MstCart           `gorm:"foreignKey:CartID"`
	ProductVariantRef *MstProductVariant `gorm:"foreignKey:ProductVariantID"`
}

func (MstCartItem) TableName() string {
	return "public.mst_cart_items"
}
