package model

import "github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"

type MstPaymentProvider struct {
	utils.DefaultModel
	ProviderName   string             `json:"provider_name" gorm:"type:varchar(100);not null"`
	ProviderCode   string             `json:"provider_code" gorm:"type:varchar(50);unique;not null"`
	ProviderType   string             `json:"provider_type" gorm:"type:varchar(50)"`
	LogoURL        string             `json:"logo_url" gorm:"type:text"`
	IsActive       bool               `json:"is_active" gorm:"default:true"`
	PaymentMethods []MstPaymentMethod `gorm:"foreignKey:ProviderID"`
	Payments       []MstPayment       `gorm:"foreignKey:PaymentProviderID"`
}

func (MstPaymentProvider) TableName() string {
	return "public.mst_payment_provider"
}
