package repository_impl

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/db"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type FaqRepositoryImpl struct {
	db *gorm.DB
}

func NewFaqRepositoryImpl() *FaqRepositoryImpl {
	return &FaqRepositoryImpl{db: db.GetManager()}
}

func (r FaqRepositoryImpl) GetAllPagination(scopes ...func(db *gorm.DB) *gorm.DB) ([]model.MstFaq, int64, error) {
	var data []model.MstFaq
	query := r.db.Scopes(scopes...).Find(&data)
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
func (r FaqRepositoryImpl) FindAll() ([]model.MstFaq, error) {
	var data []model.MstFaq
	if err := r.db.Where("is_active = ?", true).Order("sort_order ASC").Find(&data).Error; err != nil {
		return nil, err
	}
	return data, nil
}
func (r FaqRepositoryImpl) FindById(id uuid.UUID) (*model.MstFaq, error) {
	var data model.MstFaq
	if err := r.db.First(&data, "id = ?", id).Error; err != nil {
		return nil, err
	}

	return &data, nil
}
func (r FaqRepositoryImpl) FindByQuestion(question string) (*model.MstFaq, error) {
	var result model.MstFaq
	if err := r.db.First(&result, "question = ?", question).Error; err != nil {
		return nil, err
	}

	return &result, nil
}
func (r FaqRepositoryImpl) Save(data model.MstFaq) (*model.MstFaq, error) {
	if err := r.db.Create(&data).Error; err != nil {
		return nil, err
	}

	return &data, nil
}
func (r FaqRepositoryImpl) Update(data model.MstFaq) (*model.MstFaq, error) {
	var result model.MstFaq
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
func (r FaqRepositoryImpl) Delete(data *model.MstFaq) error {
	return r.db.Delete(&data).Error
}
