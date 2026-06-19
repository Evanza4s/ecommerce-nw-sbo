package model

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/google/uuid"
)

type TrxRefundEvidence struct {
	utils.DefaultModel
	RefundID  uuid.UUID `json:"refund_id" gorm:"type:uuid;not null"`
	FileURL   string    `json:"file_url" gorm:"type:text"`
	FileType  string    `json:"file_type" gorm:"type:varchar(50)"`
	RefundRef *TrxRefund `gorm:"foreignKey:RefundID"`
}

func (TrxRefundEvidence) TableName() string {
	return "public.trx_refund_evidence"
}
