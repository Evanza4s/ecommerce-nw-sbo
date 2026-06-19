'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminProductsApi } from '@/server/modules/products/api';
import type {
  ProductListItem,
  ProductDetail,
  ProductFilters,
  ApiPagination,
  CreateProductRequest,
  UpdateProductRequest,
  CreateProductVariantRequest,
  UpdateProductVariantRequest,
  CreateProductSpecRequest,
} from '@/server/modules/products/types';
import { toast } from 'react-toastify';

// ============================================================
// useAdminProducts — admin product listing
// ============================================================

export function useAdminProducts(initialFilters: Partial<ProductFilters> = {}) {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [pagination, setPagination] = useState<ApiPagination>({
    page: 1,
    page_size: 20,
    total_pages: 1,
    total_items: 0,
  });
  const [filters, setFilters] = useState<Partial<ProductFilters>>({
    page: 1,
    page_size: 20,
    ...initialFilters,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (params: Partial<ProductFilters> = filters) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminProductsApi.getAll(params);
      if (res.data) {
        setProducts(res.data ?? []);
        setPagination(res.pagination ?? pagination);
      }
    } catch (err: any) {
      setError(err.message ?? 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetch(filters);
  }, [filters]);

  const updateFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: newFilters.page ?? 1 }));
  }, []);

  const goToPage = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  return { products, pagination, filters, isLoading, error, updateFilters, goToPage, refetch: fetch };
}

// ============================================================
// useAdminProductDetail — single product by ID (admin view)
// ============================================================

export function useAdminProductDetail(id: string) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminProductsApi.getById(id);
      if (res.data) setProduct(res.data);
    } catch (err: any) {
      setError(err.message ?? 'Failed to load product');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);

  return { product, isLoading, error, refetch: fetch };
}

// ============================================================
// useCreateProduct
// ============================================================

export function useCreateProduct() {
  const [isCreating, setIsCreating] = useState(false);

  const create = useCallback(async (data: CreateProductRequest): Promise<ProductDetail> => {
    setIsCreating(true);
    try {
      const res = await adminProductsApi.create(data);
      toast.success('Produk berhasil dibuat!');
      return res.data!;
    } catch (err: any) {
      toast.error(err.message ?? 'Gagal membuat produk');
      throw err;
    } finally {
      setIsCreating(false);
    }
  }, []);

  return { create, isCreating };
}

// ============================================================
// useUpdateProduct
// ============================================================

export function useUpdateProduct() {
  const [isUpdating, setIsUpdating] = useState(false);

  const update = useCallback(async (id: string, data: UpdateProductRequest): Promise<ProductDetail> => {
    setIsUpdating(true);
    try {
      const res = await adminProductsApi.update(id, data);
      toast.success('Produk berhasil diperbarui!');
      return res.data!;
    } catch (err: any) {
      toast.error(err.message ?? 'Gagal memperbarui produk');
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  return { update, isUpdating };
}

// ============================================================
// useDeleteProduct
// ============================================================

export function useDeleteProduct(onSuccess?: () => void) {
  const [isDeleting, setIsDeleting] = useState(false);

  const remove = useCallback(async (id: string) => {
    setIsDeleting(true);
    try {
      await adminProductsApi.delete(id);
      toast.success('Produk berhasil dihapus!');
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.message ?? 'Gagal menghapus produk');
      throw err;
    } finally {
      setIsDeleting(false);
    }
  }, [onSuccess]);

  return { remove, isDeleting };
}

// ============================================================
// useUploadProductImage
// ============================================================

export function useUploadProductImage() {
  const [isUploading, setIsUploading] = useState(false);

  const upload = useCallback(async (productId: string, file: File, isThumbnail?: boolean, sortOrder?: number) => {
    setIsUploading(true);
    try {
      const res = await adminProductsApi.uploadImage(productId, file, isThumbnail, sortOrder);
      toast.success('Gambar berhasil diupload!');
      return res.data!;
    } catch (err: any) {
      toast.error(err.message ?? 'Gagal upload gambar');
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return { upload, isUploading };
}
