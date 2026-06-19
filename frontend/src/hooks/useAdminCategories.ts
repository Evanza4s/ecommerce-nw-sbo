'use client';

import { useState, useEffect, useCallback } from 'react';
import { categoriesApi } from '@/server/modules/products/api';
import type {
  Category,
  CategoryFilters,
  ApiPagination,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/server/modules/products/types';
import { toast } from 'react-toastify';

// ============================================================
// useAdminCategories — paginated category listing
// ============================================================

export function useAdminCategories(initialFilters: Partial<CategoryFilters> = {}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<ApiPagination>({
    page: 1,
    page_size: 20,
    total_pages: 1,
    total_items: 0,
  });
  const [filters, setFilters] = useState<Partial<CategoryFilters>>({
    page: 1,
    page_size: 20,
    ...initialFilters,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (params: Partial<CategoryFilters> = filters) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await categoriesApi.getAllPagination(params);
      if (res.data) {
        setCategories(res.data ?? []);
        setPagination(res.pagination ?? pagination);
      }
    } catch (err: any) {
      setError(err.message ?? 'Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetch(filters);
  }, [filters]);

  const updateFilters = useCallback((newFilters: Partial<CategoryFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: newFilters.page ?? 1 }));
  }, []);

  const goToPage = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  return { categories, pagination, filters, isLoading, error, updateFilters, goToPage, refetch: fetch };
}

// ============================================================
// useAdminCategoryDetail — single category by ID
// ============================================================

export function useAdminCategoryDetail(id: string) {
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await categoriesApi.getById(id);
      if (res.data) setCategory(res.data);
    } catch (err: any) {
      setError(err.message ?? 'Failed to load category');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);

  return { category, isLoading, error, refetch: fetch };
}

// ============================================================
// useCreateCategory
// ============================================================

export function useCreateCategory() {
  const [isCreating, setIsCreating] = useState(false);

  const create = useCallback(async (data: CreateCategoryRequest): Promise<Category> => {
    setIsCreating(true);
    try {
      const res = await categoriesApi.create(data);
      toast.success('Kategori berhasil dibuat!');
      return res.data!;
    } catch (err: any) {
      toast.error(err.message ?? 'Gagal membuat kategori');
      throw err;
    } finally {
      setIsCreating(false);
    }
  }, []);

  return { create, isCreating };
}

// ============================================================
// useUpdateCategory
// ============================================================

export function useUpdateCategory() {
  const [isUpdating, setIsUpdating] = useState(false);

  const update = useCallback(async (id: string, data: UpdateCategoryRequest): Promise<Category> => {
    setIsUpdating(true);
    try {
      const res = await categoriesApi.update(id, data);
      toast.success('Kategori berhasil diperbarui!');
      return res.data!;
    } catch (err: any) {
      toast.error(err.message ?? 'Gagal memperbarui kategori');
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  return { update, isUpdating };
}

// ============================================================
// useDeleteCategory
// ============================================================

export function useDeleteCategory(onSuccess?: () => void) {
  const [isDeleting, setIsDeleting] = useState(false);

  const remove = useCallback(async (id: string) => {
    setIsDeleting(true);
    try {
      await categoriesApi.delete(id);
      toast.success('Kategori berhasil dihapus!');
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.message ?? 'Gagal menghapus kategori');
      throw err;
    } finally {
      setIsDeleting(false);
    }
  }, [onSuccess]);

  return { remove, isDeleting };
}
