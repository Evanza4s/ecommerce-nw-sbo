"use client"

import { useState } from 'react'

type QuantitySelectorProps = {
  value: number;
  onChange: (value: number) => void;
  max?: number;
};

const QuantitySelector = ({ value, onChange, max }: QuantitySelectorProps) => {
    return (
    <div className='flex items-center gap-4'>
        <button onClick={() => onChange(value - 1)} disabled={value <= 1} className="flex h-10 w-10 items-center justify-center rounded-xl border">-</button>
        <span className='w-10 text-center font-semibold'>{value}</span>
        <button onClick={() => onChange(value + 1)} disabled={max !== undefined && value >= max} className="flex h-10 w-10 items-center justify-center rounded-xl border">+</button>
    </div>
  )
}

export default QuantitySelector
