"use client"
import { useState } from "react";
import Image from "next/image";
import AdminRowActions from "@/components/admin/AdminRowActions";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminTablePage from "@/components/admin/AdminTablePage";
import { useAdminProducts, useDeleteProduct } from "@/hooks/useAdminProducts";
import { getImageUrl } from "@/lib/utils";
import { useCategories } from "@/hooks/useCategories";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { ProductViewModal } from "@/components/admin/ProductViewModal";
import type { ProductListItem } from "@/server/modules/products/types";

export default function ProductsPage() {
  const { products, isLoading, refetch } = useAdminProducts({ page_size: 100 });
  const { categories } = useCategories();
  const { remove } = useDeleteProduct(() => refetch());

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [viewProductId, setViewProductId] = useState<string | null>(null);

  const categoryOptions = [
    { label: "Semua Kategori", value: "all" },
    ...categories.map(c => ({ label: c.name, value: c.name }))
  ];

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await remove(productToDelete.id);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <AdminTablePage
        title="Produk"
        description="Pantau performa katalog, stok, dan status publikasi produk."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Produk" },
        ]}
        data={products}
        getRowKey={(product) => product.id}
        searchPlaceholder="Cari berdasarkan nama atau kategori..."
        searchBy={(product) => `${product.product_name} ${product.category?.category_name || ""} ${product.id}`}
        action={{ label: "Tambah Produk", href: "/admin/products/create" }}
        filters={[
          {
            label: "Kategori",
            value: "category",
            options: categoryOptions,
            getValue: (product) => product.category?.category_name || "Uncategorized",
          },
          {
            label: "Status",
            value: "status",
            options: [
              { label: "Semua Status", value: "all" },
              { label: "Active", value: "active" },
              { label: "Draft", value: "draft" },
              { label: "Archived", value: "archived" },
            ],
            getValue: (product) => product.status,
          },
        ]}
        columns={[
          {
            header: "Image",
            cell: (product) => (
              <div className="relative h-12 w-12 overflow-hidden rounded-md border bg-muted">
                {product.thumbnail_url ? (
                  <Image
                    src={getImageUrl(product.thumbnail_url) || ""}
                    alt={product.product_name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-[10px] text-muted-foreground bg-slate-100">No Img</div>
                )}
              </div>
            ),
          },
          { 
            header: "Product Name", 
            cell: (product) => (
              <div>
                <p className="font-medium">{product.product_name}</p>
                <p className="text-xs text-muted-foreground">{product.brand}</p>
              </div>
            )
          },
          { header: "Category", cell: (product) => product.category?.category_name || "-" },
          {
            header: "Stock",
            cell: (product) => (
              <span className={product.stock <= 5 ? "font-medium text-red-500" : ""}>
                {product.stock}
              </span>
            ),
          },
          { 
            header: "Price", 
            cell: (product) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(product.price)
          },
          {
            header: "Status",
            cell: (product) => <AdminStatusBadge status={product.status as any} />,
          },
          {
            header: "Actions",
            className: "w-20 text-right",
            cell: (product) => (
              <div className="flex justify-end">
                <AdminRowActions
                  actions={[
                    { 
                      label: "View Product", 
                      onClick: () => setViewProductId(product.id)
                    },
                    { label: "Edit Product", href: `/admin/products/${product.id}/edit` },
                    { 
                      label: "Hapus Produk", 
                      onClick: () => {
                        setProductToDelete(product as unknown as ProductListItem);
                        setIsDeleteModalOpen(true);
                      },
                      className: "text-red-600 focus:text-red-700" 
                    },
                  ]}
                />
              </div>
            ),
          },
        ]}
        emptyMessage="Tidak ada produk ditemukan."
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Hapus Produk"
        description={`Apakah Anda yakin ingin menghapus produk "${productToDelete?.product_name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        cancelText="Batal"
        isLoading={isDeleting}
      />

      <ProductViewModal 
        productId={viewProductId} 
        onClose={() => setViewProductId(null)} 
      />
    </>
  );
}
