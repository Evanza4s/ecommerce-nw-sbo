import AuthLayout from "@/components/layout/AuthLayout";
import ImageBg from "@/assets/images/background_sidelogin.jpeg";
import Logo from "@/assets/images/logo_e-commerce.png";
import Image from "next/image";
import Link from "next/link";
import InputField from "@/components/forms/InputField";
import { Button } from "@/components/ui/button";

const page = () => {
  return (
    <section>
      <AuthLayout imagePositon="right" image={ImageBg}>
        <div className="flex flex-col mt-10 mb-16  gap-3 justify-center items-center">
          <Image src={Logo} alt="Logo" className="w-auto h-16" />
          <h1 className="text-2xl font-bold ml-3">Sign in to Your Account</h1>
          <p className="text-md ml-3">Enter your credential to continue shopping</p>
        </div>
        {/* Form Login */}
        <div>
          <form className="flex flex-col gap-6">
            <InputField label="email" name="email" type="email" placeholder="Masukan Email..." />
            <InputField label="password" name="password" type="password" placeholder="Masukan Password..." />

            <div className="flex gap-2 justify-start items-center">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className=" rounded w-4 h-4 bg-primary-ghost checked:bg-primary border-none checked:border checked:border-primary-hover"
                />
                Remember Me
              </label>
            </div>

            <Button type="submit" className="w-full">
              Login
            </Button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-black/10" />
              </div>

              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-dark/50">
                  Or Continue With
                </span>
              </div>
            </div>

            <Button type="button" variant={"secondary"} className="w-full">
              Google
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-dark/60">Don&apos;t have account?</span>

            <Link
              href="/register"
              className="ml-1 font-medium text-primary hover:underline"
            >
              Register
            </Link>
          </div>
        </div>
      </AuthLayout>
    </section>
  );
};

export default page;
