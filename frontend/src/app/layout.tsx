import type { Metadata } from "next";
import "./globals.css";

import { Montserrat, Plus_Jakarta_Sans, Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/components/cart/CartContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta-sans",
});

export const metadata: Metadata = {
  title: "Ecommerce",
  description: "Modern Ecommerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", montserrat.variable, jakarta.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col" cz-shortcut-listen="true">
        <AuthProvider>
          <CartProvider>
            {children}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
