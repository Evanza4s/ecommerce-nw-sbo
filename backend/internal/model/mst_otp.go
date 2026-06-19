package model

import (
	"time"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/google/uuid"
)

type MstOtp struct {
	utils.DefaultModel
	UserID     *uuid.UUID `json:"user_id" gorm:"type:uuid"`
	Email      string     `json:"email" gorm:"type:varchar(255)"`
	OtpCode    string     `json:"otp_code" gorm:"type:varchar(10);not null"`
	OtpType    string     `json:"otp_type" gorm:"type:varchar(50);not null"`
	IsUsed     bool       `json:"is_used" gorm:"default:false"`
	ExpiredAt  time.Time  `json:"expired_at" gorm:"not null"`
	VerifiedAt *time.Time `json:"verified_at"`
	UserRef    *MstUsers  `gorm:"foreignKey:UserID"`
}

func (MstOtp) TableName() string {
	return "public.mst_otp"
}
