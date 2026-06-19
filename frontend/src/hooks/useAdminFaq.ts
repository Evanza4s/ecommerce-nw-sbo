import { useState, useCallback, useEffect } from "react";
import { faqApi } from "@/server/modules/faq/api";
import type { FAQ } from "@/server/modules/faq/types";
import { toast } from "react-toastify";

export function useAdminFaq(params?: Record<string, string | number | boolean>) {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFaqs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await faqApi.getAll(params);
      if (Array.isArray(res.data)) {
        setFaqs(res.data);
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        setFaqs(res.data.data);
      } else {
        setFaqs([]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch faqs");
      toast.error("Gagal memuat data FAQ");
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  return { faqs, isLoading, error, refetch: fetchFaqs };
}

export function useDeleteFaq(onSuccess?: () => void) {
  const [isDeleting, setIsDeleting] = useState(false);

  const remove = async (id: string) => {
    setIsDeleting(true);
    try {
      await faqApi.delete(id);
      toast.success("FAQ berhasil dihapus");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus FAQ");
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return { remove, isDeleting };
}

export function useAdminFaqDetail(id: string) {
  const [faq, setFaq] = useState<FAQ | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    faqApi.getById(id)
      .then((res) => {
        if (res.data) setFaq(res.data);
      })
      .catch((err) => {
        toast.error(err.message || "Gagal memuat detail FAQ");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  return { faq, isLoading };
}

export function useCreateFaq() {
  const [isCreating, setIsCreating] = useState(false);

  const create = async (data: any) => {
    setIsCreating(true);
    try {
      await faqApi.create(data);
      toast.success("FAQ berhasil dibuat");
    } catch (err: any) {
      toast.error(err.message || "Gagal membuat FAQ");
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  return { create, isCreating };
}

export function useUpdateFaq() {
  const [isUpdating, setIsUpdating] = useState(false);

  const update = async (id: string, data: any) => {
    setIsUpdating(true);
    try {
      await faqApi.update(id, data);
      toast.success("FAQ berhasil diperbarui");
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui FAQ");
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return { update, isUpdating };
}
