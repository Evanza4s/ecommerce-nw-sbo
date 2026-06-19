"use client"
import Link from 'next/link'
import React from 'react'
import { Button } from '@/components/ui/button'
import { CartIcon } from '@/assets/icons/CartIcon'

const EmptyCart = () => {
    return (
        <div className='flex flex-col items-center justify-center py-20'>
            <CartIcon className='w-20 h-20' color='primary' />

            <h2 className='mt-4 text-2xl font-bold'>
                Your Cart is Empty
            </h2>

            <p className='mt-2 text-dark/60'>
                Looks like you haven&apos;t added anything to your cart yet. Start shopping and discover amazing products!
            </p>

            <Button>
                <Link href={"/"}>
                    Continue Shopping
                </Link>
            </Button>
        </div>
    )
}

export default EmptyCart
