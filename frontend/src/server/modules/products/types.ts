// ============================================================
// CATEGORY TYPES
// Matches backend: model.MstCategory
// ============================================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  is_active: boolean;
}

export interface CategoryFilters {
  name?: string;
  slug?: string;
  icon?: string;
  is_active?: boolean;
  page: number;
  page_size: number;
}

export interface CategoryListResponse {
  data: Category[];
  pagination: ApiPagination;
}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  icon?: string;
  is_active: boolean;
}

export interface UpdateCategoryRequest {
  name?: string;
  slug?: string;
  icon?: string;
  is_active?: boolean;
}

// ============================================================
// PRODUCT IMAGE TYPES
// Matches backend: schemas.ProductImageResponse
// ============================================================

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  is_thumbnail: boolean;
  sort_order: number;
}

// ============================================================
// PRODUCT VARIANT TYPES
// Matches backend: schemas.ProductVariantResponse
// ============================================================

export interface ProductVariant {
  id: string;
  product_id: string;
  color: string;
  size: string;
  sku: string;
  barcode: string;
  stock: number;
  weight: number;
  price_adjustment: number;
  variant_image?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

// ============================================================
// PRODUCT SPECIFICATION TYPES
// Matches backend: schemas.ProductSpecificationResponse
// ============================================================

export interface ProductSpecification {
  id: string;
  product_id: string;
  spec_name: string;
  spec_value: string;
}

// ============================================================
// CATEGORY IN PRODUCT (embedded)
// Matches backend: schemas.CategoryInProductResponse
// ============================================================

export interface CategoryInProduct {
  id: string;
  category_name: string;
  category_slug: string;
}

// ============================================================
// PRODUCT LIST ITEM (lightweight — for grids/tables)
// Matches backend: schemas.ProductResponse
// ============================================================

export interface ProductListItem {
  id: string;
  category_id: string;
  category?: CategoryInProduct;
  product_name: string;
  product_slug: string;
  brand: string;
  gender: string;
  price: number;
  discount_price?: number;
  stock: number;
  thumbnail_url: string;
  average_rating: number;
  total_reviews: number;
  sold_count: number;
  status: 'active' | 'draft' | 'archived';
  is_active: boolean;
  created_at: string;
}

// ============================================================
// PRODUCT DETAIL (full — for detail page)
// Matches backend: schemas.ProductDetailResponse
// ============================================================

export interface ProductDetail {
  id: string;
  category_id: string;
  category?: CategoryInProduct;
  product_name: string;
  product_slug: string;
  description: string;
  brand: string;
  gender: string;
  material: string;
  price: number;
  discount_price?: number;
  stock: number;
  weight: number;
  thumbnail_url: string;
  average_rating: number;
  total_reviews: number;
  sold_count: number;
  view_count: number;
  seo_title?: string;
  seo_description?: string;
  status: 'active' | 'draft' | 'archived';
  is_active: boolean;
  published_at?: string;
  images: ProductImage[];
  variants: ProductVariant[];
  specifications: ProductSpecification[];
  created_at: string;
  updated_at?: string;
}

// ============================================================
// PAGINATION
// ============================================================

export interface ApiPagination {
  page: number;
  page_size: number;
  total_pages: number;
  total_items: number;
}

// ============================================================
// LIST RESPONSES
// ============================================================

export interface ProductListResponse {
  data: ProductListItem[];
  pagination: ApiPagination;
}

// ============================================================
// FILTER / QUERY PARAMS
// ============================================================

export interface ProductFilters {
  search?: string;
  category_id?: string;
  brand?: string;
  gender?: string;
  status?: 'active' | 'draft' | 'archived';
  min_price?: number;
  max_price?: number;
  is_active?: boolean;
  page: number;
  page_size: number;
}

// ============================================================
// REQUEST TYPES (for Admin CRUD)
// Matches backend: schemas.CreateProduct / UpdateProduct
// ============================================================

export interface CreateProductVariantRequest {
  color: string;
  size: string;
  sku: string;
  barcode: string;
  stock: number;
  weight: number;
  price_adjustment: number;
  is_active: boolean;
}

export interface CreateProductSpecRequest {
  spec_name: string;
  spec_value: string;
}

export interface CreateProductRequest {
  category_id: string;
  product_name: string;
  product_slug?: string;
  description?: string;
  brand?: string;
  gender?: 'male' | 'female' | 'unisex';
  material?: string;
  price: number;
  discount_price?: number;
  stock: number;
  weight?: number;
  seo_title?: string;
  seo_description?: string;
  status?: 'active' | 'draft' | 'archived';
  is_active: boolean;
  variants: CreateProductVariantRequest[];
  specifications: CreateProductSpecRequest[];
}

export interface UpdateProductRequest {
  category_id?: string;
  product_name?: string;
  product_slug?: string;
  description?: string;
  brand?: string;
  gender?: 'male' | 'female' | 'unisex';
  material?: string;
  price?: number;
  discount_price?: number;
  stock?: number;
  weight?: number;
  seo_title?: string;
  seo_description?: string;
  status?: 'active' | 'draft' | 'archived';
  is_active?: boolean;
}

export interface UpdateProductVariantRequest {
  color?: string;
  size?: string;
  sku?: string;
  barcode?: string;
  stock?: number;
  weight?: number;
  price_adjustment?: number;
  is_active?: boolean;
}

// ============================================================
// IMAGE UPLOAD RESPONSE
// Matches backend: schemas.ProductImageUploadResponse
// ============================================================

export interface ProductImageUploadResponse {
  id: string;
  product_id: string;
  image_url: string;
  is_thumbnail: boolean;
  sort_order: number;
}
