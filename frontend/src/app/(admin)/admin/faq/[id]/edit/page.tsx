"use client";

import { useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import AdminFaqForm from "@/components/admin/AdminFaqForm";

export default function AdminFaqEditPage() {
  const params = useParams();
  const faqId = params.id as string;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center text-sm text-slate-500">
          <Link href="/admin/faq" className="hover:text-primary transition-colors">
            FAQ
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-slate-900 font-medium">Edit FAQ</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Edit FAQ
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Perbarui pertanyaan dan jawaban FAQ ini.
          </p>
        </div>
      </div>

      <AdminFaqForm mode="edit" faqId={faqId} />
    </div>
  );
}
