"use client";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import QuantitySelector from "@/components/product/QuantitySelector";
import { cn } from "@/lib/utils";
import type { ProductDetail, ProductVariant } from "@/server/modules/products/types";
import { ShoppingCart, Check } from "lucide-react";

import { useCart } from "@/components/cart/CartContext";
import { useRouter } from "next/navigation";


function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

type ProductInfoProps = {
  product: ProductDetail;
};

const ProductInfo = ({ product }: ProductInfoProps) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const availableSizes = useMemo(() => {
    return Array.from(new Set(product.variants.map((v) => v.size).filter(Boolean)));
  }, [product.variants]);

  const availableColors = useMemo(() => {
    return Array.from(new Set(product.variants.map((v) => v.color).filter(Boolean)));
  }, [product.variants]);

  const [selectedSize, setSelectedSize] = useState<string | null>(
    availableSizes.length > 0 ? availableSizes[0] : null
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(
    availableColors.length > 0 ? availableColors[0] : null
  );

  const currentVariant = useMemo(() => {
    if (!selectedSize && !selectedColor) return product.variants[0] || null;
    return (
      product.variants.find(
        (v) =>
          (!selectedSize || v.size === selectedSize) &&
          (!selectedColor || v.color === selectedColor)
      ) || null
    );
  }, [product.variants, selectedSize, selectedColor]);

  const basePrice = product.discount_price ? product.discount_price : product.price;
  const finalPrice = currentVariant ? basePrice + currentVariant.price_adjustment : basePrice;

  const currentStock = currentVariant ? currentVariant.stock : product.stock;

  const router = useRouter();

  const handleAddToCart = async () => {
    if (!currentVariant) return;
    await addToCart(currentVariant.id, quantity);
  };

  const handleBuyNow = async () => {
    if (!currentVariant) return;
    await addToCart(currentVariant.id, quantity);
    router.push('/checkout');
  };

  return (
    <div className="flex flex-col gap-6 mt-2 lg:mt-0">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl lg:text-4xl font-bold leading-tight">{product.product_name}</h1>
        <p className="text-dark/60 font-medium">Brand: {product.brand || "N/A"}</p>
      </div>

      <div className="flex flex-col">
        {product.discount_price && product.discount_price > 0 && product.discount_price < product.price ? (
          <>
            <p className="text-lg text-dark/40 line-through">
              {formatPrice(product.price)}
            </p>
            <p className="text-3xl font-semibold text-primary">
              {formatPrice(finalPrice)}
            </p>
          </>
        ) : (
          <p className="text-3xl font-semibold text-primary">
            {formatPrice(finalPrice)}
          </p>
        )}
      </div>

      {product.description && (
        <p className="text-sm text-dark/70 leading-relaxed whitespace-pre-wrap">
          {product.description}
        </p>
      )}

      {availableSizes.length > 0 && (
        <div className="flex flex-col gap-3 mt-2">
          <h3 className="font-semibold text-sm">Ukuran</h3>
          <div className="flex gap-3 flex-wrap">
            {availableSizes.map((size) => {
              const isAvailable = product.variants.some(
                (v) => v.size === size && (!selectedColor || v.color === selectedColor) && v.stock > 0
              );

              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  disabled={!isAvailable}
                  className={cn(
                    "h-11 min-w-[3rem] px-3 rounded-xl border font-semibold transition-colors",
                    selectedSize === size
                      ? "border-primary bg-primary text-white"
                      : "border-black/10 hover:border-black/30",
                    !isAvailable && "opacity-40 cursor-not-allowed bg-slate-50 line-through"
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {availableColors.length > 0 && (
        <div className="flex flex-col gap-3 mt-2">
          <h3 className="font-semibold text-sm">Warna</h3>
          <div className="flex gap-3 flex-wrap">
            {availableColors.map((color) => {
              const isAvailable = product.variants.some(
                (v) => v.color === color && (!selectedSize || v.size === selectedSize) && v.stock > 0
              );

              return (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  disabled={!isAvailable}
                  className={cn(
                    "h-10 w-10 rounded-full border-2 relative flex items-center justify-center transition-all",
                    selectedColor === color ? "border-primary scale-110" : "border-transparent shadow-sm",
                    !isAvailable && "opacity-40 cursor-not-allowed"
                  )}
                  style={{ backgroundColor: color }}
                  title={color}
                >
                  {selectedColor === color && (
                    <Check size={16} className={['#ffffff', '#fff'].includes(color.toLowerCase()) ? "text-black" : "text-white"} />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 mt-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Jumlah</h3>
          <span className="text-xs text-dark/60">Tersisa: <span className="font-semibold">{currentStock}</span></span>
        </div>
        <QuantitySelector value={quantity} onChange={setQuantity} max={currentStock} />
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <Button
          className="flex-1 h-12 gap-2"
          disabled={currentStock === 0 || !currentVariant}
          onClick={handleAddToCart}
        >
          <ShoppingCart size={18} />
          Tambah ke Keranjang
        </Button>
        <Button
          variant={"secondary"}
          className="flex-1 h-12"
          disabled={currentStock === 0 || !currentVariant}
          onClick={handleBuyNow}
        >
          Beli Sekarang
        </Button>
      </div>
    </div>
  );
};

export default ProductInfo;
