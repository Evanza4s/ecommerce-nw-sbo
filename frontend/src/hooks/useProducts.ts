'use client';

import { useState, useEffect, useCallback } from 'react';
import { productsApi } from '@/server/modules/products/api';
import type { ProductListItem, ProductDetail, ProductFilters, ApiPagination } from '@/server/modules/products/types';

// ============================================================
// useProducts — public product listing with filters
// ============================================================

export function useProducts(initialFilters: Partial<ProductFilters> = {}) {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [pagination, setPagination] = useState<ApiPagination>({
    page: 1,
    page_size: 12,
    total_pages: 1,
    total_items: 0,
  });
  const [filters, setFilters] = useState<Partial<ProductFilters>>({
    page: 1,
    page_size: 12,
    ...initialFilters,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (params: Partial<ProductFilters> = filters) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await productsApi.getAll(params);
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
// useProductDetail — public product detail by slug
// ============================================================

export function useProductDetail(slug: string) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    const fetch = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await productsApi.getBySlug(slug);
        if (!cancelled && res.data) {
          setProduct(res.data);
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message ?? 'Failed to load product');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetch();
    return () => { cancelled = true; };
  }, [slug]);

  return { product, isLoading, error };
}
