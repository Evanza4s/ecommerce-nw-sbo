"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import PaymentMethod from "./PaymentMethod";
import { PriceSummary } from "@/components/ui/PriceSummary";
import { formatCurrency } from "@/lib/admin";
import type { Cart } from "@/server/modules/carts/types";
import { ordersApi } from "@/server/modules/orders/api";
import { useCart } from "@/components/cart/CartContext";
import { toast } from "react-toastify";

interface PaymentSummaryProps {
  cart: Cart | null;
  selectedAddressId: string;
  courier: string;
  shippingService: string;
  shippingCost: number;
  voucherCode?: string;
  discountAmount?: number;
}

const PaymentSummary = ({ cart, selectedAddressId, courier, shippingService, shippingCost, voucherCode, discountAmount }: PaymentSummaryProps) => {
  const router = useRouter();
  const { fetchCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cart?.total_price || 0;
  const shipping = shippingCost;
  const discount = discountAmount || 0;
  const total = subtotal + shipping - discount;

  const rows = [
    { label: "Subtotal", value: formatCurrency(subtotal) },
    { label: "Shipping", value: formatCurrency(shipping) },
    ...(discount > 0 ? [{ label: "Discount", value: formatCurrency(discount), isNegative: true }] : []),
  ];

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      toast.error("Silakan pilih alamat pengiriman terlebih dahulu.");
      return;
    }
    if (!cart || !cart.items || cart.items.length === 0) {
      toast.error("Keranjang belanja kosong.");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await ordersApi.checkout({
        address_id: selectedAddressId,
        courier,
        shipping_service: shippingService,
        shipping_cost: shippingCost,
        voucher_code: voucherCode
      });

      if (res.data?.snap_token) {
        // @ts-ignore
        if (window.snap) {
          // @ts-ignore
          window.snap.pay(res.data.snap_token, {
            onSuccess: async function (result: any) {
              toast.success("Pembayaran berhasil!");
              await fetchCart(); // Clear cart in context
              router.push("/account/orders");
            },
            onPending: async function (result: any) {
              toast.info("Menunggu pembayaran Anda.");
              await fetchCart();
              router.push("/account/orders");
            },
            onError: function (result: any) {
              toast.error("Pembayaran gagal!");
            },
            onClose: async function () {
              await fetchCart();
              router.push("/account/orders");
            }
          });
        } else {
          toast.error("Modul pembayaran Midtrans belum dimuat.");
        }
      } else {
        toast.error("Gagal mendapatkan token pembayaran dari server.");
      }

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Gagal melakukan proses checkout.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PriceSummary title="Payment Summary" rows={rows} total={formatCurrency(total)}>
      <PaymentMethod />
      <div className="mt-4 rounded-xl bg-green-200 p-3 text-sm text-green-700">
        🔒 Secure Checkout
      </div>
      <Button
        onClick={handleCheckout}
        disabled={isProcessing || !cart || !cart.items || cart.items.length === 0}
        className="mt-6 w-full"
      >
        {isProcessing ? "Memproses..." : "Pay Now"}
      </Button>
    </PriceSummary>
  );
};

export default PaymentSummary;
