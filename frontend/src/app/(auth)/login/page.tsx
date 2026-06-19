'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthLayout from "@/components/layout/AuthLayout";
import ImageBg from "@/assets/images/background_sidelogin.jpeg";
import Logo from "@/assets/images/logo_e-commerce.png";
import Image from "next/image";
import Link from "next/link";
import InputField from "@/components/forms/InputField";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from 'react-toastify';
import { userRoutes } from "@/lib/user-routes";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";

const Page = () => {
  const router = useRouter();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const loggedInUser = await login({
        email: values.email.trim(),
        password: values.password,
        rememberMe: values.rememberMe,
      });

      const isAdmin = loggedInUser.role === 'admin' || loggedInUser.role === 'super admin';
      toast.success('Login berhasil! Mengalihkan...');
      setTimeout(() => {
        if (isAdmin) {
          router.push('/admin');
        } else {
          router.push(userRoutes.home);
        }
      }, 1000);
    } catch (err: any) {
      if (err.message && err.message.toLowerCase().includes('not verified')) {
        toast.info('Akun belum diverifikasi. Mengalihkan ke halaman verifikasi...');
        setTimeout(() => {
          router.push(`/verify?email=${encodeURIComponent(values.email)}`);
        }, 1500);
      } else {
        const errMsg = err.message || 'Login gagal. Periksa kembali email dan password Anda.';
        toast.error(errMsg);
      }
    }
  };

  return (
    <section>
      <AuthLayout imagePositon="right" image={ImageBg}>
        <div className="flex flex-col mt-10 mb-8 gap-3 justify-center items-center">
          <Image src={Logo} alt="Logo" className="w-auto h-16" />
          <h1 className="text-2xl font-bold ml-3">Masuk ke Akun Anda</h1>
          <p className="text-md ml-3 text-slate-500">Masukkan kredensial untuk melanjutkan</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
          <InputField
            label="Email"
            type="email"
            placeholder="Masukkan email Anda..."
            error={errors.email?.message}
            {...register('email')}
          />

          <InputField
            label="Password"
            type="password"
            placeholder="Masukkan password Anda..."
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="flex items-center gap-2">
            <input
              id="rememberMe"
              type="checkbox"
              className="rounded w-4 h-4 accent-primary"
              {...register('rememberMe')}
            />
            <label htmlFor="rememberMe" className="text-sm text-slate-600 cursor-pointer">
              Ingat saya
            </label>
          </div>

          <Button type="submit" className="w-full mt-1" disabled={isSubmitting}>
            {isSubmitting ? 'Sedang masuk...' : 'Masuk'}
          </Button>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-dark/50">Atau lanjutkan dengan</span>
            </div>
          </div>

          <Button type="button" variant="secondary" className="w-full">
            Google
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-dark/60">Belum punya akun?</span>
          <Link href="/register" className="ml-1 font-medium text-primary hover:underline">
            Daftar
          </Link>
        </div>
      </AuthLayout>
    </section>
  );
};

export default Page;
