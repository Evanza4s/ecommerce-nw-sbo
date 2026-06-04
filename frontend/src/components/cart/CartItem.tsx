"use client"

import Image, { StaticImageData } from "next/image";
import Item from "@/assets/images/avatar.png";
import QuantitySelector from "@/components/product/QuantitySelector";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
type CartItemProps = {
  id?: string | number;
  imageSrc?: StaticImageData | string;
  title?: string;
  variant?: string;
  price?: string;
};

const CartItem = ({
  // id,
  imageSrc = Item,
  title = "Oversized Essential Hoodie",
  variant = "Black • XL",
  price = "Rp. 300.000",
}: CartItemProps) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white py-4 px-6 shadow-md md:flex-row md:items-center">
      <input
        type="checkbox"
        className="w-5 h-5 mt-1 bg-gray-400/40 text-primary accent-primary checked:bg-secondary rounded-sm border-none active:border-none"
      />

      <Image
        src={imageSrc}
        alt={title}
        width={120}
        height={120}
        className="rounded-xl object-cover"
      />

      <div className="flex-1">
        <h3 className="font-bold text-lg">{title}</h3>

        <p className="text-dark/60">{variant}</p>

        <p className="mt-2 font-bold text-primary">{price}</p>
      </div>

      <div className="text-right">
        <p className="font-bold">{price}</p>
      </div>

      <QuantitySelector />

      <Button variant={"destructive"} size={"icon"}>
        <Trash2 className="w-5 h-5 text-light" />
      </Button>
    </div>
  );
};

export default CartItem;
