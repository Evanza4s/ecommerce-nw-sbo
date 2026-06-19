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

// ============================================================
// ADDRESS REPOSITORY IMPLEMENTATION
// ============================================================

type AddressRepositoryImpl struct {
	db *gorm.DB
}

func NewAddressRepositoryImpl() *AddressRepositoryImpl {
	return &AddressRepositoryImpl{db: db.GetManager()}
}

// ============================================================
// QUERY METHODS
// ============================================================

// FindByID retrieves address by ID
func (r AddressRepositoryImpl) FindByID(id uuid.UUID) (*model.MstAddress, error) {
	var data model.MstAddress
	if err := r.db.First(&data, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &data, nil
}

// FindByIDAndUserID retrieves address by ID and user ID
func (r AddressRepositoryImpl) FindByIDAndUserID(id uuid.UUID, userID uuid.UUID) (*model.MstAddress, error) {
	var data model.MstAddress
	if err := r.db.Where("id = ? AND user_id = ?", id, userID).First(&data).Error; err != nil {
		return nil, err
	}
	return &data, nil
}

// FindAllByUserID retrieves all addresses for a user
func (r AddressRepositoryImpl) FindAllByUserID(userID uuid.UUID) ([]model.MstAddress, error) {
	var data []model.MstAddress
	if err := r.db.Where("user_id = ?", userID).Order("is_default DESC, created_at DESC").Find(&data).Error; err != nil {
		return nil, err
	}
	return data, nil
}

// FindDefaultByUserID retrieves default address for a user
func (r AddressRepositoryImpl) FindDefaultByUserID(userID uuid.UUID) (*model.MstAddress, error) {
	var data model.MstAddress
	if err := r.db.Where("user_id = ? AND is_default = ?", userID, true).First(&data).Error; err != nil {
		return nil, err
	}
	return &data, nil
}

// CountByUserID counts addresses for a user
func (r AddressRepositoryImpl) CountByUserID(userID uuid.UUID) (int64, error) {
	var count int64
	if err := r.db.Model(&model.MstAddress{}).Where("user_id = ?", userID).Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}

// ============================================================
// MUTATION METHODS
// ============================================================

// Save creates a new address
func (r AddressRepositoryImpl) Save(data model.MstAddress) (*model.MstAddress, error) {
	// If this is set as default, unset other defaults first
	if data.IsDefault {
		r.UnsetDefault(data.UserID)
	}

	if err := r.db.Create(&data).Error; err != nil {
		return nil, err
	}
	return &data, nil
}

// Update updates an existing address
func (r AddressRepositoryImpl) Update(data model.MstAddress) (*model.MstAddress, error) {
	mapData, err := util.StructToMap(data)
	if err != nil {
		return nil, err
	}

	mapData = util.RemoveFromMaps(&util.ExcludeKey{
		Input:   mapData,
		Keys:    utils.DefaultEntity,
		Exclude: []string{"updated_by"},
	}).RemoveMaps()

	// If setting as default, unset others
	if data.IsDefault {
		r.UnsetDefault(data.UserID)
	}

	var result model.MstAddress
	if err = r.db.Model(&result).Clauses(clause.Returning{}).Where("id = ?", data.ID).Updates(mapData).Error; err != nil {
		return nil, err
	}

	return &result, nil
}

// Delete soft deletes an address
func (r AddressRepositoryImpl) Delete(data *model.MstAddress) error {
	return r.db.Delete(&data).Error
}

// SetDefault sets an address as default
func (r AddressRepositoryImpl) SetDefault(userID uuid.UUID, addressID uuid.UUID) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		// Unset all defaults for user
		if err := tx.Model(&model.MstAddress{}).
			Where("user_id = ? AND is_default = ?", userID, true).
			Update("is_default", false).Error; err != nil {
			return err
		}

		// Set new default
		if err := tx.Model(&model.MstAddress{}).
			Where("id = ? AND user_id = ?", addressID, userID).
			Update("is_default", true).Error; err != nil {
			return err
		}

		return nil
	})
}

// UnsetDefault unsets all default addresses for a user
func (r AddressRepositoryImpl) UnsetDefault(userID uuid.UUID) error {
	return r.db.Model(&model.MstAddress{}).
		Where("user_id = ? AND is_default = ?", userID, true).
		Update("is_default", false).Error
}
