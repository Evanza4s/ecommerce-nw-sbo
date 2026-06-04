import { ReactNode } from "react";
import AdminBreadcrumbs from "@/components/admin/AdminBreadcrumbs";
import AdminPageSection from "@/components/ui/AdminPageSection";
import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface DetailItem {
  label: string;
  value: ReactNode;
}

interface AdminDetailPageProps {
  title: string;
  description: string;
  breadcrumbs: { label: string; href?: string }[];
  summaryTitle: string;
  summaryDescription: string;
  items: DetailItem[];
  secondaryAction?: { label: string; href: string };
  primaryAction?: { label: string; href: string };
}

const AdminDetailPage = ({
  title,
  description,
  breadcrumbs,
  summaryTitle,
  summaryDescription,
  items,
  secondaryAction,
  primaryAction,
}: AdminDetailPageProps) => {
  return (
    <AdminPageSection title={title} description={description}>
      <AdminBreadcrumbs items={breadcrumbs} />

      <Card className="border p-6 shadow-sm">
        <div className="flex flex-col gap-4 border-b pb-5 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">{summaryTitle}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {summaryDescription}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {secondaryAction ? (
              <Button asChild variant="outline">
                <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
              </Button>
            ) : null}
            {primaryAction ? (
              <Button asChild>
                <Link href={primaryAction.href}>{primaryAction.label}</Link>
              </Button>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 pt-6 md:grid-cols-2">
          {items.map((item) => (
            <div key={item.label} className="rounded-xl border bg-muted/20 p-4">
              <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
              <div className="mt-2 text-sm text-foreground">{item.value}</div>
            </div>
          ))}
        </div>
      </Card>
    </AdminPageSection>
  );
};

export default AdminDetailPage;
