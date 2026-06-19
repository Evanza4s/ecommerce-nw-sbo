package repository

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type RolesRepository interface {
	GetAllPagination(scopes ...func(db *gorm.DB) *gorm.DB) ([]model.MstRoles, int64, error)
	FindAll() ([]model.MstRoles, error)
	FindById(id uuid.UUID) (*model.MstRoles, error)
	FindByName(name string) (*model.MstRoles, error)
	Save(data model.MstRoles) (*model.MstRoles, error)
	Update(data model.MstRoles) (*model.MstRoles, error)
	Delete(data *model.MstRoles) error
}
