package model

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/google/uuid"
)

type MstPaymentMethod struct {
	utils.DefaultModel
	ProviderID  uuid.UUID          `json:"provider_id" gorm:"type:uuid;not null"`
	MethodName  string             `json:"method_name" gorm:"type:varchar(100);not null"`
	MethodCode  string             `json:"method_code" gorm:"type:varchar(50);unique;not null"`
	MethodType  string             `json:"method_type" gorm:"type:varchar(50)"`
	IsActive    bool               `json:"is_active" gorm:"default:true"`
	ProviderRef *MstPaymentProvider `gorm:"foreignKey:ProviderID"`
	Payments    []MstPayment       `gorm:"foreignKey:PaymentMethodID"`
}

func (MstPaymentMethod) TableName() string {
	return "public.mst_payment_method"
}
