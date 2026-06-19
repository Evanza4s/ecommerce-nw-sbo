"use client"
import AdminBreadcrumbs from "@/components/admin/AdminBreadcrumbs";
import AdminFaqForm from "@/components/admin/AdminFaqForm";
import AdminPageSection from "@/components/ui/AdminPageSection";

const CreateFaqPage = () => {
  return (
    <AdminPageSection title="Tambah FAQ" description="Tambahkan pertanyaan umum baru ke dalam sistem.">
      <AdminBreadcrumbs
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "FAQ", href: "/admin/faq" },
          { label: "Tambah FAQ" },
        ]}
      />
      <AdminFaqForm mode="create" />
    </AdminPageSection>
  );
};

export default CreateFaqPage;
