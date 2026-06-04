"use client"

import React from 'react'
import CartItem from './CartItem'
import { sampleItems } from "@/data/cartData";

const CartList = () => {
  return (
    <div className='space-y-4'>
      {sampleItems.map((it) => (
        <CartItem key={it.id} title={it.title} variant={it.variant} price={it.displayPrice ?? `Rp. ${it.price}`} imageSrc={it.image} />
      ))}
    </div>
  )
}

export default CartList
