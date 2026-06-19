package model

import (
	"time"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/google/uuid"
)

type TrxShippingTracking struct {
	utils.DefaultModel
	ShippingID  uuid.UUID  `json:"shipping_id" gorm:"type:uuid;not null"`
	Status      string     `json:"status" gorm:"type:varchar(50);not null"`
	Location    string     `json:"location" gorm:"type:text"`
	Description string     `json:"description" gorm:"type:text"`
	TrackedAt   *time.Time `json:"tracked_at"`
	ShippingRef *MstShipping `gorm:"foreignKey:ShippingID"`
}

func (TrxShippingTracking) TableName() string {
	return "public.trx_shipping_tracking"
}
