"use client"
import Image from "next/image";
import { useState, useEffect } from "react";
import type { ProductImage } from "@/server/modules/products/types";
import { getImageUrl } from "@/lib/utils";

type ProductGalleryProps = {
  images: ProductImage[];
};

const ProductGallery = ({ images }: ProductGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null);

  useEffect(() => {
    if (images && images.length > 0) {
      setSelectedImage(images[0]);
    }
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <div className="overflow-hidden bg-white rounded-2xl shadow aspect-square flex items-center justify-center text-slate-300">
          No Image Available
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden bg-white rounded-2xl shadow aspect-square relative">
        {selectedImage && (
          <Image
            src={getImageUrl(selectedImage.image_url) || ""}
            alt="Main Product Image"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        )}
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {images.map((image) => (
          <button
            key={image.id}
            onClick={() => setSelectedImage(image)}
            className={`
              relative overflow-hidden rounded-xl border-2 flex-shrink-0 h-20 w-20
              ${
                selectedImage?.id === image.id
                  ? "border-primary"
                  : "border-transparent"
              }
            `}
          >
            <Image
              src={getImageUrl(image.image_url) || ""}
              alt="Product thumbnail"
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
