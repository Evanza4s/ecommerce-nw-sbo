import AdminDetailPage from "@/components/admin/AdminDetailPage";

export default function PromotionCreatePage() {
  return (
    <AdminDetailPage
      title="Create Promotion"
      description="Template halaman untuk form pembuatan promo atau voucher."
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Promotions", href: "/admin/promotions" },
        { label: "Create" },
      ]}
      summaryTitle="Promotion Schema Recommendation"
      summaryDescription="Karena tabel promosi belum ada, halaman ini menjadi placeholder yang siap dihubungkan ke mstpromotions atau mstvouchers."
      secondaryAction={{ label: "Back to Promotions", href: "/admin/promotions" }}
      items={[
        { label: "Promo Code", value: "Gunakan kode unik seperti JUNIHEMAT atau WELCOME10." },
        { label: "Discount Type", value: "Sediakan pilihan Percentage dan Nominal." },
        { label: "Quota", value: "Batasi jumlah penggunaan promo agar campaign terukur." },
        { label: "Validity", value: "Pastikan valid_from dan valid_until disimpan sebagai timestamp." },
        { label: "Status", value: "Gunakan state draft, scheduled, active, dan expired." },
        { label: "Next Step", value: "Saat backend siap, halaman ini bisa diubah menjadi form CRUD penuh." },
      ]}
    />
  );
}
