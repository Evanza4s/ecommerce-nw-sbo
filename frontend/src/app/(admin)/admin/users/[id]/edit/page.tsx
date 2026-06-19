"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { userApi, rolesApi } from "@/server/index";
import { UserProfile } from "@/server/modules/users/types";
import { Role } from "@/server/modules/roles/types";
import AdminDetailPage from "@/components/admin/AdminDetailPage";
import { Button } from "@/components/ui/button";

interface UserEditPageProps {
  params: Promise<{ id: string }>;
}

export default function UserEditPage({ params }: UserEditPageProps) {
  const router = useRouter();
  const { user: currentUser, isLoading: isAuthLoading } = useAuth();
  
  const [userId, setUserId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [selectedRole, setSelectedRole] = useState("");
  const [isActive, setIsActive] = useState(true);

  const isSuperadmin = currentUser?.role?.toLowerCase() === 'super admin' || currentUser?.role?.toLowerCase() === 'superadmin';

  useEffect(() => {
    params.then((p) => setUserId(p.id));
  }, [params]);

  useEffect(() => {
    if (isAuthLoading) return;
    
    if (!isSuperadmin) {
      toast.error("Unauthorized: Super Admin access required");
      router.push("/admin");
      return;
    }

    if (userId) {
      fetchData();
    }
  }, [isSuperadmin, isAuthLoading, router, userId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [userRes, rolesRes] = await Promise.all([
        userApi.getById(userId!),
        rolesApi.getAllNoPagination()
      ]);

      if (userRes.status === true && userRes.data) {
        setUserProfile(userRes.data);
        setSelectedRole(userRes.data.role_id || "");
        setIsActive(userRes.data.is_active);
      }

      if (rolesRes.status === true && rolesRes.data) {
        setRoles(rolesRes.data);
      }
    } catch (error: any) {
      if (isSuperadmin) {
        toast.error(error.message || "Failed to fetch data");
        router.push("/admin/users");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!userId) return;
    
    try {
      setIsSaving(true);
      
      // Update Status if changed
      if (userProfile?.is_active !== isActive) {
        await userApi.updateStatus(userId, isActive);
      }

      // Update Role if changed
      if (userProfile?.role_id !== selectedRole) {
        await userApi.updateRole(userId, selectedRole);
      }

      toast.success("User updated successfully");
      router.push("/admin/users");
    } catch (error: any) {
      toast.error(error.message || "Failed to update user");
    } finally {
      setIsSaving(false);
    }
  };

  if (isAuthLoading || isLoading || !isSuperadmin) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <p className="text-muted-foreground">User not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminDetailPage
        title="Manage User Access"
        description="Manajemen role dan status akun internal."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Users", href: "/admin/users" },
          { label: userProfile.fullname || userProfile.username || "Edit" },
        ]}
        summaryTitle={userProfile.fullname || userProfile.username}
        summaryDescription="Gunakan halaman ini untuk mengubah peran atau status aktif pengguna."
        secondaryAction={{ label: "Back to Users", href: "/admin/users" }}
        items={[
          { label: "Email", value: userProfile.email },
          { label: "Username", value: userProfile.username },
        ]}
      />
      
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Form Pengaturan User</h3>
        <div className="space-y-4 max-w-md">
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <select 
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              disabled={currentUser?.id === userProfile.id} // Cannot change own role
            >
              <option value="" disabled>Select a role</option>
              {roles.map(r => (
                <option key={r.id} value={r.id}>{r.role_name}</option>
              ))}
            </select>
            {currentUser?.id === userProfile.id && (
              <p className="text-xs text-muted-foreground mt-1">You cannot change your own role.</p>
            )}
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <input 
              type="checkbox"
              id="isActive" 
              checked={isActive} 
              onChange={(e) => setIsActive(e.target.checked)} 
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              disabled={currentUser?.id === userProfile.id} // Cannot deactivate self
            />
            <label
              htmlFor="isActive"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Akun Aktif (Is Active)
            </label>
          </div>

          <div className="pt-6">
            <Button onClick={handleSave} disabled={isSaving || !selectedRole}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
