package model

import (
	"time"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/google/uuid"
)

type UserIdentity struct {
	utils.DefaultModel
	UserID      uuid.UUID  `json:"user_id" gorm:"type:uuid;not null"`
	FirstName   string     `json:"first_name" gorm:"type:varchar(100)"`
	LastName    string     `json:"last_name" gorm:"type:varchar(100)"`
	PhoneNumber string     `json:"phone_number" gorm:"type:varchar(30)"`
	Gender      string     `json:"gender" gorm:"type:varchar(20)"`
	BirthPlace  string     `json:"birth_place" gorm:"type:varchar(100)"`
	BirthDate   *time.Time `json:"birth_date"`
	AvatarURL   string     `json:"avatar_url" gorm:"column:avatar_url;type:text"`
	UserRef     *MstUsers  `gorm:"foreignKey:UserID"`
}

func (t UserIdentity) TableName() string {
	return "public.mst_user_identity"
}
