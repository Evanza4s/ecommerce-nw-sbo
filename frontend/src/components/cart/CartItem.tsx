"use client"

import Image from "next/image";
import QuantitySelector from "@/components/product/QuantitySelector";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { CartItem as CartItemType } from "@/server/modules/carts/types";

type CartItemProps = {
  item: CartItemType;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white py-4 px-6 shadow-md md:flex-row md:items-center">
      <Image
        src={item.variant_image || "/placeholder.jpg"}
        alt={item.product_name}
        width={100}
        height={100}
        className="rounded-xl object-cover h-24 w-24"
      />

      <div className="flex-1">
        <h3 className="font-bold text-lg">{item.product_name}</h3>
        <p className="text-dark/60">{item.color} • {item.size}</p>
        <p className="mt-2 font-bold text-primary">{formatPrice(item.price)}</p>
      </div>

      <div className="text-right hidden md:block">
        <p className="font-bold">{formatPrice(item.subtotal)}</p>
      </div>

      <QuantitySelector 
        value={item.quantity} 
        onChange={(val) => onUpdateQuantity(item.id, val)} 
      />

      <Button variant={"destructive"} size={"icon"} onClick={() => onRemove(item.id)}>
        <Trash2 className="w-5 h-5 text-light" />
      </Button>
    </div>
  );
};

export default CartItem;
