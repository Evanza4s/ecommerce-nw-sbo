"use client"
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Loader2, Trash2 } from "lucide-react";

import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminTablePage from "@/components/admin/AdminTablePage";
import AdminRowActions from "@/components/admin/AdminRowActions";
import { formatDateTime } from "@/lib/admin";
import { vouchersApi } from "@/server/index";
import { Voucher } from "@/server/modules/vouchers/types";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { Button } from "@/components/ui/button";

export default function PromotionsPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Confirmation Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState<Voucher | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      setIsLoading(true);
      const res = await vouchersApi.getAllNoPagination();
      if (res.status === true && res.data) {
        setVouchers(res.data);
      } else {
        toast.error(res.message || "Failed to fetch vouchers");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred while fetching vouchers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (voucher: Voucher) => {
    setVoucherToDelete(voucher);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!voucherToDelete) return;
    try {
      setIsDeleting(true);
      const res = await vouchersApi.delete(voucherToDelete.id);
      if (res.status === true) {
        toast.success("Voucher deleted successfully");
        setVouchers((prev) => prev.filter((v) => v.id !== voucherToDelete.id));
      } else {
        toast.error(res.message || "Failed to delete voucher");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setVoucherToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <>
      <AdminTablePage
        title="Promotions / Vouchers"
        description="Katalog promo untuk voucher diskon yang tersimpan di tabel mst_voucher."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Promotions / Vouchers" },
        ]}
        data={vouchers}
        getRowKey={(voucher) => voucher.id}
        searchPlaceholder="Search by promo code..."
        searchBy={(voucher) => `${voucher.code} ${voucher.discount_type}`}
        action={{ label: "Create Voucher", href: "/admin/promotions/create" }}
        filters={[
          {
            label: "Status",
            value: "status",
            options: [
              { label: "All Status", value: "all" },
              { label: "Scheduled", value: "scheduled" },
              { label: "Active", value: "active" },
              { label: "Expired", value: "expired" },
              { label: "Inactive", value: "inactive" },
            ],
            getValue: (voucher) => voucher.status,
          },
        ]}
        columns={[
          { header: "Promo Code", cell: (voucher) => voucher.code },
          { header: "Discount Type", cell: (voucher) => voucher.discount_type },
          { header: "Discount Value", cell: (voucher) => voucher.discount_type === 'Percentage' ? `${voucher.discount_value}%` : `Rp ${voucher.discount_value.toLocaleString('id-ID')}` },
          { header: "Quota (Used/Max)", cell: (voucher) => `${voucher.used_count} / ${voucher.max_usage}` },
          { header: "Valid From", cell: (voucher) => voucher.start_date ? formatDateTime(voucher.start_date) : "-" },
          { header: "Valid Until", cell: (voucher) => voucher.end_date ? formatDateTime(voucher.end_date) : "-" },
          {
            header: "Status",
            cell: (voucher) => <AdminStatusBadge status={voucher.status} />,
          },
          {
            header: "Actions",
            cell: (voucher) => (
              <AdminRowActions
                actions={[
                  { label: "Edit Voucher", href: `/admin/promotions/${voucher.id}/edit` },
                  { label: "Delete", onClick: () => handleDeleteClick(voucher), className: "text-rose-600 focus:text-rose-700" }
                ]}
              />
            ),
          },
        ]}
        emptyMessage="No vouchers found."
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Voucher"
        description={`Are you sure you want to delete the voucher "${voucherToDelete?.code}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
