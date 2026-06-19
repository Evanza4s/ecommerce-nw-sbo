package utils

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type DefaultModel struct {
	ID        uuid.UUID      `json:"id" gorm:"primarykey;type:uuid;default:uuid_generate_v4()"`
	CreatedBy uuid.UUID      `json:"created_by" gorm:"type:uuid"`
	UpdatedBy *uuid.UUID     `json:"updated_by" gorm:"type:uuid"`
	DeletedBy *uuid.UUID     `json:"deleted_by" gorm:"type:uuid"`
	CreatedAt time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt *time.Time     `json:"updated_at" gorm:"default:null;autoUpdateTime"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}
