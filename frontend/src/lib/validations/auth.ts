import { z } from 'zod';

// ============================================================
// SHARED RULES — matches backend validate tags in request.go
// ============================================================

const emailSchema = z
  .string()
  .min(1, 'Email wajib diisi')
  .email('Format email tidak valid');

const passwordSchema = z
  .string()
  .min(1, 'Password wajib diisi')
  .min(8, 'Password minimal 8 karakter')
  .max(72, 'Password maksimal 72 karakter');

// ============================================================
// LOGIN SCHEMA
// Mirrors backend: LoginRequest { email required,email; password required }
// ============================================================

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password wajib diisi'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// ============================================================
// REGISTER SCHEMA
// Mirrors backend: RegisterRequest {
//   email required,email
//   username required,min=3,max=100
//   password required,min=8,max=72
//   confirmPassword required (must match password)
//   firstName required
//   lastName required
// }
// ============================================================

export const registerSchema = z
  .object({
    firstName: z.string().min(1, 'Nama depan wajib diisi'),
    lastName: z.string().min(1, 'Nama belakang wajib diisi'),
    email: emailSchema,
    username: z
      .string()
      .min(1, 'Username wajib diisi')
      .min(3, 'Username minimal 3 karakter')
      .max(100, 'Username maksimal 100 karakter')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username hanya boleh mengandung huruf, angka, dan underscore'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak cocok',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

// ============================================================
// VERIFY OTP SCHEMA
// Mirrors backend: VerifyOTPRequest { email required,email; otp_code required,len=6 }
// ============================================================

export const verifyOtpSchema = z.object({
  otpCode: z
    .string()
    .min(1, 'Kode OTP wajib diisi')
    .length(6, 'Kode OTP harus 6 digit')
    .regex(/^\d{6}$/, 'Kode OTP hanya boleh berisi angka'),
});

export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;
