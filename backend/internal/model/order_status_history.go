package model

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/google/uuid"
)

type TrxOrderStatusHistory struct {
	utils.DefaultModel
	OrderID   uuid.UUID  `json:"order_id" gorm:"type:uuid;not null"`
	Status    string     `json:"status" gorm:"type:varchar(50);not null"`
	Notes     string     `json:"notes" gorm:"type:text"`
	ChangedBy *uuid.UUID `json:"changed_by" gorm:"type:uuid"`
	OrderRef  *MstOrders  `gorm:"foreignKey:OrderID"`
	UserRef   *MstUsers  `gorm:"foreignKey:ChangedBy"`
}

func (TrxOrderStatusHistory) TableName() string {
	return "public.trx_order_status_history"
}
