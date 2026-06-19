import { getApi, postApi, putApi, deleteApi } from '../../core/client';
import type { AuthResponse } from '../auth/types';
import type {
  Category,
  ProductListItem,
  ProductDetail,
  ProductListResponse,
  ProductFilters,
  CreateProductRequest,
  UpdateProductRequest,
  CreateProductVariantRequest,
  UpdateProductVariantRequest,
  CreateProductSpecRequest,
  ProductImageUploadResponse,
  ProductVariant,
  ProductSpecification,
  CategoryFilters,
  CategoryListResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from './types';

// ============================================================
// HELPER — build query string from filters (skip undefined/empty)
// ============================================================

function buildQuery(params: Record<string, any>): string {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      q.set(k, String(v));
    }
  });
  const qs = q.toString();
  return qs ? `?${qs}` : '';
}

// ============================================================
// PUBLIC PRODUCTS API (no auth required)
// ============================================================

export const productsApi = {
  /** GET /products — paginated list with optional filters */
  getAll: (filters: Partial<ProductFilters> = {}) => {
    const params = { page: 1, page_size: 12, ...filters };
    return getApi<AuthResponse<ProductListItem[]> & { pagination?: ApiPagination }>(`/products${buildQuery(params)}`);
  },

  /** GET /products/:slug — public product detail by slug */
  getBySlug: (slug: string) => {
    return getApi<AuthResponse<ProductDetail>>(`/products/${slug}`);
  },
};

// ============================================================
// ADMIN PRODUCTS API (JWT required — handled by axios interceptor)
// ============================================================

export const adminProductsApi = {
  /** GET /products — list all products (can filter by status=draft etc.) */
  getAll: (filters: Partial<ProductFilters> = {}) => {
    const params = { page: 1, page_size: 20, ...filters };
    return getApi<AuthResponse<ProductListItem[]> & { pagination?: ApiPagination }>(`/products${buildQuery(params)}`);
  },

  /** GET /products/admin/:id — full product detail by UUID */
  getById: (id: string) => {
    return getApi<AuthResponse<ProductDetail>>(`/products/admin/${id}`);
  },

  /** POST /products/admin — create a new product */
  create: (data: CreateProductRequest) => {
    return postApi<AuthResponse<ProductDetail>>('/products/admin', data);
  },

  /** PUT /products/admin/:id — update product basic info */
  update: (id: string, data: UpdateProductRequest) => {
    return putApi<AuthResponse<ProductDetail>>(`/products/admin/${id}`, data);
  },

  /** DELETE /products/admin/:id — delete product */
  delete: (id: string) => {
    return deleteApi<AuthResponse<null>>(`/products/admin/${id}`);
  },

  // ── Images ──────────────────────────────────────────────

  /** POST /products/admin/:id/images — upload image (multipart/form-data) */
  uploadImage: (productId: string, file: File, isThumbnail?: boolean, sortOrder?: number) => {
    const form = new FormData();
    form.append('image', file);
    if (isThumbnail) form.append('is_thumbnail', 'true');
    if (sortOrder !== undefined) form.append('sort_order', sortOrder.toString());
    
    return postApi<AuthResponse<ProductImageUploadResponse>>(
      `/products/admin/${productId}/images`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  },

  /** GET /products/admin/:id/images — list all images */
  getImages: (productId: string) => {
    return getApi<AuthResponse<ProductImageUploadResponse[]>>(
      `/products/admin/${productId}/images`
    );
  },

  /** PUT /products/admin/:id/images/:imageId/thumbnail — set as thumbnail */
  setThumbnail: (productId: string, imageId: string) => {
    return putApi<AuthResponse<null>>(
      `/products/admin/${productId}/images/${imageId}/thumbnail`
    );
  },

  /** DELETE /products/admin/:id/images/:imageId — delete image */
  deleteImage: (productId: string, imageId: string) => {
    return deleteApi<AuthResponse<null>>(
      `/products/admin/${productId}/images/${imageId}`
    );
  },

  // ── Variants ────────────────────────────────────────────

  /** POST /products/admin/:id/variants — add variant */
  addVariant: (productId: string, data: CreateProductVariantRequest) => {
    return postApi<AuthResponse<ProductVariant>>(
      `/products/admin/${productId}/variants`,
      data
    );
  },

  /** PUT /products/admin/:id/variants/:variantId — update variant */
  updateVariant: (productId: string, variantId: string, data: UpdateProductVariantRequest) => {
    return putApi<AuthResponse<ProductVariant>>(
      `/products/admin/${productId}/variants/${variantId}`,
      data
    );
  },

  /** DELETE /products/admin/:id/variants/:variantId — delete variant */
  deleteVariant: (productId: string, variantId: string) => {
    return deleteApi<AuthResponse<null>>(
      `/products/admin/${productId}/variants/${variantId}`
    );
  },

  // ── Specifications ───────────────────────────────────────

  /** POST /products/admin/:id/specifications — add spec */
  addSpec: (productId: string, data: CreateProductSpecRequest) => {
    return postApi<AuthResponse<ProductSpecification>>(
      `/products/admin/${productId}/specifications`,
      data
    );
  },

  /** DELETE /products/admin/:id/specifications/:specId — delete spec */
  deleteSpec: (productId: string, specId: string) => {
    return deleteApi<AuthResponse<null>>(
      `/products/admin/${productId}/specifications/${specId}`
    );
  },
};

// ============================================================
// CATEGORIES API
// ============================================================

export const categoriesApi = {
  getAllPagination: (filters: Partial<CategoryFilters> = {}) => {
    const params = { page: 1, page_size: 20, ...filters };
    return getApi<AuthResponse<Category[]> & { pagination?: ApiPagination }>(`/categories/get-all${buildQuery(params)}`);
  },

  /** GET /categories — all categories (no pagination, for dropdowns) */
  getAll: () => {
    return getApi<AuthResponse<Category[]>>('/categories');
  },

  /** GET /categories/:id — single category by ID */
  getById: (id: string) => {
    return getApi<AuthResponse<Category>>(`/categories/${id}`);
  },

  /** POST /categories — create a new category */
  create: (data: CreateCategoryRequest) => {
    return postApi<AuthResponse<Category>>('/categories', data);
  },

  /** PUT /categories/:id — update category */
  update: (id: string, data: UpdateCategoryRequest) => {
    return putApi<AuthResponse<Category>>(`/categories/${id}`, data);
  },

  /** DELETE /categories/:id — delete category */
  delete: (id: string) => {
    return deleteApi<AuthResponse<null>>(`/categories/${id}`);
  },
};
