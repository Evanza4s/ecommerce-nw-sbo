package model

import (
	"time"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/google/uuid"
)

type MstShipping struct {
	utils.DefaultModel
	OrderID           uuid.UUID             `json:"order_id" gorm:"type:uuid;not null"`
	CourierName       string                `json:"courier_name" gorm:"type:varchar(50)"`
	ServiceName       string                `json:"service_name" gorm:"type:varchar(100)"`
	TrackingNumber    string                `json:"tracking_number" gorm:"type:varchar(100)"`
	ShippingStatus    string                `json:"shipping_status" gorm:"type:varchar(50);not null"`
	EstimatedArrival  *time.Time            `json:"estimated_arrival"`
	DeliveredAt       *time.Time            `json:"delivered_at"`
	OrderRef          *MstOrders            `gorm:"foreignKey:OrderID"`
	TrackingHistory   []TrxShippingTracking `gorm:"foreignKey:ShippingID"`
}

func (MstShipping) TableName() string {
	return "public.mst_shipping"
}
