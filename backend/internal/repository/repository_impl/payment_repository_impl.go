package repository_impl

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/db"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type PaymentRepositoryImpl struct {
	db *gorm.DB
}

func NewPaymentRepositoryImpl() *PaymentRepositoryImpl {
	return &PaymentRepositoryImpl{db: db.GetManager()}
}

func (r PaymentRepositoryImpl) GetAllPagination(scopes ...func(db *gorm.DB) *gorm.DB) ([]model.MstPayment, int64, error) {
	var data []model.MstPayment
	query := r.db.Scopes(scopes...).
		Preload("OrderRef").
		Preload("OrderRef.UserRef").
		Preload("ProviderRef").
		Preload("MethodRef").
		Find(&data)
	
	if err := query.Error; err != nil {
		return nil, 0, err
	} else if query.RowsAffected == 0 {
		return nil, 0, gorm.ErrRecordNotFound
	}

	var count int64
	if err := utils.RemoveOrder(query).Count(&count).Error; err != nil {
		return nil, 0, err
	}

	return data, count, nil
}

func (r PaymentRepositoryImpl) FindById(id string) (*model.MstPayment, error) {
	var data model.MstPayment
	if err := r.db.
		Preload("OrderRef").
		Preload("ProviderRef").
		Preload("MethodRef").
		First(&data, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &data, nil
}

func (r PaymentRepositoryImpl) FindByOrderId(orderId string) (*model.MstPayment, error) {
	var data model.MstPayment
	if err := r.db.
		Preload("OrderRef").
		Preload("ProviderRef").
		Preload("MethodRef").
		First(&data, "order_id = ?", orderId).Error; err != nil {
		return nil, err
	}
	return &data, nil
}

func (r PaymentRepositoryImpl) Save(data model.MstPayment) (*model.MstPayment, error) {
	if err := r.db.Create(&data).Error; err != nil {
		return nil, err
	}
	return &data, nil
}

func (r PaymentRepositoryImpl) Update(data model.MstPayment) (*model.MstPayment, error) {
	var result model.MstPayment
	mapData, err := util.StructToMap(data)
	if err != nil {
		return nil, err
	}

	mapData = util.RemoveFromMaps(&util.ExcludeKey{
		Input:   mapData,
		Keys:    utils.DefaultEntity,
		Exclude: []string{"updated_by"},
	}).RemoveMaps()

	if err = r.db.Model(&result).Clauses(clause.Returning{}).Where("id = ?", data.ID).Updates(mapData).Error; err != nil {
		return nil, err
	}

	return &result, nil
}
