package repository

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"gorm.io/gorm"
)

type VoucherRepository interface {
	GetAll(db *gorm.DB, params map[string]interface{}, page, pageSize int) ([]model.MstVoucher, int64, error)
	GetByID(db *gorm.DB, id string) (*model.MstVoucher, error)
	GetByCode(db *gorm.DB, code string) (*model.MstVoucher, error)
	Create(db *gorm.DB, voucher *model.MstVoucher) error
	Update(db *gorm.DB, voucher *model.MstVoucher) error
	Delete(db *gorm.DB, id string) error
	GetAllNoPagination(db *gorm.DB, params map[string]interface{}) ([]model.MstVoucher, error)
}
