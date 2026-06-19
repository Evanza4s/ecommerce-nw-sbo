package model

import (
	"time"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
)

type MstVoucher struct {
	utils.DefaultModel
	Code            string     `json:"code" gorm:"type:varchar(50);unique;not null"`
	DiscountType    string     `json:"discount_type" gorm:"type:varchar(20);not null"`
	DiscountValue   float64    `json:"discount_value" gorm:"type:numeric(18,2);not null"`
	MinimumPurchase float64    `json:"minimum_purchase" gorm:"type:numeric(18,2)"`
	MaxUsage        int        `json:"max_usage"`
	UsedCount       int        `json:"used_count" gorm:"default:0"`
	StartDate       *time.Time `json:"start_date"`
	EndDate         *time.Time `json:"end_date"`
	IsActive        bool       `json:"is_active" gorm:"default:true"`
}

func (MstVoucher) TableName() string {
	return "public.mst_voucher"
}
