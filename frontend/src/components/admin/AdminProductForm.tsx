"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Plus, Star, Trash2, X } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { useCreateProduct, useUpdateProduct, useAdminProductDetail, useUploadProductImage } from "@/hooks/useAdminProducts";

import AdminPanelCard from "@/components/admin/AdminPanelCard";
import { InputField, InputGroup } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateProductRequest, UpdateProductRequest } from "@/server";

type SpecItem = { id: string; label: string; value: string };
type SizeChartItem = { id: string; size: string; length: string };

type ProductFormData = {
  name: string;
  slug: string;
  category: string;
  brand: string;
  gender: string;
  material: string;
  stock: string;
  weight: string;
  price: string;
  discount_price: string;
  seo_title: string;
  seo_description: string;
  status: "active" | "draft";
  description: string;
  sizes: string[];
  colors: string[];
  specifications: SpecItem[];
  sizeChart: SizeChartItem[];
};

interface AdminProductFormProps {
  mode: "create" | "edit";
  productId?: string;
}

const initialFormData: ProductFormData = {
  name: "",
  slug: "",
  category: "",
  brand: "",
  gender: "",
  material: "",
  stock: "",
  weight: "",
  price: "",
  discount_price: "",
  seo_title: "",
  seo_description: "",
  status: "draft",
  description: "",
  sizes: [],
  colors: [],
  specifications: [{ id: "spec-0", label: "", value: "" }],
  sizeChart: [{ id: "size-0", size: "", length: "" }],
};

const editFormData: ProductFormData = {
  name: "NWV Hoodie",
  slug: "nwv-hoodie",
  category: "Men",
  brand: "NWV",
  gender: "unisex",
  material: "Cotton Fleece",
  stock: "20",
  weight: "500",
  price: "300000",
  discount_price: "250000",
  seo_title: "NWV Hoodie Original",
  seo_description: "Premium hoodie untuk daily wear",
  status: "active",
  description:
    "Premium hoodie untuk daily wear dengan material nyaman dan potongan regular fit.",
  sizes: ["M", "L", "XL"],
  colors: ["#111827", "#d1d5db"],
  specifications: [
    { id: "spec-0", label: "Material", value: "Cotton Fleece" },
    { id: "spec-1", label: "Fit", value: "Regular" },
  ],
  sizeChart: [
    { id: "size-0", size: "M", length: "68 cm" },
    { id: "size-1", size: "L", length: "71 cm" },
  ],
};

const AdminProductForm = ({ mode, productId }: AdminProductFormProps) => {
  const router = useRouter();
  const { categories } = useCategories();
  const { create, isCreating } = useCreateProduct();
  const { update, isUpdating } = useUpdateProduct();
  const { product: existingProduct, isLoading: isLoadingProduct } = useAdminProductDetail(mode === "edit" ? (productId || "") : "");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const { upload } = useUploadProductImage();

  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("#000000");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [thumbnailIndex, setThumbnailIndex] = useState<number>(0);

  useEffect(() => {
    if (mode === "edit" && existingProduct) {
      setFormData({
        name: existingProduct.product_name || "",
        slug: existingProduct.product_slug || "",
        category: existingProduct.category_id || "",
        brand: existingProduct.brand || "",
        gender: existingProduct.gender || "",
        material: existingProduct.material || "",
        stock: existingProduct.stock?.toString() || "0",
        weight: existingProduct.weight?.toString() || "0",
        price: existingProduct.price?.toString() || "0",
        discount_price: existingProduct.discount_price?.toString() || "",
        seo_title: existingProduct.seo_title || "",
        seo_description: existingProduct.seo_description || "",
        status: existingProduct.status as "active" | "draft",
        description: existingProduct.description || "",
        sizes: Array.from(new Set(existingProduct.variants.map(v => v.size).filter(Boolean))),
        colors: Array.from(new Set(existingProduct.variants.map(v => v.color).filter(Boolean))),
        specifications: existingProduct.specifications.some(s => !s.spec_name.startsWith("Size Chart - "))
          ? existingProduct.specifications
            .filter(s => !s.spec_name.startsWith("Size Chart - "))
            .map(s => ({ id: s.id, label: s.spec_name, value: s.spec_value }))
          : [{ id: "spec-0", label: "", value: "" }],
        sizeChart: existingProduct.specifications.some(s => s.spec_name.startsWith("Size Chart - "))
          ? existingProduct.specifications
            .filter(s => s.spec_name.startsWith("Size Chart - "))
            .map(s => ({ id: s.id, size: s.spec_name.replace("Size Chart - ", ""), length: s.spec_value }))
          : [{ id: "size-0", size: "", length: "" }],
      });

      if (existingProduct.images && existingProduct.images.length > 0) {
        setImagePreviews(existingProduct.images.map((img) => img.image_url));
      } else if (existingProduct.thumbnail_url) {
        setImagePreviews([existingProduct.thumbnail_url]);
      }
    }
  }, [mode, existingProduct]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => {
        if (preview && !preview.startsWith("http")) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [imagePreviews]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setImageFiles((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);

    // Reset file input so same files can be selected again if needed
    event.target.value = '';
  };

  const removeImage = (index: number) => {
    // Note: In a full implementation, we should track existing images vs new files separately.
    // For now, this handles new files deletion properly if in create mode.
    if (mode === "create") {
      setImageFiles((prev) => prev.filter((_, i) => i !== index));
    } else {
      // In edit mode, if index is greater than or equal to existing images count, we can remove it from imageFiles
      const existingCount = imagePreviews.length - imageFiles.length;
      if (index >= existingCount) {
        setImageFiles((prev) => prev.filter((_, i) => i !== (index - existingCount)));
      }
    }

    setImagePreviews((prev) => {
      const newPreviews = prev.filter((_, i) => i !== index);
      if (prev[index] && !prev[index].startsWith("http")) {
        URL.revokeObjectURL(prev[index]);
      }
      return newPreviews;
    });

    if (thumbnailIndex === index) {
      setThumbnailIndex(0);
    } else if (thumbnailIndex > index) {
      setThumbnailIndex(thumbnailIndex - 1);
    }
  };

  const addSize = () => {
    const nextSize = sizeInput.trim();

    if (!nextSize || formData.sizes.includes(nextSize)) {
      return;
    }

    setFormData((current) => ({
      ...current,
      sizes: [...current.sizes, nextSize],
    }));
    setSizeInput("");
  };

  const removeSize = (size: string) => {
    setFormData((current) => ({
      ...current,
      sizes: current.sizes.filter((item) => item !== size),
    }));
  };

  const addColor = () => {
    if (formData.colors.includes(colorInput)) {
      return;
    }

    setFormData((current) => ({
      ...current,
      colors: [...current.colors, colorInput],
    }));
  };

  const removeColor = (color: string) => {
    setFormData((current) => ({
      ...current,
      colors: current.colors.filter((item) => item !== color),
    }));
  };

  const addSpecRow = () => {
    setFormData((current) => ({
      ...current,
      specifications: [
        ...current.specifications,
        { id: Date.now().toString(), label: "", value: "" },
      ],
    }));
  };

  const updateSpecRow = (id: string, field: "label" | "value", value: string) => {
    setFormData((current) => ({
      ...current,
      specifications: current.specifications.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeSpecRow = (id: string) => {
    setFormData((current) => ({
      ...current,
      specifications: current.specifications.filter((item) => item.id !== id),
    }));
  };

  const addSizeChartRow = () => {
    setFormData((current) => ({
      ...current,
      sizeChart: [
        ...current.sizeChart,
        { id: Date.now().toString(), size: "", length: "" },
      ],
    }));
  };

  const updateSizeChartRow = (
    id: string,
    field: "size" | "length",
    value: string
  ) => {
    setFormData((current) => ({
      ...current,
      sizeChart: current.sizeChart.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeSizeChartRow = (id: string) => {
    setFormData((current) => ({
      ...current,
      sizeChart: current.sizeChart.filter((item) => item.id !== id),
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!formData.category) {
      alert("Silakan pilih kategori!");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Prepare Payload
      const payload: Partial<CreateProductRequest | UpdateProductRequest> = {
        product_name: formData.name,
        product_slug: formData.slug || undefined,
        category_id: formData.category,
        brand: formData.brand || undefined,
        gender: (formData.gender as "male" | "female" | "unisex") || undefined,
        material: formData.material || undefined,
        stock: Number(formData.stock),
        weight: formData.weight ? Number(formData.weight) : undefined,
        price: Number(formData.price),
        discount_price: formData.discount_price ? Number(formData.discount_price) : undefined,
        seo_title: formData.seo_title || undefined,
        seo_description: formData.seo_description || undefined,
        status: formData.status,
        description: formData.description,
        is_active: formData.status === "active",
        specifications: [
          ...formData.specifications
            .filter((item) => item.label && item.value)
            .map((item) => ({
              spec_name: item.label,
              spec_value: item.value
            })),
          ...formData.sizeChart
            .filter((item) => item.size && item.length)
            .map((item) => ({
              spec_name: `Size Chart - ${item.size}`,
              spec_value: item.length
            }))
        ],
      };

      const variants: {
        color: string; size: string; sku: string; barcode: string; stock: number;
        weight: number; price_adjustment: number; is_active: boolean;
      }[] = [];
      const colorsToUse = formData.colors.length > 0 ? formData.colors : ["Default"];
      const sizesToUse = formData.sizes.length > 0 ? formData.sizes : ["Default"];

      const baseSku = formData.name.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 6);

      colorsToUse.forEach(color => {
        sizesToUse.forEach(size => {
          const colorCode = color === "Default" ? "" : color.replace("#", "").substring(0, 4).toUpperCase();
          const sizeCode = size === "Default" ? "" : size.toUpperCase().replace(/[^A-Z0-9]/g, '');
          const skuParts = [baseSku || "PRD"];
          if (colorCode) skuParts.push(colorCode);
          if (sizeCode) skuParts.push(sizeCode);

          // Add a random string to ensure absolute uniqueness and avoid DB constraint errors
          const uniqueId = Math.random().toString(36).substring(2, 6).toUpperCase();
          const finalSku = skuParts.join('-') + '-' + uniqueId;

          variants.push({
            color: color === "Default" ? "" : color,
            size: size === "Default" ? "" : size,
            sku: finalSku,
            barcode: "",
            stock: Number(formData.stock),
            weight: Number(formData.weight) || 0,
            price_adjustment: 0,
            is_active: true
          });
        });
      });

      // @ts-ignore
      payload.variants = variants;

      let newOrUpdatedProduct;

      if (mode === "create") {
        newOrUpdatedProduct = await create(payload as any);
      } else if (mode === "edit" && productId) {
        newOrUpdatedProduct = await update(productId, payload as any);
      }

      if (imageFiles.length > 0 && newOrUpdatedProduct?.id) {
        console.log("Uploading Images for product ID:", newOrUpdatedProduct.id);

        // Upload sequentially to ensure order and avoid race conditions 
        // with the backend auto-thumbnail logic.
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];

          // Determine if this new file should be the thumbnail
          let isThumbnail = false;
          if (mode === "create") {
            isThumbnail = i === thumbnailIndex;
          } else {
            // In edit mode, thumbnailIndex might point to an existing image.
            // If it points to a new file, it means: thumbnailIndex >= existingCount
            const existingCount = imagePreviews.length - imageFiles.length;
            isThumbnail = thumbnailIndex === (existingCount + i);
          }

          await upload(newOrUpdatedProduct.id, file, isThumbnail, i);
        }
      }

      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan produk. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (mode === "edit" && isLoadingProduct) {
    return <div className="p-8 text-center animate-pulse">Memuat data produk...</div>;
  }

  return (
    <AdminPanelCard>
      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-3">
            <TabsTrigger value="basic">1. Basic Info</TabsTrigger>
            <TabsTrigger value="variants">2. Variants</TabsTrigger>
            <TabsTrigger value="specs">3. Specifications</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <InputGroup cols={2}>
              <InputField
                label="Product Name"
                name="name"
                value={formData.name ?? ""}
                onChange={handleInputChange}
                required
              />
              <InputField
                label="Product Slug (Optional)"
                name="slug"
                value={formData.slug ?? ""}
                onChange={handleInputChange}
                placeholder="Leave blank to auto-generate"
              />
            </InputGroup>

            <InputGroup cols={4}>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">Kategori</label>
                <select
                  name="category"
                  value={formData.category ?? ""}
                  onChange={handleInputChange}
                  required
                  className="rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                >
                  <option value="">-- Pilih Kategori --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <InputField
                label="Brand"
                name="brand"
                value={formData.brand ?? ""}
                onChange={handleInputChange}
              />
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">Gender</label>
                <select
                  name="gender"
                  value={formData.gender ?? ""}
                  onChange={handleInputChange}
                  className="rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                >
                  <option value="">-- Pilih Gender --</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>
              <InputField
                label="Material"
                name="material"
                value={formData.material ?? ""}
                onChange={handleInputChange}
              />
            </InputGroup>

            <InputGroup cols={4}>
              <InputField
                label="Price (IDR)"
                name="price"
                type="number"
                min="0"
                value={formData.price ?? ""}
                onChange={handleInputChange}
                required
              />
              <InputField
                label="Discount Price (IDR)"
                name="discount_price"
                type="number"
                min="0"
                value={formData.discount_price ?? ""}
                onChange={handleInputChange}
              />
              <InputField
                label="Stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock ?? ""}
                onChange={handleInputChange}
                required
              />
              <InputField
                label="Weight (gram)"
                name="weight"
                type="number"
                min="0"
                value={formData.weight ?? ""}
                onChange={handleInputChange}
              />
            </InputGroup>

            <InputGroup cols={3}>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">Status</label>
                <select
                  name="status"
                  value={formData.status ?? "draft"}
                  onChange={handleInputChange}
                  className="rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                >
                  <option value="draft">Save as Draft</option>
                  <option value="active">Publish (Active)</option>
                </select>
              </div>
              <InputField
                label="SEO Title"
                name="seo_title"
                value={formData.seo_title ?? ""}
                onChange={handleInputChange}
              />
              <InputField
                label="SEO Description"
                name="seo_description"
                value={formData.seo_description ?? ""}
                onChange={handleInputChange}
              />
            </InputGroup>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Product Images</label>
              <div className="flex flex-wrap gap-4 mt-2">
                {imagePreviews.map((preview, idx) => (
                  <div
                    key={idx}
                    onClick={() => setThumbnailIndex(idx)}
                    className={`group relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 transition ${thumbnailIndex === idx ? 'border-primary shadow-md' : 'border-slate-300 hover:border-primary/50'} bg-slate-50`}
                  >
                    <Image src={preview} alt={`Preview ${idx}`} fill className="object-cover" />

                    <div className="absolute left-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition">
                      <Star size={12} className={thumbnailIndex === idx ? "fill-yellow-400 text-yellow-400" : "text-white/70"} />
                    </div>

                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                      className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                    >
                      <X size={14} />
                    </button>

                    {thumbnailIndex === idx && (
                      <div className="absolute bottom-0 w-full bg-primary/90 py-0.5 text-center text-[10px] font-medium text-white backdrop-blur-sm">
                        Thumbnail
                      </div>
                    )}
                  </div>
                ))}

                {/* Upload Button */}
                <label className="flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 transition">
                  <ImagePlus className="text-slate-400" />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description ?? ""}
                onChange={handleInputChange}
                className="rounded-lg border border-input bg-background p-3 text-sm"
              />
            </div>
          </TabsContent>

          <TabsContent value="variants" className="space-y-8">
            <div>
              <h3 className="mb-4 text-lg font-semibold">Available Sizes</h3>
              <div className="mb-4 flex items-center gap-3">
                <input
                  type="text"
                  placeholder="e.g., 39, M, L, XL"
                  value={sizeInput}
                  onChange={(event) => setSizeInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addSize();
                    }
                  }}
                  className="w-64 rounded-lg border border-input px-4 py-2 text-sm"
                />
                <Button type="button" onClick={addSize} variant="secondary">
                  Add Size
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.sizes.map((size) => (
                  <div
                    key={size}
                    className="flex items-center gap-2 rounded-md border bg-slate-100 px-3 py-1.5 text-sm font-medium"
                  >
                    {size}
                    <button
                      type="button"
                      onClick={() => removeSize(size)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {formData.sizes.length === 0 ? (
                  <p className="text-sm text-slate-400">No sizes added yet.</p>
                ) : null}
              </div>
            </div>

            <hr />

            <div>
              <h3 className="mb-4 text-lg font-semibold">Available Colors</h3>
              <div className="mb-4 flex items-center gap-3">
                <input
                  type="color"
                  value={colorInput}
                  onChange={(event) => setColorInput(event.target.value)}
                  className="h-10 w-16 cursor-pointer rounded border p-1"
                />
                <span className="font-mono text-sm">{colorInput}</span>
                <Button type="button" onClick={addColor} variant="secondary">
                  Add Color
                </Button>
              </div>
              <div className="flex flex-wrap gap-3">
                {formData.colors.map((color) => (
                  <div
                    key={color}
                    className="group relative h-10 w-10 rounded-full border-2 border-slate-200"
                    style={{ backgroundColor: color }}
                  >
                    <button
                      type="button"
                      onClick={() => removeColor(color)}
                      className="absolute -right-2 -top-2 hidden h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white group-hover:flex"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {formData.colors.length === 0 ? (
                  <p className="text-sm text-slate-400">No colors added yet.</p>
                ) : null}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="specs" className="space-y-10">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">General Specifications</h3>
                <Button type="button" onClick={addSpecRow} variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Row
                </Button>
              </div>
              <div className="space-y-3 rounded-xl border bg-slate-50 p-4">
                {formData.specifications.map((spec) => (
                  <div key={spec.id} className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Label (e.g., Brand)"
                      value={spec.label}
                      onChange={(event) =>
                        updateSpecRow(spec.id, "label", event.target.value)
                      }
                      className="flex-1 rounded-md border p-2 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g., Nike)"
                      value={spec.value}
                      onChange={(event) =>
                        updateSpecRow(spec.id, "value", event.target.value)
                      }
                      className="flex-1 rounded-md border p-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpecRow(spec.id)}
                      className="rounded-md p-2 text-red-500 transition-colors hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Size Chart Table</h3>
                <Button
                  type="button"
                  onClick={addSizeChartRow}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Row
                </Button>
              </div>
              <div className="space-y-3 rounded-xl border bg-slate-50 p-4">
                {formData.sizeChart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="EU Size (e.g., 39)"
                      value={item.size}
                      onChange={(event) =>
                        updateSizeChartRow(item.id, "size", event.target.value)
                      }
                      className="flex-1 rounded-md border p-2 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Foot Length (e.g., 24.5 cm)"
                      value={item.length}
                      onChange={(event) =>
                        updateSizeChartRow(item.id, "length", event.target.value)
                      }
                      className="flex-1 rounded-md border p-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeSizeChartRow(item.id)}
                      className="rounded-md p-2 text-red-500 transition-colors hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end gap-4 border-t pt-6">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/products">Batal</Link>
          </Button>
          {activeTab !== "specs" ? (
            <Button
              type="button"
              onClick={() =>
                setActiveTab(activeTab === "basic" ? "variants" : "specs")
              }
            >
              Lanjut
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting || isCreating || isUpdating}>
              {isSubmitting || isCreating || isUpdating
                ? "Menyimpan..."
                : mode === "create"
                  ? "Simpan Produk"
                  : "Perbarui Produk"}
            </Button>
          )}
        </div>
      </form>
    </AdminPanelCard>
  );
};

export default AdminProductForm;
