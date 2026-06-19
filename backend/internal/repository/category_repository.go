package repository

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CategoryRepository interface {
	GetAllPagination(scopes ...func(db *gorm.DB) *gorm.DB) ([]model.MstCategory, int64, error)
	FindAll() ([]model.MstCategory, error)
	FindByID(id uuid.UUID) (*model.MstCategory, error)
	FindBySlug(slug string) (*model.MstCategory, error)
	Save(data model.MstCategory) (*model.MstCategory, error)
	Update(data model.MstCategory) (*model.MstCategory, error)
	Delete(data *model.MstCategory) error
	ExistsBySlug(slug string) (bool, error)
}
