import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ProductImageGallery,
  ProductPriceSection,
  ProductActionButtons,
  ProductDescription,
} from "@/user/components/product";
import { useAddToCart } from "@/shared/hooks/queries/useCartQuery";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import BackButton from "@/shared/components/BackButton";
import toastUtil from "@/shared/utils/toast";
import apiClient from "@/services/api/apiClient";

const productfetchapi = import.meta.env.VITE_MEDIA_CLOUD_BASE_URL;
const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isProductLoading, setIsProductLoading] = useState(true);

  const [productDetails, setProductDetails] = useState(null);

  // console.log("product id : ", productDetails);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setIsProductLoading(true);
        const response = await fetch(
          `${productfetchapi}/api/v1/products/details/${id}`,
        );
        const data = await response.json();
        setProductDetails(data.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setIsProductLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  // Queries
  // const { data: productData, isLoading: isProductLoading } = useProductDetails(id);
  // const { data: reviewsData, isLoading: isReviewsLoading } = useReviews(id);
  const { isAuthenticated, token } = useAuthStore();
  const addItemToLocalCart = useCartStore((state) => state.addItem);
  const { mutate: addToCartMutation, isPending: isAddingToCart } =
    useAddToCart();

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestQty, setRequestQty] = useState(1);
  const [requestRemark, setRequestRemark] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);

  const decodeJwt = (token) => {
    if (!token) return null;
    try {
      const payload = token.split(".")[1];
      if (!payload) return null;
      const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
      return JSON.parse(decodeURIComponent(escape(decoded)));
    } catch (decodeError) {
      console.warn("Failed to decode auth token", decodeError);
      return null;
    }
  };

  const tokenPayload = decodeJwt(token);
  const currentUserId = tokenPayload?.rid;

  // const reviews = reviewsData?.data || [];

  // Get product (service already normalizes and returns the object)
  const fetchedProduct = productDetails;

  // Fetch suggested items based on category of current product
  // Category identification must be done ONLY using _id
  // const categoryId = fetchedProduct?.categoryId || fetchedProduct?.category?._id || fetchedProduct?.category;

  // const { data: suggestedData } = useProducts({
  //     categoryId: categoryId,
  //     limit: 5,
  //     page: 1 // Always first page for related products
  // });

  // const suggestedItems = suggestedData?.data || [];

  // If loading, show skeleton (implemented simply for now)
  if (isProductLoading)
    return (
      <div className="flex justify-center items-center min-h-screen pt-20">
        <div className="animate-spin h-12 w-12 border-4 border-emerald-500 rounded-full border-t-transparent"></div>
      </div>
    );

  // Use real data or fallback object structure
  const product = fetchedProduct
    ? {
        ...fetchedProduct,
        images:
          fetchedProduct.images && fetchedProduct.images.length > 0
            ? fetchedProduct.images
            : fetchedProduct.image
              ? [fetchedProduct.image]
              : [],
        stock: Number(fetchedProduct.stock ?? 50),
        originalPrice:
          fetchedProduct.originalPrice ||
          fetchedProduct.mrp ||
          fetchedProduct.price,
        discount:
          fetchedProduct.discount ||
          (fetchedProduct.mrp > fetchedProduct.price
            ? Math.round(
                ((fetchedProduct.mrp - fetchedProduct.price) /
                  fetchedProduct.mrp) *
                  100,
              )
            : 0),
        specialOffer: fetchedProduct.specialOffer || {
          title: "Bank Offer: 10% instant discount",
          code: "SBI10",
        },
      }
    : null;

  const isOutOfStock = product?.stock === 0;

  if (!product)
    return (
      <div className="flex justify-center items-center min-h-screen pt-20">
        <h2 className="text-xl font-semibold text-gray-700 font-gyrotrope">
          Product not found
        </h2>
      </div>
    );

  const scrollThumbnails = (direction) => {
    if (direction === "up" && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    } else if (
      direction === "down" &&
      selectedImage < product.images.length - 1
    ) {
      setSelectedImage(selectedImage + 1);
    }
  };

  const handleAddToCart = () => {
    if (!productDetails) return;

    if (isOutOfStock) {
      toastUtil.info(
        "This product is out of stock. Please request stock to be notified when it becomes available.",
      );
      return;
    }

    // User requested strict usage of 'rid' from product data
    const productRid = productDetails.rid;

    if (isAuthenticated) {
      if (!productRid) {
        toastUtil.error("Product RID missing. Cannot add to cart.");
        return;
      }
      // Authenticated flow
      addToCartMutation({
        rid: productRid,
        image: productDetails?.images?.[0]?.url || productDetails?.image,
        quantity: 1,
      });
    } else {
      // Guest flow
      addItemToLocalCart(
        {
          ...productDetails,
          // Ensure properties needed for local cart calculation are correct
          id: productDetails.id || productDetails._id,
          rid: productDetails.rid,
          image: productDetails.images?.[0]?.url || productDetails?.image,
        },
        1,
      );

      toastUtil.info("Login to sync your cart!");
      navigate(`/login?redirect=${window.location.pathname}`);
    }
  };

  const openRequestModal = () => setIsRequestModalOpen(true);

  const handleSendRequest = async () => {
    if (!productDetails) return;

    if (!isAuthenticated) {
      toastUtil.info("Please login to request stock.");
      navigate(`/login?redirect=${window.location.pathname}`);
      return;
    }

    const productRid = productDetails.rid;
    if (!productRid || !currentUserId) {
      toastUtil.error(
        "Unable to submit request. Missing user or product info.",
      );
      return;
    }

    const quantity = Number(requestQty);
    if (!quantity || quantity <= 0) {
      toastUtil.error("Please enter a valid quantity.");
      return;
    }

    setIsRequesting(true);
    try {
      await apiClient.post("/api/v1/products/request", {
        productId: productRid,
        requestedBy: currentUserId,
        quantity,
        remark: requestRemark || "",
      });

      toastUtil.success(
        "Request submitted. We'll notify you when it's back in stock.",
      );
      setIsRequestModalOpen(false);
      setRequestQty(1);
      setRequestRemark("");
    } catch (error) {
      if (!error || !error.response) {
        toastUtil.error("Failed to send request. Please try again.");
      }
    } finally {
      setIsRequesting(false);
    }
  };

  const actionButtonLoading = isOutOfStock ? isRequesting : isAddingToCart;

  return (
    <div style={{ paddingTop: "30px" }}>
      <style>{` 
         @media (min-width: 768px) { 
           .orders-container { 
             padding-top: 80px !important; 
           } 
         }
         @media (max-width: 639px) {
           .product-details-container {
             padding-left: 5px !important;
             padding-right: 5px !important;
           }
         }
         @media (min-width: 640px) and (max-width: 1290px) {
           .product-details-container {
             padding-left: 5px !important;
             padding-right: 5px !important;
           }
         }
       `}</style>
      <div className="orders-container flex flex-col min-h-screen bg-gray-50 ">
        <main className="grow">
          <div className="product-details-container flex flex-col items-center w-full px-4 md:px-6 lg:px-12">
            <div className="mx-auto max-w-7xl w-full">
              <div className="mb-6" style={{ marginBottom: "1.5rem" }}>
                <BackButton
                  fallbackRoute="/"
                  label="Back to Products"
                  className="inline-flex"
                />
              </div>

              {/* Product Section */}
              <div
                className="grid grid-cols-1 gap-6 sm:gap-8 mb-8 sm:mb-12"
                style={{
                  gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
                  marginBottom: "1.5rem",
                }}
                data-lg-grid="true"
              >
                <style>{`
                @media (min-width: 1024px) {
                  [data-lg-grid="true"] {
                    grid-template-columns: 2fr 3fr !important;
                  }
                }
              `}</style>
                <ProductImageGallery
                  images={productDetails?.images}
                  selectedImage={selectedImage}
                  onImageSelect={setSelectedImage}
                  onScroll={scrollThumbnails}
                />

                {/* Right - Product Info */}
                <div className="flex flex-col">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h1
                      style={{
                        fontFamily: "Gyrotrope",
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "#000000",
                        lineHeight: "1.4",
                        flex: 1,
                      }}
                    >
                      {productDetails?.name}
                    </h1>

                    {/* Wishlist Button */}
                    {/* <button
                      onClick={handleWishlistToggle}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
                      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Heart
                        size={24}
                        className={isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                      />
                    </button> */}
                  </div>

                  <ProductPriceSection
                    price={productDetails?.MRP}
                    originalPrice={productDetails?.MRP}
                    discount={productDetails?.discount}
                    stock={productDetails?.stock}
                    specialOffer={product?.specialOffer}
                  />

                  <ProductActionButtons
                    onAddToCart={handleAddToCart}
                    onViewCart={() => navigate("/cart")}
                    onRequestStock={openRequestModal}
                    isAdding={actionButtonLoading}
                    isOutOfStock={isOutOfStock}
                  />
                </div>
              </div>

              {/* Description Section */}
              <ProductDescription product={product} />

              {isRequestModalOpen && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                  style={{
                    padding: "20px",
                  }}
                >
                  <div
                    className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-lg"
                    style={{
                      padding: "20px",
                    }}
                  >
                    <div className="flex items-center justify-between border-b px-6 py-4">
                      <h2 className="text-lg font-semibold">Request Stock</h2>
                      <button
                        type="button"
                        onClick={() => setIsRequestModalOpen(false)}
                        className="text-xl font-bold leading-none text-gray-500 hover:text-gray-700"
                        aria-label="Close request modal"
                      >
                        ×
                      </button>
                    </div>

                    <div className="px-6 py-4 space-y-4">
                      <p className="text-sm text-gray-600">
                        This product is currently out of stock. Submit a request
                        and we&apos;ll notify you when it is back.
                      </p>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700">
                          Quantity
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={requestQty}
                          onChange={(e) =>
                            setRequestQty(Number(e.target.value))
                          }
                          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700">
                          Remark (optional)
                        </label>
                        <textarea
                          value={requestRemark}
                          onChange={(e) => setRequestRemark(e.target.value)}
                          rows={3}
                          className="mt-1 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none"
                          placeholder="Add any details that can help us fulfill your request"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 border-t px-6 py-4 sm:flex-row sm:justify-end">
                      <button
                        style={{
                          padding: "10px",
                        }}
                        type="button"
                        onClick={() => setIsRequestModalOpen(false)}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        style={{
                          padding: "10px",
                        }}
                        type="button"
                        onClick={handleSendRequest}
                        disabled={isRequesting}
                        className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isRequesting ? "Submitting..." : "Send Request"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews Section */}
              {/* <ProductReviews reviews={reviews} isLoading={isReviewsLoading} /> */}

              {/* Suggested Medicine Section */}
              {/* <SuggestedItemsSection
                title="Suggested Medicine"
                items={suggestedItems}
                className="mb-5"
                titleStyle={{
                  textDecorationThickness: '2px',
                  textDecorationColor: '#111827',
                  lineHeight: '1.2'
                }}
                containerStyle={{}}
              /> */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductDetails;
