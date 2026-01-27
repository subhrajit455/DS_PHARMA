import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Save,
  ArrowLeft,
  Package,
  Tag,
  DollarSign,
  Box,
  IndianRupee,
} from "lucide-react";
import { toast } from "react-hot-toast";
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

import useDataStore from "@/store/useDataStore";

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = window.location;
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
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
const [categories, setCategories] = useState([]);
const [categoryLoading, setCategoryLoading] = useState(false);

console.log("Categories:");
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
      console.log("Fetched categories:", res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories");
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
          category: navState.category || "",
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
              category: product.category,
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
            toast.error("Failed to fetch product details");
            navigate("/admin/products");
          }
        };
        fetchProduct();
        fetchCategories();
      }
    }
  }, [id, isEditMode, navigate]);




  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      let updated = { ...prev, [name]: value };
      // Auto-calculate discountedPrice if price or discount changes
      if (name === "price" || name === "discount") {
        const originalPrice =
          name === "price" ? Number(value) : Number(updated.price);
        const discountPercent =
          name === "discount" ? Number(value) : Number(updated.discount);
        const discountAmount = (discountPercent / 100) * originalPrice;
        updated.discountedPrice = Math.max(originalPrice - discountAmount, 0);
      }
      return updated;
    });
  };

const handleImageChange = (e) => {
  const files = Array.from(e.target.files);

  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  const maxImages = 5;

  // Filter valid images
  const validFiles = files.filter((file) =>
    allowedTypes.includes(file.type)
  );

  if (validFiles.length !== files.length) {
    toast.error("Only JPG, JPEG, and PNG images are allowed");
  }

  if (validFiles.length > maxImages) {
    toast.error(`You can upload a maximum of ${maxImages} images`);
    return;
  }

  const previews = validFiles.map((file) =>
    URL.createObjectURL(file)
  );

  setFormData((prev) => ({
    ...prev,
    images: validFiles,
    imagePreviews: previews,
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
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    setIsLoading(true);

    try {
      console.log("Submitting form data:", formData);
      const fd = new FormData();

      // text fields
      Object.entries({
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        unit: formData.unit,
        brand: formData.brand,
        description: formData.description,
        status: formData.status,
        price: Number(formData.price),
        discount: Number(formData.discount),
        discountedPrice: Number(formData.discountedPrice),
        stock: Number(formData.stock),
      }).forEach(([key, value]) => fd.append(key, value));

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
        toast.success("Product updated successfully");
      } else {
        console.log("Creating product with data:", fd);
        await axios.post(productUrl.createProduct, fd, config);
        toast.success("Product created successfully");
      }

      await queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/admin/products");
    } catch (err) {
      console.log("err", err.response?.data?.message );
      toast.error(err.response?.data?.message || "Failed to save product");
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div
      className="max-w-7xl mx-auto space-y-4 sm:space-y-6 min-h-screen"
      style={{
        padding: "5px",
        background:
          "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)",
      }}
    >
      <Button
        variant="ghost"
        className="pl-0 text-gray-500 hover:text-gray-900 text-[8px] sm:text-sm"
        onClick={() => navigate("/admin/products")}
        style={{ paddingBottom: "15px sm:20px" }}
      >
        <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
        <span style={{ marginTop: "4px" }}>Back to Products</span>
      </Button>

      <div
        className="flex justify-between items-center"
        style={{ marginTop: "8px" }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          {isEditMode ? "Edit Product" : "Add New Product"}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6">
            <Card>
              <CardHeader
                className="pb-2 sm:pb-3 md:pb-4"
                style={{ paddingBottom: "15px" }}
              >
                <CardTitle className="text-base sm:text-lg md:text-xl">
                  Product Details
                </CardTitle>
                <CardDescription className="text-[10px] sm:text-[8px] sm:text-xs md:text-sm">
                  Enter the basic information for the product.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="grid gap-2" style={{ marginBottom: "20px" }}>
                  <Label htmlFor="name" className="text-[8px] sm:text-sm">
                    Product Name<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="e.g. Paracetamol 500mg"
                    className="text-[12px] h-10 sm:h-auto"
                    value={formData.name}
                    onChange={handleChange}
                    icon={Package}
                    style={{ padding: "10px 35px" }}
                  />
                </div>
                <div
                  className="grid grid-cols-2 gap-3"
                  style={{ marginBottom: "20px" }}
                >
                  <div className="grid gap-2">
                    <Label htmlFor="unit" className="text-[8px] sm:text-sm">
                      Unit<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="unit"
                      name="unit"
                      placeholder="e.g. 500mg, 1L, 10pcs"
                      className="text-[12px] h-10 sm:h-auto"
                      value={formData.unit}
                      onChange={handleChange}
                      style={{ padding: "10px 20px" }}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="brand" className="text-[8px] sm:text-sm">
                      Brand<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="brand"
                      name="brand"
                      placeholder="e.g. Cipla, Nestle"
                      className="text-[12px] h-10 sm:h-auto"
                      value={formData.brand}
                      onChange={handleChange}
                      style={{ padding: "10px 20px" }}
                    />
                  </div>
                </div>
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
                  style={{ marginBottom: "20px" }}
                >
                  <div className="grid gap-2">
                    <Label htmlFor="sku" className="text-[8px] sm:text-sm">
                    SKU  <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="sku"
                      name="sku"
                      className="font-mono text-[12px] h-10 sm:h-auto"
                      placeholder="e.g. MED-001"
                      value={formData.sku}
                      onChange={handleChange}
                      icon={Tag}
                      style={{ padding: "10px 35px" }}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category" className="text-[8px] sm:text-sm">
                      Category<span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="category"
                      name="category"
                      required
                      className="flex h-10 sm:h-auto w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[8px] sm:text-[12px] shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.category}
                      onChange={handleChange}
                      style={{ padding: "10px 5px" }}
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat, idx) => (
                        <option key={idx} value={cat.name || cat}>
                          {cat.name || cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Status Row (removed Website Visibility) */}
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center"
                  style={{ marginBottom: "20px" }}
                >
                  <div className="grid gap-2">
                    <Label htmlFor="status">
                      Status<span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="status"
                      name="status"
                      required
                      className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[12px] shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.status}
                      onChange={handleChange}
                      style={{ padding: "10px 5px" }}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="draft">Draft</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-2" style={{ marginBottom: "20px" }}>
                  <Label htmlFor="description">
                    Description<span className="text-red-500">*</span>
                  </Label>
                  <textarea
                    id="description"
                    name="description"
                    rows="5"
                    className="flex min-h-[60px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[12px] shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                    placeholder="Product detailed description..."
                    value={formData.description}
                    onChange={handleChange}
                    style={{ padding: "20px 10px" }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Info */}
          <div className="space-y-4 sm:space-y-6">
            <Card style={{ marginBottom: "10px", padding: "10px" }}>
              <CardHeader>
                <CardTitle>Pricing & Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2" style={{ marginBottom: "10px" }}>
                  <Label htmlFor="price">
                    Price (₹)<span className="text-red-500">*</span>
                  </Label>
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
                    style={{ padding: "20px 30px" }}
                  />
                </div>
                <div className="grid gap-2" style={{ marginBottom: "10px" }}>
                  <Label htmlFor="discount">
                    Discount (%)<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="discount"
                    type="number"
                    name="discount"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.discount}
                    onChange={handleChange}
                    placeholder="e.g. 10"
                    style={{ padding: "20px 30px" }}
                  />
                </div>
                <div className="grid gap-2" style={{ marginBottom: "10px" }}>
                  <Label htmlFor="discountedPrice">
                    Discounted Price (₹)<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="discountedPrice"
                    type="number"
                    name="discountedPrice"
                    value={formData.discountedPrice}
                    disabled
                    style={{ padding: "20px 30px", background: "#f3f4f6" }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stock">
                    Stock<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    name="stock"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    icon={Box}
                    style={{ padding: "20px 35px" }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-muted/40 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">
                  Product Images
                </CardTitle>
                <CardDescription className="text-sm">
                  Upload one or more product images
                  <span className="ml-1 text-red-500">*</span>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Upload Box */}
                <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center cursor-pointer transition hover:border-primary hover:bg-primary/5">
          <input
  type="file"
  accept=".jpg,.jpeg,.png,image/jpeg,image/png"
  multiple
  onChange={handleImageChange}
  className="hidden"
/>


                  <p className="text-sm font-medium text-gray-700 py-1">
                    Click to upload or drag & drop
                  </p>
                  <p className="text-xs text-gray-500 py-1">
                    PNG, JPG, JPEG (upto 5 allowed)
                  </p>
                </label>

                {/* Image Preview Grid */}
                {formData.imagePreviews?.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {formData.imagePreviews.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative group aspect-square overflow-hidden rounded-xl border bg-white shadow-sm"
                      >
                        <img
                          src={url}
                          alt={`Preview ${idx + 1}`}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow opacity-0 transition group-hover:opacity-100 hover:bg-red-50 hover:text-red-600"
                        >
                          ✕
                        </button>

                        {/* Main Image Badge */}
                        {idx === 0 && (
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[10px] font-medium text-white shadow">
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

        <div className="flex justify-end pt-6" style={{ marginTop: "10px" }}>
          <Button
            type="submit"
            disabled={isLoading}
            size="md"
            style={{ padding: "5px 10px" }}
          >
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? (
              <span style={{ marginTop: "4px", paddingLeft: "5px" }}>
                Saving...
              </span>
            ) : (
              <span style={{ marginTop: "4px", paddingLeft: "5px" }}>
                Save Product
              </span>
            )}
          </Button>
        </div>
      </form>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        title={isEditMode ? "Update Product" : "Create Product"}
        message={
          isEditMode
            ? "Are you sure you want to update this product details?"
            : "Are you sure you want to create this new product?"
        }
        confirmText={isEditMode ? "Update" : "Create"}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProductForm;
