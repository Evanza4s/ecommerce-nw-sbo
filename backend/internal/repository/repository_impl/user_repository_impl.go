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
// USER REPOSITORY IMPLEMENTATION
// ============================================================

type UserRepositoryImpl struct {
	db *gorm.DB
}

func NewUserRepositoryImpl() *UserRepositoryImpl {
	return &UserRepositoryImpl{db: db.GetManager()}
}

// ============================================================
// QUERY METHODS
// ============================================================

// GetAllPagination retrieves paginated users
func (r UserRepositoryImpl) GetAllPagination(scopes ...func(db *gorm.DB) *gorm.DB) ([]model.MstUsers, int64, error) {
	var data []model.MstUsers
	query := r.db.Model(&model.MstUsers{}).Preload("RoleRef").Scopes(scopes...).Find(&data)
	if err := query.Error; err != nil {
		return nil, 0, err
	}
	if query.RowsAffected == 0 {
		return nil, 0, gorm.ErrRecordNotFound
	}

	var count int64
	if err := utils.RemoveOrder(query).Count(&count).Error; err != nil {
		return nil, 0, err
	}

	return data, count, nil
}

// FindAll retrieves all users without pagination
func (r UserRepositoryImpl) FindAll(scopes ...func(db *gorm.DB) *gorm.DB) ([]model.MstUsers, error) {
	var data []model.MstUsers
	query := r.db.Preload("RoleRef").Scopes(scopes...).Find(&data)
	if err := query.Error; err != nil {
		return nil, err
	}
	if query.RowsAffected == 0 {
		return nil, gorm.ErrRecordNotFound
	}
	return data, nil
}

// FindByID retrieves user by ID
func (r UserRepositoryImpl) FindByID(id uuid.UUID) (*model.MstUsers, error) {
	var data model.MstUsers
	if err := r.db.Preload("RoleRef").First(&data, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &data, nil
}

// FindByIDWithRelations retrieves user with all relations
func (r UserRepositoryImpl) FindByIDWithRelations(id uuid.UUID) (*model.MstUsers, error) {
	var data model.MstUsers
	if err := r.db.
		Preload("RoleRef").
		Preload("Identity").
		Preload("Addresses").
		First(&data, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &data, nil
}

// FindByEmail retrieves user by email
func (r UserRepositoryImpl) FindByEmail(email string) (*model.MstUsers, error) {
	var data model.MstUsers
	if err := r.db.Preload("RoleRef").Where("email = ?", email).First(&data).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, gorm.ErrRecordNotFound
		}
		return nil, err
	}
	return &data, nil
}

// FindByUsername retrieves user by username
func (r UserRepositoryImpl) FindByUsername(username string) (*model.MstUsers, error) {
	var data model.MstUsers
	if err := r.db.Preload("RoleRef").Where("username = ?", username).First(&data).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, gorm.ErrRecordNotFound
		}
		return nil, err
	}
	return &data, nil
}

// ExistsByEmail checks if email exists
func (r UserRepositoryImpl) ExistsByEmail(email string) (bool, error) {
	var count int64
	if err := r.db.Model(&model.MstUsers{}).Where("email = ?", email).Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}

// ExistsByUsername checks if username exists
func (r UserRepositoryImpl) ExistsByUsername(username string) (bool, error) {
	var count int64
	if err := r.db.Model(&model.MstUsers{}).Where("username = ?", username).Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}

// ExistsByEmailExceptID checks if email exists except for specific ID
func (r UserRepositoryImpl) ExistsByEmailExceptID(email string, id uuid.UUID) (bool, error) {
	var count int64
	if err := r.db.Model(&model.MstUsers{}).Where("email = ? AND id != ?", email, id).Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}

// ExistsByUsernameExceptID checks if username exists except for specific ID
func (r UserRepositoryImpl) ExistsByUsernameExceptID(username string, id uuid.UUID) (bool, error) {
	var count int64
	if err := r.db.Model(&model.MstUsers{}).Where("username = ? AND id != ?", username, id).Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}

// ============================================================
// MUTATION METHODS
// ============================================================

// Save creates a new user
func (r UserRepositoryImpl) Save(data model.MstUsers) (*model.MstUsers, error) {
	if err := r.db.Create(&data).Error; err != nil {
		return nil, err
	}
	return &data, nil
}

// Update updates an existing user
func (r UserRepositoryImpl) Update(data model.MstUsers) (*model.MstUsers, error) {
	mapData, err := util.StructToMap(data)
	if err != nil {
		return nil, err
	}

	// Remove default entity fields except updated_by
	mapData = util.RemoveFromMaps(&util.ExcludeKey{
		Input:   mapData,
		Keys:    utils.DefaultEntity,
		Exclude: []string{"updated_by"},
	}).RemoveMaps()

	// Remove relations to prevent GORM error
	delete(mapData, "RoleRef")
	delete(mapData, "Identity")
	delete(mapData, "Addresses")
	delete(mapData, "Sessions")

	// Add password if present
	if data.Password != "" {
		mapData["password"] = data.Password
	}

	var result model.MstUsers
	if err = r.db.Model(&result).Clauses(clause.Returning{}).Where("id = ?", data.ID).Updates(mapData).Error; err != nil {
		return nil, err
	}

	return &result, nil
}

// Delete soft deletes a user
func (r UserRepositoryImpl) Delete(data *model.MstUsers) error {
	return r.db.Delete(&data).Error
}
