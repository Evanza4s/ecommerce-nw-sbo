"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { vouchersApi } from '@/server/modules/vouchers/api'
import { toast } from 'react-toastify'

interface PromoCodeProps {
  subtotal: number;
  onApply: (code: string, discount: number) => void;
  appliedCode?: string;
  appliedDiscount?: number;
}

const PromoCode = ({ subtotal, onApply, appliedCode, appliedDiscount }: PromoCodeProps) => {
  const [code, setCode] = useState(appliedCode || '');
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) return;

    // If there's an already applied code and the user wants to apply the same, do nothing.
    if (code === appliedCode) return;

    setLoading(true);
    try {
      const res = await vouchersApi.validate({
        code: code.trim(),
        cart_subtotal: subtotal
      });

      if (res.data?.is_valid) {
        toast.success(res.data.message || "Promo code applied!");
        onApply(res.data.voucher_code, res.data.discount_amount);
      } else {
        toast.error("Invalid promo code");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to apply promo code");
      onApply('', 0); // reset if fail
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setCode('');
    onApply('', 0);
    toast.info("Promo code removed");
  };

  return (
    <div className='rounded-2xl bg-white p-5 shadow-md'>
        <h3 className='font-semibold'>
            Have a Promo Code? <span className='text-primary'>Apply Here</span>
        </h3>

        <div className='mt-4 flex gap-2'>
            <input 
              type="text" 
              placeholder='Promo Code' 
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              disabled={!!appliedCode}
              className='flex-1 rounded-lg border px-3 py-2 placeholder:text-primary-ghost/20 focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-100 disabled:text-slate-500' 
            />

            {appliedCode ? (
              <Button variant={"destructive"} onClick={handleRemove}>
                  Remove
              </Button>
            ) : (
              <Button variant={"secondary"} onClick={handleApply} disabled={loading || !code.trim() || subtotal <= 0}>
                  {loading ? '...' : 'Apply'}
              </Button>
            )}
        </div>
        
        {appliedCode && (
          <p className="mt-2 text-sm text-green-600 font-medium">
            Code '{appliedCode}' applied! Discount: Rp {appliedDiscount?.toLocaleString("id-ID")}
          </p>
        )}
    </div>
  )
}

export default PromoCode
