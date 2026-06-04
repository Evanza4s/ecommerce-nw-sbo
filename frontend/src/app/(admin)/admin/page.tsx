import DashbordStats from "@/components/dashboard/DashbordStats";
import RevenueChart from "@/components/dashboard/RevenueChart";
import AdminBreadcrumbs from "@/components/admin/AdminBreadcrumbs";
import AdminPageSection from "@/components/ui/AdminPageSection";

const page = () => {
  return (
    <AdminPageSection title="Dashboard" description="Welcome admin">
      <AdminBreadcrumbs items={[{ label: "Dashboard" }]} />

      <div className="mt-8 space-y-6">
        <DashbordStats />
        <RevenueChart />
      </div>
    </AdminPageSection>
  );
};

export default page;
