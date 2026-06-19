"use client";
import { useProducts } from "@/hooks/useProducts";
import ProductCard, { ProductCardSkeleton } from "@/components/product/ProductCard";
import PublicSection from "@/components/ui/PublicSection";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const RecomendationPage = () => {
  const { products, isLoading } = useProducts({ page: 1, page_size: 8, status: "active" });

  return (
    <PublicSection title="Popular this Week" className="px-0">
      <div className="flex mt-5 px-6">
        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[
            Autoplay({
              delay: 2000,
              stopOnInteraction: true,
              stopOnMouseEnter: true,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {isLoading
              ? [...Array(4)].map((_, index) => (
                  <CarouselItem
                    key={`skeleton-${index}`}
                    className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <ProductCardSkeleton className="h-full" />
                  </CarouselItem>
                ))
              : products.map((product) => (
                  <CarouselItem
                    key={product.id}
                    className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <ProductCard
                      product={product}
                      className="h-full"
                    />
                  </CarouselItem>
                ))}
          </CarouselContent>
          <CarouselPrevious className="h-12 w-12 rounded-2xl border-none bg-white shadow-lg transition hover:bg-primary hover:text-white" />
          <CarouselNext className="h-12 w-12 rounded-2xl border-none bg-white shadow-lg transition hover:bg-primary hover:text-white" />
        </Carousel>
      </div>
    </PublicSection>
  );
};

export default RecomendationPage;
