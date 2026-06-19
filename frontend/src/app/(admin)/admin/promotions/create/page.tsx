"use client"
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import VoucherForm from "@/components/admin/VoucherForm";

export default function PromotionCreatePage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center text-sm text-zinc-500 mb-4">
          <Link href="/admin" className="hover:text-zinc-900 transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href="/admin/promotions" className="hover:text-zinc-900 transition-colors">
            Promotions
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-zinc-900 font-medium">Create</span>
        </div>
        
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Create Voucher</h1>
          <p className="text-zinc-500 mt-1">Create a new discount voucher or promotion code.</p>
        </div>
      </div>

      <VoucherForm />
    </div>
  );
}
