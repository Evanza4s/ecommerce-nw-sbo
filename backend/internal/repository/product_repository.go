package repository

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/google/uuid"
)

// ============================================================
// PRODUCT REPOSITORY INTERFACE
// ============================================================

type ProductRepository interface {
	// Query
	FindAll(filters map[string]interface{}, page, pageSize int) ([]model.MstProduct, *utils.PaginationInfoDTO, error)
	FindByID(id uuid.UUID) (*model.MstProduct, error)
	FindBySlug(slug string) (*model.MstProduct, error)
	ExistsBySlug(slug string, excludeID *uuid.UUID) (bool, error)

	// Mutation
	Save(data model.MstProduct) (*model.MstProduct, error)
	Update(data model.MstProduct) (*model.MstProduct, error)
	Delete(data *model.MstProduct) error

	// Images
	SaveImage(data model.MstProductImage) (*model.MstProductImage, error)
	FindImagesByProductID(productID uuid.UUID) ([]model.MstProductImage, error)
	FindImageByID(id uuid.UUID) (*model.MstProductImage, error)
	DeleteImage(data *model.MstProductImage) error
	UnsetAllThumbnails(productID uuid.UUID) error
	SetThumbnail(productID uuid.UUID, imageID uuid.UUID) error

	// Variants
	SaveVariant(data model.MstProductVariant) (*model.MstProductVariant, error)
	FindVariantsByProductID(productID uuid.UUID) ([]model.MstProductVariant, error)
	FindVariantByID(id uuid.UUID) (*model.MstProductVariant, error)
	UpdateVariant(data model.MstProductVariant) (*model.MstProductVariant, error)
	DeleteVariant(data *model.MstProductVariant) error

	// Specifications
	SaveSpecification(data model.MstProductSpecification) (*model.MstProductSpecification, error)
	FindSpecificationsByProductID(productID uuid.UUID) ([]model.MstProductSpecification, error)
	DeleteSpecification(data *model.MstProductSpecification) error
	DeleteAllSpecificationsByProductID(productID uuid.UUID) error
}
