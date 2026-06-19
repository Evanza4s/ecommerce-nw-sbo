package repository_impl

import (
	"errors"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/repository"
	"gorm.io/gorm"
)

type VoucherRepositoryImpl struct{}

func NewVoucherRepositoryImpl() repository.VoucherRepository {
	return &VoucherRepositoryImpl{}
}

func (r *VoucherRepositoryImpl) GetAll(db *gorm.DB, params map[string]interface{}, page, pageSize int) ([]model.MstVoucher, int64, error) {
	var vouchers []model.MstVoucher
	var total int64

	query := db.Model(&model.MstVoucher{})

	if code, ok := params["code"]; ok && code != "" {
		query = query.Where("code ILIKE ?", "%"+code.(string)+"%")
	}

	if status, ok := params["status"]; ok && status != "" {
		// active, scheduled, expired, draft map to is_active and dates
		// For simplicity we just use is_active if it's boolean
		if isActive, isBool := status.(bool); isBool {
			query = query.Where("is_active = ?", isActive)
		}
	}

	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * pageSize
	err = query.Offset(offset).Limit(pageSize).Find(&vouchers).Error
	if err != nil {
		return nil, 0, err
	}

	return vouchers, total, nil
}

func (r *VoucherRepositoryImpl) GetAllNoPagination(db *gorm.DB, params map[string]interface{}) ([]model.MstVoucher, error) {
	var vouchers []model.MstVoucher
	query := db.Model(&model.MstVoucher{})

	if code, ok := params["code"]; ok && code != "" {
		query = query.Where("code ILIKE ?", "%"+code.(string)+"%")
	}

	err := query.Find(&vouchers).Error
	return vouchers, err
}

func (r *VoucherRepositoryImpl) GetByID(db *gorm.DB, id string) (*model.MstVoucher, error) {
	var voucher model.MstVoucher
	err := db.Where("id = ?", id).First(&voucher).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &voucher, nil
}

func (r *VoucherRepositoryImpl) GetByCode(db *gorm.DB, code string) (*model.MstVoucher, error) {
	var voucher model.MstVoucher
	err := db.Where("code = ?", code).First(&voucher).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &voucher, nil
}

func (r *VoucherRepositoryImpl) Create(db *gorm.DB, voucher *model.MstVoucher) error {
	return db.Create(voucher).Error
}

func (r *VoucherRepositoryImpl) Update(db *gorm.DB, voucher *model.MstVoucher) error {
	return db.Save(voucher).Error
}

func (r *VoucherRepositoryImpl) Delete(db *gorm.DB, id string) error {
	return db.Where("id = ?", id).Delete(&model.MstVoucher{}).Error
}
