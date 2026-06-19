package model

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/google/uuid"
)

type MstPromotionProduct struct {
	utils.DefaultModel
	PromotionID  uuid.UUID    `json:"promotion_id" gorm:"type:uuid;not null"`
	ProductID    uuid.UUID    `json:"product_id" gorm:"type:uuid;not null"`
	PromotionRef *MstPromotion `gorm:"foreignKey:PromotionID"`
	ProductRef   *MstProduct   `gorm:"foreignKey:ProductID"`
}

func (MstPromotionProduct) TableName() string {
	return "public.mst_promotion_product"
}
