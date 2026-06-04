"use client"

import { useState } from 'react'

const QuantitySelector = () => {
  const [qty, setQty] = useState(1)
    return (
    <div className='flex items-center gap-4'>
        <button onClick={() => setQty(qty - 1)} disabled={qty <= 1} className="flex h-10 w-10 items-center justify-center rounded-xl border">-</button>
        <span className='w-10 text-center font-semibold'>{qty}</span>
        <button onClick={() => setQty(qty + 1)} className="flex h-10 w-10 items-center justify-center rounded-xl border">+</button>
    </div>
  )
}

export default QuantitySelector
