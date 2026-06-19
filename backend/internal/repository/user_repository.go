package repository

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// ============================================================
// USER REPOSITORY INTERFACE
// ============================================================

type UserRepository interface {
	// Query
	GetAllPagination(scopes ...func(db *gorm.DB) *gorm.DB) ([]model.MstUsers, int64, error)
	FindAll(scopes ...func(db *gorm.DB) *gorm.DB) ([]model.MstUsers, error)
	FindByID(id uuid.UUID) (*model.MstUsers, error)
	FindByIDWithRelations(id uuid.UUID) (*model.MstUsers, error)
	FindByEmail(email string) (*model.MstUsers, error)
	FindByUsername(username string) (*model.MstUsers, error)
	ExistsByEmail(email string) (bool, error)
	ExistsByUsername(username string) (bool, error)
	ExistsByEmailExceptID(email string, id uuid.UUID) (bool, error)
	ExistsByUsernameExceptID(username string, id uuid.UUID) (bool, error)

	// Mutation
	Save(data model.MstUsers) (*model.MstUsers, error)
	Update(data model.MstUsers) (*model.MstUsers, error)
	Delete(data *model.MstUsers) error
}
