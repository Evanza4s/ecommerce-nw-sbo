package model

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/google/uuid"
)

type TrxLoginHistory struct {
	utils.DefaultModel
	UserID        *uuid.UUID `json:"user_id" gorm:"type:uuid"`
	Email         string     `json:"email" gorm:"type:varchar(255)"`
	IPAddress     string     `json:"ip_address" gorm:"type:varchar(45)"`
	Browser       string     `json:"browser" gorm:"type:varchar(255)"`
	OS            string     `json:"os" gorm:"type:varchar(255)"`
	LoginStatus   string     `json:"login_status" gorm:"type:varchar(50);not null"`
	FailureReason string     `json:"failure_reason" gorm:"type:text"`
	UserRef       *MstUsers  `gorm:"foreignKey:UserID"`
}

func (TrxLoginHistory) TableName() string {
	return "public.trx_login_history"
}
