package repository

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"gorm.io/gorm"
)

type PaymentRepository interface {
	GetAllPagination(scopes ...func(db *gorm.DB) *gorm.DB) ([]model.MstPayment, int64, error)
	FindById(id string) (*model.MstPayment, error)
	FindByOrderId(orderId string) (*model.MstPayment, error)
	Save(data model.MstPayment) (*model.MstPayment, error)
	Update(data model.MstPayment) (*model.MstPayment, error)
}
