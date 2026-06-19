package products

import (
	"mime/multipart"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/products/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
)

// ============================================================
// PRODUCT SERVICE INTERFACE
// ============================================================

type Service interface {
	// Public
	GetProducts(req *schemas.GetProductsPagination) (int, interface{})
	GetProductBySlug(slug string) (int, interface{})

	// Admin CRUD
	GetProductByID(payload *model.JwtPayload, id string) (int, interface{})
	CreateProduct(payload *model.JwtPayload, req *schemas.CreateProduct) (int, interface{})
	UpdateProduct(payload *model.JwtPayload, id string, req *schemas.UpdateProduct) (int, interface{})
	DeleteProduct(payload *model.JwtPayload, id string) (int, interface{})

	// Images — upload & manage
	UploadProductImage(payload *model.JwtPayload, productID string, file *multipart.FileHeader, isThumbnail bool, sortOrder int) (int, interface{})
	GetProductImages(payload *model.JwtPayload, productID string) (int, interface{})
	SetThumbnailImage(payload *model.JwtPayload, productID string, imageID string) (int, interface{})
	DeleteProductImage(payload *model.JwtPayload, productID string, imageID string) (int, interface{})

	// Variants
	CreateProductVariant(payload *model.JwtPayload, productID string, req *schemas.CreateProductVariant) (int, interface{})
	UpdateProductVariant(payload *model.JwtPayload, productID string, variantID string, req *schemas.UpdateProductVariant) (int, interface{})
	DeleteProductVariant(payload *model.JwtPayload, productID string, variantID string) (int, interface{})

	// Specifications
	CreateProductSpecification(payload *model.JwtPayload, productID string, req *schemas.CreateProductSpecification) (int, interface{})
	DeleteProductSpecification(payload *model.JwtPayload, productID string, specID string) (int, interface{})
}
