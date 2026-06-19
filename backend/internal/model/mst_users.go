package model

import (
	"time"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/google/uuid"
)

type MstUsers struct {
	utils.DefaultModel
	Fullname     string     `json:"fullname" gorm:"type:varchar(200);not null"`
	Username     string     `json:"username" gorm:"type:varchar(100);unique;not null"`
	Email        string     `json:"email" gorm:"type:varchar(255);unique;not null"`
	Password     string     `json:"-" gorm:"column:password;type:text;not null"`
	RoleID       uuid.UUID  `json:"role_id" gorm:"type:uuid;not null"`
	IsActive     bool       `json:"is_active" gorm:"default:true"`
	IsVerified   bool       `json:"is_verified" gorm:"default:false"`
	LastLoginAt  *time.Time `json:"last_login_at"`
	EmailVerifiedAt *time.Time `json:"email_verified_at"`
	RoleRef      *MstRoles      `gorm:"foreignKey:RoleID"`
	Identity     *UserIdentity `gorm:"foreignKey:UserID"`
	Addresses    []MstAddress  `gorm:"foreignKey:UserID"`
	Sessions     []UserSession `gorm:"foreignKey:UserID"`
}

func (t MstUsers) TableName() string {
	return "public.mst_users"
}
