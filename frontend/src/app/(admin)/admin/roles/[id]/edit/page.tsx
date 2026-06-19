"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

import AdminDetailPage from "@/components/admin/AdminDetailPage";
import { rolesApi } from "@/server/index";
import { Role } from "@/server/modules/roles/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface RoleEditPageProps {
  params: Promise<{ id: string }>;
}

export default function RoleEditPage({ params }: RoleEditPageProps) {
  const router = useRouter();
  const { id } = use(params);
  
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [roleName, setRoleName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperadmin, setIsSuperadmin] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await rolesApi.getById(id);
        if (res.status === true && res.data) {
          setRole(res.data);
          setRoleName(res.data.role_name);
          setIsAdmin(res.data.is_admin);
          setIsSuperadmin(res.data.is_superadmin);
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch role details");
        router.push("/admin/roles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRole();
  }, [id, router]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await rolesApi.update(id, {
        role_name: roleName,
        is_admin: isAdmin,
        is_superadmin: isSuperadmin,
      });

      if (res.status === true) {
        toast.success("Role updated successfully");
        router.push("/admin/roles");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update role");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!role) {
    return null; // or redirect
  }

  return (
    <div className="space-y-6">
      <AdminDetailPage
        title="Edit Role"
        description="Ubah konfigurasi role dan permission system."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Roles", href: "/admin/roles" },
          { label: role.role_name },
        ]}
        summaryTitle={role.role_name}
        summaryDescription="Di tahap ini Anda dapat mengubah status admin dari role ini."
        secondaryAction={{ label: "Back to Roles", href: "/admin/roles" }}
        items={[]}
      />
      
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Form Role</h3>
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <label className="text-sm font-medium">Role Name</label>
            <Input 
              value={roleName} 
              onChange={(e) => setRoleName(e.target.value)} 
              placeholder="e.g. Admin, Manager, Staff"
            />
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <input 
              type="checkbox"
              id="isAdmin" 
              checked={isAdmin} 
              onChange={(e) => setIsAdmin(e.target.checked)} 
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label
              htmlFor="isAdmin"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Is Admin (Bisa mengakses dashboard)
            </label>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input 
              type="checkbox"
              id="isSuperadmin" 
              checked={isSuperadmin} 
              onChange={(e) => setIsSuperadmin(e.target.checked)} 
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label
              htmlFor="isSuperadmin"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Is Super Admin (Akses Penuh)
            </label>
          </div>

          <div className="pt-6">
            <Button onClick={handleSave} disabled={isSaving || !roleName.trim()}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
