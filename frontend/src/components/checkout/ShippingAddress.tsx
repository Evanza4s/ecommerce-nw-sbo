import React from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Truck, Plus } from "lucide-react";
import type { UserAddress } from "@/server/modules/users/types";
import type { ShippingRatesResponseData } from "@/server/modules/shipping/types";
import Link from "next/link";

interface ShippingAddressProps {
  addresses: UserAddress[];
  selectedAddressId: string;
  onSelectAddress: (id: string) => void;
  selectedCourier: string;
  onSelectCourier: (c: string) => void;
  selectedService: string;
  onSelectService: (s: string) => void;
  shippingRates: ShippingRatesResponseData | null;
  isLoadingRates: boolean;
}

const ShippingAddress = ({ 
  addresses, selectedAddressId, onSelectAddress,
  selectedCourier, onSelectCourier,
  selectedService, onSelectService,
  shippingRates, isLoadingRates
}: ShippingAddressProps) => {
  const selectedAddr = addresses.find(a => a.id === selectedAddressId);

  return (
    <div className="rounded-2xl bg-white p-5 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-2"><MapPin className="h-5 w-5" /> Shipping Address</h3>
        <Button variant={"ghost"} size={"sm"} asChild>
          <Link href="/account/addresses" target="_blank" className="text-primary hover:text-primary/80">
            <Plus className="mr-1 h-4 w-4" /> Add New Address
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border p-4 space-y-4">
        {addresses.length === 0 ? (
          <div className="text-sm text-slate-500">Anda belum memiliki alamat pengiriman. Silakan tambahkan di profil Anda.</div>
        ) : (
          <div className="space-y-3">
            <label className="text-sm font-semibold">Pilih Alamat:</label>
            <select 
              value={selectedAddressId}
              onChange={(e) => onSelectAddress(e.target.value)}
              className="w-full rounded-lg border p-2 text-sm"
            >
              <option value="" disabled>-- Pilih Alamat --</option>
              {addresses.map(a => (
                <option key={a.id} value={a.id}>
                  {a.receiver_name} - {a.full_address}, {a.city}
                </option>
              ))}
            </select>

            {selectedAddr && (
              <div className="rounded-lg bg-slate-50 p-3 text-sm">
                <p className="font-semibold">{selectedAddr.receiver_name}</p>
                <p className="text-slate-600">{selectedAddr.phone_number}</p>
                <p className="text-slate-600">{selectedAddr.full_address}, {selectedAddr.city}, {selectedAddr.postal_code}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2"><Truck className="h-5 w-5" /> Shipping Method</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold">Kurir</label>
            <select 
              value={selectedCourier}
              onChange={(e) => onSelectCourier(e.target.value)}
              className="mt-1 w-full rounded-lg border p-2 text-sm"
            >
              <option value="jne">JNE</option>
              <option value="pos">POS Indonesia</option>
              <option value="tiki">TIKI</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold">Layanan</label>
            <select 
              value={selectedService}
              onChange={(e) => onSelectService(e.target.value)}
              className="mt-1 w-full rounded-lg border p-2 text-sm"
              disabled={isLoadingRates || !shippingRates || shippingRates.costs.length === 0}
            >
              {isLoadingRates ? (
                <option value="">Loading...</option>
              ) : !shippingRates || shippingRates.costs.length === 0 ? (
                <option value="">Tidak ada layanan</option>
              ) : (
                shippingRates.costs.map((c) => (
                  <option key={c.service} value={c.service}>
                    {c.description} ({c.service}) - Rp {c.cost.toLocaleString("id-ID")}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingAddress;
