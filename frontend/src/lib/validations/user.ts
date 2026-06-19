import * as z from 'zod';

export const updateProfileSchema = z.object({
  first_name: z.string().min(1, 'Nama depan diperlukan'),
  last_name: z.string().min(1, 'Nama belakang diperlukan'),
  phone: z.string().min(10, 'Nomor telepon tidak valid').max(15, 'Nomor telepon tidak valid').optional().or(z.literal('')),
  gender: z.enum(['male', 'female', 'other']).optional(),
  dateOfBirth: z.date().optional(),
});

export type UpdateProfileValues = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z.object({
  old_password: z.string().min(1, 'Kata sandi lama diperlukan'),
  new_password: z.string().min(8, 'Kata sandi minimal 8 karakter'),
  confirm_password: z.string().min(8, 'Konfirmasi kata sandi diperlukan'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Kata sandi baru dan konfirmasi tidak cocok",
  path: ["confirm_password"],
});

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export const addressSchema = z.object({
  address_label: z.string().optional(),
  receiver_name: z.string().min(1, 'Nama penerima diperlukan'),
  phone_number: z.string().min(10, 'Nomor telepon tidak valid').max(15, 'Nomor telepon tidak valid'),
  province_id: z.string().min(1, 'Provinsi diperlukan'),
  province: z.string().min(1, 'Provinsi diperlukan'),
  city_id: z.string().min(1, 'Kabupaten/Kota diperlukan'),
  city: z.string().min(1, 'Kabupaten/Kota diperlukan'),
  district_id: z.string().min(1, 'Kecamatan diperlukan'),
  district: z.string().min(1, 'Kecamatan diperlukan'),
  village: z.string().min(1, 'Desa/Kelurahan diperlukan'),
  postal_code: z.string().min(1, 'Kode pos diperlukan'),
  full_address: z.string().min(10, 'Alamat lengkap minimal 10 karakter'),
});

export type AddressValues = z.infer<typeof addressSchema>;
