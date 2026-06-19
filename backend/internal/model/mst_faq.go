package model

import "github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"

type MstFaq struct {
	utils.DefaultModel
	Question  string `json:"question" gorm:"type:text;not null"`
	Answer    string `json:"answer" gorm:"type:text;not null"`
	SortOrder int    `json:"sort_order" gorm:"default:0"`
	IsActive  bool   `json:"is_active" gorm:"default:true"`
}

func (MstFaq) TableName() string {
	return "public.mst_faq"
}
