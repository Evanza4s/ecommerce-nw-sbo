import React from 'react'

interface OrderNoteProps {
  notes?: string;
}

const OrderNote = ({ notes }: OrderNoteProps) => {
  return (
    <div className='rounded-2xl border p-5 bg-white shadow-sm'>
        <h3 className='mb-2 font-bold'>
            Order Note
        </h3>
        <p className='text-sm text-dark/70 leading-relaxed whitespace-pre-line'>
            {notes || "Tidak ada catatan untuk pesanan ini."}
        </p>
    </div>
  )
}

export default OrderNote
