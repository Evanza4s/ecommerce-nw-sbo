import Link from "next/link";

import { InputField } from "@/components/forms";
import AdminPanelCard from "@/components/admin/AdminPanelCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface AdminCategoryFormProps {
  title: string;
  submitLabel: string;
  initialValues?: {
    name?: string;
    slug?: string;
    status?: "active" | "inactive";
  };
}

const AdminCategoryForm = ({
  title,
  submitLabel,
  initialValues,
}: AdminCategoryFormProps) => {
  return (
    <AdminPanelCard>
      <form className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Atur informasi utama kategori agar konsisten dengan katalog produk.
          </p>
        </div>

        <InputField
          label="Category Name"
          name="categoryName"
          defaultValue={initialValues?.name}
        />
        <InputField label="Slug" name="slug" defaultValue={initialValues?.slug} />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Status</label>
          <select
            name="status"
            defaultValue={initialValues?.status ?? "active"}
            className="rounded-lg border border-input bg-background px-4 py-3 text-sm"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 border-t pt-6">
          <Button asChild variant="outline" type="button">
            <Link href="/admin/categories">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancel
            </Link>
          </Button>
          <Button type="submit">{submitLabel}</Button>
        </div>
      </form>
    </AdminPanelCard>
  );
};

export default AdminCategoryForm;
