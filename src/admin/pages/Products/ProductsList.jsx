import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  Package,
} from "lucide-react";
import toastUtil from "@/shared/utils/toast";
import { ChevronDown } from "lucide-react";

import { Button } from "@/admin/components/ui/Button";
import { Card, CardContent } from "@/admin/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/admin/components/ui/Table";
import { Pagination } from "@/admin/components/ui/Pagination";
import { productUrl, categoryUrl } from "@/config/adminApi";
import ViewProductModal from "./ViewProduct";
import axios from "axios";
import ConfirmationModal from "@/admin/components/ui/ConfirmationModal";
// import { error } from "node:console";

const ProductsList = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
  });
  const [search, setSearch] = useState("");
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(categoryUrl.getAllCategories);
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  const categoryMap = React.useMemo(() => {
    const map = {};
    categories.forEach((cat) => {
      map[cat._id || cat.id] = cat.name;
    });
    return map;
  }, [categories]);

  const fetchProducts = React.useCallback(async (page = 1, limit = 10, searchTerm = "") => {
    setIsLoading(true);
    try {
      // Fetch categories once if not already fetched
      if (categories.length === 0) {
        fetchCategories();
      }
      const response = await axios.get(productUrl.getAllProducts, {
        params: { page, limit, search: searchTerm },
      });
      // API: { message, pagination, data }
      setProducts(response.data.data || []);
      setPagination(
        response.data.pagination || {
          totalItems: 0,
          totalPages: 1,
          currentPage: 1,
          limit,
        },
      );
    } catch (error) {
      console.error(error);
      toastUtil.error("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  }, [categories.length]);


  useEffect(() => {
    fetchProducts(pagination.currentPage, pagination.limit, search);
  }, [pagination.currentPage, pagination.limit, search, fetchProducts]);

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

const handleItemsPerPageChange = (limit) => {
  setPagination((prev) => ({ ...prev, limit, currentPage: 1 }));
};


  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setDeleteLoading(true);
    try {
      await axios.delete(`${productUrl.deleteProduct}/${deleteId}`);
      toastUtil.success("Product deleted successfully");

      setConfirmOpen(false);
      setDeleteId(null);

      fetchProducts(pagination.currentPage, pagination.limit);
    } catch (error) {
      console.error(error);
      toastUtil.error("Failed to delete product");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col h-full space-y-4 sm:space-y-6 max-w-full overflow-x-hidden"
      style={{
        padding: "10px 10px 0px 10px",
        background:
          "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)",
      }}
    >
      <div
        className="flex flex-row justify-between items-start sm:items-center gap-3 sm:gap-4"
        style={{ paddingBottom: "10px 10px 0px 10px" }}
      >
        <div>
          <h2 className="text-xl sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-teal-800 bg-clip-text text-transparent flex items-center gap-2">
            Products
            
          </h2>
          {/* <p className="text-gray-500 text-[10px] sm:text-[8px] sm:text-xs md:text-sm mt-0.5">
            Manage your pharmacy inventory
          </p> */}
        </div>
        <Button
          onClick={() => navigate("/admin/products/new")}
          className="text-[10px] sm:text-[8px] sm:text-xs md:text-sm h-7 sm:h-9 md:h-10"
          style={{ padding: "0px 10px" }} 
        >
          <Plus className="mr-0.5 sm:mr-1 md:mr-2 h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />{" "}
          <span style={{ marginTop: "3px" }}>Add Product</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center mb-2 mt-2">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={handleSearchChange}
          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          style={{ marginBottom: "8px" }}
        />
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent
          className="flex flex-col flex-1 min-h-0 p-2 sm:p-3 md:p-4 lg:p-6 space-y-2 sm:space-y-3 md:space-y-4 overflow-hidden"
          style={{ padding: "5px" }}
        >
          <div className="flex-1 overflow-auto rounded-md border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow
                  style={{
                    background: "linear-gradient(to right, #f0fdf4, #f0fdfa)",
                  }}
                >
                  <TableHead
                    className="font-semibold text-gray-700 text-[8px] sm:text-sm"
                    style={{ padding: "6px 8px" }}
                  >
                    Image
                  </TableHead>
                  <TableHead
                    className="font-semibold text-gray-700 text-[8px] sm:text-sm"
                    style={{ padding: "6px 8px" }}
                  >
                    Name
                  </TableHead>
                  <TableHead
                    className="font-semibold text-gray-700 text-[8px] sm:text-sm"
                    style={{ padding: "6px 8px" }}
                  >
                    Brand
                  </TableHead>
                  <TableHead
                    className="font-semibold text-gray-700 text-[8px] sm:text-sm"
                    style={{ padding: "6px 8px" }}
                  >
                    Category
                  </TableHead>
                  <TableHead
                    className="font-semibold text-gray-700 text-[8px] sm:text-sm"
                    style={{ padding: "6px 8px" }}
                  >
                    SKU
                  </TableHead>
                  <TableHead
                    className="font-semibold text-gray-700 text-[8px] sm:text-sm"
                    style={{ padding: "6px 8px" }}
                  >
                    Unit
                  </TableHead>
                  <TableHead
                    className="font-semibold text-gray-700 text-[8px] sm:text-sm"
                    style={{ padding: "6px 8px" }}
                  >
                    Price
                  </TableHead>
                  <TableHead
                    className="font-semibold text-gray-700 text-[8px] sm:text-sm"
                    style={{ padding: "6px 8px" }}
                  >
                    Discount
                  </TableHead>
                  <TableHead
                    className="font-semibold text-gray-700 text-[8px] sm:text-sm"
                    style={{ padding: "6px 8px" }}
                  >
                    Disc. Price
                  </TableHead>
                  <TableHead
                    className="font-semibold text-gray-700 text-[8px] sm:text-sm"
                    style={{ padding: "6px 8px" }}
                  >
                    Stock
                  </TableHead>
                  <TableHead
                    className="font-semibold text-gray-700 text-[8px] sm:text-sm"
                    style={{ padding: "6px 8px" }}
                  >
                    Status
                  </TableHead>
                  <TableHead
                    className="text-right font-semibold text-gray-700 text-[8px] sm:text-sm"
                    style={{ padding: "6px 8px" }}
                  >
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={12} className="h-24 text-center">
                      <div className="flex items-center justify-center gap-2 text-emerald-600">
                        <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                        <span>Loading products...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : products.length > 0 ? (
                  products.map((product) => (
                    <TableRow
                      key={product._id}
                      className="hover:bg-emerald-50/50 transition-all duration-200 border-b border-gray-100 group"
                    >
                      <TableCell style={{ padding: "6px" }}>
                        {product.image && product.image.length > 0 ? (
                          <img
                            src={product.image[0].url}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded">
                            <Package className="w-6 h-6 text-gray-300" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell
                        className="font-medium text-gray-900 text-[8px] sm:text-sm"
                        style={{ padding: "8px" }}
                      >
                        {product.name}
                      </TableCell>
                      <TableCell
                        className="text-gray-700 text-[8px] sm:text-xs"
                        style={{ padding: "6px" }}
                      >
                        {product.brand}
                      </TableCell>
                      <TableCell
                        className="text-gray-700 text-[8px] sm:text-xs"
                        style={{ padding: "6px" }}
                      >
                        {typeof product.category === 'object' && product.category?.name 
                          ? product.category.name 
                          : categoryMap[product.category] || product.category || 'N/A'
                        }
                      </TableCell>
                      <TableCell
                        className="font-mono text-[8px] sm:text-xs text-gray-500"
                        style={{ padding: "6px" }}
                      >
                        {product.sku}
                      </TableCell>
                      <TableCell
                        className="text-gray-700 text-[8px] sm:text-xs"
                        style={{ padding: "6px" }}
                      >
                        {product.unit}
                      </TableCell>
                      <TableCell
                        className="text-[8px] sm:text-xs font-semibold text-emerald-600"
                        style={{ padding: "6px" }}
                      >
                        ₹{Number(product.price).toFixed(2)}
                      </TableCell>
                      <TableCell
                        className="text-[8px] sm:text-xs"
                        style={{ padding: "6px" }}
                      >
                        {product.discount}%
                      </TableCell>
                      <TableCell
                        className="text-[8px] sm:text-xs font-semibold text-emerald-700"
                        style={{ padding: "6px" }}
                      >
                        ₹{Number(product.discountedPrice).toFixed(2)}
                      </TableCell>
                      <TableCell
                        className="text-[8px] sm:text-xs"
                        style={{ padding: "6px" }}
                      >
                        {product.stock}
                      </TableCell>
                      <TableCell
                        className="text-[8px] sm:text-xs"
                        style={{ padding: "6px" }}
                      >
                        {product.status}
                      </TableCell>
                      <TableCell
                        className="text-right"
                        style={{ padding: "6px" }}
                      >
                        <div className="flex items-center justify-center gap-1 sm:gap-2 opacity-100">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-emerald-50"
                            onClick={() => {
                              setSelectedProductId(product._id);
                              setViewOpen(true);
                            }}
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-blue-50"
                            onClick={() =>
                              navigate(`/admin/products/${product._id}/edit`, {
                                state: { product },
                              })
                            }
                          >
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-red-50"
                            onClick={() => {
                              setDeleteId(product._id);
                              setConfirmOpen(true);
                            }}
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={12}
                      className="h-32 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Package className="w-8 h-8 text-gray-300" />
                        <p>No products found.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {!isLoading && pagination.totalPages > 1 && (
            <div
              className="shrink-0 mt-auto pt-4"
              style={{ bottom: "0", marginTop: "10px" }}
            >
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={pagination.limit}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>
      <ViewProductModal
        open={viewOpen}
        productId={selectedProductId}
        onClose={() => {
          setViewOpen(false);
          setSelectedProductId(null);
        }}
      />



      <ConfirmationModal
        isOpen={confirmOpen}
        onClose={() => {
          if (!deleteLoading) {
            setConfirmOpen(false);
            setDeleteId(null);
          }
        }}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default ProductsList;
