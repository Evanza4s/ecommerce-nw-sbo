package model

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/google/uuid"
)

type MstOrders struct {
	utils.DefaultModel
	OrderNumber    string         `json:"order_number" gorm:"type:varchar(50);unique;not null"`
	UserID         uuid.UUID      `json:"user_id" gorm:"type:uuid;not null"`
	AddressID      uuid.UUID      `json:"address_id" gorm:"type:uuid;not null"`
	SubtotalAmount float64        `json:"subtotal_amount" gorm:"type:numeric(18,2);not null"`
	DiscountAmount float64        `json:"discount_amount" gorm:"type:numeric(18,2);default:0"`
	TaxAmount      float64        `json:"tax_amount" gorm:"type:numeric(18,2);default:0"`
	ShippingCost   float64        `json:"shipping_cost" gorm:"type:numeric(18,2);default:0"`
	GrandTotal     float64        `json:"grand_total" gorm:"type:numeric(18,2);not null"`
	OrderStatus    string         `json:"order_status" gorm:"type:varchar(50);not null"`
	PaymentStatus  string         `json:"payment_status" gorm:"type:varchar(50);not null"`
	Notes          string         `json:"notes" gorm:"type:text"`
	Items          []MstOrderItem `gorm:"foreignKey:OrderID"`
	Payment        *MstPayment    `gorm:"foreignKey:OrderID"`
	Shipping       *MstShipping   `gorm:"foreignKey:OrderID"`
	StatusHistory  []TrxOrderStatusHistory `gorm:"foreignKey:OrderID"`
	Refunds        []TrxRefund    `gorm:"foreignKey:OrderID"`
}

func (MstOrders) TableName() string {
	return "public.mst_orders"
}
