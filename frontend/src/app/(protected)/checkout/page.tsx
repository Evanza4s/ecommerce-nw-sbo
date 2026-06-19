"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CheckoutItem from "@/components/checkout/CheckoutItem";
import PaymentSummary from "@/components/checkout/PaymentSummary";
import PromoCode from "@/components/cart/PromoCode";
import PageSection from "@/components/ui/PageSection";
import ShippingAddress from "@/components/checkout/ShippingAddress";
import { ArrowLeft } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { userApi } from "@/server/modules/users/api";
import type { UserAddress } from "@/server/modules/users/types";
import { shippingApi } from "@/server/modules/shipping/api";
import type { ShippingRatesResponseData } from "@/server/modules/shipping/types";
import Script from "next/script";

const CheckoutPage = () => {
  const { cart, fetchCart } = useCart();
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [selectedCourier, setSelectedCourier] = useState<string>("jne");
  const [selectedService, setSelectedService] = useState<string>("REG");
  const [shippingRates, setShippingRates] = useState<ShippingRatesResponseData | null>(null);
  const [shippingCost, setShippingCost] = useState<number>(15000);
  const [isLoadingRates, setIsLoadingRates] = useState<boolean>(false);
  const [appliedVoucherCode, setAppliedVoucherCode] = useState<string>('');
  const [appliedVoucherDiscount, setAppliedVoucherDiscount] = useState<number>(0);

  useEffect(() => {
    fetchCart();

    if (user?.id) {
      userApi.address.getAll(user.id)
        .then(res => {
          if (res.data) {
            setAddresses(res.data);
            const defaultAddr = res.data.find(a => a.is_default) || res.data[0];
            if (defaultAddr) {
              setSelectedAddressId(defaultAddr.id);
            }
          }
        })
        .catch(console.error);
    }
  }, [user?.id, fetchCart]);

  const selectedAddress = addresses.find(a => a.id === selectedAddressId);

  const totalWeightGrams = Math.max(
    1000,
    cart?.items
      ? Math.round(cart.items.reduce((sum, item) => sum + (item.weight || 1000) * item.quantity, 0))
      : 1000
  );

  useEffect(() => {
    if (!selectedAddressId || !selectedAddress || !cart?.items || cart.items.length === 0) {
      setShippingRates(null);
      return;
    }

    const fetchRates = async () => {
      setIsLoadingRates(true);
      try {
        const res = await shippingApi.getRates({
          origin: "423", // Set fallback origin as District ID for Komerce
          destination: selectedAddress.district_id || selectedAddress.city_id,
          weight: totalWeightGrams,
          courier: selectedCourier,
        });

        if (res.data) {
          setShippingRates(res.data);
          if (res.data.costs && res.data.costs.length > 0) {
            const matchedCost = res.data.costs.find(c => c.service === selectedService) || res.data.costs[0];
            setSelectedService(matchedCost.service);
            setShippingCost(matchedCost.cost);
          } else {
            setSelectedService("");
            setShippingCost(15000);
          }
        }
      } catch (err) {
        console.error("Failed to fetch shipping rates:", err);
        setShippingRates(null);
        setSelectedService("");
        setShippingCost(15000);
      } finally {
        setIsLoadingRates(false);
      }
    };

    fetchRates();
  }, [selectedAddressId, selectedAddress?.district_id, selectedAddress?.city_id, selectedCourier, totalWeightGrams, cart?.items?.length]);

  const handleSelectService = (serviceName: string) => {
    setSelectedService(serviceName);
    if (shippingRates) {
      const matched = shippingRates.costs.find(c => c.service === serviceName);
      if (matched) {
        setShippingCost(matched.cost);
      }
    }
  };

  const midtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "SB-Mid-client-XXXXX";
  const snapScriptSrc = "https://app.sandbox.midtrans.com/snap/snap.js";

  return (
    <>
      <Script
        src={snapScriptSrc}
        data-client-key={midtransClientKey}
        strategy="lazyOnload"
      />

      <PageSection
        title="Checkout"
        description="Complete your order and proceed to payment"
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            <CheckoutItem items={cart?.items || []} />
            <ShippingAddress
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onSelectAddress={setSelectedAddressId}
              selectedCourier={selectedCourier}
              onSelectCourier={setSelectedCourier}
              selectedService={selectedService}
              onSelectService={handleSelectService}
              shippingRates={shippingRates}
              isLoadingRates={isLoadingRates}
            />
          </div>
          <div className="space-y-4">
            <PromoCode 
              subtotal={cart?.total_price || 0}
              onApply={(code, discount) => {
                setAppliedVoucherCode(code);
                setAppliedVoucherDiscount(discount);
              }}
              appliedCode={appliedVoucherCode}
              appliedDiscount={appliedVoucherDiscount}
            />
            <PaymentSummary
              cart={cart}
              selectedAddressId={selectedAddressId}
              courier={selectedCourier}
              shippingService={selectedService}
              shippingCost={shippingCost}
              voucherCode={appliedVoucherCode}
              discountAmount={appliedVoucherDiscount}
            />
          </div>
        </div>

        <div className="flex border-4 justify-end items-center border-dark rounded-2xl p-4 mt-8">
          <Button
            asChild
            variant={"outline"}
            size={"default"}
            className="gap-2 border-dark text-black"
          >
            <Link href="/cart">
              <ArrowLeft /> <span>Kembali ke keranjang</span>
            </Link>
          </Button>
        </div>
      </PageSection>
    </>
  );
};

export default CheckoutPage;
