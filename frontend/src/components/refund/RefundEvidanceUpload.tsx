import React, { useState } from "react";
import { Input } from "@/components/ui/input";

interface RefundEvidanceUploadProps {
  onUploadComplete: (urls: string[]) => void;
}

const RefundEvidanceUpload = ({ onUploadComplete }: RefundEvidanceUploadProps) => {
  const [fileNames, setFileNames] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setFileNames(files.map(f => f.name));
      const urls: string[] = [];
      let loadedCount = 0;

      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            urls.push(reader.result);
          }
          loadedCount++;
          if (loadedCount === files.length) {
            onUploadComplete(urls);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  return (
    <div className="mt-6">
      <label htmlFor="refundEvidence" className="mb-3 block font-semibold text-slate-800">
        Upload Bukti Foto / Video
      </label>

      <div className="rounded-xl border-2 border-dashed p-8 text-center border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
        <p className="text-dark/60 text-sm">Pilih foto/video produk unboxing untuk mendukung pengajuan Anda.</p>

        <Input
          id="refundEvidence"
          name="refundEvidence"
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileChange}
          className="mt-4 w-full cursor-pointer"
          aria-describedby="refund-evidence-help"
        />
        {fileNames.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2 justify-center">
            {fileNames.map((name, idx) => (
              <span key={idx} className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                {name}
              </span>
            ))}
          </div>
        )}
        <p id="refund-evidence-help" className="mt-3 text-xs text-dark/50">
          Mendukung format JPG, PNG, atau MP4.
        </p>
      </div>
    </div>
  );
};

export default RefundEvidanceUpload;
