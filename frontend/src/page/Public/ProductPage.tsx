"use client";

import Image from "next/image";
import Banner from "../../assets/images/banner_landingpage.png";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import ProductCard, { ProductCardSkeleton } from "@/components/product/ProductCard";
import PublicSection from "@/components/ui/PublicSection";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

// Gender filter options mapped to backend values
const GENDER_FILTERS = [
  { label: "Semua", value: "" },
  { label: "Pria", value: "male" },
  { label: "Wanita", value: "female" },
  { label: "Unisex", value: "unisex" },
];

const ProductPage = () => {
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const { products, pagination, isLoading, error, updateFilters, goToPage } =
    useProducts({ page: 1, page_size: 12, status: "active" });

  const { categories } = useCategories();

  // Search with basic debounce via state
  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value);
      updateFilters({ search: value, page: 1 });
    },
    [updateFilters]
  );

  const handleCategoryFilter = useCallback(
    (categoryId: string) => {
      setSelectedCategory(categoryId);
      updateFilters({ category_id: categoryId || undefined, page: 1 });
    },
    [updateFilters]
  );

  const handleGenderFilter = useCallback(
    (gender: string) => {
      setSelectedGender(gender);
      updateFilters({ gender: gender || undefined, page: 1 });
    },
    [updateFilters]
  );

  return (
    <PublicSection className="px-0" contentClassName="flex flex-col gap-8">
      {/* Banner */}
      <div className="overflow-hidden rounded-3xl">
        <Image
          src={Banner}
          alt="Banner"
          priority
          className="h-auto w-full object-cover"
        />
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 w-full">
          {/* Categories */}
          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <span className="text-sm font-semibold text-gray-500 whitespace-nowrap">Kategori:</span>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => handleCategoryFilter("")}
                className={cn(
                  "rounded-xl px-4 transition",
                  selectedCategory === "" &&
                    "bg-primary text-white hover:bg-primary/90 hover:text-white"
                )}
              >
                Semua
              </Button>
              {categories.map((c) => (
                <Button
                  key={c.id}
                  variant="ghost"
                  onClick={() => handleCategoryFilter(c.id)}
                  className={cn(
                    "rounded-xl px-4 transition",
                    selectedCategory === c.id &&
                      "bg-primary text-white hover:bg-primary/90 hover:text-white"
                  )}
                >
                  {c.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <span className="text-sm font-semibold text-gray-500 whitespace-nowrap">Gender:</span>
            <div className="flex flex-wrap items-center gap-2">
              {GENDER_FILTERS.map((f) => (
                <Button
                  key={f.value}
                  variant="ghost"
                  onClick={() => handleGenderFilter(f.value)}
                  className={cn(
                    "rounded-xl px-6 transition",
                    selectedGender === f.value &&
                      "bg-primary text-white hover:bg-primary/90 hover:text-white"
                  )}
                >
                  {f.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-87.5 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="search"
            placeholder="Cari produk..."
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex h-12 w-full items-center gap-3 rounded-xl border border-black/10 bg-white px-11 shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          : products.length > 0
          ? products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          : !isLoading && (
              <div className="col-span-full py-16 text-center text-dark/40">
                <p className="text-lg">Tidak ada produk ditemukan</p>
                <p className="text-sm mt-1">Coba ubah filter atau kata kunci pencarian</p>
              </div>
            )}
      </div>

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className="flex justify-center items-center">
          <Pagination>
            <PaginationContent className="gap-2">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.page > 1) goToPage(pagination.page - 1);
                  }}
                  className={cn(
                    "h-11 w-28 rounded-xl border border-black/10 px-4 transition hover:bg-primary hover:text-white",
                    pagination.page <= 1 && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>

              {Array.from({ length: pagination.total_pages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={pagination.page === i + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      goToPage(i + 1);
                    }}
                    className={cn(
                      "h-11 w-11 rounded-xl transition",
                      pagination.page === i + 1
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "border border-black/10 hover:bg-black/5"
                    )}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.page < pagination.total_pages)
                      goToPage(pagination.page + 1);
                  }}
                  className={cn(
                    "h-11 w-28 rounded-xl border border-black/10 px-4 transition hover:bg-primary hover:text-white",
                    pagination.page >= pagination.total_pages &&
                      "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </PublicSection>
  );
};

export default ProductPage;
