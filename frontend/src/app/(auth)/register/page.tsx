'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthLayout from "@/components/layout/AuthLayout";
import ImageBg from "@/assets/images/background_sidelogin.jpeg";
import Logo from "@/assets/images/logo_e-commerce.png";
import Image from "next/image";
import InputGroup from "@/components/forms/InputGroup";
import InputField from "@/components/forms/InputField";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from 'react-toastify';
import { registerSchema, type RegisterFormValues } from "@/lib/validations/auth";

const Page = () => {
  const router = useRouter();
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const result = await registerUser({
        email: values.email.trim(),
        username: values.username.trim(),
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      toast.success('Registrasi berhasil! Kode OTP telah dikirim ke email Anda.');
      setTimeout(() => {
        router.push(`/verify?email=${encodeURIComponent(result.email)}`);
      }, 1500);
    } catch (err: any) {
      const errMsg = err.message || 'Registrasi gagal. Silakan coba lagi.';
      toast.error(errMsg);
    }
  };

  return (
    <section>
      <AuthLayout image={ImageBg} imagePositon="right">
        <div className="flex flex-col mt-10 mb-8 gap-3 justify-center items-center">
          <Image src={Logo} alt="Logo" className="w-auto h-16" />
          <h1 className="text-2xl font-bold ml-3">Buat Akun Baru</h1>
          <p className="text-md ml-3 text-slate-500">Lengkapi data berikut untuk mendaftar</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
          <InputGroup cols={2}>
            <InputField
              label="Nama Depan"
              type="text"
              placeholder="Masukkan nama depan..."
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <InputField
              label="Nama Belakang"
              type="text"
              placeholder="Masukkan nama belakang..."
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </InputGroup>

          <InputField
            label="Email"
            type="email"
            placeholder="Masukkan email Anda..."
            error={errors.email?.message}
            {...register('email')}
          />

          <InputField
            label="Username"
            type="text"
            placeholder="Masukkan username..."
            hint="3–100 karakter, hanya huruf, angka, dan underscore"
            error={errors.username?.message}
            {...register('username')}
          />

          <InputGroup cols={2}>
            <InputField
              label="Password"
              type="password"
              placeholder="Min. 8 karakter..."
              hint="8–72 karakter"
              error={errors.password?.message}
              {...register('password')}
            />
            <InputField
              label="Konfirmasi Password"
              type="password"
              placeholder="Ulangi password..."
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
          </InputGroup>

          <Button type="submit" className="w-full mt-1" disabled={isSubmitting}>
            {isSubmitting ? 'Mendaftar...' : 'Daftar'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-dark/60">Sudah punya akun?</span>
          <Link href="/login" className="ml-1 font-medium text-primary hover:underline">
            Masuk
          </Link>
        </div>
      </AuthLayout>
    </section>
  );
};

export default Page;
