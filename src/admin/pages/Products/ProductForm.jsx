import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Save,
  ArrowLeft,
  Package,
  Tag,
  Box,
  IndianRupee,
  X,
} from "lucide-react";
import toastUtil from "@/shared/utils/toast";
import { useQueryClient } from "@tanstack/react-query";
import { categoryUrl, productUrl } from "@/config/adminApi";
import axios from "axios";
import { Button } from "@/admin/components/ui/Button";
import { Input } from "@/admin/components/ui/Input";
import { Label } from "@/admin/components/ui/Label";

import { productService } from "@/services/admin/api/productService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/admin/components/ui/Card";
import ConfirmationModal from "@/admin/components/ui/ConfirmationModal";

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);
  
  let navState = null;
  try {
    navState =
      window.history.state &&
      window.history.state.usr &&
      window.history.state.usr.product
        ? window.history.state.usr.product
        : null;
  } catch {
    navState = null;
  }

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    price: 0,
    discountedPrice: 0,
    unit: "",
    brand: "",
    discount: 0,
    stock: 0,
    description: "",
    status: "active",
    images: [],
    imagePreviews: [], 
    existingImages: [], 
  });

  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);
      const res = await axios.get(categoryUrl.getAllCategories); 
      setCategories(res.data.data || []);
    } catch (err) {
      console.error(err);
      toastUtil.error("Failed to load categories");
    } finally {
      setCategoryLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      if (navState) {
        setFormData({
          name: navState.name || "",
          sku: navState.sku || "",
          category: typeof navState.category === 'object' ? (navState.category._id || navState.category.id) : navState.category,
          price: navState.price || 0,
          discountedPrice: navState.discountedPrice || 0,
          unit: navState.unit || "",
          brand: navState.brand || "",
          discount: navState.discount || 0,
          stock: navState.stock || 0,
          description: navState.description || "",
          status: navState.status || "active",
          images: [],
          imagePreviews: Array.isArray(navState.image)
            ? navState.image.map((img) => img.url)
            : [],
          existingImages: Array.isArray(navState.image)
            ? navState.image.map((img) => img.url)
            : [],
        });
      } else {
        const fetchProduct = async () => {
          try {
            const product = await productService.getProduct(id);
            setFormData({
              name: product.name,
              sku: product.sku || "",
              category: typeof product.category === 'object' ? (product.category._id || product.category.id) : product.category,
              price: product.price,
              discountedPrice: product.discountedPrice || 0,
              unit: product.unit || "",
              brand: product.brand || "",
              discount: product.discount || 0,
              stock: product.stock,
              description: product.description || "",
              status: product.status || "active",
              images: [],
              imagePreviews: Array.isArray(product.images)
                ? product.images.map((img) => img.url)
                : [],
              existingImages: Array.isArray(product.images)
                ? product.images.map((img) => img.url)
                : [],
            });
          } catch (error) {
            console.error(error);
            // toastUtil.error("Failed to fetch product details"); // Handled by apiClient if appropriate
            navigate("/admin/products");
          }
        };
        fetchProduct();
      }
    }
  }, [id, isEditMode, navigate, navState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      let updated = { ...prev, [name]: value };
      if (name === "price" || name === "discount") {
        const originalPrice = name === "price" ? Number(value) : Number(updated.price);
        const discountPercent = name === "discount" ? Number(value) : Number(updated.discount);
        const discountAmount = (discountPercent / 100) * originalPrice;
        updated.discountedPrice = Math.max(originalPrice - discountAmount, 0);
      }
      return updated;
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxImages = 5;

    const validFiles = files.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        toastUtil.error(`${file.name} is not a supported image type (JPG, PNG, WebP only)`);
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        toastUtil.error(`${file.name} must be smaller than 2MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length + formData.images.length > maxImages) {
      toastUtil.error(`You can upload a maximum of ${maxImages} images`);
      return;
    }

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...validFiles],
      imagePreviews: [...prev.imagePreviews, ...newPreviews],
    }));
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => {
      const newImages = prev.images.filter((_, i) => i !== index);
      const newPreviews = prev.imagePreviews.filter((_, i) => i !== index);
      return { ...prev, images: newImages, imagePreviews: newPreviews };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toastUtil.error("Product name is required");
    if (!formData.category) return toastUtil.error("Please select a category");
    if (formData.images.length === 0 && formData.existingImages.length === 0) {
      return toastUtil.error("Please upload at least one product image");
    }
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    setIsLoading(true);

    try {
      const fd = new FormData();
      fd.append('name', formData.name.trim());
      fd.append('sku', formData.sku.trim());
      fd.append('category', formData.category);
      fd.append('unit', formData.unit.trim());
      fd.append('brand', formData.brand.trim());
      fd.append('description', formData.description.trim());
      fd.append('status', formData.status);
      fd.append('price', Number(formData.price));
      fd.append('discount', Number(formData.discount));
      fd.append('discountedPrice', Number(formData.discountedPrice));
      fd.append('stock', Number(formData.stock));

      if (Array.isArray(formData.images)) {
        formData.images.forEach((file) => {
          if (file instanceof File) {
            fd.append("images", file);
          }
        });
      }

      if (Array.isArray(formData.existingImages)) {
        formData.existingImages.forEach((url) => {
          if (typeof url === "string") {
            fd.append("existingImages", url);
          }
        });
      }

      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (isEditMode) {
        await axios.put(`${productUrl.updateProduct}/${id}`, fd, config);
        toastUtil.success("Product updated successfully");
      } else {
        await axios.post(productUrl.createProduct, fd, config);
        toastUtil.success("Product created successfully");
      }

      await queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/admin/products");
    } catch (err) {
      console.error("Submission Error:", err);
      // Detailed error handling is in apiClient, but we can provide context here
      toastUtil.error(err.response?.data?.message || "Failed to save product");
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div
      className="max-w-7xl mx-auto space-y-4 sm:space-y-6 min-h-screen"
      style={{
        padding: "10px",
        background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)",
      }}
    >
      <Button
        variant="ghost"
        className="pl-0 text-gray-500 hover:text-gray-900 text-sm"
        onClick={() => navigate("/admin/products")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        <span>Back to Products</span>
      </Button>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          {isEditMode ? "Edit Product" : "Add New Product"}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>Enter the basic information for the product.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2 text-sm">
                  <Label htmlFor="name">Product Name<span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="e.g. Paracetamol 500mg"
                    value={formData.name}
                    onChange={handleChange}
                    icon={Package}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="unit">Unit<span className="text-red-500">*</span></Label>
                    <Input
                      id="unit"
                      name="unit"
                      required
                      placeholder="e.g. 500mg, 1L"
                      value={formData.unit}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="brand">Brand<span className="text-red-500">*</span></Label>
                    <Input
                      id="brand"
                      name="brand"
                      required
                      placeholder="e.g. Cipla"
                      value={formData.brand}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="sku">SKU<span className="text-red-500">*</span></Label>
                    <Input
                      id="sku"
                      name="sku"
                      required
                      className="font-mono"
                      placeholder="e.g. MED-001"
                      value={formData.sku}
                      onChange={handleChange}
                      icon={Tag}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category<span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <select
                        id="category"
                        name="category"
                        required
                        disabled={categoryLoading}
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.category}
                        onChange={handleChange}
                      >
                        <option value="">{categoryLoading ? "Loading..." : "Select Category"}</option>
                        {categories.map((cat) => (
                          <option key={cat._id || cat.id} value={cat._id || cat.id}>
                            {cat.name || cat}
                          </option>
                        ))}
                      </select>
                      {categoryLoading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status<span className="text-red-500">*</span></Label>
                  <select
                    id="status"
                    name="status"
                    required
                    className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description<span className="text-red-500">*</span></Label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    required
                    className="flex min-h-[100px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Product detailed description..."
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (₹)<span className="text-red-500">*</span></Label>
                  <Input
                    id="price"
                    type="number"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    icon={IndianRupee}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    name="discount"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.discount}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="discountedPrice">Discounted Price (₹)</Label>
                  <Input
                    id="discountedPrice"
                    type="number"
                    value={formData.discountedPrice}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stock">Stock<span className="text-red-500">*</span></Label>
                  <Input
                    id="stock"
                    type="number"
                    name="stock"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    icon={Box}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
                <CardDescription>Upload at least one product image.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center cursor-pointer transition hover:border-emerald-600 hover:bg-emerald-50/50">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="p-3 bg-white rounded-full shadow-sm">
                    <Save className="w-5 h-5 text-emerald-600 rotate-180" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">Click to upload or drag & drop</p>
                  <p className="text-xs text-gray-500">JPG, PNG, WebP (Max 5 images)</p>
                </label>

                {formData.imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {formData.imagePreviews.map((url, idx) => (
                      <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border">
                        <img src={url} alt="" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {idx === 0 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-emerald-600 text-white text-[10px] py-0.5 text-center">
                            Main Image
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </form>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        title={isEditMode ? "Update Product" : "Create Product"}
        message={`Are you sure you want to ${isEditMode ? "update" : "create"} this product?`}
        confirmText={isEditMode ? "Update" : "Create"}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProductForm;
