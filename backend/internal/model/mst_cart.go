package model

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/google/uuid"
)

type MstCart struct {
	utils.DefaultModel
	UserID  uuid.UUID     `json:"user_id" gorm:"type:uuid;not null;uniqueIndex"`
	Items   []MstCartItem `gorm:"foreignKey:CartID"`
}

func (MstCart) TableName() string {
	return "public.mst_cart"
}
