"use client"
import Image, { StaticImageData } from "next/image";
import { useState } from "react";

type ProductImage = {
  src: StaticImageData;
  alt: string;
};

type ProductGalleryProps = {
  images: ProductImage[];
};

const ProductGallery = ({ images }: ProductGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden bg-white rounded-2xl shadow">
        <Image
          src={selectedImage.src}
          alt="Main Product Image"
          width={700}
          height={700}
          className="h-auto w-full object-cover"
        />
      </div>
      <div className="flex gap-3 overflow-x-auto">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(image)}
            className={`
              overflow-hidden rounded-xl border-2
              ${
                selectedImage === image
                  ? "border-primary"
                  : "border-transparent"
              }
            `}
          >
            <Image
              src={image.src}
              alt={`Product ${index}`}
              width={90}
              height={90}
              className="h-20 w-20 object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
