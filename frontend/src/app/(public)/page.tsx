"use client";
import HeroPage from "@/page/Public/HeroPage";
import Divider from "@/components/product/Divider";
import ProductPage from "@/page/Public/ProductPage";
import RecomendationPage from "@/page/Public/RecomendationPage";
import FAQPage from "@/page/Public/FAQPage";
import ContactPage from "@/page/Public/ContactPage";

export default function Home() {
  return (
    <main className="py-16">
      <HeroPage />
      <Divider className="mt-16" />
      <ProductPage />
      <Divider className="flex justify-end items-center mt-16" />
      <RecomendationPage />
      <FAQPage />
      <Divider className="mt-16" />
      <ContactPage />
    </main>
  );
}
