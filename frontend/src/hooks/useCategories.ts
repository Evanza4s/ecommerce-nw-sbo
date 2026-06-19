'use client';

import { useState, useEffect } from 'react';
import { categoriesApi } from '@/server/modules/products/api';
import type { Category } from '@/server/modules/products/types';

// ============================================================
// useCategories — fetch all categories (for dropdowns/filters)
// ============================================================

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetch = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await categoriesApi.getAll();
        if (!cancelled && res.data) {
          setCategories(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message ?? 'Failed to load categories');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetch();
    return () => { cancelled = true; };
  }, []);

  return { categories, isLoading, error };
}
