package model

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/google/uuid"
)

type TrxNotification struct {
	utils.DefaultModel
	UserID  uuid.UUID `gorm:"type:uuid;not null" json:"user_id"`
	Title   string    `gorm:"type:varchar(255);not null" json:"title"`
	Message string    `gorm:"type:text;not null" json:"message"`
	Type    string    `gorm:"type:varchar(50);not null" json:"type"`
	IsRead  bool      `gorm:"default:false" json:"is_read"`
}
