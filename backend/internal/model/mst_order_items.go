package model

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/google/uuid"
)

type MstOrderItem struct {
	utils.DefaultModel
	OrderID           uuid.UUID         `json:"order_id" gorm:"type:uuid;not null"`
	ProductVariantID  uuid.UUID         `json:"product_variant_id" gorm:"type:uuid;not null"`
	Quantity          int               `json:"quantity" gorm:"not null"`
	Price             float64           `json:"price" gorm:"type:numeric(18,2);not null"`
	Subtotal          float64           `json:"subtotal" gorm:"type:numeric(18,2);not null"`
	OrderRef          *MstOrders         `gorm:"foreignKey:OrderID"`
	ProductVariantRef *MstProductVariant `gorm:"foreignKey:ProductVariantID"`
}

func (MstOrderItem) TableName() string {
	return "public.mst_order_items"
}
