package model

import "github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"

type MstCategory struct {
	utils.DefaultModel
	Name     string       `json:"name" gorm:"type:varchar(150)"`
	Slug     string       `json:"slug" gorm:"type:varchar(150);unique"`
	Icon     string       `json:"icon" gorm:"type:text"`
	IsActive bool         `json:"is_active" gorm:"default:true"`
	Products []MstProduct `gorm:"foreignKey:CategoryID"`
}

func (MstCategory) TableName() string {
	return "public.mst_category"
}
