package model

import (
	"time"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/google/uuid"
)

type UserSession struct {
	utils.DefaultModel
	UserID           uuid.UUID  `json:"user_id" gorm:"type:uuid;not null;index"`
	RefreshTokenHash string     `json:"-" gorm:"type:text;not null;index"`
	DeviceName       string     `json:"device_name" gorm:"type:varchar(255)"`
	DeviceType       string     `json:"device_type" gorm:"type:varchar(100)"`
	Browser          string     `json:"browser" gorm:"type:varchar(100)"`
	OS               string     `json:"os" gorm:"type:varchar(100)"`
	IPAddress        string     `json:"ip_address" gorm:"type:varchar(45)"`
	UserAgent        string     `json:"user_agent" gorm:"type:text"`
	LoginAt          *time.Time `json:"login_at"`
	LastActivityAt   *time.Time `json:"last_activity_at"`
	ExpiredAt        time.Time  `json:"expired_at" gorm:"not null;index"`
	RevokedAt        *time.Time `json:"revoked_at"`
	UserRef          *MstUsers  `gorm:"foreignKey:UserID"`
}

func (t UserSession) TableName() string {
	return "public.mst_user_sessions"
}
