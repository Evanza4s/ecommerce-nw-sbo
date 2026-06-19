"use client";

import { useState, useEffect } from "react";
import { Plus, MapPin, Trash2, Edit2, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import { useAuth } from "@/hooks/useAuth";
import { userApi } from "@/server/modules/users/api";
import type { UserAddress } from "@/server/modules/users/types";
import { AddressValues } from "@/lib/validations/user";

import PageSection from "@/components/ui/PageSection";
import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import AddressDialog from "@/components/forms/AddressDialog";

export default function AddressesPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);

  const fetchAddresses = async () => {
    if (!user?.id) return;
    try {
      setIsLoading(true);
      const res = await userApi.address.getAll(user.id);
      if (res.data) setAddresses(res.data);
    } catch (err) {
      console.error("Failed to fetch addresses", err);
      toast.error("Gagal memuat daftar alamat");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  const handleAddClick = () => {
    setEditingAddress(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (address: UserAddress) => {
    setEditingAddress(address);
    setIsDialogOpen(true);
  };

  const handleSetDefault = async (addressId: string) => {
    if (!user?.id) return;
    try {
      await userApi.address.setDefault(user.id, addressId);
      toast.success("Alamat utama berhasil diubah");
      fetchAddresses();
    } catch (err: any) {
      toast.error(err.message || "Gagal mengubah alamat utama");
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!user?.id) return;
    if (!window.confirm("Apakah Anda yakin ingin menghapus alamat ini?")) return;
    try {
      await userApi.address.delete(user.id, addressId);
      toast.success("Alamat berhasil dihapus");
      fetchAddresses();
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus alamat");
    }
  };

  const onFormSubmit = async (values: AddressValues) => {
    if (!user?.id) return;
    try {
      if (editingAddress) {
        await userApi.address.update(user.id, editingAddress.id, values);
        toast.success("Alamat berhasil diperbarui");
      } else {
        await userApi.address.create(user.id, { ...values, is_default: false });
        toast.success("Alamat baru berhasil ditambahkan");
      }
      setIsDialogOpen(false);
      fetchAddresses();
    } catch (err: any) {
      throw new Error(err.message || "Terjadi kesalahan saat menyimpan alamat");
    }
  };

  return (
    <PageSection
      title="Manajemen Alamat"
      description="Atur alamat pengiriman Anda untuk mempermudah proses checkout."
      className="bg-slate-50 min-h-screen"
    >
      <div className="mb-6 flex justify-end">
        <Button onClick={handleAddClick} className="rounded-xl px-6 shadow-md hover:-translate-y-0.5 transition">
          <Plus className="mr-2 h-4 w-4" />
          Tambah Alamat Baru
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : addresses.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
          <div className="mb-4 rounded-full bg-slate-100 p-4">
            <MapPin className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Belum ada alamat</h3>
          <p className="mt-2 text-sm text-slate-500 max-w-sm">
            Anda belum menambahkan alamat pengiriman apa pun. Tambahkan sekarang untuk mempermudah belanja Anda.
          </p>
          <Button onClick={handleAddClick} variant="outline" className="mt-6 rounded-xl">
            Tambah Alamat
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {addresses.map((address) => (
            <Card
              key={address.id}
              className={`relative overflow-hidden p-6 transition-all hover:shadow-md hover:-translate-y-1 ${address.is_default ? "border-primary ring-1 ring-primary/20 bg-primary/5" : "border-slate-200 bg-white"
                }`}
            >
              {address.is_default && (
                <div className="absolute right-0 top-0 rounded-bl-xl bg-primary px-3 py-1 text-xs font-medium text-white shadow-sm flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Utama
                </div>
              )}

              <div className="mb-4 flex items-center gap-2">
                <MapPin className={`h-5 w-5 ${address.is_default ? "text-primary" : "text-slate-400"}`} />
                <h3 className="font-semibold text-slate-900 line-clamp-1">
                  {address.address_label || "Alamat"}
                </h3>
              </div>

              <div className="space-y-1.5 text-sm leading-relaxed text-slate-600 mb-6">
                <p className="font-medium text-slate-900">{address.receiver_name}</p>
                <p>{address.phone_number}</p>
                <p className="line-clamp-2">{address.full_address}</p>
                <p>{address.district}, {address.city}</p>
                <p>{address.province} {address.postal_code}</p>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-slate-100/60 mt-auto">
                {!address.is_default && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg text-xs"
                    onClick={() => handleSetDefault(address.id)}
                  >
                    Jadikan Utama
                  </Button>
                )}
                <div className="flex-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-lg text-slate-500 hover:text-primary hover:bg-primary/10 h-8 w-8 p-0"
                  onClick={() => handleEditClick(address)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-lg text-slate-500 hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                  onClick={() => handleDelete(address.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AddressDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={editingAddress}
        onSubmit={onFormSubmit}
      />
    </PageSection>
  );
}
