"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  CalendarIcon,
  Camera,
  MapPin,
  ShieldCheck,
  Trash2,
} from "lucide-react";

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
import { cn } from "@/lib/utils";
import { InputField } from "@/components/forms";

const profileStats = [
  { label: "Member Since", value: "14 Mei 2026" },
  { label: "Account Type", value: "Regular Member" },
  { label: "Total Orders", value: "12 Order" },
  { label: "Total Spend", value: "12.000.000" },
];

const primaryAddress = {
  label: "Provinsi",
  value: "Jawa Barat",
  city: "Kabupaten/Bogor",
  district: "Kecamatan Bandung Barat",
  subdistrict: "Desa Padalarang",
  postalCode: "40553",
};

const addressSummary = [
  {
    title: "Main Address",
    address:
      "Jl. Sudirman No. 121 RT 01/RW 02, Kec. Menteng, Kota Jakarta Pusat",
    postalCode: "DKI Jakarta 10310",
    phone: "0812-3456-7890",
  },
  {
    title: "Work Address",
    address:
      "Jl. Sudirman No. 121 RT 01/RW 02, Kec. Menteng, Kota Jakarta Pusat",
    postalCode: "DKI Jakarta 10310",
    phone: "0812-3456-7890",
  },
];

const inputClassName =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

const sectionTitleClassName = "text-lg font-semibold text-slate-900";

export default function AccountProfilePage() {
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(
    new Date("2000-05-14"),
  );

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
              <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 md:flex">
                <ShieldCheck className="h-4 w-4" />
                Verified Account
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[180px_minmax(0,1fr)]">
              <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
                <Avatar className="h-28 w-28 border-4 border-white shadow-md">
                  <ProfileAvatar src={AvatarImage.src} alt="Profile avatar" />
                  <AvatarFallback>EA</AvatarFallback>
                </Avatar>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 w-full rounded-xl"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Upload Profile
                </Button>
                <p className="mt-3 text-xs leading-5 text-slate-500">
                  Recommended square image, up to 2MB.
                </p>
              </div>

              <form className="space-y-4">
                <InputGroup cols={2}>
                  <InputField label="First Name" name="first_name" />
                  <InputField label="Last Name" name="last_name" />
                </InputGroup>

                <InputField label="Email" name="email" type="email" />

                <InputField label="Phone Number" name="phone" />

                <InputGroup cols={2}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Date of Birth
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            inputClassName,
                            "justify-between rounded-xl px-4 font-normal hover:bg-white",
                            !dateOfBirth && "text-slate-400",
                          )}
                        >
                          {dateOfBirth
                            ? format(dateOfBirth, "dd MMMM yyyy")
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
                          selected={dateOfBirth}
                          onSelect={setDateOfBirth}
                          captionLayout="dropdown"
                          startMonth={new Date(1950, 0)}
                          endMonth={new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Gender
                    </label>
                    <select defaultValue="male" className={inputClassName}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Prefer not to say</option>
                    </select>
                  </div>
                </InputGroup>

                <div className="flex justify-end pt-2">
                  <Button className="rounded-xl px-6">Save Changes</Button>
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

            <form className="space-y-4">
                <InputField label="Old Password" name="old_password" type="password" />
                <InputField label="New Password" name="new_password" type="password" />
                <InputField label="Confirm Password" name="confirm_password" type="password" />

              <div className="flex justify-end pt-2">
                <Button className="rounded-xl px-6">Change Password</Button>
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
              <Button variant="outline" size="sm" className="rounded-xl">
                Manage Addresses
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {addressSummary.map((address) => (
                <div
                  key={address.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-slate-900">
                      {address.title}
                    </h3>
                  </div>
                  <div className="space-y-1 text-sm leading-6 text-slate-600">
                    <p>{address.address}</p>
                    <p>{address.postalCode}</p>
                    <p>{address.phone}</p>
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
            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <div>
                <p className="font-medium text-slate-900">
                  {primaryAddress.label}
                </p>
                <p>{primaryAddress.value}</p>
              </div>
              <div>
                <p className="font-medium text-slate-900">Kabupaten/Kota</p>
                <p>{primaryAddress.city}</p>
              </div>
              <div>
                <p className="font-medium text-slate-900">Kecamatan</p>
                <p>{primaryAddress.district}</p>
              </div>
              <div>
                <p className="font-medium text-slate-900">Desa</p>
                <p>{primaryAddress.subdistrict}</p>
              </div>
              <div>
                <p className="font-medium text-slate-900">Postal Code</p>
                <p>{primaryAddress.postalCode}</p>
              </div>
            </div>
          </Card>

          <Card className="border border-rose-200 p-6 hover:translate-y-0 hover:shadow-md">
            <h2 className={sectionTitleClassName}>Account</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Once you delete your account, there&apos;s no going back. Please
              be certain before continuing.
            </p>
            <div className="mt-5 flex justify-end">
              <Button variant="destructive" className="rounded-xl">
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
