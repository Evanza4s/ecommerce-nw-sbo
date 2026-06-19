package model

import (
	"time"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/google/uuid"
)

type TrxRefund struct {
	utils.DefaultModel
	OrderID      uuid.UUID           `json:"order_id" gorm:"type:uuid;not null"`
	UserID       uuid.UUID           `json:"user_id" gorm:"type:uuid;not null"`
	RefundNumber string              `json:"refund_number" gorm:"type:varchar(50);unique"`
	RefundType   string              `json:"refund_type" gorm:"type:varchar(50);not null"`
	RefundReason string              `json:"refund_reason" gorm:"type:text"`
	RefundAmount float64             `json:"refund_amount" gorm:"type:numeric(18,2);not null"`
	RefundStatus string              `json:"refund_status" gorm:"type:varchar(50);not null"`
	AdminNotes   string              `json:"admin_notes" gorm:"type:text"`
	ApprovedAt   *time.Time          `json:"approved_at"`
	OrderRef     *MstOrders           `gorm:"foreignKey:OrderID"`
	Evidences    []TrxRefundEvidence `gorm:"foreignKey:RefundID"`
}

func (TrxRefund) TableName() string {
	return "public.trx_refund"
}
