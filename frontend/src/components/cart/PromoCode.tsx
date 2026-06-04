"use client"
import React from 'react'
import { Button } from '@/components/ui/button'

const PromoCode = () => {
  return (
    <div className='rounded-2xl bg-white p-5 shadow-md'>
        <h3 className='font-semibold'>
            Have a Promo Code? <span className='text-primary'>Apply Here</span>
        </h3>

        <div className='mt-4 flex gap-2'>
            <input type="text" placeholder='Promo Code' className='flex-1 rounded-lg border px-3 py-2 placeholder:text-primary-ghost/20 focus:outline-none focus:ring-2 focus:ring-primary' />

            <Button variant={"secondary"}>
                Apply
            </Button>
        </div>
    </div>
  )
}

export default PromoCode
