import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useAddToCart } from "@/shared/hooks/queries/useCartQuery";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import useDataStore from "@/store/useDataStore";
import CartIcon from "@/assets/icons/Cart.png";
import SafeImage from "@/shared/components/SafeImage";
import toastUtil from "@/shared/utils/toast";
import apiClient from "@/services/api/apiClient";

const PharmacyProductCard = ({
  id,
  rid, // Use rid for cart identification
  name,
  price,
  originalPrice,
  mrp,
  discount,
  quantity,
  unit = "piece",
  imageUrl,
  image,
  stock,
  inStock = true,
  onCardClick = null,
  className = "",
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const addItemToLocalCart = useCartStore((state) => state.addItem);
  const { mutate: addToCartMutation, isPending } = useAddToCart();

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestQty, setRequestQty] = useState(1);
  const [requestRemark, setRequestRemark] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);
  console.log("Rendering PharmacyProductCard with props:", {
    id,
    rid,
    name,
    price,
    originalPrice,
    mrp,
    discount,
    quantity,
    unit,
    imageUrl,
    image,
    stock,
    inStock,
  });

  const productId = rid || id;

  const decodeJwt = (token) => {
    if (!token) return null;
    try {
      const payload = token.split(".")[1];
      if (!payload) return null;
      const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
      return JSON.parse(decodeURIComponent(escape(decoded)));
    } catch (e) {
      return null;
    }
  };

  const tokenPayload = decodeJwt(localStorage.getItem("authToken"));
  const currentUserId =tokenPayload?.rid 
   

  const handleSendRequest = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toastUtil.info("Please login to request stock.");
      navigate(`/login?redirect=${window.location.pathname}`);
      return;
    }

    // if (!productId || !currentUserId) {
    //   toastUtil.error(
    //     "Unable to submit request. Missing user or product info.",
    //   );
    //   return;
    // }

    const qty = Number(requestQty);
    if (!qty || qty <= 0) {
      toastUtil.error("Please enter a valid quantity.");
      return;
    }

    setIsRequesting(true);
    try {
      await apiClient.post("/api/v1/products/request", {
        productId,
        requestedBy: currentUserId,
        quantity: qty,
        remark: requestRemark || "",
      });

      toastUtil.success(
        "Request submitted. We'll notify you when it's back in stock.",
      );
      setIsRequestModalOpen(false);
      setRequestQty(1);
      setRequestRemark("");
    } catch (error) {
      // apiClient already shows toast for many errors, but show fallback
      if (!error || !error.response) {
        toastUtil.error("Failed to send request. Please try again.");
      }
    } finally {
      setIsRequesting(false);
    }
  };

  // Use useDataStore for wishlist (to avoid conflicting with new useCartStore for now if they are different)
  const wishlist = useDataStore((state) => state.wishlist);
  const addToWishlist = useDataStore((state) => state.addToWishlist);
  const removeFromWishlist = useDataStore((state) => state.removeFromWishlist);

  const isInWishlist = wishlist.some((item) => item.id === id);

  // Handle image prop variation (image vs imageUrl)
  const displayImage = imageUrl || image;

  // Normalize numeric values to avoid NaN when source data is missing/invalid
  const safeNumber = (val) => {
    const n = Number(val);
    return Number.isFinite(n) ? n : 0;
  };

  const displayPrice =
    safeNumber(price) || safeNumber(mrp) || safeNumber(originalPrice);
  const comparisonPrice = safeNumber(mrp) || safeNumber(originalPrice);

  const discountPercentage =
    comparisonPrice > 0 && displayPrice > 0 && comparisonPrice > displayPrice
      ? Math.round(((comparisonPrice - displayPrice) / comparisonPrice) * 100)
      : safeNumber(discount);

  // Determine if product is available
  // Robust check: Only treat as unavailable if explicitly inStock === false OR stock is explicitly 0
  const isAvailable =
    inStock !== false && (stock === undefined || Number(stock) > 0);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isAvailable) return;

    // productId (rid) is required for both backend and local cart
    // User requested strict usage of 'rid' from product data
    const productRid = rid;

    if (isAuthenticated) {
      if (!productRid) {
        toastUtil.error("Product RID missing. Cannot add to cart.");
        return;
      }
      // Logic for logged in users: Sync directly to backend
      addToCartMutation({
        image: displayImage,
        name,
        price,
        originalPrice: comparisonPrice || price,
        discount: discountPercentage,
        rid: productRid,
        quantity: 1,
      });
    } else {
      // Logic for guest users: Save to local store and redirect to login
      addItemToLocalCart(
        {
          id,
          rid,
          name,
          price,
          originalPrice: comparisonPrice || price,
          discount: discountPercentage,
          image: displayImage,
          unit,
          stock,
        },
        1,
      );

      toastUtil.info("Login to sync your cart!");
      navigate(`/login?redirect=${window.location.pathname}`);
    }
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    if (isInWishlist) {
      removeFromWishlist(id);
    } else {
      addToWishlist({
        id,
        name,
        price,
        originalPrice: comparisonPrice || price,
        discount: discountPercentage,
        image: displayImage,
        unit,
      });
    }
  };

  const handleCardClick = () => {
    // If onCardClick is provided by parent, use it (it usually handles navigation)
    // Otherwise, use default navigation to product details
    if (onCardClick) {
      onCardClick({ id, name, price, quantity, unit });
    } else {
      // console.log("product id : ",rid);
      navigate(`/product/${rid}`);
    }
  };

  // Check if transparent variant is requested via className or props (could be extended)
  const isTransparent = className.includes("bg-transparent");
  const baseBgClass = isTransparent ? "" : "bg-white";

  return (
    <>
      <style>{`
        .cart-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cart-button {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: none;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
          box-shadow: 4px 4px 8px #d1d5db, -4px -4px 8px #ffffff;
          outline: none;
        }

        @media (max-width: 640px) {
          .cart-button {
            width: 32px;
            height: 32px;
          }
        }

        .cart-button:hover {
          box-shadow: 2px 2px 4px #d1d5db, -2px -2px 4px #ffffff;
          transform: translateY(-1px);
        }

        .cart-button:active {
          box-shadow: inset 4px 4px 8px #d1d5db, inset -4px -4px 8px #ffffff;
          transform: translateY(1px);
        }

        .cart-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          box-shadow: none;
          background: #f1f5f9;
        }

        .cart-button img {
          width: 18px;
          height: 18px;
          object-fit: contain;
          opacity: 0.8;
          transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
        }

        @media (max-width: 640px) {
          .cart-button img {
            width: 14px;
            height: 14px;
          }
        }

        .cart-button:active img {
          transform: scale(0.9);
          opacity: 1;
        }

        .cart-button:focus-visible {
          outline: 2px solid #10b981;
          outline-offset: 2px;
        }
      `}</style>
      <div
        className={`${baseBgClass} overflow-hidden rounded-lg cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md w-full ${className} ${!isAvailable ? "opacity-60" : ""}`}
        style={{ maxWidth: "300px", padding: "10px" }}
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCardClick();
          }
        }}
        aria-label={`${name} - ${quantity} ${unit} - ₹${displayPrice.toLocaleString("en-IN")}`}
      >
        {/* Product Image */}
        <div className="relative rounded-sm overflow-hidden aspect-4/3 bg-linear-to-br from-sky-100 to-sky-200">
          <SafeImage
            src={displayImage}
            alt={name}
            className="object-cover w-full h-full px-2 py-2"
            loading="lazy"
          />

          {/* Wishlist Button */}
          {/* <button
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white shadow-sm transition-colors duration-150"
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            style={{ padding: '5px' }}
          >
            <Heart
              className={isInWishlist ? 'fill-red-500 text-red-500 w-3 h-3 sm:w-4 sm:h-4' : 'text-gray-400 w-3 h-3 sm:w-4 sm:h-4'}
            />
          </button> */}

          {/* Stock Status Badge */}
          {isAvailable ? (
            <div className="absolute top-2 right-2 flex items-center justify-center">
              <span
                className="px-2 py-1 text-[8px] sm:text-[10px] font-semibold text-white bg-emerald-600 rounded-full"
                style={{ padding: "5px" }}
              >
                In Stock
              </span>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/30 p-4">
              <span
                className="px-3 py-1 text-[8px] sm:text-xs font-semibold text-white bg-red-500 rounded-full"
                style={{ padding: "5px" }}
              >
                Out of Stock
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRequestModalOpen(true);
                }}
                className="px-3 py-1.5 text-[9px] sm:text-[11px] font-semibold text-black bg-white rounded-full shadow-sm hover:bg-gray-100 transition p-3.5"
                style={{
                  padding: "10px",
                }}
              >
                Request Stock
              </button>
            </div>
          )}

          {/* Discount Badge */}
          {discountPercentage > 0 && isAvailable && (
            <div
              className="absolute top-2 left-2 px-2 py-0.5 text-[8px] sm:text-[10px] font-bold text-white bg-green-500 rounded"
              style={{ padding: "1px  5px" }}
            >
              {discountPercentage}% OFF
            </div>
          )}

          {/* Dark shadow gradient on upper half */}
          <div
            className="absolute top-0 left-0 right-0 pointer-events-none"
            style={{
              height: "50%",
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.15), transparent)",
            }}
          />
        </div>

        {/* Product Info */}
        <div className="relative pt-2 translate-y-1/8">
          {/* Product Name */}
          <h3
            title={name}
            className="flex items-center justify-start text-[6px]  sm:text-[11px] font-semibold leading-tight text-left text-gray-900 min-h-8"
          >
            {name && name.length > 15
              ? `${name.substring(0, 32)}...`
              : name || "Unnamed Product"}
          </h3>

          {/* Price and Discount Group */}
          <div className="flex flex-col gap-1 mb-3">
            {/* Effective Price and Discount Badge */}
            <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
              <span
                className="text-[12px] sm:text-[12px] font-bold text-gray-900 tracking-tight"
                title={`Selling Price: ₹${displayPrice.toLocaleString("en-IN")}`}
              >
                ₹{displayPrice.toLocaleString("en-IN")}
              </span>

              {discountPercentage > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] sm:text-[10px] text-gray-40font-bold text-white bg-emerald-600 px-2 py-0.5 rounded-md shadow-sm">
                    {discountPercentage}% OFF
                  </span>
                </div>
              )}
            </div>

            {/* MRP & Packing/Unit Details */}
            <div className="flex items-center gap-1 flex-row min-h-4">
              {comparisonPrice > displayPrice && (
                <span className="text-[8px] sm:text-[10px] text-gray-400 line-through decoration-gray-400/60 font-medium">
                  MRP ₹{Number(comparisonPrice).toLocaleString("en-IN")}
                </span>
              )}
              {discountPercentage > 0 && (
                <span className="text-[8px] sm:text-[10px] text-emerald-600 font-bold">
                  Save ₹{Math.round(comparisonPrice - displayPrice)}
                </span>
              )}
              <span className="text-[8px] sm:text-[10px] text-gray-400 font-medium whitespace-nowrap">
                {unit || "strip"}
              </span>
            </div>
          </div>

          {/* Cart Icon - Neumorphic Design */}
          <div className="cart-toggle absolute right-0 top-1/2 -translate-y-1/2">
            <button
              onClick={handleAddToCart}
              disabled={isPending || !isAvailable}
              className="cart-button"
              aria-label={isAvailable ? `Add ${name} to cart` : "Out of stock"}
            >
              <img src={CartIcon} alt="Add to Cart" />
            </button>
          </div>
        </div>
      </div>

      {/* Request Stock Modal */}
      {isRequestModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center "
          style={{
            padding: "20px",
          }}
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsRequestModalOpen(false)}
          />
          <div
            className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl p-6"
            style={{
              padding: "20px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              Request Restock
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              This product is currently out of stock. Submit a request and we'll
              notify you when it's available.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600">
                  Quantity
                </label>
                <input
                  type="number"
                  min={1}
                  value={requestQty}
                  onChange={(e) => setRequestQty(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">
                  Remark (optional)
                </label>
                <textarea
                  value={requestRemark}
                  onChange={(e) => setRequestRemark(e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="Any additional details..."
                />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                style={{
                  padding: "10px",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendRequest}
                disabled={isRequesting}
                className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  padding: "10px",
                }}
              >
                {isRequesting ? "Sending..." : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PharmacyProductCard;
