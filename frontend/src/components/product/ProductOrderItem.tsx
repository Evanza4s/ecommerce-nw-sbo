import Image, { StaticImageData } from "next/image";
import { cn } from "@/lib/utils";

type ProductOrderItemProps = {
  imageSrc: StaticImageData | string;
  title: string;
  variant: string;
  qty: number;
  price: string;
  totalPrice?: string;
  className?: string;
};

const ProductOrderItem = ({
  imageSrc,
  title,
  variant,
  qty,
  price,
  totalPrice,
  className,
}: ProductOrderItemProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-dark/10 pb-4 last:border-none last:pb-0 md:flex-row md:items-center",
        className
      )}
    >
      <div className="flex items-center gap-4 md:flex-1">
        <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-dark/5">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold">{title}</h4>
          <p className="text-sm text-dark/60">{variant}</p>
          <p className="mt-2 font-bold text-primary">{price}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 text-right md:w-44 md:flex-col md:items-end">
        <span className="text-sm text-dark/60">Qty: {qty}</span>
        <span className="font-bold">{totalPrice ?? price}</span>
      </div>
    </div>
  );
};

export default ProductOrderItem;
