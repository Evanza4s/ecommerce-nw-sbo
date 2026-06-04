"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import QuantitySelector from "@/components/product/QuantitySelector";
import { cn } from "@/lib/utils";

type ProductInfoProps = {
  title: string;
  price: string;
  description?: string;
  sizes?: string[];
  colors?: string[];
};

const ProductInfo = ({
  title,
  price,
  description,
  sizes = [],
  colors = [],
}: ProductInfoProps) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    colors.length ? colors[0] : null
  );

  return (
    <div className="flex flex-col gap-6 mt-8">
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="text-2xl font-semibold text-primary">{price}</p>
      {description ? <p className="text-sm text-dark/60">{description}</p> : null}

      {sizes.length > 0 && (
        <div>
          <h3 className="mb-3 font-semibold">Size</h3>
          <div className="flex gap-3 flex-wrap">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "h-12 w-12 rounded-xl border font-semibold",
                  selectedSize === size
                    ? "border-primary bg-primary text-white"
                    : "border-black/10"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {colors.length > 0 && (
        <div>
          <h3 className="mb-3 font-semibold">Color</h3>
          <div className="flex gap-3">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={cn(
                  "h-10 w-10 rounded-full border-2",
                  selectedColor === color ? "border-primary" : "border-transparent"
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="mb-3 font-semibold">Quantity</h3>
        <QuantitySelector />
      </div>

      <div className="mt-4 flex gap-4">
        <Button>Add To Cart</Button>
        <Button variant={"secondary"}>Buy Now</Button>
      </div>
    </div>
  );
};

export default ProductInfo;
