"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, X } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import { adminProductsApi } from "@/server/modules/products/api";
import type { ProductDetail } from "@/server/modules/products/types";
import { formatCurrency } from "@/lib/admin";

interface ProductViewModalProps {
  productId: string | null;
  onClose: () => void;
}

export function ProductViewModal({ productId, onClose }: ProductViewModalProps) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      return;
    }

    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await adminProductsApi.getById(productId);
        if (res.data) {
          setProduct(res.data);
        } else {
          setError("Produk tidak ditemukan.");
        }
      } catch (err: any) {
        setError(err?.message || "Terjadi kesalahan saat memuat data produk.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return (
    <Dialog open={!!productId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl overflow-hidden p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Detail Produk</DialogTitle>
        </DialogHeader>

        <div className="p-6">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm">Memuat rincian produk...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex h-64 items-center justify-center text-rose-500">
              <p>{error}</p>
            </div>
          ) : product ? (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Image Section */}
              <div className="flex flex-col gap-4">
                <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted">
                  {product.thumbnail_url ? (
                    <Image
                      src={getImageUrl(product.thumbnail_url) || ""}
                      alt={product.product_name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground bg-slate-50">
                      No Image Available
                    </div>
                  )}
                </div>
                {/* Thumbnails grid if images exist */}
                {product.images && product.images.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {product.images.map((img) => (
                      <div key={img.id} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border">
                        <Image
                          src={img.image_url}
                          alt="Product detail"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Detail Section */}
              <div className="flex flex-col gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold tracking-tight">{product.product_name}</h2>
                    <AdminStatusBadge status={product.status as any} />
                  </div>
                  <p className="text-lg font-semibold text-primary">
                    {formatCurrency(product.price)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-4 text-sm">
                  <div>
                    <p className="font-medium text-muted-foreground">Brand</p>
                    <p>{product.brand || "-"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Kategori</p>
                    <p>{product.category?.category_name || "-"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Stok</p>
                    <p>{product.stock}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Berat</p>
                    <p>{product.weight} gram</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-muted-foreground mb-1">Deskripsi</h3>
                  <div 
                    className="text-sm prose prose-sm max-w-none text-slate-700 max-h-32 overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: product.description || "Tidak ada deskripsi." }}
                  />
                </div>

                {product.variants && product.variants.length > 0 && (
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-1">Varian</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((v) => (
                        <div key={v.id} className="rounded-md border px-2 py-1 text-xs bg-white">
                          <span className="font-medium">{v.color}</span> - {v.size} 
                          {v.price_adjustment ? ` (+${formatCurrency(v.price_adjustment)})` : ""}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
