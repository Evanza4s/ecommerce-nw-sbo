"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateFaq, useUpdateFaq, useAdminFaqDetail } from "@/hooks/useAdminFaq";

import AdminPanelCard from "@/components/admin/AdminPanelCard";
import { InputField } from "@/components/forms";
import { Button } from "@/components/ui/button";

type FaqFormData = {
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
};

interface AdminFaqFormProps {
  mode: "create" | "edit";
  faqId?: string;
}

const initialFormData: FaqFormData = {
  question: "",
  answer: "",
  sort_order: 0,
  is_active: true,
};

const AdminFaqForm = ({ mode, faqId }: AdminFaqFormProps) => {
  const router = useRouter();
  const { create, isCreating } = useCreateFaq();
  const { update, isUpdating } = useUpdateFaq();
  const { faq: existingFaq, isLoading: isLoadingFaq } = useAdminFaqDetail(mode === "edit" ? (faqId || "") : "");

  const [formData, setFormData] = useState<FaqFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === "edit" && existingFaq) {
      setFormData({
        question: existingFaq.question,
        answer: existingFaq.answer,
        sort_order: existingFaq.sort_order || 0,
        is_active: existingFaq.is_active,
      });
    }
  }, [mode, existingFaq]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        question: formData.question,
        answer: formData.answer,
        sort_order: Number(formData.sort_order),
        is_active: formData.is_active,
      };

      if (mode === "create") {
        await create(payload);
      } else if (mode === "edit" && faqId) {
        await update(faqId, payload);
      }

      router.push("/admin/faq");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (mode === "edit" && isLoadingFaq) {
    return <div className="p-8 text-center animate-pulse">Memuat data FAQ...</div>;
  }

  return (
    <AdminPanelCard>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-6">
          <InputField
            label="Pertanyaan"
            placeholder="Masukkan pertanyaan pelanggan..."
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            required
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Jawaban</label>
            <textarea
              className="w-full min-h-[120px] rounded-xl border border-gray-200 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              placeholder="Berikan jawaban detail untuk pertanyaan ini..."
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <InputField
              label="Urutan"
              type="number"
              placeholder="0"
              value={formData.sort_order.toString()}
              onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Status</label>
              <div className="flex items-center gap-4 h-[42px]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={formData.is_active}
                    onChange={() => setFormData({ ...formData, is_active: true })}
                    className="h-4 w-4 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">Aktif</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={!formData.is_active}
                    onChange={() => setFormData({ ...formData, is_active: false })}
                    className="h-4 w-4 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">Nonaktif</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 border-t border-slate-100 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/faq")}
            disabled={isSubmitting || isCreating || isUpdating}
          >
            Batal
          </Button>
          <Button type="submit" disabled={isSubmitting || isCreating || isUpdating}>
            {isSubmitting || isCreating || isUpdating
              ? "Menyimpan..."
              : mode === "create"
                ? "Simpan FAQ"
                : "Perbarui FAQ"}
          </Button>
        </div>
      </form>
    </AdminPanelCard>
  );
};

export default AdminFaqForm;
