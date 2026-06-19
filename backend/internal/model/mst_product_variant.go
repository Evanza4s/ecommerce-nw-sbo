package model

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/google/uuid"
)

type MstProductVariant struct {
	utils.DefaultModel
	ProductID       uuid.UUID  `json:"product_id" gorm:"type:uuid;not null"`
	Color           string     `json:"color" gorm:"type:varchar(100)"`
	Size            string     `json:"size" gorm:"type:varchar(50)"`
	SKU             string     `json:"sku" gorm:"type:varchar(100);unique"`
	Barcode         string     `json:"barcode" gorm:"type:varchar(100)"`
	Stock           int        `json:"stock" gorm:"default:0"`
	Weight          float64    `json:"weight" gorm:"type:numeric(10,2)"`
	PriceAdjustment float64    `json:"price_adjustment" gorm:"type:numeric(18,2)"`
	VariantImage    string     `json:"variant_image" gorm:"type:text"`
	IsActive        bool       `json:"is_active" gorm:"default:true"`
	ProductRef      *MstProduct `gorm:"foreignKey:ProductID"`
}

func (MstProductVariant) TableName() string {
	return "public.mst_product_variant"
}
