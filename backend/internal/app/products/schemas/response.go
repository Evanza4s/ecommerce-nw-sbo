package schemas

import (
	"time"

	"github.com/google/uuid"
)

// ============================================================
// PRODUCT RESPONSE SCHEMAS
// ============================================================

// ProductImageResponse represents a product image
type ProductImageResponse struct {
	ID          uuid.UUID `json:"id"`
	ProductID   uuid.UUID `json:"product_id"`
	ImageURL    string    `json:"image_url"`
	IsThumbnail bool      `json:"is_thumbnail"`
	SortOrder   int       `json:"sort_order"`
}

// ProductVariantResponse represents a product variant
type ProductVariantResponse struct {
	ID              uuid.UUID  `json:"id"`
	ProductID       uuid.UUID  `json:"product_id"`
	Color           string     `json:"color"`
	Size            string     `json:"size"`
	SKU             string     `json:"sku"`
	Barcode         string     `json:"barcode"`
	Stock           int        `json:"stock"`
	Weight          float64    `json:"weight"`
	PriceAdjustment float64    `json:"price_adjustment"`
	VariantImage    string     `json:"variant_image,omitempty"`
	IsActive        bool       `json:"is_active"`
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       *time.Time `json:"updated_at,omitempty"`
}

// ProductSpecificationResponse represents a product specification
type ProductSpecificationResponse struct {
	ID        uuid.UUID `json:"id"`
	ProductID uuid.UUID `json:"product_id"`
	SpecName  string    `json:"spec_name"`
	SpecValue string    `json:"spec_value"`
}

// CategoryInProductResponse embeds category name in product
type CategoryInProductResponse struct {
	ID           uuid.UUID `json:"id"`
	CategoryName string    `json:"category_name"`
	CategorySlug string    `json:"category_slug"`
}

// ProductResponse represents a product in list view (lightweight)
type ProductResponse struct {
	ID            uuid.UUID                  `json:"id"`
	CategoryID    uuid.UUID                  `json:"category_id"`
	Category      *CategoryInProductResponse `json:"category,omitempty"`
	ProductName   string                     `json:"product_name"`
	ProductSlug   string                     `json:"product_slug"`
	Brand         string                     `json:"brand"`
	Gender        string                     `json:"gender"`
	Price         float64                    `json:"price"`
	DiscountPrice float64                    `json:"discount_price,omitempty"`
	Stock         int                        `json:"stock"`
	ThumbnailURL  string                     `json:"thumbnail_url"`
	AverageRating float64                    `json:"average_rating"`
	TotalReviews  int                        `json:"total_reviews"`
	SoldCount     int64                      `json:"sold_count"`
	Status        string                     `json:"status"`
	IsActive      bool                       `json:"is_active"`
	CreatedAt     time.Time                  `json:"created_at"`
}

// ProductDetailResponse represents full product detail
type ProductDetailResponse struct {
	ID             uuid.UUID                      `json:"id"`
	CategoryID     uuid.UUID                      `json:"category_id"`
	Category       *CategoryInProductResponse     `json:"category,omitempty"`
	ProductName    string                         `json:"product_name"`
	ProductSlug    string                         `json:"product_slug"`
	Description    string                         `json:"description"`
	Brand          string                         `json:"brand"`
	Gender         string                         `json:"gender"`
	Material       string                         `json:"material"`
	Price          float64                        `json:"price"`
	DiscountPrice  float64                        `json:"discount_price,omitempty"`
	Stock          int                            `json:"stock"`
	Weight         float64                        `json:"weight"`
	ThumbnailURL   string                         `json:"thumbnail_url"`
	AverageRating  float64                        `json:"average_rating"`
	TotalReviews   int                            `json:"total_reviews"`
	SoldCount      int64                          `json:"sold_count"`
	ViewCount      int64                          `json:"view_count"`
	SeoTitle       string                         `json:"seo_title,omitempty"`
	SeoDescription string                         `json:"seo_description,omitempty"`
	Status         string                         `json:"status"`
	IsActive       bool                           `json:"is_active"`
	PublishedAt    *time.Time                     `json:"published_at,omitempty"`
	Images         []ProductImageResponse         `json:"images"`
	Variants       []ProductVariantResponse       `json:"variants"`
	Specifications []ProductSpecificationResponse `json:"specifications"`
	CreatedAt      time.Time                      `json:"created_at"`
	UpdatedAt      *time.Time                     `json:"updated_at,omitempty"`
}

// ProductImageUploadResponse response after uploading image
type ProductImageUploadResponse struct {
	ID          uuid.UUID `json:"id"`
	ProductID   uuid.UUID `json:"product_id"`
	ImageURL    string    `json:"image_url"`
	IsThumbnail bool      `json:"is_thumbnail"`
	SortOrder   int       `json:"sort_order"`
}
