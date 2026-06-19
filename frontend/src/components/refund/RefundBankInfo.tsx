import React from "react";
import { Input } from "@/components/ui/input";

interface RefundBankInfoProps {
  bankName: string;
  setBankName: (val: string) => void;
  accountNumber: string;
  setAccountNumber: (val: string) => void;
  accountHolder: string;
  setAccountHolder: (val: string) => void;
}

const RefundBankInfo = ({
  bankName, setBankName,
  accountNumber, setAccountNumber,
  accountHolder, setAccountHolder
}: RefundBankInfoProps) => {
  return (
    <section className="mt-6">
      <h3 className="mb-3 font-semibold text-slate-800">Akun Rekening Pengembalian Dana</h3>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="flex flex-col text-sm text-dark/70">
          <span className="mb-2 font-medium">Nama Bank</span>
          <Input
            name="bankName"
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            placeholder="Contoh: BCA, Mandiri, BNI"
          />
        </label>

        <label className="flex flex-col text-sm text-dark/70">
          <span className="mb-2 font-medium">Nomor Rekening</span>
          <Input
            name="accountNumber"
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="Nomor Rekening"
          />
        </label>

        <label className="flex flex-col text-sm text-dark/70">
          <span className="mb-2 font-medium">Nama Pemilik Rekening</span>
          <Input
            name="accountHolder"
            type="text"
            value={accountHolder}
            onChange={(e) => setAccountHolder(e.target.value)}
            placeholder="Nama Pemilik"
          />
        </label>
      </div>
    </section>
  );
};

export default RefundBankInfo;
