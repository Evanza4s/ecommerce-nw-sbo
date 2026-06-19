'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from "next/image";

import Background from "@/assets/images/background_sidelogin.jpeg";
import Logo from "@/assets/images/logo_e-commerce.png";

import OtpInput from "@/components/forms/OtpInput";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from 'react-toastify';
import { userRoutes } from "@/lib/user-routes";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyOtp, resendOtp } = useAuth();

  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleOtpChange = (otp: string) => {
    setOtpCode(otp);
    // Clear error once user starts correcting
    if (otpError) setOtpError('');
  };

  const handleVerify = async () => {
    // Validate with zod schema rules: length=6, digits only
    if (otpCode.length !== 6) {
      setOtpError('Kode OTP harus 6 digit');
      toast.error('Kode OTP harus 6 digit');
      return;
    }
    if (!/^\d{6}$/.test(otpCode)) {
      setOtpError('Kode OTP hanya boleh berisi angka');
      toast.error('Kode OTP hanya boleh berisi angka');
      return;
    }

    setOtpError('');
    setIsLoading(true);

    try {
      await verifyOtp(email, otpCode);
      toast.success('Akun berhasil diverifikasi! Mengalihkan ke halaman login...');
      setTimeout(() => {
        router.push(userRoutes.login);
      }, 2000);
    } catch (err: any) {
      const errMsg = err.message || 'Verifikasi gagal. Silakan coba lagi.';
      setOtpError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error('Email tidak ditemukan. Silakan ulangi pendaftaran.');
      return;
    }

    setIsResending(true);
    toast.info('Mengirim ulang kode OTP...');

    try {
      await resendOtp(email);
      toast.success('Kode OTP baru telah dikirim ke email Anda.');
      setOtpCode('');
      setOtpError('');
    } catch (err: any) {
      const errMsg = err.message || 'Gagal mengirim ulang OTP. Silakan coba lagi.';
      toast.error(errMsg);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <section className="min-h-screen bg-background px-8 md:px-16 lg:px-26 py-12">
      <div className="relative mx-auto flex min-h-[90vh] w-full items-center justify-center overflow-hidden rounded-3xl">
        <Image
          src={Background}
          alt="Background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10 w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl">
          <Image
            src={Logo}
            alt="Logo"
            className="mx-auto h-16 w-auto"
          />

          <div className="mt-4 text-center">
            <h1 className="text-3xl font-bold text-dark">
              Verifikasi Akun
            </h1>

            <p className="mt-2 text-dark/60">
              Masukkan kode OTP untuk memverifikasi akun Anda
            </p>

            {email && (
              <p className="mt-1 text-sm text-dark/50">
                Kode dikirim ke: <span className="font-medium">{email}</span>
              </p>
            )}
          </div>

          <div className="mt-8">
            <OtpInput value={otpCode} onChange={handleOtpChange} length={6} />
            {otpError && (
              <p className="mt-2 text-center text-xs text-red-500" role="alert">
                {otpError}
              </p>
            )}
          </div>

          <Button
            className="mt-6 w-full"
            onClick={handleVerify}
            disabled={isLoading || otpCode.length !== 6}
          >
            {isLoading ? 'Memverifikasi...' : 'Verifikasi Akun'}
          </Button>

          <div className="mt-4 text-center text-sm text-dark/60">
            Tidak menerima kode?{' '}
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="font-semibold text-primary hover:underline disabled:opacity-50"
            >
              {isResending ? 'Mengirim...' : 'Kirim Ulang OTP'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}


const Page = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
};

export default Page;
