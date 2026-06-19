package repository

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type FaqRepository interface {
	GetAllPagination(scopes ...func(db *gorm.DB) *gorm.DB) ([]model.MstFaq, int64, error)
	FindAll() ([]model.MstFaq, error)
	FindById(id uuid.UUID) (*model.MstFaq, error)
	FindByQuestion(question string) (*model.MstFaq, error)
	Save(data model.MstFaq) (*model.MstFaq, error)
	Update(data model.MstFaq) (*model.MstFaq, error)
	Delete(data *model.MstFaq) error
}
