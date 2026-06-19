"use client"
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PriceSummary } from '@/components/ui/PriceSummary'

type CartSummaryProps = {
  subtotal?: number | string;
  shipping?: number | string;
  discount?: number | string;
  total?: number | string;
}

const format = (v: number | string | undefined) => {
  if (v === undefined) return "-";
  if (typeof v === 'number') return new Intl.NumberFormat('id-ID').format(v).replace(/\./g, '.').replace(/,/g, ',').replace(/^/, 'Rp. ');
  return v as string;
}

const CartSummary = ({ subtotal, shipping, discount, total }: CartSummaryProps) => {
  const rows = [
    { label: 'Subtotal', value: format(subtotal) },
    { label: 'Shipping', value: format(shipping) },
    { label: 'Discount', value: format(discount), isNegative: true },
  ];

  return (
    <PriceSummary
      title="Order Summary"
      rows={rows}
      total={format(total)}
      className="sticky top-24"
    >
      <Link href="/checkout" className="mt-6 block w-full">
        <Button className='w-full'>
          Checkout
        </Button>
      </Link>
    </PriceSummary>
  )
}

export default CartSummary
