package model

import (
	"time"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
)

type MstPromotion struct {
	utils.DefaultModel
	PromotionName   string                `json:"promotion_name" gorm:"type:varchar(255);not null"`
	PromotionType   string                `json:"promotion_type" gorm:"type:varchar(50);not null"`
	DiscountType    string                `json:"discount_type" gorm:"type:varchar(50);not null"`
	DiscountValue   float64               `json:"discount_value" gorm:"type:numeric(18,2);not null"`
	MinimumPurchase float64               `json:"minimum_purchase" gorm:"type:numeric(18,2)"`
	BannerImage     string                `json:"banner_image" gorm:"type:text"`
	StartDate       *time.Time            `json:"start_date"`
	EndDate         *time.Time            `json:"end_date"`
	IsActive        bool                  `json:"is_active" gorm:"default:true"`
	Products        []MstPromotionProduct `gorm:"foreignKey:PromotionID"`
}

func (MstPromotion) TableName() string {
	return "public.mst_promotion"
}
