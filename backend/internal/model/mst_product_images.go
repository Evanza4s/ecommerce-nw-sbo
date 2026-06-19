package model

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/google/uuid"
)

type MstProductImage struct {
	utils.DefaultModel
	ProductID   uuid.UUID  `json:"product_id" gorm:"type:uuid;not null"`
	ImageURL    string     `json:"image_url" gorm:"type:text"`
	IsThumbnail bool       `json:"is_thumbnail" gorm:"default:false"`
	SortOrder   int        `json:"sort_order" gorm:"default:0"`
	ProductRef  *MstProduct `gorm:"foreignKey:ProductID"`
}

func (MstProductImage) TableName() string {
	return "public.mst_product_images"
}
