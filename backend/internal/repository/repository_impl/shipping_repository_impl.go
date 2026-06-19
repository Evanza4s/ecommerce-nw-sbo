package repository_impl

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/db"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"gorm.io/gorm"
)

type ShippingRepositoryImpl struct {
	db *gorm.DB
}

func NewShippingRepositoryImpl() *ShippingRepositoryImpl {
	return &ShippingRepositoryImpl{db: db.GetManager()}
}

func (r ShippingRepositoryImpl) GetAllPagination(limit, offset int, search string, status string) ([]model.MstShipping, int64, error) {
	var shippings []model.MstShipping
	var total int64

	query := r.db.Model(&model.MstShipping{})

	if search != "" {
		query = query.Where("tracking_number ILIKE ? OR order_id::text ILIKE ?", "%"+search+"%", "%"+search+"%")
	}

	if status != "" && status != "all" {
		query = query.Where("shipping_status = ?", status)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := query.
		Preload("OrderRef").
		Order("created_at desc").
		Limit(limit).
		Offset(offset).
		Find(&shippings).Error; err != nil {
		return nil, 0, err
	}

	return shippings, total, nil
}
