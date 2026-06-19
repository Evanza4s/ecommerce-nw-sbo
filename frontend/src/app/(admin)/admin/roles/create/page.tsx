"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

import AdminDetailPage from "@/components/admin/AdminDetailPage";
import { rolesApi } from "@/server/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RoleCreatePage() {
  const router = useRouter();
  
  const [isSaving, setIsSaving] = useState(false);

  const [roleName, setRoleName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperadmin, setIsSuperadmin] = useState(false);

  const handleCreate = async () => {
    try {
      setIsSaving(true);
      const res = await rolesApi.create({
        role_name: roleName,
        is_admin: isAdmin,
        is_superadmin: isSuperadmin,
      });

      if (res.status === true) {
        toast.success("Role created successfully");
        router.push("/admin/roles");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create role");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminDetailPage
        title="Create Role"
        description="Tambahkan role baru ke sistem."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Roles", href: "/admin/roles" },
          { label: "Create" },
        ]}
        summaryTitle="New Role"
        summaryDescription="Di tahap ini Anda dapat menentukan status admin dari role baru ini."
        secondaryAction={{ label: "Back to Roles", href: "/admin/roles" }}
        items={[]}
      />
      
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Form Role Baru</h3>
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <label className="text-sm font-medium">Role Name</label>
            <Input 
              value={roleName} 
              onChange={(e) => setRoleName(e.target.value)} 
              placeholder="e.g. Sales, Support"
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
            <Button onClick={handleCreate} disabled={isSaving || !roleName.trim()}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Create Role
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
