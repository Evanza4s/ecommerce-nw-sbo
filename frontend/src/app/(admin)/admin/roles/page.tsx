"use client"
import { Check, X, Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import AdminRowActions from "@/components/admin/AdminRowActions";
import AdminTablePage from "@/components/admin/AdminTablePage";
import { formatDateTime } from "@/lib/admin";
import { rolesApi } from "@/server/index";
import { Role } from "@/server/modules/roles/types";
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

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Confirmation Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchRoles = async () => {
    try {
      setIsLoading(true);
      const res = await rolesApi.getAllNoPagination();
      if (res.status === true && res.data) {
        setRoles(res.data);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch roles");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const triggerDelete = (role: Role) => {
    setRoleToDelete(role);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!roleToDelete) return;
    
    try {
      setIsDeleting(true);
      const res = await rolesApi.delete(roleToDelete.id);
      if (res.status === true) {
        toast.success("Role deleted successfully");
        fetchRoles();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete role");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setRoleToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <AdminTablePage
        title="Roles"
        description="Manajemen role dan hak akses untuk pengguna sistem internal."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Roles" },
        ]}
        data={roles}
        getRowKey={(role) => role.id}
        searchPlaceholder="Search by role name..."
        searchBy={(role) => role.role_name}
        action={{ label: "Create Role", href: "/admin/roles/create" }}
        columns={[
          { header: "Role Name", cell: (role) => role.role_name },
          { header: "Is Admin", cell: (role) => <BooleanCell value={role.is_admin} /> },
          {
            header: "Is Super Admin",
            cell: (role) => <BooleanCell value={role.is_superadmin} />,
          },
          { header: "Created At", cell: (role) => formatDateTime(role.created_at || new Date().toISOString()) },
          {
            header: "Actions",
            className: "w-24 text-right",
            cell: (role) => (
              <div className="flex justify-end items-center gap-2">
                <AdminRowActions
                  actions={[
                    { label: "Edit", href: `/admin/roles/${role.id}/edit` },
                  ]}
                />
                <Button 
                  variant="ghost" 
                  size="icon-sm" 
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50" 
                  onClick={() => triggerDelete(role)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ),
          },
        ]}
        emptyMessage="No roles found."
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDelete}
        title="Delete Role"
        description={`Are you sure you want to delete the role "${roleToDelete?.role_name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
