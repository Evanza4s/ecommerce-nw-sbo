"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import { useAuth } from "@/hooks/useAuth";
import { userApi } from "@/server/index";
import { UserProfile } from "@/server/modules/users/types";
import AdminRowActions from "@/components/admin/AdminRowActions";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminTablePage from "@/components/admin/AdminTablePage";
import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

const BooleanCell = ({ value }: { value: boolean }) => {
  return value ? (
    <span className="inline-flex items-center text-emerald-700">
      <Check className="mr-1 h-4 w-4" />
      Yes
    </span>
  ) : (
    <span className="inline-flex items-center text-rose-700">
      <X className="mr-1 h-4 w-4" />
      No
    </span>
  );
};

export default function UsersPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Confirmation Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isSuperadmin = user?.role?.toLowerCase() === 'super admin' || user?.role?.toLowerCase() === 'superadmin';

  useEffect(() => {
    if (isAuthLoading) return;
    
    if (!isSuperadmin) {
      toast.error("Unauthorized: Super Admin access required");
      router.push("/admin");
      return;
    }

    fetchUsers();
  }, [isSuperadmin, isAuthLoading, router]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await userApi.getAll();
      if (res.status === true && res.data) {
        setUsers(res.data);
      }
    } catch (error: any) {
      // Don't show toast if it's unauthorized and we're redirecting
      if (isSuperadmin) {
        toast.error(error.message || "Failed to fetch users");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const triggerDelete = (u: UserProfile) => {
    setUserToDelete(u);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!userToDelete) return;
    
    try {
      setIsDeleting(true);
      const res = await userApi.delete(userToDelete.id);
      if (res.status === true) {
        toast.success("User deleted successfully");
        fetchUsers();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  if (isAuthLoading || isLoading || !isSuperadmin) {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Memeriksa hak akses dan memuat data...</p>
      </div>
    );
  }

  return (
    <>
      <AdminTablePage
        title="Users"
        description="Daftar akun internal yang memiliki akses ke dashboard sistem."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Users" },
        ]}
        data={users}
        getRowKey={(user) => user.id}
        searchPlaceholder="Search by email, username, or role..."
        searchBy={(user) => `${user.fullname} ${user.username} ${user.email} ${user.role_name}`}
        columns={[
          { header: "Name", cell: (user) => user.fullname || "-" },
          { header: "Username", cell: (user) => user.username },
          { header: "Email", cell: (user) => user.email },
          { header: "Role", cell: (user) => <span className="capitalize">{user.role_name}</span> },
          {
            header: "Verified",
            cell: (user) => <BooleanCell value={user.is_verified} />,
          },
          { 
            header: "Active", 
            cell: (user) => <BooleanCell value={user.is_active} /> 
          },
          {
            header: "Actions",
            className: "w-24 text-right",
            cell: (u) => (
              <div className="flex justify-end items-center gap-2">
                <AdminRowActions
                  actions={[
                    { label: "Edit User", href: `/admin/users/${u.id}/edit` },
                  ]}
                />
                <Button 
                  variant="ghost" 
                  size="icon-sm" 
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 disabled:opacity-50" 
                  onClick={() => triggerDelete(u)}
                  disabled={u.id === user?.id} // Cannot delete self
                  title={u.id === user?.id ? "Cannot delete yourself" : "Delete user"}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ),
          },
        ]}
        emptyMessage="No system users found."
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDelete}
        title="Delete User"
        description={`Are you sure you want to delete user "${userToDelete?.username}" (${userToDelete?.email})? This action cannot be undone.`}
        confirmText="Delete User"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
