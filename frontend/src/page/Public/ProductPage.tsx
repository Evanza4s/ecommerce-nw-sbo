import Image from "next/image";
import Banner from "../../assets/images/banner_landingpage.png";
import { Button } from "@/components/ui/button";
import Searchbar from "@/components/forms/Searchbar";
import ProductCard from "@/components/product/ProductCard";
import PublicSection from "@/components/ui/PublicSection";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ProductPage = () => {
  return (
    <PublicSection className="px-0" contentClassName="flex flex-col gap-8">
      <div className="overflow-hidden rounded-3xl">
        <Image
          src={Banner}
          alt="Banner"
          priority
          className="h-auto w-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="ghost" className="rounded-xl px-6">
            Pria
          </Button>

          <Button variant="ghost" className="rounded-xl px-6">
            Wanita
          </Button>

          <Button variant="ghost" className="rounded-xl px-6">
            Anak
          </Button>

          <Button variant="ghost" className="rounded-xl px-6">
            Sport
          </Button>

          <Button variant="ghost" className="rounded-xl px-6">
            Casual
          </Button>
        </div>

        <div className="w-full lg:w-87.5">
          <Searchbar placeholder="Search product..." />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {[...Array(8)].map((_, index) => (
          <ProductCard
            key={index}
            title="Sepatu Nike"
            price="Rp 1.000.000"
            brand="Nike"
          />
        ))}
      </div>

      <div className="flex justify-center items-center">
        <Pagination>
          <PaginationContent className="gap-2">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                className="
          h-11 w-28 rounded-xl border border-black/10
          px-4 transition
          hover:bg-primary hover:text-white"
              />
            </PaginationItem>

            <PaginationItem>
              <PaginationLink
                href="#"
                isActive
                className="
          h-11 w-11 rounded-xl
          bg-primary text-white
          hover:bg-primary-divider
        "
              >
                1
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationLink
                href="#"
                className="
          h-11 w-11 rounded-xl
          border border-black/10
          hover:bg-black/5
        "
              >
                2
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationLink
                href="#"
                className="
          h-11 w-11 rounded-xl
          border border-black/10
          hover:bg-black/5
        "
              >
                3
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                href="#"
                className="
          h-11 w-28 rounded-xl border border-black/10
          px-4 transition
          hover:bg-primary hover:text-white
        "
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </PublicSection>
  );
};

export default ProductPage;
