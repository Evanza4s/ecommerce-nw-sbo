import AdminFaqForm from "@/components/admin/AdminFaqForm";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function AdminFaqCreatePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center text-sm text-slate-500">
          <Link href="/admin/faq" className="hover:text-primary transition-colors">
            FAQ
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-slate-900 font-medium">Tambah Baru</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Tambah FAQ Baru
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Buat pertanyaan dan jawaban baru untuk ditampilkan di halaman FAQ.
          </p>
        </div>
      </div>

      <AdminFaqForm mode="create" />
    </div>
  );
}
