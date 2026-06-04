import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type ProductCardProps = {
  title: string;
  price: string;
  brand: string;
  actionLabel?: string;
  className?: string;
  image?: ReactNode;
  onAction?: () => void;
};

const ProductCard = ({
  title,
  price,
  brand,
  actionLabel = "Buy Now",
  className,
  image,
  onAction,
}: ProductCardProps) => {
  return (
    <div
      className={cn(
        "flex flex-col bg-white drop-shadow-md px-6 py-8 rounded-2xl gap-4 transition hover:-translate-y-1 hover:shadow-lg",
        className
      )}
    >
      <div className="rounded-xl bg-dark/5 aspect-square overflow-hidden">
        {image ?? <div className="h-full w-full" />}
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">{title}</h3>
          <p className="font-bold">{price}</p>
        </div>
        <p className="text-sm text-dark/60">{brand}</p>
        <div className="flex justify-end">
          <Button variant="default" size="lg" onClick={onAction} className="w-35">
            {actionLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
