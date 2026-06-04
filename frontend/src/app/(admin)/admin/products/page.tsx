"use client"
import Image from "next/image";
import AdminRowActions from "@/components/admin/AdminRowActions";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminTablePage from "@/components/admin/AdminTablePage";
import { adminProducts } from "@/data/admin-dashboard";
import { formatCurrency } from "@/lib/admin";

export default function ProductsPage() {
  return (
    <AdminTablePage
      title="Products"
      description="Pantau performa katalog, stok, dan status publikasi produk."
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Products" },
      ]}
      data={adminProducts}
      getRowKey={(product) => product.id}
      searchPlaceholder="Search by product name or category..."
      searchBy={(product) => `${product.name} ${product.category} ${product.id}`}
      action={{ label: "Create Product", href: "/admin/products/create" }}
      filters={[
        {
          label: "Category",
          value: "category",
          options: [
            { label: "All Categories", value: "all" },
            { label: "Men", value: "Men" },
            { label: "Sport", value: "Sport" },
            { label: "Accessories", value: "Accessories" },
          ],
          getValue: (product) => product.category,
        },
        {
          label: "Status",
          value: "status",
          options: [
            { label: "All Status", value: "all" },
            { label: "Active", value: "active" },
            { label: "Draft", value: "draft" },
            { label: "Archived", value: "archived" },
          ],
          getValue: (product) => product.status,
        },
      ]}
      columns={[
        { header: "ID", cell: (product) => product.id },
        {
          header: "Image",
          cell: (product) => (
            <div className="relative h-12 w-12 overflow-hidden rounded-md border bg-muted">
              <Image
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
                width={48}
                height={48}
              />
            </div>
          ),
        },
        { header: "Product Name", cell: (product) => product.name },
        { header: "Category", cell: (product) => product.category },
        {
          header: "Stock",
          cell: (product) => (
            <span className={product.stock <= 5 ? "font-medium text-red-500" : ""}>
              {product.stock}
            </span>
          ),
        },
        { header: "Price", cell: (product) => formatCurrency(product.price) },
        {
          header: "Status",
          cell: (product) => <AdminStatusBadge status={product.status} />,
        },
        {
          header: "Actions",
          className: "w-20 text-right",
          cell: (product) => (
            <div className="flex justify-end">
              <AdminRowActions
                actions={[
                  { label: "View Product", href: `/admin/products/${product.id}` },
                  { label: "Edit Product", href: `/admin/products/${product.id}/edit` },
                ]}
              />
            </div>
          ),
        },
      ]}
      emptyMessage="No products found."
    />
  );
}
