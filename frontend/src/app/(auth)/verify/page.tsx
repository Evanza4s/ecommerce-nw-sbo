import Image from "next/image";

import Background from "@/assets/images/background_sidelogin.jpeg";
import Logo from "@/assets/images/logo_e-commerce.png";

import OtpInput from "@/components/forms/OtpInput";
import { Button } from "@/components/ui/button";

const Page = () => {
  return (
    <section className="min-h-screen bg-background px-8 md:px-16 lg:px-26 py-12">

      <div className="relative mx-auto flex min-h-[90vh] w-full  items-center justify-center overflow-hidden rounded-3xl">

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
              Verify Registration Account
            </h1>

            <p className="mt-2 text-dark/60">
              Enter your OTP Code to verify your account
            </p>
          </div>

          <div className="mt-8">
            <OtpInput />
          </div>

          <Button className="mt-8 w-full">
            Verify Account
          </Button>

          <div className="mt-4 text-center text-sm text-dark/60">
            Didn&apos;t receive code?
            <button
              type="button"
              className="ml-1 font-semibold text-primary hover:underline"
            >
              Resend OTP
            </button>
          </div>

        </div>

      </div>

    </section>
  );
};

export default Page;
