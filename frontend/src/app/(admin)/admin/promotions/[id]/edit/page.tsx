"use client"
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";

import VoucherForm from "@/components/admin/VoucherForm";
import { vouchersApi } from "@/server/index";
import { Voucher } from "@/server/modules/vouchers/types";

export default function PromotionEditPage() {
  const params = useParams();
  const router = useRouter();
  const voucherId = params.id as string;
  
  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!voucherId) return;

    const fetchVoucher = async () => {
      try {
        setIsLoading(true);
        const res = await vouchersApi.getById(voucherId);
        if (res.status === true && res.data) {
          setVoucher(res.data);
        } else {
          toast.error(res.message || "Failed to fetch voucher");
          router.push("/admin/promotions");
        }
      } catch (error: any) {
        toast.error(error.message || "An error occurred");
        router.push("/admin/promotions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVoucher();
  }, [voucherId, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

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
          <span className="text-zinc-900 font-medium">Edit</span>
        </div>
        
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Edit Voucher</h1>
          <p className="text-zinc-500 mt-1">Update details for voucher code {voucher?.code}</p>
        </div>
      </div>

      {voucher && <VoucherForm initialData={voucher} isEditing={true} />}
    </div>
  );
}
