import AuthLayout from "@/components/layout/AuthLayout";
import ImageBg from "@/assets/images/background_sidelogin.jpeg";
import Logo from "@/assets/images/logo_e-commerce.png";
import Image from "next/image";
import InputGroup from "@/components/forms/InputGroup";
import InputField from "@/components/forms/InputField";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const page = () => {
  return (
    <section>
      <AuthLayout image={ImageBg} imagePositon="right">
        <div className="flex flex-col mt-10 mb-16  gap-3 justify-center items-center">
          <Image src={Logo} alt="Logo" className="w-auto h-16" />
          <h1 className="text-2xl font-bold ml-3">Sign up to Your Account</h1>
          <p className="text-md ml-3">Enter your detail to create an account</p>
        </div>
        {/* Form Register */}
        <div>
          <form className="flex flex-col gap-6">
            <InputGroup cols={2}>
              <InputField
                label="First Name"
                name="firstName"
                type="text"
                placeholder="Masukan Nama Depan..."
              />
              <InputField
                label="Last Name"
                name="lastName"
                type="text"
                placeholder="Masukan Nama Belakang..."
              />
            </InputGroup>
            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="Masukan Email..."
            />
            <InputField
              label="Username"
              name="username"
              type="text"
              placeholder="Masukan Username..."
            />
            <InputGroup cols={2}>
              <InputField
                label="Password"
                name="password"
                type="password"
                placeholder="Masukan Password..."
              />
              <InputField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Masukan Konfirmasi Password..."
              />
            </InputGroup>

            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-dark/60">Have an account?</span>
            <Link
              href="/login"
              className="ml-1 font-medium text-primary hover:underline"
            >
              Login
            </Link>
          </div>

        </div>
      </AuthLayout>
    </section>
  );
};

export default page;
