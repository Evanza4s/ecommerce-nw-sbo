package repository

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// ============================================================
// USER IDENTITY REPOSITORY INTERFACE
// ============================================================

type UserIdentityRepository interface {
	// Query
	FindByID(id uuid.UUID) (*model.UserIdentity, error)
	FindByUserID(userID uuid.UUID) (*model.UserIdentity, error)
	FindAll(scopes ...func(db *gorm.DB) *gorm.DB) ([]model.UserIdentity, error)

	// Mutation
	Save(data model.UserIdentity) (*model.UserIdentity, error)
	Update(data model.UserIdentity) (*model.UserIdentity, error)
	Delete(data *model.UserIdentity) error
}
