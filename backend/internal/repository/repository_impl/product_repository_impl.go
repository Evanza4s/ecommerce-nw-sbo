package repository_impl

import (
	"fmt"
	"strings"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/db"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// ============================================================
// PRODUCT REPOSITORY IMPLEMENTATION
// ============================================================

type ProductRepositoryImpl struct {
	db *gorm.DB
}

func NewProductRepositoryImpl() *ProductRepositoryImpl {
	return &ProductRepositoryImpl{db: db.GetManager()}
}

// ============================================================
// QUERY METHODS
// ============================================================

// FindAll retrieves products with filter and pagination
func (r ProductRepositoryImpl) FindAll(filters map[string]interface{}, page, pageSize int) ([]model.MstProduct, *utils.PaginationInfoDTO, error) {
	var data []model.MstProduct

	query := r.db.Preload("CategoryRef").Preload("Images")

	// Apply filters
	if search, ok := filters["search"].(string); ok && search != "" {
		search = "%" + strings.ToLower(search) + "%"
		query = query.Where("LOWER(product_name) LIKE ? OR LOWER(brand) LIKE ? OR LOWER(product_slug) LIKE ?", search, search, search)
	}
	if categoryID, ok := filters["category_id"].(string); ok && categoryID != "" {
		query = query.Where("category_id = ?", categoryID)
	}
	if brand, ok := filters["brand"].(string); ok && brand != "" {
		query = query.Where("LOWER(brand) = ?", strings.ToLower(brand))
	}
	if gender, ok := filters["gender"].(string); ok && gender != "" {
		query = query.Where("gender = ?", gender)
	}
	if status, ok := filters["status"].(string); ok && status != "" {
		query = query.Where("status = ?", status)
	}
	if isActive, ok := filters["is_active"].(*bool); ok && isActive != nil {
		query = query.Where("is_active = ?", *isActive)
	}
	if minPrice, ok := filters["min_price"].(float64); ok && minPrice > 0 {
		query = query.Where("price >= ?", minPrice)
	}
	if maxPrice, ok := filters["max_price"].(float64); ok && maxPrice > 0 {
		query = query.Where("price <= ?", maxPrice)
	}

	// Count total
	var total int64
	if err := query.Model(&model.MstProduct{}).Count(&total).Error; err != nil {
		return nil, nil, err
	}

	// Paginate
	paginateScope, info := utils.PaginateWithTotal(page, pageSize)
	info.Count = total
	info.TotalPages = utils.CalculateTotalPages(total, pageSize)

	if err := query.Scopes(paginateScope).
		Order("created_at DESC").
		Find(&data).Error; err != nil {
		return nil, nil, err
	}

	return data, info, nil
}

// FindByID retrieves product by ID with all relations
func (r ProductRepositoryImpl) FindByID(id uuid.UUID) (*model.MstProduct, error) {
	var data model.MstProduct
	if err := r.db.
		Preload("CategoryRef").
		Preload("Images", func(db *gorm.DB) *gorm.DB {
			return db.Order("sort_order ASC, created_at ASC")
		}).
		Preload("Variants", func(db *gorm.DB) *gorm.DB {
			return db.Where("is_active = true").Order("created_at ASC")
		}).
		Preload("Specifications").
		First(&data, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &data, nil
}

// FindBySlug retrieves product by slug with all relations
func (r ProductRepositoryImpl) FindBySlug(slug string) (*model.MstProduct, error) {
	var data model.MstProduct
	if err := r.db.
		Preload("CategoryRef").
		Preload("Images", func(db *gorm.DB) *gorm.DB {
			return db.Order("sort_order ASC, created_at ASC")
		}).
		Preload("Variants", func(db *gorm.DB) *gorm.DB {
			return db.Where("is_active = true").Order("created_at ASC")
		}).
		Preload("Specifications").
		Where("product_slug = ?", slug).
		First(&data).Error; err != nil {
		return nil, err
	}
	return &data, nil
}

// ExistsBySlug checks if slug already exists (optionally excluding an ID)
func (r ProductRepositoryImpl) ExistsBySlug(slug string, excludeID *uuid.UUID) (bool, error) {
	var count int64
	query := r.db.Model(&model.MstProduct{}).Where("product_slug = ?", slug)
	if excludeID != nil {
		query = query.Where("id != ?", *excludeID)
	}
	if err := query.Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}

// ============================================================
// MUTATION METHODS
// ============================================================

// Save creates a new product
func (r ProductRepositoryImpl) Save(data model.MstProduct) (*model.MstProduct, error) {
	if err := r.db.Create(&data).Error; err != nil {
		return nil, err
	}
	return &data, nil
}

// Update updates an existing product
func (r ProductRepositoryImpl) Update(data model.MstProduct) (*model.MstProduct, error) {
	var result model.MstProduct
	if err := r.db.Model(&result).
		Clauses(clause.Returning{}).
		Where("id = ?", data.ID).
		Updates(&data).Error; err != nil {
		return nil, err
	}
	return &result, nil
}

// Delete soft deletes a product
func (r ProductRepositoryImpl) Delete(data *model.MstProduct) error {
	return r.db.Delete(data).Error
}

// ============================================================
// IMAGE METHODS
// ============================================================

// SaveImage saves a product image record
func (r ProductRepositoryImpl) SaveImage(data model.MstProductImage) (*model.MstProductImage, error) {
	if err := r.db.Create(&data).Error; err != nil {
		return nil, err
	}
	return &data, nil
}

// FindImagesByProductID retrieves all images for a product
func (r ProductRepositoryImpl) FindImagesByProductID(productID uuid.UUID) ([]model.MstProductImage, error) {
	var data []model.MstProductImage
	if err := r.db.
		Where("product_id = ?", productID).
		Order("sort_order ASC, created_at ASC").
		Find(&data).Error; err != nil {
		return nil, err
	}
	return data, nil
}

// FindImageByID retrieves a specific product image
func (r ProductRepositoryImpl) FindImageByID(id uuid.UUID) (*model.MstProductImage, error) {
	var data model.MstProductImage
	if err := r.db.First(&data, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &data, nil
}

// DeleteImage soft deletes a product image
func (r ProductRepositoryImpl) DeleteImage(data *model.MstProductImage) error {
	return r.db.Delete(data).Error
}

// UnsetAllThumbnails unsets all thumbnail flags for a product
func (r ProductRepositoryImpl) UnsetAllThumbnails(productID uuid.UUID) error {
	return r.db.Model(&model.MstProductImage{}).
		Where("product_id = ? AND is_thumbnail = true", productID).
		Update("is_thumbnail", false).Error
}

// SetThumbnail sets a specific image as thumbnail and updates product thumbnail_url
func (r ProductRepositoryImpl) SetThumbnail(productID uuid.UUID, imageID uuid.UUID) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		// Unset all thumbnails
		if err := tx.Model(&model.MstProductImage{}).
			Where("product_id = ?", productID).
			Update("is_thumbnail", false).Error; err != nil {
			return err
		}

		// Set new thumbnail
		var img model.MstProductImage
		if err := tx.Clauses(clause.Returning{}).
			Model(&img).
			Where("id = ? AND product_id = ?", imageID, productID).
			Update("is_thumbnail", true).Error; err != nil {
			return err
		}

		// Update product thumbnail_url
		if err := tx.Model(&model.MstProduct{}).
			Where("id = ?", productID).
			Update("thumbnail_url", img.ImageURL).Error; err != nil {
			return err
		}

		return nil
	})
}

// ============================================================
// VARIANT METHODS
// ============================================================

// SaveVariant creates a product variant
func (r ProductRepositoryImpl) SaveVariant(data model.MstProductVariant) (*model.MstProductVariant, error) {
	if err := r.db.Create(&data).Error; err != nil {
		return nil, err
	}
	return &data, nil
}

// FindVariantsByProductID retrieves all variants for a product
func (r ProductRepositoryImpl) FindVariantsByProductID(productID uuid.UUID) ([]model.MstProductVariant, error) {
	var data []model.MstProductVariant
	if err := r.db.
		Where("product_id = ?", productID).
		Order("created_at ASC").
		Find(&data).Error; err != nil {
		return nil, err
	}
	return data, nil
}

// FindVariantByID retrieves a specific variant
func (r ProductRepositoryImpl) FindVariantByID(id uuid.UUID) (*model.MstProductVariant, error) {
	var data model.MstProductVariant
	if err := r.db.First(&data, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &data, nil
}

// UpdateVariant updates a product variant
func (r ProductRepositoryImpl) UpdateVariant(data model.MstProductVariant) (*model.MstProductVariant, error) {
	var result model.MstProductVariant
	if err := r.db.Model(&result).
		Clauses(clause.Returning{}).
		Where("id = ?", data.ID).
		Updates(&data).Error; err != nil {
		return nil, err
	}
	return &result, nil
}

// DeleteVariant soft deletes a variant
func (r ProductRepositoryImpl) DeleteVariant(data *model.MstProductVariant) error {
	return r.db.Delete(data).Error
}

// ============================================================
// SPECIFICATION METHODS
// ============================================================

// SaveSpecification saves a product specification
func (r ProductRepositoryImpl) SaveSpecification(data model.MstProductSpecification) (*model.MstProductSpecification, error) {
	if err := r.db.Create(&data).Error; err != nil {
		return nil, err
	}
	return &data, nil
}

// FindSpecificationsByProductID retrieves all specifications for a product
func (r ProductRepositoryImpl) FindSpecificationsByProductID(productID uuid.UUID) ([]model.MstProductSpecification, error) {
	var data []model.MstProductSpecification
	if err := r.db.
		Where("product_id = ?", productID).
		Find(&data).Error; err != nil {
		return nil, err
	}
	return data, nil
}

// DeleteSpecification soft deletes a specification
func (r ProductRepositoryImpl) DeleteSpecification(data *model.MstProductSpecification) error {
	return r.db.Delete(data).Error
}

// DeleteAllSpecificationsByProductID deletes all specifications for a product
func (r ProductRepositoryImpl) DeleteAllSpecificationsByProductID(productID uuid.UUID) error {
	return r.db.Where("product_id = ?", productID).Delete(&model.MstProductSpecification{}).Error
}

// ============================================================
// SLUG HELPER
// ============================================================

// GenerateUniqueSlug ensures slug uniqueness by appending number if needed
func GenerateUniqueSlug(base string, repo *ProductRepositoryImpl, excludeID *uuid.UUID) string {
	slug := base
	for i := 1; ; i++ {
		exists, err := repo.ExistsBySlug(slug, excludeID)
		if err != nil || !exists {
			return slug
		}
		slug = fmt.Sprintf("%s-%d", base, i)
	}
}
