"use client";

import React, { useState } from "react";
import RefundEvidanceUpload from "./RefundEvidanceUpload";
import RefundBankInfo from "./RefundBankInfo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { refundsApi } from "@/server/modules/refunds/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import type { Order } from "@/server/modules/orders/types";
import { Loader2 } from "lucide-react";

interface FormRefundProps {
  order: Order;
}

const FormRefund = ({ order }: FormRefundProps) => {
  const router = useRouter();
  const [reason, setReason] = useState("damaged");
  const [description, setDescription] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evidenceUrls, setEvidenceUrls] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      toast.error("Silakan pilih alasan refund.");
      return;
    }
    if (!description) {
      toast.error("Silakan berikan deskripsi penjelasan kendala produk.");
      return;
    }

    setIsSubmitting(true);
    try {
      const fullReasonText = [
        `Alasan: ${reason}`,
        `Deskripsi: ${description}`,
        bankName && `Bank: ${bankName}`,
        accountNumber && `No. Rekening: ${accountNumber}`,
        accountHolder && `Atas Nama: ${accountHolder}`
      ].filter(Boolean).join(" | ");

      const finalEvidenceUrl = evidenceUrls.length > 0 
        ? JSON.stringify(evidenceUrls) 
        : "https://placehold.co/600x400?text=Evidence";

      await refundsApi.create({
        order_id: order.id,
        reason: fullReasonText,
        evidence_url: finalEvidenceUrl
      });

      toast.success("Pengajuan refund berhasil dikirim!");
      router.push(`/account/refunds/${order.id}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Gagal mengirim pengajuan refund.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const firstItemName = order.Items?.[0]?.ProductVariantRef?.ProductRef?.product_name || "Produk NWV";

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-md border border-slate-100" aria-labelledby="refund-form-heading">
      <h2 id="refund-form-heading" className="mb-6 text-xl font-bold text-slate-800">
        Informasi Refund
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col text-sm text-dark/70">
          <span className="mb-2 font-medium text-slate-700">Nama Penerima</span>
          <Input
            name="fullName"
            type="text"
            readOnly
            value={order.AddressRef?.receiver_name || ""}
            className="bg-slate-50 cursor-not-allowed"
          />
        </label>

        <label className="flex flex-col text-sm text-dark/70">
          <span className="mb-2 font-medium text-slate-700">Nomor Order</span>
          <Input
            name="orderNumber"
            type="text"
            readOnly
            value={order.order_number}
            className="bg-slate-50 cursor-not-allowed"
          />
        </label>

        <label className="flex flex-col text-sm text-dark/70">
          <span className="mb-2 font-medium text-slate-700">Alasan Refund</span>
          <select
            name="refundReason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="rounded-xl border border-gray-200 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            <option value="damaged">Produk Rusak / Cacat</option>
            <option value="wrong-product">Produk Salah Kirim</option>
            <option value="missing-item">Barang Kurang / Hilang</option>
            <option value="wrong-size">Ukuran Tidak Sesuai</option>
          </select>
        </label>

        <label className="flex flex-col text-sm text-dark/70">
          <span className="mb-2 font-medium text-slate-700">Nama Produk</span>
          <Input
            name="productName"
            type="text"
            readOnly
            value={firstItemName}
            className="bg-slate-50 cursor-not-allowed"
          />
        </label>
      </div>

      <label className="mt-4 flex flex-col text-sm text-dark/70">
        <span className="mb-2 font-medium text-slate-700">Deskripsi Kendala</span>
        <Textarea
          name="description"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Jelaskan secara detail kendala yang dialami pada produk Anda..."
          className="resize-none"
        />
      </label>

      <RefundEvidanceUpload onUploadComplete={(urls) => setEvidenceUrls(urls)} />

      <RefundBankInfo
        bankName={bankName}
        setBankName={setBankName}
        accountNumber={accountNumber}
        setAccountNumber={setAccountNumber}
        accountHolder={accountHolder}
        setAccountHolder={setAccountHolder}
      />

      <div className="mt-8 flex flex-col gap-3">
        <Button
          className="w-full flex items-center justify-center gap-2"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Kirim Pengajuan Refund
        </Button>

        <Button
          variant="outline"
          className="w-full"
          type="button"
          onClick={() => router.push(`/orders/${order.id}`)}
        >
          Batal
        </Button>
      </div>
    </form>
  );
};

export default FormRefund;
