"use client"

import Image, { StaticImageData } from "next/image";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  image: StaticImageData;
  imagePositon?: "left" | "right";
}

const AuthLayout = ({
  children,
  image,
  imagePositon = "left",
}: AuthLayoutProps) => {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {imagePositon === "left" && (
        <div className="relative hidden lg:block">
          <Image
            src={image}
            alt="Auth Background"
            fill
            priority
            className="object-cover object-right rounded-r-4xl"
          />
          <div className="absolute inset-0" />
        </div>
      )}

        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-2xl rounded-3xl border bg-white p-8 shadow-lg">
            {children}
          </div>
        </div>

      {imagePositon === "right" && (
        <div className="relative hidden lg:block">
          <Image
            src={image}
            alt="Auth Background"
            fill
            priority
            className="object-cover object-left rounded-l-4xl"
          />
          <div className="absolute inset-0" />
        </div>
      )}
    </div>
  );
};

export default AuthLayout;
