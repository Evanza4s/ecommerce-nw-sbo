import React from 'react'

const OrderNote = () => {
  return (
    <div className='rounded-2xl border p-5'>
        <h3 className='mb-4 font-bold'>
            Order Note
        </h3>

        <textarea 
        rows={8}
        className='w-full rounded-lg border px-3 py-2 placeholder:text-primary-ghost/40 focus:outline-none focus:ring-2 focus:ring-primary'
        placeholder='Add note to your order...'
        />
    </div>
  )
}

export default OrderNote
