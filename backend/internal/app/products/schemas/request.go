package schemas

// ============================================================
// PRODUCT REQUEST SCHEMAS
// ============================================================

// GetProductsPagination request for paginated product list
type GetProductsPagination struct {
	Search     string  `json:"search" query:"search"`
	CategoryID string  `json:"category_id" query:"category_id"`
	Brand      string  `json:"brand" query:"brand"`
	Gender     string  `json:"gender" query:"gender"`
	Status     string  `json:"status" query:"status"`
	MinPrice   float64 `json:"min_price" query:"min_price"`
	MaxPrice   float64 `json:"max_price" query:"max_price"`
	IsActive   *bool   `json:"is_active" query:"is_active"`
	Page       int     `json:"page" query:"page" validate:"required,min=1"`
	PageSize   int     `json:"page_size" query:"page_size" validate:"required,min=1,max=100"`
}

// CreateProductVariant request for creating a product variant
type CreateProductVariant struct {
	Color           string  `json:"color"`
	Size            string  `json:"size"`
	SKU             string  `json:"sku"`
	Barcode         string  `json:"barcode"`
	Stock           int     `json:"stock"`
	Weight          float64 `json:"weight"`
	PriceAdjustment float64 `json:"price_adjustment"`
	IsActive        bool    `json:"is_active"`
}

// CreateProductSpecification request for a product specification
type CreateProductSpecification struct {
	SpecName  string `json:"spec_name" validate:"required"`
	SpecValue string `json:"spec_value" validate:"required"`
}

// CreateProduct request for creating a new product
type CreateProduct struct {
	CategoryID     string                       `json:"category_id" validate:"required,uuid"`
	ProductName    string                       `json:"product_name" validate:"required,min=3,max=255"`
	ProductSlug    string                       `json:"product_slug" validate:"omitempty,max=255"`
	Description    string                       `json:"description"`
	Brand          string                       `json:"brand" validate:"omitempty,max=100"`
	Gender         string                       `json:"gender" validate:"omitempty,oneof=male female unisex"`
	Material       string                       `json:"material" validate:"omitempty,max=150"`
	Price          float64                      `json:"price" validate:"required,gt=0"`
	DiscountPrice  float64                      `json:"discount_price" validate:"omitempty,gte=0"`
	Stock          int                          `json:"stock" validate:"gte=0"`
	Weight         float64                      `json:"weight" validate:"omitempty,gte=0"`
	SeoTitle       string                       `json:"seo_title" validate:"omitempty,max=255"`
	SeoDescription string                       `json:"seo_description"`
	Status         string                       `json:"status" validate:"omitempty,oneof=active draft archived"`
	IsActive       bool                         `json:"is_active"`
	Variants       []CreateProductVariant       `json:"variants"`
	Specifications []CreateProductSpecification `json:"specifications"`
}

// UpdateProductVariant request for updating a variant
type UpdateProductVariant struct {
	Color           string  `json:"color"`
	Size            string  `json:"size"`
	SKU             string  `json:"sku"`
	Barcode         string  `json:"barcode"`
	Stock           *int    `json:"stock"`
	Weight          float64 `json:"weight"`
	PriceAdjustment float64 `json:"price_adjustment"`
	IsActive        *bool   `json:"is_active"`
}

// UpdateProduct request for updating a product
type UpdateProduct struct {
	CategoryID     string  `json:"category_id" validate:"omitempty,uuid"`
	ProductName    string  `json:"product_name" validate:"omitempty,min=3,max=255"`
	ProductSlug    string  `json:"product_slug" validate:"omitempty,max=255"`
	Description    string  `json:"description"`
	Brand          string  `json:"brand" validate:"omitempty,max=100"`
	Gender         string  `json:"gender" validate:"omitempty,oneof=male female unisex"`
	Material       string  `json:"material" validate:"omitempty,max=150"`
	Price          float64 `json:"price" validate:"omitempty,gt=0"`
	DiscountPrice  float64 `json:"discount_price" validate:"omitempty,gte=0"`
	Stock          *int    `json:"stock" validate:"omitempty,gte=0"`
	Weight         float64 `json:"weight" validate:"omitempty,gte=0"`
	SeoTitle       string  `json:"seo_title" validate:"omitempty,max=255"`
	SeoDescription string  `json:"seo_description"`
	Status         string  `json:"status" validate:"omitempty,oneof=active draft archived"`
	IsActive       *bool   `json:"is_active"`
}
