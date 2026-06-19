"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/forms";
import InputGroup from "@/components/forms/InputGroup";
import { addressSchema, type AddressValues } from "@/lib/validations/user";
import type { UserAddress } from "@/server/modules/users/types";
import { shippingApi } from "@/server/modules/shipping/api";
import type { Province, City, District } from "@/server/modules/shipping/types";

interface AddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: AddressValues) => Promise<void>;
  initialData?: UserAddress | null;
}

export default function AddressDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: AddressDialogProps) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddressValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address_label: "",
      receiver_name: "",
      phone_number: "",
      province_id: "",
      province: "",
      city_id: "",
      city: "",
      district_id: "",
      district: "",
      village: "",
      postal_code: "",
      full_address: "",
    },
  });

  const selectedProvinceId = watch("province_id");
  const selectedCityId = watch("city_id");
  const selectedDistrictId = watch("district_id");

  useEffect(() => {
    if (open) {
      shippingApi.getProvinces().then(res => {
        if (res.data) setProvinces(res.data);
      }).catch(console.error);

      if (initialData) {
        reset({
          address_label: initialData.address_label || "",
          receiver_name: initialData.receiver_name || "",
          phone_number: initialData.phone_number || "",
          province_id: initialData.province_id || "",
          province: initialData.province || "",
          city_id: initialData.city_id || "",
          city: initialData.city || "",
          district_id: initialData.district_id || "",
          district: initialData.district || "",
          village: initialData.village || "",
          postal_code: initialData.postal_code || "",
          full_address: initialData.full_address || "",
        });
      } else {
        reset({
          address_label: "",
          receiver_name: "",
          phone_number: "",
          province_id: "",
          province: "",
          city_id: "",
          city: "",
          district_id: "",
          district: "",
          village: "",
          postal_code: "",
          full_address: "",
        });
      }
    }
  }, [open, initialData, reset]);

  useEffect(() => {
    if (selectedProvinceId) {
      setIsLoadingRegions(true);
      shippingApi.getCities(selectedProvinceId).then(res => {
        if (res.data) setCities(res.data);
      }).catch(console.error).finally(() => setIsLoadingRegions(false));
      
      const matchedProv = provinces.find(p => p.province_id === selectedProvinceId);
      if (matchedProv) {
        setValue("province", matchedProv.province);
      }
    } else {
      setCities([]);
    }
  }, [selectedProvinceId, provinces, setValue]);

  useEffect(() => {
    if (selectedCityId && cities.length > 0) {
      const matchedCity = cities.find(c => c.city_id === selectedCityId);
      if (matchedCity) {
        setValue("city", matchedCity.city_name);
        if (!watch("postal_code") && matchedCity.postal_code) {
          setValue("postal_code", matchedCity.postal_code);
        }
      }

      setIsLoadingDistricts(true);
      shippingApi.getDistricts(selectedCityId).then(res => {
        if (res.data) setDistricts(res.data);
      }).catch(console.error).finally(() => setIsLoadingDistricts(false));
    } else {
      setDistricts([]);
    }
  }, [selectedCityId, cities, setValue, watch]);

  useEffect(() => {
    if (selectedDistrictId && districts.length > 0) {
      const matchedDistrict = districts.find(d => d.district_id === selectedDistrictId);
      if (matchedDistrict) {
        setValue("district", matchedDistrict.district_name);
      }
    }
  }, [selectedDistrictId, districts, setValue]);

  const handleFormSubmit = async (values: AddressValues) => {
    await onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Ubah Alamat" : "Tambah Alamat Baru"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
          <InputField
            label="Label Alamat (Opsional)"
            hint="Contoh: Rumah, Kantor"
            type="text"
            error={errors.address_label?.message}
            {...register("address_label")}
          />
          
          <InputGroup cols={2}>
            <InputField
              label="Nama Penerima"
              type="text"
              error={errors.receiver_name?.message}
              {...register("receiver_name")}
            />
            <InputField
              label="Nomor Telepon"
              type="text"
              error={errors.phone_number?.message}
              {...register("phone_number")}
            />
          </InputGroup>

          <InputGroup cols={2}>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Provinsi</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register("province_id")}
              >
                <option value="">Pilih Provinsi</option>
                {provinces.map(p => (
                  <option key={p.province_id} value={p.province_id}>{p.province}</option>
                ))}
              </select>
              {errors.province_id && <p className="text-[0.8rem] font-medium text-destructive">{errors.province_id.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Kabupaten / Kota</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register("city_id")}
                disabled={!selectedProvinceId || isLoadingRegions}
              >
                <option value="">{isLoadingRegions ? "Loading..." : "Pilih Kota"}</option>
                {cities.map(c => (
                  <option key={c.city_id} value={c.city_id}>{c.type} {c.city_name}</option>
                ))}
              </select>
              {errors.city_id && <p className="text-[0.8rem] font-medium text-destructive">{errors.city_id.message}</p>}
            </div>
          </InputGroup>

          <InputGroup cols={2}>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Kecamatan</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register("district_id")}
                disabled={!selectedCityId || isLoadingDistricts}
              >
                <option value="">{isLoadingDistricts ? "Loading..." : "Pilih Kecamatan"}</option>
                {districts.map(d => (
                  <option key={d.district_id} value={d.district_id}>{d.district_name}</option>
                ))}
              </select>
              {errors.district_id && <p className="text-[0.8rem] font-medium text-destructive">{errors.district_id.message}</p>}
            </div>
            <InputField
              label="Desa / Kelurahan"
              type="text"
              error={errors.village?.message}
              {...register("village")}
            />
          </InputGroup>

          <InputGroup cols={2}>
            <InputField
              label="Kode Pos"
              type="text"
              error={errors.postal_code?.message}
              {...register("postal_code")}
            />
          </InputGroup>

          <InputField
            label="Alamat Lengkap"
            type="text"
            hint="Nama jalan, gedung, no. rumah, blok/unit"
            error={errors.full_address?.message}
            {...register("full_address")}
          />

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? "Simpan Perubahan" : "Simpan Alamat"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
