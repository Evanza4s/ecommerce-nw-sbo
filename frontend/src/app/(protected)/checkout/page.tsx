import { Button } from "@/components/ui/button";
import CheckoutItem from "@/components/checkout/CheckoutItem";
import PaymentSummary from "@/components/checkout/PaymentSummary";
import PromoCode from "@/components/cart/PromoCode";
import PageSection from "@/components/ui/PageSection";
import ShippingAddress from "@/components/checkout/ShippingAddress";
import { ArrowLeft } from "lucide-react";
import React from "react";

const page = () => {
  return (
    <PageSection
      title="Checkout"
      description="Complete your order and proceed to payment"
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <CheckoutItem />
          <ShippingAddress />
        </div>
        <div className="space-y-4">
          <PromoCode />
          <PaymentSummary />
        </div>
      </div>

      <div className="flex border-4 justify-end items-center border-dark rounded-2xl p-4 mt-8">
        <Button
          variant={"outline"}
          size={"default"}
          className="gap-2 border-dark text-black"
        >
          <ArrowLeft /> <span>Kembali ke keranjang</span>
        </Button>
      </div>
    </PageSection>
  );
};

export default page;
