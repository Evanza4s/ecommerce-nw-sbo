import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import type { ProductListItem } from "@/server/modules/products/types";
import { getImageUrl } from "@/lib/utils";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col bg-white drop-shadow-md px-6 py-8 rounded-2xl gap-4 animate-pulse",
        className
      )}
    >
      <div className="rounded-xl bg-dark/10 aspect-square" />
      <div className="flex flex-col gap-2">
        <div className="h-4 bg-dark/10 rounded w-3/4" />
        <div className="h-4 bg-dark/10 rounded w-1/2" />
        <div className="h-8 bg-dark/10 rounded mt-2" />
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: ProductListItem;
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  const hasDiscount =
    product.discount_price !== undefined &&
    product.discount_price > 0 &&
    product.discount_price < product.price;

  return (
    <Link
      href={`/products/${product.product_slug}`}
      className={cn(
        "flex flex-col bg-white drop-shadow-md px-6 py-8 rounded-2xl gap-4 transition hover:-translate-y-1 hover:shadow-lg cursor-pointer",
        className
      )}
    >
      {/* Image */}
      <div className="rounded-xl bg-dark/5 aspect-square overflow-hidden relative">
        {product.thumbnail_url ? (
          <Image
            src={getImageUrl(product.thumbnail_url) || ""}
            alt={product.product_name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-slate-300 text-sm">
            No Image
          </div>
        )}

        {product.status === "draft" && (
          <span className="absolute top-2 left-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
            Draft
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-2 right-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
            Habis
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 flex-1">
            {product.product_name}
          </h3>
        </div>

        <p className="text-xs text-dark/60">{product.brand}</p>

        {product.total_reviews > 0 && (
          <div className="flex items-center gap-1 mt-0.5">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-dark/60">
              {product.average_rating.toFixed(1)} ({product.total_reviews})
            </span>
          </div>
        )}

        <div className="flex flex-col mt-1">
          {hasDiscount ? (
            <>
              <span className="text-xs text-dark/40 line-through">
                {formatPrice(product.price)}
              </span>
              <span className="font-bold text-primary">
                {formatPrice(product.discount_price!)}
              </span>
            </>
          ) : (
            <span className="font-bold">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
