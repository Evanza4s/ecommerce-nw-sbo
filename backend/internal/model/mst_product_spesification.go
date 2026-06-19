package model

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/google/uuid"
)

type MstProductSpecification struct {
	utils.DefaultModel
	ProductID  uuid.UUID  `json:"product_id" gorm:"type:uuid;not null"`
	SpecName   string     `json:"spec_name" gorm:"type:varchar(150)"`
	SpecValue  string     `json:"spec_value" gorm:"type:text"`
	ProductRef *MstProduct `gorm:"foreignKey:ProductID"`
}

func (MstProductSpecification) TableName() string {
	return "public.mst_product_specifications"
}
