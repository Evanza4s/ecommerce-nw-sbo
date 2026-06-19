package model

import (
	"time"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/google/uuid"
)

type MstPayment struct {
	utils.DefaultModel
	OrderID           uuid.UUID          `json:"order_id" gorm:"type:uuid;not null"`
	PaymentProviderID *uuid.UUID         `json:"payment_provider_id" gorm:"type:uuid"`
	PaymentMethodID   *uuid.UUID         `json:"payment_method_id" gorm:"type:uuid"`
	PaymentReference  string             `json:"payment_reference" gorm:"type:varchar(255)"`
	Amount            float64            `json:"amount" gorm:"type:numeric(18,2);not null"`
	PaymentStatus     string             `json:"payment_status" gorm:"type:varchar(50);not null"`
	PaidAt            *time.Time         `json:"paid_at"`
	OrderRef          *MstOrders          `gorm:"foreignKey:OrderID"`
	ProviderRef       *MstPaymentProvider `gorm:"foreignKey:PaymentProviderID"`
	MethodRef         *MstPaymentMethod   `gorm:"foreignKey:PaymentMethodID"`
}

func (MstPayment) TableName() string {
	return "public.mst_payment"
}
