"use client";

import { Button } from "@/components/ui/button";
import CartList from "@/components/cart/CartList";
import CartSummary from "@/components/cart/CartSummary";
import PromoCode from "@/components/cart/PromoCode";
import PageSection from "@/components/ui/PageSection";
import { ArrowLeft } from "lucide-react";
import { sampleItems, calcTotals } from "@/data/cartData";

const page = () => {
  return (
    <PageSection title="Shopping Cart" description="3 items in your cart">
      <div className="flex flex-col justify-center">
        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          <div className="space-y-4">
            <CartList />
          </div>

          <div className="sticky top-24 h-fit space-y-6">
            <PromoCode />
            <CartSummary {...calcTotals(sampleItems)} />
          </div>
        </div>

        <div className="flex border-4 justify-end items-center border-dark rounded-2xl p-4 mt-8">
          <Button
            variant={"outline"}
            size={"default"}
            className="gap-2 border-dark text-black"
          >
            <ArrowLeft /> <span>Kembali</span>
          </Button>
        </div>
      </div>
    </PageSection>
  );
};

export default page;
