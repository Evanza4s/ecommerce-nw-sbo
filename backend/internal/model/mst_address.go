package model

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/google/uuid"
)

type MstAddress struct {
	utils.DefaultModel
	UserID       uuid.UUID `json:"user_id" gorm:"type:uuid;not null"`
	ReceiverName string    `json:"receiver_name" gorm:"type:varchar(200)"`
	PhoneNumber  string    `json:"phone_number" gorm:"type:varchar(30)"`
	Province     string    `json:"province" gorm:"type:varchar(150)"`
	City         string    `json:"city" gorm:"type:varchar(150)"`
	District     string    `json:"district" gorm:"type:varchar(150)"`
	Village      string    `json:"village" gorm:"type:varchar(150)"`
	PostalCode   string    `json:"postal_code" gorm:"type:varchar(20)"`
	FullAddress  string    `json:"full_address" gorm:"type:text"`
	AddressLabel string    `json:"address_label" gorm:"type:varchar(100)"`
	IsDefault    bool      `json:"is_default" gorm:"default:false"`
	Latitude     float64   `json:"latitude" gorm:"type:numeric(12,8)"`
	Longitude    float64   `json:"longitude" gorm:"type:numeric(12,8)"`
	UserRef      *MstUsers `gorm:"foreignKey:UserID"`
}

func (MstAddress) TableName() string {
	return "public.mst_address"
}
