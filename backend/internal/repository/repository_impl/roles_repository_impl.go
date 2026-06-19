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

type RolesRepository struct {
	db *gorm.DB
}

func NewRolesRepositoryImpl() *RolesRepository {
	return &RolesRepository{db: db.DbManager()}
}

func (r RolesRepository) GetAllPagination(scopes ...func(db *gorm.DB) *gorm.DB) ([]model.MstRoles, int64, error) {
	var data []model.MstRoles
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

func (r RolesRepository) FindAll() ([]model.MstRoles, error) {
	var data []model.MstRoles
	if err := r.db.Find(&data).Error; err != nil {
		return nil, err
	}

	return data, nil
}

func (r RolesRepository) FindById(id uuid.UUID) (*model.MstRoles, error) {
	var data model.MstRoles
	if err := r.db.First(&data, "id = ?", id).Error; err != nil {
		return nil, err
	}

	return &data, nil
}

func (r RolesRepository) FindByName(name string) (*model.MstRoles, error) {
	var data model.MstRoles
	if err := r.db.First(&data, "role_name = ?", name).Error; err != nil {
		return nil, err
	}

	return &data, nil
}

func (r RolesRepository) Save(data model.MstRoles) (*model.MstRoles, error) {
	if err := r.db.Create(&data).Error; err != nil {
		return nil, err
	}
	return &data, nil
}

func (r RolesRepository) Update(data model.MstRoles) (*model.MstRoles, error) {
	var result model.MstRoles
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

func (r RolesRepository) Delete(data *model.MstRoles) error {
	return r.db.Delete(&data).Error
}
