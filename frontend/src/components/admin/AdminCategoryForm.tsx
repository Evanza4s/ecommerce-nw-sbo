"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateCategory, useUpdateCategory, useAdminCategoryDetail } from "@/hooks/useAdminCategories";

import AdminPanelCard from "@/components/admin/AdminPanelCard";
import { InputField } from "@/components/forms";
import { Button } from "@/components/ui/button";

type CategoryFormData = {
  name: string;
  slug: string;
  icon: string;
  is_active: boolean;
};

interface AdminCategoryFormProps {
  mode: "create" | "edit";
  categoryId?: string;
}

const initialFormData: CategoryFormData = {
  name: "",
  slug: "",
  icon: "",
  is_active: true,
};

const AdminCategoryForm = ({ mode, categoryId }: AdminCategoryFormProps) => {
  const router = useRouter();
  const { create, isCreating } = useCreateCategory();
  const { update, isUpdating } = useUpdateCategory();
  const { category: existingCategory, isLoading: isLoadingCategory } = useAdminCategoryDetail(mode === "edit" ? (categoryId || "") : "");

  const [formData, setFormData] = useState<CategoryFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === "edit" && existingCategory) {
      setFormData({
        name: existingCategory.name,
        slug: existingCategory.slug,
        icon: existingCategory.icon || "",
        is_active: existingCategory.is_active,
      });
    }
  }, [mode, existingCategory]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    // Auto-generate slug when creating, or if the user modifies name (optional, but usually helpful)
    if (mode === "create") {
      setFormData({ ...formData, name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') });
    } else {
      setFormData({ ...formData, name });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        icon: formData.icon,
        is_active: formData.is_active,
      };

      if (mode === "create") {
        await create(payload);
      } else if (mode === "edit" && categoryId) {
        await update(categoryId, payload);
      }

      router.push("/admin/categories");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (mode === "edit" && isLoadingCategory) {
    return <div className="p-8 text-center animate-pulse">Memuat data kategori...</div>;
  }

  return (
    <AdminPanelCard>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Category Name */}
          <InputField
            label="Category Name"
            placeholder="e.g. Shoes"
            value={formData.name}
            onChange={handleNameChange}
            required
          />

          {/* Slug */}
          <InputField
            label="Slug (URL)"
            placeholder="e.g. shoes"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
          />

          {/* Icon */}
          <InputField
            label="Icon (Opsional)"
            placeholder="e.g. fas fa-shoe-prints atau URL"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          />

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Status</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={formData.is_active}
                  onChange={() => setFormData({ ...formData, is_active: true })}
                  className="h-4 w-4 text-primary focus:ring-primary"
                />
                <span className="text-sm">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={!formData.is_active}
                  onChange={() => setFormData({ ...formData, is_active: false })}
                  className="h-4 w-4 text-primary focus:ring-primary"
                />
                <span className="text-sm">Inactive</span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 border-t border-slate-100 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/categories")}
            disabled={isSubmitting || isCreating || isUpdating}
          >
            Batal
          </Button>
          <Button type="submit" disabled={isSubmitting || isCreating || isUpdating}>
            {isSubmitting || isCreating || isUpdating
              ? "Menyimpan..."
              : mode === "create"
                ? "Simpan Kategori"
                : "Perbarui Kategori"}
          </Button>
        </div>
      </form>
    </AdminPanelCard>
  );
};

export default AdminCategoryForm;
