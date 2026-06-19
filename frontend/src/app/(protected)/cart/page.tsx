"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import CartList from "@/components/cart/CartList";
import CartSummary from "@/components/cart/CartSummary";
import PromoCode from "@/components/cart/PromoCode";
import PageSection from "@/components/ui/PageSection";
import { ArrowLeft, Trash } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import Link from "next/link";

const CartPage = () => {
  const { cart, isLoading, updateQuantity, removeItem, clearCart } = useCart();

  const [appliedVoucherCode, setAppliedVoucherCode] = useState<string>('');
  const [appliedVoucherDiscount, setAppliedVoucherDiscount] = useState<number>(0);

  if (isLoading) {
    return (
      <PageSection title="Shopping Cart" description="Loading your cart...">
        <div className="flex h-64 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </PageSection>
    );
  }

  const items = cart?.items || [];
  const totalItems = cart?.total_items || 0;

  const subtotal = cart?.total_price || 0;
  const shipping = items.length > 0 ? 50000 : 0;
  const discount = appliedVoucherDiscount || 0;
  const total = subtotal + shipping - discount;

  return (
    <PageSection title="Shopping Cart" description={`${totalItems} items in your cart`}>
      <div className="flex flex-col justify-center">
        {items.length > 0 && (
          <div className="flex justify-end mb-4">
            <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={clearCart}>
              <Trash className="w-4 h-4 mr-2" /> Kosongkan Keranjang
            </Button>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          <div className="space-y-4">
            <CartList items={items} onUpdateQuantity={updateQuantity} onRemove={removeItem} />
          </div>

          <div className="sticky top-24 h-fit space-y-6">
            <PromoCode 
              subtotal={subtotal}
              onApply={(code, discountAmt) => {
                setAppliedVoucherCode(code);
                setAppliedVoucherDiscount(discountAmt);
              }}
              appliedCode={appliedVoucherCode}
              appliedDiscount={appliedVoucherDiscount}
            />
            <CartSummary subtotal={subtotal} shipping={shipping} discount={discount} total={total} />
          </div>
        </div>

        <div className="flex border-4 justify-between items-center border-dark rounded-2xl p-4 mt-8">
          <Link href="/products">
            <Button
              variant={"outline"}
              size={"default"}
              className="gap-2 border-dark text-black"
            >
              <ArrowLeft /> <span>Lanjut Belanja</span>
            </Button>
          </Link>
        </div>
      </div>
    </PageSection>
  );
};

export default CartPage;
