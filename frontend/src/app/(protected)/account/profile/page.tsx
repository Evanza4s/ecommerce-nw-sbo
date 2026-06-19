"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { format, parseISO } from "date-fns";
import {
  CalendarIcon,
  Camera,
  MapPin,
  ShieldCheck,
  Trash2,
  Loader2
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import AvatarImage from "@/assets/images/avatar.png";
import Card from "@/components/ui/Card";
import PageSection from "@/components/ui/PageSection";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage as ProfileAvatar,
} from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import InputGroup from "@/components/forms/InputGroup";
import { cn, getAvatarUrl } from "@/lib/utils";
import { InputField } from "@/components/forms";
import { useAuth } from "@/hooks/useAuth";
import { userApi } from "@/server/modules/users/api";
import {
  updateProfileSchema,
  changePasswordSchema,
  type UpdateProfileValues,
  type ChangePasswordValues,
} from "@/lib/validations/user";
import type { UserAddress } from "@/server/modules/users/types";
import { useMyOrders } from "@/hooks/useMyOrders";

const inputClassName =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

const sectionTitleClassName = "text-lg font-semibold text-slate-900";

export default function AccountProfilePage() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    setValue: setProfileValue,
    control: profileControl,
    formState: { errors: profileErrors, isSubmitting: isSubmittingProfile },
  } = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      gender: undefined,
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  useEffect(() => {
    if (user?.id) {
      setProfileValue("first_name", user.firstName || "");
      setProfileValue("last_name", user.lastName || "");
      setProfileValue("phone", user.phone || "");
      setAvatarUrl(user.avatar || null);

      userApi.identity.get(user.id).then((res) => {
        if (res.data) {
          if (res.data.gender) setProfileValue("gender", res.data.gender as any);
          if (res.data.birth_date) {
            setProfileValue("dateOfBirth", parseISO(res.data.birth_date));
          }
          if (res.data.avatar_url) {
            setAvatarUrl(res.data.avatar_url);
            if (user.avatar !== res.data.avatar_url) {
              updateUser({ avatar: res.data.avatar_url });
            }
          }
        }
      }).catch(err => {
        console.error("Failed to fetch user identity", err);
      });

      userApi.address.getAll(user.id).then((res) => {
        if (res.data) setAddresses(res.data);
      }).catch(err => console.error("Failed to fetch addresses", err));
    }
  }, [user, setProfileValue]);

  const onProfileSubmit = async (values: UpdateProfileValues) => {
    if (!user?.id) return;
    try {
      const fullname = `${values.first_name} ${values.last_name}`.trim();
      await userApi.update({ fullname });

      await userApi.identity.update(user.id, {
        first_name: values.first_name,
        last_name: values.last_name,
        phone_number: values.phone,
        gender: values.gender,
        birth_date: values.dateOfBirth ? format(values.dateOfBirth, "yyyy-MM-dd") : undefined,
      });

      updateUser({
        firstName: values.first_name,
        lastName: values.last_name,
        phone: values.phone,
      });

      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    }
  };

  const onPasswordSubmit = async (values: ChangePasswordValues) => {
    try {
      await userApi.changePassword({
        current_password: values.old_password,
        new_password: values.new_password,
        confirm_password: values.confirm_password,
      });
      toast.success("Password changed successfully!");
      resetPasswordForm();
    } catch (err: any) {
      toast.error(err.message || "Failed to change password");
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    try {
      setIsUploading(true);
      const res = await userApi.identity.uploadAvatar(user.id, file);
      if (res.data?.avatar_url) {
        setAvatarUrl(res.data.avatar_url);
        updateUser({ avatar: res.data.avatar_url });
        toast.success("Avatar uploaded successfully");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload avatar");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const { orders } = useMyOrders();
  
  const handleDeleteAccount = () => {
    toast.info("Fitur penghapusan akun mandiri sedang dalam pengembangan. Silakan hubungi Customer Service.");
  };

  const primaryAddr = addresses.find(a => a.is_default) || addresses[0];
  const memberSince = user?.createdAt ? format(parseISO(user.createdAt), "dd MMMM yyyy") : "-";
  const accountType = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Member";

  const validOrders = orders.filter(o => o.order_status !== "cancelled" && o.payment_status === "paid");
  const totalOrders = orders.length; // You might just want to count all orders or only valid ones. Let's show all valid orders for spend.
  const totalSpend = validOrders.reduce((sum, o) => sum + (o.grand_total || 0), 0);
  const formattedSpend = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(totalSpend);

  const profileStats = [
    { label: "Member Since", value: memberSince },
    { label: "Account Type", value: accountType },
    { label: "Total Orders", value: `${totalOrders} Order${totalOrders > 1 ? "s" : ""}` },
    { label: "Total Spend", value: formattedSpend },
  ];

  return (
    <PageSection
      title="Profile Setting"
      description="Manage your personal information and account preferences."
      className="bg-slate-50"
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_360px]">
        <div className="space-y-6">
          <Card className="border border-slate-200 p-6 hover:translate-y-0 hover:shadow-md">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className={sectionTitleClassName}>Personal Information</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Keep your profile updated for faster checkout and delivery.
                </p>
              </div>
              {user?.isVerified && (
                <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 md:flex">
                  <ShieldCheck className="h-4 w-4" />
                  Verified Account
                </div>
              )}
            </div>

            <div className="grid gap-6 lg:grid-cols-[180px_minmax(0,1fr)]">
              <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
                <Avatar className="h-28 w-28 border-4 border-white shadow-md">
                  <ProfileAvatar src={getAvatarUrl(avatarUrl) || AvatarImage.src} alt="Profile avatar" />
                  <AvatarFallback>{user?.firstName?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleAvatarUpload}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 w-full rounded-xl"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
                  {isUploading ? "Uploading..." : "Upload Profile"}
                </Button>
                <p className="mt-3 text-xs leading-5 text-slate-500">
                  Recommended square image, up to 2MB.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleProfileSubmit(onProfileSubmit)}>
                <InputGroup cols={2}>
                  <InputField label="First Name" type="text" error={profileErrors.first_name?.message} {...registerProfile("first_name")} />
                  <InputField label="Last Name" type="text" error={profileErrors.last_name?.message} {...registerProfile("last_name")} />
                </InputGroup>

                <InputField label="Email" type="email" value={user?.email || ""} disabled hint="Email address cannot be changed." name={""} />

                <InputField label="Phone Number" type="text" error={profileErrors.phone?.message} {...registerProfile("phone")} />

                <InputGroup cols={2}>
                  <div className="space-y-2 flex flex-col">
                    <label className="text-sm font-medium text-slate-700">
                      Date of Birth
                    </label>
                    <Controller
                      name="dateOfBirth"
                      control={profileControl}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className={cn(
                                inputClassName,
                                "justify-between rounded-xl px-4 font-normal hover:bg-white",
                                !field.value && "text-slate-400",
                              )}
                            >
                              {field.value
                                ? format(field.value, "dd MMMM yyyy")
                                : "Pick a date"}
                              <CalendarIcon className="h-4 w-4 text-slate-400" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            align="start"
                            className="w-auto overflow-hidden rounded-2xl border border-slate-200 p-0"
                          >
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              captionLayout="dropdown"
                              startMonth={new Date(1950, 0)}
                              endMonth={new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Gender
                    </label>
                    <select className={inputClassName} {...registerProfile("gender")}>
                      <option value="">Select gender...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Prefer not to say</option>
                    </select>
                  </div>
                </InputGroup>

                <div className="flex justify-end pt-2">
                  <Button type="submit" className="rounded-xl px-6" disabled={isSubmittingProfile}>
                    {isSubmittingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </Card>

          <Card className="border border-slate-200 p-6 hover:translate-y-0 hover:shadow-md">
            <div className="mb-6">
              <h2 className={sectionTitleClassName}>Password & Security</h2>
              <p className="mt-1 text-sm text-slate-500">
                Update your password regularly to keep your account secure.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
              <InputField label="Old Password" type="password" error={passwordErrors.old_password?.message} {...registerPassword("old_password")} />
              <InputField label="New Password" type="password" error={passwordErrors.new_password?.message} {...registerPassword("new_password")} />
              <InputField label="Confirm Password" type="password" error={passwordErrors.confirm_password?.message} {...registerPassword("confirm_password")} />

              <div className="flex justify-end pt-2">
                <Button type="submit" className="rounded-xl px-6" disabled={isSubmittingPassword}>
                  {isSubmittingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Change Password
                </Button>
              </div>
            </form>
          </Card>

          <Card className="border border-slate-200 p-6 hover:translate-y-0 hover:shadow-md">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className={sectionTitleClassName}>Address Summary</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Review your saved addresses before checkout.
                </p>
              </div>
              <Link href="/account/addresses">
                <Button variant="outline" size="sm" className="rounded-xl">
                  Manage Addresses
                </Button>
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {addresses.length === 0 ? (
                <div className="col-span-2 text-center text-sm text-slate-500 py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                  Belum ada alamat yang tersimpan.
                </div>
              ) : addresses.map((address) => (
                <div
                  key={address.id}
                  className={cn("rounded-2xl border p-4", address.is_default ? "border-primary bg-primary/5" : "border-slate-200 bg-slate-50")}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold text-slate-900">
                        {address.address_label || "Address"} {address.is_default && "(Utama)"}
                      </h3>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm leading-6 text-slate-600">
                    <p className="font-medium text-slate-900">{address.receiver_name}</p>
                    <p>{address.full_address}</p>
                    <p>{address.district}, {address.city}</p>
                    <p>{address.province} {address.postal_code}</p>
                    <p>{address.phone_number}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border border-slate-200 p-6 hover:translate-y-0 hover:shadow-md">
            <h2 className={sectionTitleClassName}>Account Overview</h2>
            <div className="mt-5 space-y-4">
              {profileStats.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0"
                >
                  <span className="text-sm text-slate-500">{item.label}</span>
                  <span className="text-right text-sm font-semibold text-slate-900">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border border-slate-200 p-6 hover:translate-y-0 hover:shadow-md">
            <h2 className={sectionTitleClassName}>Address (Utama)</h2>
            {primaryAddr ? (
              <div className="mt-5 space-y-4 text-sm text-slate-600">
                <div>
                  <p className="font-medium text-slate-900">Provinsi</p>
                  <p>{primaryAddr.province}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Kabupaten/Kota</p>
                  <p>{primaryAddr.city}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Kecamatan</p>
                  <p>{primaryAddr.district}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Desa/Kelurahan</p>
                  <p>{primaryAddr.village}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Postal Code</p>
                  <p>{primaryAddr.postal_code}</p>
                </div>
              </div>
            ) : (
              <div className="mt-5 text-sm text-slate-500">
                Anda belum mengatur alamat utama.
              </div>
            )}
          </Card>

          <Card className="border border-rose-200 p-6 hover:translate-y-0 hover:shadow-md">
            <h2 className={sectionTitleClassName}>Account</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Once you delete your account, there&apos;s no going back. Please
              be certain before continuing.
            </p>
            <div className="mt-5 flex justify-end">
              <Button type="button" variant="destructive" className="rounded-xl" onClick={handleDeleteAccount}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete My Account
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </PageSection>
  );
}
