import PublicSection from "@/components/ui/PublicSection";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ProductDetail } from "@/server/modules/products/types";
import { useMemo } from "react";

type ProductSpecificationProps = {
  product: ProductDetail;
};

const ProductSpecification = ({ product }: ProductSpecificationProps) => {
  // Map general specifications from API
  const generalSpecification = useMemo(() => {
    const baseSpecs = [
      { label: "Kategori", value: product.category?.category_name || "-" },
      { label: "Merek", value: product.brand || "-" },
      { label: "Gender", value: product.gender === "male" ? "Pria" : product.gender === "female" ? "Wanita" : product.gender === "unisex" ? "Unisex" : "-" },
      { label: "Material", value: product.material || "-" },
      { label: "Berat", value: product.weight ? `${product.weight} gram` : "-" },
    ];

    // Add dynamic specifications from API (filter out size chart)
    const dynamicSpecs = product.specifications
      .filter((spec) => !spec.spec_name.startsWith("Size Chart - "))
      .map((spec) => ({
        label: spec.spec_name,
        value: spec.spec_value,
      }));

    return [...baseSpecs, ...dynamicSpecs];
  }, [product]);

  // Extract size chart from specifications
  const sizeChartList = useMemo(() => {
    const fromSpecs = product.specifications
      .filter((spec) => spec.spec_name.startsWith("Size Chart - "))
      .map((spec) => ({
        size: spec.spec_name.replace("Size Chart - ", ""),
        length: spec.spec_value,
      }));
      
    // If we have size chart defined in specs, use it.
    if (fromSpecs.length > 0) return fromSpecs;
    
    // Fallback to just listing sizes if no detailed size chart is provided
    return Array.from(new Set(product.variants.map((v) => v.size).filter(Boolean))).map(size => ({
      size,
      length: "-"
    }));
  }, [product.specifications, product.variants]);

  if (generalSpecification.length === 0 && sizeChartList.length === 0) {
    return null;
  }

  return (
    <PublicSection className="px-0 py-0">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Spesifikasi Produk</h2>
        <div className="mt-3 h-1 w-48 bg-slate-900" />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* General */}
        <div className="rounded-3xl bg-primary/5 p-6 border border-primary/10">
          <h3 className="mb-6 text-xl font-bold text-slate-900">General</h3>
          
          <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <Table>
              <TableBody>
                {generalSpecification.map((item, index) => (
                  <TableRow 
                    key={index} 
                    className="hover:bg-transparent"
                  >
                    <TableCell className="w-[40%] py-3 pl-5 font-medium text-slate-500 border-r">
                      {item.label}
                    </TableCell>
                    <TableCell className="w-[60%] py-3 pl-5 font-semibold text-slate-900">
                      {item.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Available Sizes List / Size Chart */}
        {sizeChartList.length > 0 && (
          <div className="rounded-3xl bg-primary/5 p-6 border border-primary/10">
            <h3 className="mb-6 text-xl font-bold text-slate-900">Panduan Ukuran (Size Chart)</h3>

            <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="hover:bg-slate-50">
                    <TableHead className="py-3 pl-5 font-semibold text-slate-900 border-r w-1/2">
                      Ukuran
                    </TableHead>
                    <TableHead className="py-3 pl-5 font-semibold text-slate-900 w-1/2">
                      Panjang/Lebar (cm)
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sizeChartList.map((item) => (
                    <TableRow 
                      key={item.size}
                      className="hover:bg-slate-50/50"
                    >
                      <TableCell className="py-3 pl-5 font-semibold text-slate-900 border-r">
                        {item.size}
                      </TableCell>
                      <TableCell className="py-3 pl-5 font-medium text-slate-500">
                        {item.length}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </PublicSection>
  );
};

export default ProductSpecification;