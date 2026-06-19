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

type CategoryRepositoryImpl struct {
	db *gorm.DB
}

func NewCategoryRepositoryImpl() *CategoryRepositoryImpl {
	return &CategoryRepositoryImpl{db: db.GetManager()}
}

func (r CategoryRepositoryImpl) GetAllPagination(scopes ...func(db *gorm.DB) *gorm.DB) ([]model.MstCategory, int64, error) {
	var data []model.MstCategory
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

func (r CategoryRepositoryImpl) FindAll() ([]model.MstCategory, error) {
	var data []model.MstCategory
	if err := r.db.Where("is_active = ?", true).Order("category_name ASC").Find(&data).Error; err != nil {
		return nil, err
	}
	return data, nil
}

func (r CategoryRepositoryImpl) FindByID(id uuid.UUID) (*model.MstCategory, error) {
	var data model.MstCategory
	if err := r.db.First(&data, "id = ?", id).Error; err != nil {
		return nil, err
	}

	return &data, nil
}

func (r CategoryRepositoryImpl) FindBySlug(slug string) (*model.MstCategory, error) {
	var data model.MstCategory
	if err := r.db.Where("category_slug = ?", slug).First(&data).Error; err != nil {
		return nil, err
	}

	return &data, nil
}

func (r CategoryRepositoryImpl) Save(data model.MstCategory) (*model.MstCategory, error) {
	if err := r.db.Create(&data).Error; err != nil {
		return nil, err
	}
	return &data, nil
}

func (r CategoryRepositoryImpl) Update(data model.MstCategory) (*model.MstCategory, error) {
	var result model.MstCategory
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

func (r CategoryRepositoryImpl) Delete(data *model.MstCategory) error {
	return r.db.Delete(&data).Error
}

func (r CategoryRepositoryImpl) ExistsBySlug(slug string) (bool, error) {
	var count int64
	if err := r.db.Model(&model.MstCategory{}).Where("category_slug = ?", slug).Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}
