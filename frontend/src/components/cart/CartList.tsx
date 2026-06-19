"use client"

import React from 'react'
import CartItem from './CartItem'
import type { CartItem as CartItemType } from "@/server/modules/carts/types";

type CartListProps = {
  items: CartItemType[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
};

const CartList = ({ items, onUpdateQuantity, onRemove }: CartListProps) => {
  if (items.length === 0) {
    return <div className="p-8 text-center bg-white rounded-2xl shadow-sm text-dark/60">Keranjang Anda kosong.</div>;
  }

  return (
    <div className='space-y-4'>
      {items.map((it) => (
        <CartItem 
          key={it.id} 
          item={it} 
          onUpdateQuantity={onUpdateQuantity} 
          onRemove={onRemove} 
        />
      ))}
    </div>
  )
}

export default CartList
