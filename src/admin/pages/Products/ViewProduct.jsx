import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  X,
  Package,
  Tag,
  CreditCard,
  Hash,
  Building2,
  Archive,
  Calendar,
  Layers,
  Database,
  FlaskConical,
  Percent,
  CircleDollarSign,
  Barcode,
  Image as ImageIcon,
  ShieldCheck,
  AlertTriangle,
  Box,
  Pill,
  IndianRupee,
  Info,
} from "lucide-react";

import { productUrl } from "@/config/adminApi";
import { Button } from "@/admin/components/ui/Button";
import { Badge } from "@/admin/components/ui/Badge";
import toastUtil from "@/shared/utils/toast";
import { cn } from "@/admin/utils/cn";

/* =========================================================
   VIEW PRODUCT MODAL
========================================================= */

const ViewProductModal = ({ open, onClose, productId }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  /* =========================================================
     FETCH CATEGORIES
  ========================================================= */

  useEffect(() => {
    if (!open || categories.length > 0) return;

    const fetchCategories = async () => {
      try {
        const url = `${import.meta.env.VITE_URL}/category`;

        const response = await axios.get(url);

        setCategories(response?.data?.data || []);
      } catch (error) {
        console.error("CATEGORY FETCH ERROR:", error);
      }
    };

    fetchCategories();
  }, [open, categories.length]);

  /* =========================================================
     CATEGORY MAP
  ========================================================= */

  const categoryMap = useMemo(() => {
    const map = {};

    categories.forEach((category) => {
      const id = category?._id || category?.id;

      if (id) {
        map[id] = category?.name || "Uncategorized";
      }
    });

    return map;
  }, [categories]);

  /* =========================================================
     FETCH PRODUCT
  ========================================================= */

  useEffect(() => {
    if (!open || !productId) return;

    const fetchProduct = async () => {
      setLoading(true);
      setProduct(null);

      try {
        const url = `${productUrl.getAllProducts}/details/${productId}`;

        console.log("PRODUCT DETAILS URL:", url);

        const response = await axios.get(url);

        console.log("PRODUCT DETAILS RESPONSE:", response?.data);

        const productData =
          response?.data?.data ||
          response?.data ||
          null;

        setProduct(productData);
      } catch (error) {
        console.error("PRODUCT DETAILS ERROR:", error);

        toastUtil.error("Failed to fetch product details");

        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [open, productId]);

  /* =========================================================
     CLOSE WITH ESC
  ========================================================= */

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  /* =========================================================
     HELPERS
  ========================================================= */

  const getCategoryName = (category) => {
    if (!category) {
      return "Uncategorized";
    }

    if (typeof category === "object") {
      return category?.name || "Uncategorized";
    }

    return categoryMap[category] || String(category);
  };

  const formatDate = (dateValue) => {
    if (
      dateValue === null ||
      dateValue === undefined ||
      dateValue === "" ||
      dateValue === "0"
    ) {
      return "Not available";
    }

    const value = String(dateValue);

    // YYYYMMDD
    if (/^\d{8}$/.test(value)) {
      return `${value.slice(6, 8)}/${value.slice(
        4,
        6
      )}/${value.slice(0, 4)}`;
    }

    return value;
  };

  const cleanProductName = (name) => {
    if (!name) {
      return "Unnamed Product";
    }

    return String(name)
      .replace(/\/\*\*/g, "")
      .replace(/\*\//g, "")
      .trim();
  };

  const formatCurrency = (value) => {
    const number = Number(value || 0);

    return number.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getStockStatus = (stock) => {
    const quantity = Number(stock || 0);

    if (quantity <= 0) {
      return {
        label: "Out of Stock",
        className:
          "bg-red-50 text-red-700 border-red-200",
        icon: AlertTriangle,
      };
    }

    if (quantity <= 10) {
      return {
        label: "Low Stock",
        className:
          "bg-amber-50 text-amber-700 border-amber-200",
        icon: AlertTriangle,
      };
    }

    return {
      label: "In Stock",
      className:
        "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: ShieldCheck,
    };
  };

  /* =========================================================
     DERIVED DATA
  ========================================================= */

  const stockStatus = getStockStatus(product?.stock);

  const StockIcon = stockStatus.icon;

  const images = Array.isArray(product?.images)
    ? product.images.filter((image) => image?.url)
    : [];

  const categoryName = getCategoryName(
    product?.categoryDetails || product?.category
  );

  /* =========================================================
     MODAL
  ========================================================= */

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-5">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close product viewer"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      {/* Modal */}
      <div className="relative z-10 flex h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:h-[90vh]">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <header className="relative shrink-0 border-b border-slate-200 bg-white">
          {/* Medical blue accent */}
          <div className="absolute left-0 top-0 h-full w-1 bg-[#0096FF]" />

          <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-7">
            {/* Product identity */}
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0096FF]/10 text-[#0096FF]">
                <Pill className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <Badge className="border-0 bg-[#0096FF] px-2.5 py-1 text-[10px] font-bold text-white">
                    PRODUCT #{product?.rid || "---"}
                  </Badge>

                  <Badge
                    variant="outline"
                    className="border-slate-200 bg-slate-50 text-[10px] font-semibold text-slate-600"
                  >
                    {categoryName}
                  </Badge>

                  {product && (
                    <span
                      className={cn(
                        "flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold",
                        stockStatus.className
                      )}
                    >
                      <StockIcon className="h-3 w-3" />
                      {stockStatus.label}
                    </span>
                  )}
                </div>

                <h2 className="max-w-[600px] truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                  {loading
                    ? "Loading product..."
                    : cleanProductName(product?.name)}
                </h2>

                <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-slate-500">
                  <Building2 className="h-3.5 w-3.5 shrink-0" />

                  {product?.company ||
                    "Manufacturer not available"}
                </p>
              </div>
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0096FF]/20"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* =====================================================
            BODY
        ===================================================== */}

        <main className="min-h-0 flex-1 overflow-y-auto bg-[#f7f9fc]">
          <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-7">
            {loading ? (
              <LoadingState />
            ) : product ? (
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
                {/* =================================================
                    LEFT COLUMN
                ================================================= */}

                <div className="space-y-5">
                  {/* Product Images */}
                  <ProductGallery images={images} />

                  {/* Inventory */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                          <Archive className="h-4 w-4 text-[#0096FF]" />
                          Inventory
                        </h3>

                        <p className="mt-0.5 text-xs text-slate-400">
                          Current stock information
                        </p>
                      </div>

                      <div
                        className={cn(
                          "flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold",
                          stockStatus.className
                        )}
                      >
                        <StockIcon className="h-3 w-3" />
                        {stockStatus.label}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <InventoryRow
                        icon={Archive}
                        label="Current Stock"
                        value={`${product?.stock ?? 0} Units`}
                      />

                      <InventoryRow
                        icon={Barcode}
                        label="Batch Number"
                        value={product?.curbatch || "---"}
                      />

                      <InventoryRow
                        icon={Calendar}
                        label="Expiry Date"
                        value={formatDate(product?.exp)}
                      />
                    </div>
                  </div>

                  {/* Quick product summary */}
                  <div className="rounded-2xl border border-[#0096FF]/10 bg-gradient-to-br from-[#0096FF]/5 to-white p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0096FF]/10 text-[#0096FF]">
                        <Info className="h-4 w-4" />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          Product Summary
                        </h3>

                        <p className="text-xs text-slate-400">
                          Important product details
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <SummaryRow
                        label="Category"
                        value={categoryName}
                      />

                      <SummaryRow
                        label="Manufacturer"
                        value={
                          product?.company ||
                          "Not available"
                        }
                      />

                      <SummaryRow
                        label="Batch"
                        value={
                          product?.curbatch || "---"
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* =================================================
                    RIGHT COLUMN
                ================================================= */}

                <div className="space-y-5">
                  {/* Pricing */}
                  <Section
                    icon={CircleDollarSign}
                    title="Pricing"
                    subtitle="Current product pricing information"
                    iconClass="bg-emerald-50 text-emerald-600"
                  >
                    <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-3">
                      <PriceCard
                        label="MRP"
                        value={product?.MRP}
                        type="mrp"
                      />

                      <PriceCard
                        label="Sale Rate"
                        value={product?.Rate}
                        type="sale"
                      />

                      <PriceCard
                        label="Purchase Rate"
                        value={product?.PRate}
                        type="purchase"
                      />
                    </div>
                  </Section>

                  {/* Product Information */}
                  <Section
                    icon={Tag}
                    title="Product Information"
                    subtitle="Classification and identification details"
                    iconClass="bg-blue-50 text-blue-600"
                  >
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      <InfoCard
                        icon={Tag}
                        label="Category"
                        value={categoryName}
                      />

                      <InfoCard
                        icon={Building2}
                        label="Manufacturer"
                        value={product?.company}
                      />

                      <InfoCard
                        icon={FlaskConical}
                        label="Salt / Composition"
                        value={product?.Salt}
                      />

                      <InfoCard
                        icon={Hash}
                        label="Shop Code"
                        value={product?.shopcode}
                      />

                      <InfoCard
                        icon={Layers}
                        label="Conversion"
                        value={product?.Conversion}
                      />

                      <InfoCard
                        icon={Database}
                        label="Marg Code"
                        value={product?.MargCode}
                      />
                    </div>
                  </Section>

                  {/* Offers */}
                  <Section
                    icon={Percent}
                    title="Offers & Identifiers"
                    subtitle="Additional product information"
                    iconClass="bg-violet-50 text-violet-600"
                  >
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      <SmallInfo
                        icon={Percent}
                        label="Deal Offer"
                        value={product?.Deal}
                      />

                      <SmallInfo
                        icon={Archive}
                        label="Free Item"
                        value={product?.Free}
                      />

                      <SmallInfo
                        icon={Barcode}
                        label="GCode-6"
                        value={product?.Gcode6}
                      />

                      <SmallInfo
                        icon={CreditCard}
                        label="Marg GCode"
                        value={product?.gcode}
                      />
                    </div>
                  </Section>

                  {/* Remarks */}
                  {product?.remarks && (
                    <Section
                      icon={Archive}
                      title="Professional Remarks"
                      subtitle="Additional notes associated with this product"
                      iconClass="bg-amber-50 text-amber-600"
                    >
                      <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-4">
                        <p className="whitespace-pre-wrap break-words text-xs leading-6 text-slate-600">
                          {product.remarks}
                        </p>
                      </div>
                    </Section>
                  )}
                </div>
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </main>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer className="flex shrink-0 items-center justify-between gap-4 border-t border-slate-200 bg-white px-5 py-3.5 sm:px-6">
          <div className="hidden items-center gap-2 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />

            <span className="text-xs font-semibold text-slate-500">
              Medical product record
            </span>
          </div>

          <Button
            variant="outline"
            onClick={onClose}
            className="ml-auto h-10 rounded-xl border-slate-200 px-6 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Close
          </Button>
        </footer>
      </div>
    </div>
  );
};

/* =========================================================
   SECTION
========================================================= */

const Section = ({
  icon: Icon,
  title,
  subtitle,
  iconClass,
  children,
}) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
            iconClass
          )}
        >
          <Icon className="h-4 w-4" />
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-900">
            {title}
          </h3>

          {subtitle && (
            <p className="mt-0.5 text-xs text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {children}
    </section>
  );
};

/* =========================================================
   PRODUCT GALLERY
========================================================= */

const ProductGallery = ({ images }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <ImageIcon className="h-4 w-4 text-[#0096FF]" />
            Product Images
          </h3>

          <p className="mt-0.5 text-xs text-slate-400">
            {images.length
              ? `${images.length} image${images.length > 1 ? "s" : ""
              }`
              : "No images"}
          </p>
        </div>
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-2.5">
          {images.map((image, index) => (
            <div
              key={image?.url || index}
              className={cn(
                "group relative overflow-hidden rounded-xl border bg-slate-50",
                index === 0
                  ? "col-span-2 aspect-[4/3] border-[#0096FF]/20"
                  : "aspect-square border-slate-100"
              )}
            >
              <img
                src={image.url}
                alt={`Product ${index + 1}`}
                className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
              />

              {index === 0 && (
                <span className="absolute left-2 top-2 rounded-md bg-[#0096FF] px-2 py-1 text-[9px] font-bold text-white shadow-sm">
                  PRIMARY
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
          <ImageIcon className="h-8 w-8 text-slate-300" />

          <p className="mt-2 text-xs font-semibold text-slate-400">
            No image available
          </p>
        </div>
      )}
    </div>
  );
};

/* =========================================================
   INVENTORY ROW
========================================================= */

const InventoryRow = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3.5 py-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
          <Icon className="h-3.5 w-3.5" />
        </div>

        <span className="text-xs font-semibold text-slate-500">
          {label}
        </span>
      </div>

      <span className="max-w-[150px] truncate text-xs font-bold text-slate-800">
        {value || "---"}
      </span>
    </div>
  );
};

/* =========================================================
   SUMMARY ROW
========================================================= */

const SummaryRow = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2.5 last:border-0 last:pb-0">
      <span className="text-xs font-medium text-slate-400">
        {label}
      </span>

      <span
        className="max-w-[170px] truncate text-right text-xs font-bold text-slate-700"
        title={value}
      >
        {value || "---"}
      </span>
    </div>
  );
};

/* =========================================================
   INFO CARD
========================================================= */

const InfoCard = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="group min-w-0 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 transition hover:border-[#0096FF]/20 hover:bg-white hover:shadow-sm">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-400 shadow-sm transition group-hover:text-[#0096FF]">
          <Icon className="h-3.5 w-3.5" />
        </div>

        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p
            className="mt-1 break-words text-xs font-bold text-slate-700"
            title={value || "---"}
          >
            {value || "---"}
          </p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   SMALL INFO
========================================================= */

const SmallInfo = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-3.5 py-3">
      <div className="flex min-w-0 items-center gap-2">
        <Icon className="h-3.5 w-3.5 shrink-0 text-slate-400" />

        <span className="truncate text-[10px] font-bold uppercase tracking-wide text-slate-400">
          {label}
        </span>
      </div>

      <span
        className="max-w-[90px] truncate text-xs font-bold text-slate-800"
        title={value || "0"}
      >
        {value || "0"}
      </span>
    </div>
  );
};

/* =========================================================
   PRICE CARD
========================================================= */

const PriceCard = ({ label, value, type }) => {
  const config = {
    mrp: {
      wrapper: "border-slate-200 bg-slate-50",
      label: "text-slate-500",
      value: "text-slate-900",
      icon: "text-slate-300",
    },
    sale: {
      wrapper: "border-emerald-200 bg-emerald-50",
      label: "text-emerald-700",
      value: "text-emerald-700",
      icon: "text-emerald-200",
    },
    purchase: {
      wrapper: "border-blue-200 bg-blue-50",
      label: "text-blue-700",
      value: "text-blue-700",
      icon: "text-blue-200",
    },
  };

  const styles = config[type] || config.mrp;

  return (
    <div
      className={cn(
        "relative min-w-0 overflow-hidden rounded-2xl border p-4",
        "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        styles.wrapper
      )}
    >
      {/* Header */}
      <div className="relative z-10 flex min-w-0 items-center justify-between gap-2">
        <span
          className={cn(
            "truncate text-[10px] font-extrabold uppercase tracking-[0.12em]",
            styles.label
          )}
        >
          {label}
        </span>

        <div
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/80",
            styles.icon
          )}
        >
          <IndianRupee className="h-3.5 w-3.5" />
        </div>
      </div>

      {/* Price */}
      <div className="relative z-10 mt-3 min-w-0">
        <p
          className={cn(
            "truncate text-[clamp(1.25rem,2vw,1.6rem)] font-black leading-none tracking-tight",
            styles.value
          )}
          title={`₹${formatPrice(value)}`}
        >
          ₹{formatPrice(value)}
        </p>
      </div>

      {/* Decorative icon */}
      <CircleDollarSign
        className={cn(
          "absolute -bottom-5 -right-5 h-20 w-20 opacity-40",
          styles.icon
        )}
      />
    </div>
  );
};

/* =========================================================
   PRICE FORMATTER
========================================================= */

const formatPrice = (value) => {
  const number = Number(value || 0);

  return number.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/* =========================================================
   LOADING STATE
========================================================= */

const LoadingState = () => {
  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0096FF]/10">
        <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-slate-200 border-t-[#0096FF]" />
      </div>

      <p className="mt-4 text-sm font-bold text-slate-700">
        Loading product details
      </p>

      <p className="mt-1 text-xs text-slate-400">
        Please wait while we fetch the product information...
      </p>
    </div>
  );
};

/* =========================================================
   EMPTY STATE
========================================================= */

const EmptyState = () => {
  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
        <Box className="h-8 w-8" />
      </div>

      <h3 className="mt-4 text-sm font-bold text-slate-800">
        Product not found
      </h3>

      <p className="mt-1 text-xs text-slate-400">
        The requested product could not be loaded.
      </p>
    </div>
  );
};

export default ViewProductModal;