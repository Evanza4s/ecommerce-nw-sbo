package repository_impl

import (
	"errors"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/db"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// ============================================================
// USER IDENTITY REPOSITORY IMPLEMENTATION
// ============================================================

type UserIdentityRepositoryImpl struct {
	db *gorm.DB
}

func NewUserIdentityRepositoryImpl() *UserIdentityRepositoryImpl {
	return &UserIdentityRepositoryImpl{db: db.GetManager()}
}

// ============================================================
// QUERY METHODS
// ============================================================

// FindByID retrieves user identity by ID
func (r UserIdentityRepositoryImpl) FindByID(id uuid.UUID) (*model.UserIdentity, error) {
	var data model.UserIdentity
	if err := r.db.First(&data, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &data, nil
}

// FindByUserID retrieves user identity by user ID
func (r UserIdentityRepositoryImpl) FindByUserID(userID uuid.UUID) (*model.UserIdentity, error) {
	var data model.UserIdentity
	if err := r.db.Where("user_id = ?", userID).First(&data).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil // Return nil without error if not found
		}
		return nil, err
	}
	return &data, nil
}

// FindAll retrieves all user identities
func (r UserIdentityRepositoryImpl) FindAll(scopes ...func(db *gorm.DB) *gorm.DB) ([]model.UserIdentity, error) {
	var data []model.UserIdentity
	query := r.db.Scopes(scopes...).Find(&data)
	if err := query.Error; err != nil {
		return nil, err
	}
	if query.RowsAffected == 0 {
		return nil, gorm.ErrRecordNotFound
	}
	return data, nil
}

// ============================================================
// MUTATION METHODS
// ============================================================

// Save creates a new user identity
func (r UserIdentityRepositoryImpl) Save(data model.UserIdentity) (*model.UserIdentity, error) {
	if err := r.db.Create(&data).Error; err != nil {
		return nil, err
	}
	return &data, nil
}

// Update updates an existing user identity
func (r UserIdentityRepositoryImpl) Update(data model.UserIdentity) (*model.UserIdentity, error) {
	mapData, err := util.StructToMap(data)
	if err != nil {
		return nil, err
	}

	mapData = util.RemoveFromMaps(&util.ExcludeKey{
		Input:   mapData,
		Keys:    utils.DefaultEntity,
		Exclude: []string{"updated_by"},
	}).RemoveMaps()

	var result model.UserIdentity
	if err = r.db.Model(&result).Clauses(clause.Returning{}).Where("id = ?", data.ID).Updates(mapData).Error; err != nil {
		return nil, err
	}

	return &result, nil
}

// Delete soft deletes a user identity
func (r UserIdentityRepositoryImpl) Delete(data *model.UserIdentity) error {
	return r.db.Delete(&data).Error
}
