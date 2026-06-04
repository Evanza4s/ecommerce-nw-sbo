import PublicSection from "@/components/ui/PublicSection";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Pastikan path import ini sesuai dengan project Anda

const generalSpecification = [
  { label: "Product Name", value: "Nike Air Force 1 '07" },
  { label: "Brand", value: "Nike" },
  { label: "Category", value: "Sneakers" },
  { label: "Style", value: "Lifestyle" },
  { label: "Upper Material", value: "Premium Leather" },
  { label: "Midsole", value: "Nike Air Cushioning" },
  { label: "Outsole", value: "Rubber" },
  { label: "Gender", value: "Unisex" },
  { label: "Weight", value: "± 420 g / shoe" },
];

const sizeChart = [
  { size: "39", length: "24.5 cm" },
  { size: "40", length: "25 cm" },
  { size: "41", length: "26 cm" },
  { size: "42", length: "26.5 cm" },
  { size: "43", length: "27.5 cm" },
  { size: "44", length: "28 cm" },
];

const ProductSpecification = () => {
  return (
    <PublicSection className="px-0 py-0">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Product Specification</h2>
        <div className="mt-3 h-1 w-72 bg-slate-900" />
      </div>

      {/* Content */}
      <div className="grid gap-8 lg:grid-cols-2">
        
        {/* General */}
        <div className="rounded-3xl bg-primary/10 p-6">
          <h3 className="mb-6 text-2xl font-bold text-slate-900">General</h3>
          
          <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <Table>
              <TableBody>
                {generalSpecification.map((item) => (
                  <TableRow 
                    key={item.label} 
                    className="hover:bg-transparent" // Menghilangkan efek hover abu-abu bawaan
                  >
                    <TableCell className="w-1/2 py-4 pl-5 font-medium text-slate-500">
                      {item.label}
                    </TableCell>
                    <TableCell className="w-1/2 py-4 pr-5 text-right font-semibold text-slate-900">
                      {item.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Size Chart */}
        <div className="rounded-3xl bg-primary/10 p-6">
          <h3 className="mb-6 text-2xl font-bold text-slate-900">Size Chart</h3>

          <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow className="hover:bg-slate-50">
                  <TableHead className="w-1/2 py-4 pl-5 font-semibold text-slate-900">
                    EU Size
                  </TableHead>
                  <TableHead className="w-1/2 py-4 pr-5 text-right font-semibold text-slate-900">
                    Foot Length
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sizeChart.map((item) => (
                  <TableRow 
                    key={item.size}
                    className="hover:bg-slate-50/50"
                  >
                    <TableCell className="py-4 pl-5 font-semibold text-slate-900">
                      {item.size}
                    </TableCell>
                    <TableCell className="py-4 pr-5 text-right text-slate-600">
                      {item.length}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </PublicSection>
  );
};

export default ProductSpecification;