"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

import AdminDetailPage from "@/components/admin/AdminDetailPage";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import { userApi } from "@/server/index";
import { UserProfile, UserIdentity, UserAddress } from "@/server/modules/users/types";

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [customer, setCustomer] = useState<UserProfile | null>(null);
  const [identity, setIdentity] = useState<UserIdentity | null>(null);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    Promise.all([
      userApi.getById(id),
      userApi.identity.get(id).catch(() => ({ data: null })), // Handle 404 for missing identity silently
      userApi.address.getAll(id).catch(() => ({ data: [] }))
    ])
      .then(([profileRes, identityRes, addressRes]) => {
        if (isMounted) {
          if (profileRes.data) setCustomer(profileRes.data);
          if (identityRes.data) setIdentity(identityRes.data);
          if (Array.isArray(addressRes.data)) {
            setAddresses(addressRes.data);
          } else if (addressRes.data && Array.isArray((addressRes.data as any).data)) {
             // In case it's wrapped
            setAddresses((addressRes.data as any).data);
          }
        }
      })
      .catch((err) => {
        toast.error(err.message || "Gagal memuat data pelanggan");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const toggleStatus = async () => {
    if (!customer) return;
    try {
      setIsUpdatingStatus(true);
      const newStatus = !customer.is_active;
      const res = await userApi.updateStatus(id, newStatus);
      if (res.status === true) {
        toast.success(`Status akun berhasil diubah menjadi ${newStatus ? 'Aktif' : 'Nonaktif'}`);
        setCustomer({ ...customer, is_active: newStatus });
      } else {
        toast.error(res.message || "Gagal memperbarui status akun");
      }
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
        <h2 className="text-xl font-medium text-slate-700">Pelanggan tidak ditemukan</h2>
        <button 
          onClick={() => router.push("/admin/customers")}
          className="text-primary hover:underline"
        >
          Kembali ke Daftar Pelanggan
        </button>
      </div>
    );
  }

  const fullName = identity 
    ? `${identity.first_name || ''} ${identity.last_name || ''}`.trim() 
    : customer.fullname || customer.username;

  return (
    <AdminDetailPage
      title="Customer Detail"
      description="Profil pelanggan dan ringkasan data identitas untuk kebutuhan operasional atau pemeriksaan kecurangan."
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Customers", href: "/admin/customers" },
        { label: fullName },
      ]}
      summaryTitle={fullName}
      summaryDescription={`Akun ini terdaftar sebagai ${customer.role_name || 'Customer'}. Anda dapat melakukan blokir (suspend) apabila terdapat indikasi kecurangan.`}
      secondaryAction={{ label: "Back to Customers", href: "/admin/customers" }}
      primaryAction={{ 
        label: isUpdatingStatus ? "Updating..." : (customer.is_active ? "Suspend Account" : "Activate Account"), 
        onClick: toggleStatus,
        variant: customer.is_active ? "danger" : "default"
      }}
      items={[
        { label: "ID Pelanggan", value: customer.id },
        { label: "Username", value: customer.username },
        { label: "Email", value: customer.email },
        { label: "Nomor Telepon", value: identity?.phone_number || "-" },
        { label: "Gender", value: identity?.gender || "-" },
        { label: "Total Alamat Tersimpan", value: addresses.length.toString() },
        { label: "Status Akun", value: <AdminStatusBadge status={customer.is_active ? "active" : "inactive"} /> },
        { label: "Status Verifikasi", value: <AdminStatusBadge status={customer.is_verified ? "verified" : "unverified"} /> },
      ]}
    />
  );
}
