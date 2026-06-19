package repository

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/google/uuid"
)

// ============================================================
// ADDRESS REPOSITORY INTERFACE
// ============================================================

type AddressRepository interface {
	// Query
	FindByID(id uuid.UUID) (*model.MstAddress, error)
	FindByIDAndUserID(id uuid.UUID, userID uuid.UUID) (*model.MstAddress, error)
	FindAllByUserID(userID uuid.UUID) ([]model.MstAddress, error)
	FindDefaultByUserID(userID uuid.UUID) (*model.MstAddress, error)
	CountByUserID(userID uuid.UUID) (int64, error)

	// Mutation
	Save(data model.MstAddress) (*model.MstAddress, error)
	Update(data model.MstAddress) (*model.MstAddress, error)
	Delete(data *model.MstAddress) error
	SetDefault(userID uuid.UUID, addressID uuid.UUID) error
	UnsetDefault(userID uuid.UUID) error
}
