import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import ShippingMethod from "./ShippingMethod";
import OrderNote from "@/components/order/OrderNote";

const ShippingAddress = () => {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold">Shipping Address</h3>

        <Button variant={"ghost"} size={"sm"}>
          Add New Address
        </Button>
      </div>

      <div className="rounded-xl border p-4">
        <h3 className="text-lg text-dark font-semibold">
            Default Address
        </h3>
        <div className="rounded-xl border p-4 flex justify-between items-center">
                    <div>
          <h4 className="font-semibold">Home Address</h4>

          <p className="text-sm text-dark/70">Evanza Agusta Setiawan</p>

          <p className="text-sm text-dark/70">+62 81234567890</p>

          <p className="mt-2 text-sm">
            Jl. Contoh Alamat No.123, Jakarta, Indonesia
          </p>
        </div>
        <div className="flex gap-3">
            <Button variant={"outline"} size={"sm"} className="border-dark text-black hover:bg-light">
                <Edit />
            </Button>
            <Button variant={"destructive"} size={"sm"} className="border-dark text-white">
                <Trash2 />
            </Button>
        </div>
        </div>
      </div>

      <ShippingMethod />

      <OrderNote />
    </div>
  );
};

export default ShippingAddress;
