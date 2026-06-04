import Item from "@/assets/images/avatar.png";
import { StaticImageData } from "next/image";

export type CartProduct = {
  id: number | string;
  title: string;
  variant: string;
  price: number; // store as number for calculations
  displayPrice?: string; // optional formatted string
  image: StaticImageData | string;
}

export const sampleItems: CartProduct[] = [
  {
    id: 1,
    title: "Oversized Essential Hoodie",
    variant: "Black • XL",
    price: 300000,
    displayPrice: "Rp. 300.000",
    image: Item,
  },
  {
    id: 2,
    title: "Classic Runner Shoes",
    variant: "White • 42",
    price: 250000,
    displayPrice: "Rp. 250.000",
    image: Item,
  },
  {
    id: 3,
    title: "Everyday Tee",
    variant: "Grey • M",
    price: 100000,
    displayPrice: "Rp. 100.000",
    image: Item,
  },
];

export const checkoutItems: CartProduct[] = [sampleItems[0]];
export const orderItems: CartProduct[] = [sampleItems[0], sampleItems[1]];

export function calcTotals(items: CartProduct[]) {
  const subtotal = items.reduce((s, it) => s + it.price, 0);
  const shipping = subtotal > 500000 ? 0 : 15000;
  const discount = 20000;
  const total = subtotal + shipping - discount;
  return { subtotal, shipping, discount, total };
}
