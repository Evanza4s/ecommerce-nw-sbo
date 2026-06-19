"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

import { vouchersApi } from "@/server/index";
import { Voucher, CreateVoucherRequest, UpdateVoucherRequest } from "@/server/modules/vouchers/types";

interface VoucherFormProps {
  initialData?: Voucher;
  isEditing?: boolean;
}

export default function VoucherForm({ initialData, isEditing = false }: VoucherFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    code: initialData?.code || "",
    discount_type: initialData?.discount_type || "Percentage",
    discount_value: initialData?.discount_value?.toString() || "",
    minimum_purchase: initialData?.minimum_purchase?.toString() || "0",
    max_usage: initialData?.max_usage?.toString() || "1",
    start_date: initialData?.start_date ? new Date(initialData.start_date).toISOString().slice(0, 16) : "",
    end_date: initialData?.end_date ? new Date(initialData.end_date).toISOString().slice(0, 16) : "",
    is_active: initialData !== undefined ? initialData.is_active : true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" 
        ? (e.target as HTMLInputElement).checked 
        : name === "code" ? value.toUpperCase() : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const start_date = formData.start_date ? new Date(formData.start_date).toISOString() : null;
      const end_date = formData.end_date ? new Date(formData.end_date).toISOString() : null;

      if (isEditing && initialData) {
        const updateData: UpdateVoucherRequest = {
          discount_type: formData.discount_type as "Percentage" | "Nominal",
          discount_value: parseFloat(formData.discount_value),
          minimum_purchase: parseFloat(formData.minimum_purchase),
          max_usage: parseInt(formData.max_usage),
          start_date,
          end_date,
          is_active: formData.is_active,
        };

        const res = await vouchersApi.update(initialData.id, updateData);
        if (res.status === true) {
          toast.success("Voucher updated successfully");
          router.push("/admin/promotions");
        } else {
          toast.error(res.message || "Failed to update voucher");
        }
      } else {
        const createData: CreateVoucherRequest = {
          code: formData.code,
          discount_type: formData.discount_type as "Percentage" | "Nominal",
          discount_value: parseFloat(formData.discount_value),
          minimum_purchase: parseFloat(formData.minimum_purchase),
          max_usage: parseInt(formData.max_usage),
          start_date,
          end_date,
          is_active: formData.is_active,
        };

        const res = await vouchersApi.create(createData);
        if (res.status === true) {
          toast.success("Voucher created successfully");
          router.push("/admin/promotions");
        } else {
          toast.error(res.message || "Failed to create voucher");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow-sm border border-zinc-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-zinc-900 mb-6">Voucher Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {!isEditing && (
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="code" className="block text-sm font-medium text-zinc-700 mb-1">Promo Code *</label>
              <input
                type="text"
                id="code"
                name="code"
                required
                value={formData.code}
                onChange={handleChange}
                disabled={isEditing}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 disabled:bg-zinc-100 disabled:text-zinc-500 uppercase"
                placeholder="e.g. SUMMER2026"
              />
              <p className="mt-1 text-xs text-zinc-500">Promo code cannot be changed once created.</p>
            </div>
          )}

          <div>
            <label htmlFor="discount_type" className="block text-sm font-medium text-zinc-700 mb-1">Discount Type *</label>
            <select
              id="discount_type"
              name="discount_type"
              required
              value={formData.discount_type}
              onChange={handleChange}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            >
              <option value="Percentage">Percentage (%)</option>
              <option value="Nominal">Nominal (Rp)</option>
            </select>
          </div>

          <div>
            <label htmlFor="discount_value" className="block text-sm font-medium text-zinc-700 mb-1">Discount Value *</label>
            <input
              type="number"
              id="discount_value"
              name="discount_value"
              required
              min="0.1"
              step="any"
              value={formData.discount_value}
              onChange={handleChange}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              placeholder={formData.discount_type === "Percentage" ? "e.g. 15" : "e.g. 50000"}
            />
          </div>

          <div>
            <label htmlFor="minimum_purchase" className="block text-sm font-medium text-zinc-700 mb-1">Minimum Purchase</label>
            <input
              type="number"
              id="minimum_purchase"
              name="minimum_purchase"
              required
              min="0"
              value={formData.minimum_purchase}
              onChange={handleChange}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              placeholder="0"
            />
          </div>

          <div>
            <label htmlFor="max_usage" className="block text-sm font-medium text-zinc-700 mb-1">Maximum Usage Quota *</label>
            <input
              type="number"
              id="max_usage"
              name="max_usage"
              required
              min="1"
              value={formData.max_usage}
              onChange={handleChange}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              placeholder="e.g. 100"
            />
          </div>

          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-zinc-700 mb-1">Start Date</label>
            <input
              type="datetime-local"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>

          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-zinc-700 mb-1">End Date</label>
            <input
              type="datetime-local"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>

          <div className="col-span-1 md:col-span-2 flex items-center space-x-2 pt-4 border-t border-zinc-100">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-zinc-700">
              Voucher is Active
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center rounded-md border border-transparent bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            isEditing ? "Save Changes" : "Create Voucher"
          )}
        </button>
      </div>
    </form>
  );
}
