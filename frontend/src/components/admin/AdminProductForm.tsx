"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ImagePlus, Plus, Trash2, X } from "lucide-react";

import AdminPanelCard from "@/components/admin/AdminPanelCard";
import { InputField, InputGroup } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SpecItem = { id: string; label: string; value: string };
type SizeChartItem = { id: string; size: string; length: string };

type ProductFormData = {
  name: string;
  category: string;
  stock: string;
  price: string;
  status: "active" | "draft";
  description: string;
  sizes: string[];
  colors: string[];
  specifications: SpecItem[];
  sizeChart: SizeChartItem[];
};

interface AdminProductFormProps {
  mode: "create" | "edit";
}

const initialFormData: ProductFormData = {
  name: "",
  category: "",
  stock: "",
  price: "",
  status: "draft",
  description: "",
  sizes: [],
  colors: [],
  specifications: [{ id: "spec-0", label: "", value: "" }],
  sizeChart: [{ id: "size-0", size: "", length: "" }],
};

const editFormData: ProductFormData = {
  name: "NWV Hoodie",
  category: "Men",
  stock: "20",
  price: "300000",
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

const AdminProductForm = ({ mode }: AdminProductFormProps) => {
  const [formData, setFormData] = useState<ProductFormData>(
    mode === "edit" ? editFormData : initialFormData
  );
  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("#000000");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setImagePreview(URL.createObjectURL(file));
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
    setIsSubmitting(true);

    const payload = {
      ...formData,
      specifications: formData.specifications.filter(
        (item) => item.label.trim() !== ""
      ),
      sizeChart: formData.sizeChart.filter((item) => item.size.trim() !== ""),
    };

    console.log("Product payload:", payload);

    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Product ${mode === "create" ? "created" : "updated"} successfully.`);
    }, 1000);
  };

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
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <InputField
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              />
            </InputGroup>

            <InputGroup cols={3}>
              <InputField
                label="Stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleInputChange}
                required
              />
              <InputField
                label="Price (IDR)"
                name="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="rounded-lg border border-input bg-background px-4 py-3 text-sm"
                >
                  <option value="draft">Save as Draft</option>
                  <option value="active">Publish (Active)</option>
                </select>
              </div>
            </InputGroup>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Product Image</label>
              <div className="flex items-center gap-4">
                <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50">
                  {imagePreview ? (
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  ) : (
                    <ImagePlus className="text-slate-400" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
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

        <div className="mt-8 flex justify-end gap-3 border-t pt-6">
          <Button asChild variant="outline" type="button">
            <Link href="/admin/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancel
            </Link>
          </Button>
          {activeTab !== "specs" ? (
            <Button
              type="button"
              onClick={() =>
                setActiveTab(activeTab === "basic" ? "variants" : "specs")
              }
            >
              Next Step
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : mode === "create"
                  ? "Save Product"
                  : "Update Product"}
            </Button>
          )}
        </div>
      </form>
    </AdminPanelCard>
  );
};

export default AdminProductForm;
