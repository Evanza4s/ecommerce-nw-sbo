"use client"
import AdminBreadcrumbs from "@/components/admin/AdminBreadcrumbs";
import AdminFaqForm from "@/components/admin/AdminFaqForm";
import AdminPageSection from "@/components/ui/AdminPageSection";
import { use } from "react";

interface EditFaqPageProps {
  params: Promise<{ id: string }>;
}

const EditFaqPage = ({ params }: EditFaqPageProps) => {
  const { id } = use(params);

  return (
    <AdminPageSection title="Edit FAQ" description="Perbarui informasi pertanyaan umum.">
      <AdminBreadcrumbs
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "FAQ", href: "/admin/faq" },
          { label: "Edit FAQ" },
        ]}
      />
      <AdminFaqForm mode="edit" faqId={id} />
    </AdminPageSection>
  );
};

export default EditFaqPage;
