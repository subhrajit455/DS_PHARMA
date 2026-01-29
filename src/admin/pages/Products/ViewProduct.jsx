import React, { useEffect, useState } from "react";
import axios from "axios";
import { X, Package } from "lucide-react";
import { productUrl } from "@/config/adminApi";
import { Button } from "@/admin/components/ui/Button";
import { Card, CardContent } from "@/admin/components/ui/Card";
import toastUtil from "@/shared/utils/toast";

const ViewProductModal = ({ open, onClose, productId }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/category`
      );
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const categoryMap = React.useMemo(() => {
    const map = {};
    categories.forEach((cat) => {
      map[cat._id || cat.id] = cat.name;
    });
    return map;
  }, [categories]);

  useEffect(() => {
    if (!open || !productId) return;

    if (categories.length === 0) {
      fetchCategories();
    }

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${productUrl.getAllProducts}/${productId}`
        );
        setProduct(res.data.data || res.data);
      } catch {
        toastUtil.error("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [open, productId, categories.length]);

  const getCategoryName = (category) => {
     if (!category) return "-";
     if (typeof category === 'object' && category.name) return category.name;
     return categoryMap[category] || category;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-[96%] max-w-5xl rounded-2xl shadow-2xl overflow-hidden ">
        {/* Header */}
        <div className="flex items-center justify-between px-10 py-10 border-b ">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 px-5">
              Product Details
            </h3>
            <p className="text-sm text-gray-500">
              Complete information about the product
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="max-h-[80vh] overflow-y-auto px-8 py-6">
          <Card className="border-0 shadow-none">
            <CardContent className="space-y-10 p-0">
              {loading ? (
                <div className="py-20 text-center text-gray-500">
                  Loading product details...
                </div>
              ) : product ? (
                <>
                  {/* Images Section */}
                  <section className="space-y-4">
                    <h4 className="text-base font-semibold text-gray-800">
                      Product Images
                    </h4>

                    <div className="flex flex-wrap gap-4">
                      {product.image?.length ? (
                        product.image.map((img, i) => (
                          <div
                            key={i}
                            className="w-32 h-32 rounded-xl border overflow-hidden bg-gray-50"
                          >
                            <img
                              src={img.url}
                              alt="product"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))
                      ) : (
                        <div className="w-32 h-32 rounded-xl border bg-gray-100 flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Details Section */}
                  <section className="space-y-4">
                    <h4 className="text-base font-semibold text-gray-800">
                      Product Information
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <Detail label="Name" value={product.name} />
                      <Detail label="Brand" value={product.brand} />
                      <Detail label="Category" value={getCategoryName(product.category)} />
                      <Detail label="SKU" value={product.sku} />
                      <Detail label="Unit" value={product.unit} />
                      <Detail label="Price" value={`₹${Number(product.price).toFixed(2)}`} />
                      <Detail label="Discount" value={`${product.discount}%`} />
                      <Detail
                        label="Discounted Price"
                        value={`₹${Number(product.discountedPrice).toFixed(2)}`}
                      />
                      <Detail label="Stock" value={product.stock} />
                      <Detail label="Status" value={product.status} />
                    </div>
                  </section>

                  {/* Description */}
                  {product.description && (
                    <section className="space-y-3">
                      <h4 className="text-base font-semibold text-gray-800">
                        Description
                      </h4>
                      <div className="rounded-xl border bg-gray-50 p-5 text-sm text-gray-700 leading-relaxed">
                        {product.description}
                      </div>
                    </section>
                  )}
                </>
              ) : (
                <div className="py-20 text-center text-gray-500">
                  No product data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-8 py-5 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div className="rounded-xl border bg-gray-50 px-5 py-4">
    <p className="text-xs uppercase tracking-wide text-gray-500">
      {label}
    </p>
    <p className="mt-1 font-medium text-gray-900">
      {value || "-"}
    </p>
  </div>
);

export default ViewProductModal;
