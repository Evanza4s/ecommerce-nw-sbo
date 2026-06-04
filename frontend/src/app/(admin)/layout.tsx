import AdminNavbar from "@/components/layout/AdminNavbar";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>

      <AdminSidebar />

      <main className="flex-1">

        <AdminNavbar />

        <div className="p-6">
          {children}
        </div>

      </main>

    </SidebarProvider>
  );
}