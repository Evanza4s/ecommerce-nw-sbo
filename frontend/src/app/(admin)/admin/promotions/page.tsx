"use client"
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminTablePage from "@/components/admin/AdminTablePage";
import { adminPromotions } from "@/data/admin-dashboard";
import { formatDateTime } from "@/lib/admin";

export default function PromotionsPage() {
  return (
    <AdminTablePage
      title="Promotions"
      description="Contoh katalog promo untuk voucher dan campaign yang disarankan lewat tabel `mstpromotions`."
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Promotions" },
      ]}
      data={adminPromotions}
      getRowKey={(promotion) => promotion.id}
      searchPlaceholder="Search by promo code..."
      searchBy={(promotion) => `${promotion.code} ${promotion.discountType}`}
      action={{ label: "Create Promotion", href: "/admin/promotions/create" }}
      filters={[
        {
          label: "Promotion Status",
          value: "status",
          options: [
            { label: "All Status", value: "all" },
            { label: "Scheduled", value: "scheduled" },
            { label: "Active", value: "active" },
            { label: "Expired", value: "expired" },
            { label: "Draft", value: "draft" },
          ],
          getValue: (promotion) => promotion.status,
        },
      ]}
      columns={[
        { header: "Promo Code", cell: (promotion) => promotion.code },
        { header: "Discount Type", cell: (promotion) => promotion.discountType },
        { header: "Quota", cell: (promotion) => promotion.quota.toString() },
        { header: "Valid From", cell: (promotion) => formatDateTime(promotion.validFrom) },
        { header: "Valid Until", cell: (promotion) => formatDateTime(promotion.validUntil) },
        {
          header: "Status",
          cell: (promotion) => <AdminStatusBadge status={promotion.status} />,
        },
      ]}
      emptyMessage="No promotions found."
    />
  );
}
