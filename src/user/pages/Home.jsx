import React, { lazy, Suspense, useState, useEffect, useCallback } from "react";
import ResponsiveHeroSection from "@/user/components/sections/HeroSection";
import LazyComponent from "@/shared/components/LazyComponent";
import PharmacyProductCard from "@/user/components/product/components/PharmacyProductCard";
import PageLoader from "@/shared/components/loaders/PageLoader";
import { AlertCircle, PackageX, Loader2 } from "lucide-react";
import axios from "axios";

// Lazy load non-critical sections
const WhyChooseUsSection = lazy(
  () => import("@/user/components/sections/WhyChooseUsSection")
);

const productfetchapi = import.meta.env.VITE_MEDIA_CLOUD_BASE_URL;

const Home = () => {
  const limit = 25;

  const [allProducts, setAllProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  /**
   * Fetch products
   */
  const fetchProducts = useCallback(async (page = 1) => {
    if (page === 1) {
      setIsLoading(true);
    } else {
      setIsFetchingMore(true);
    }

    try {
      const response = await axios.get(
        `${productfetchapi}/api/v1/products?page=${page}&limit=${limit}&stock=2`
      );

      const dashData = response?.data?.data;

      console.log("API RESPONSE:", dashData);

      // Get products safely
      const apiProducts = Array.isArray(dashData?.products)
        ? dashData.products
        : [];

      /**
       * IMPORTANT:
       * Remove invalid products which don't have a proper name.
       *
       * This prevents PharmacyProductCard from displaying
       * "Unnamed Product".
       */
      const validProducts = apiProducts.filter((product) => {
        return (
          product &&
          typeof product.name === "string" &&
          product.name.trim().length > 0
        );
      });

      console.log("API products:", apiProducts.length);
      console.log("Valid products:", validProducts.length);

      // Show which products are invalid
      const invalidProducts = apiProducts.filter(
        (product) =>
          !product ||
          typeof product.name !== "string" ||
          product.name.trim().length === 0
      );

      if (invalidProducts.length > 0) {
        console.warn(
          "Products removed because name is missing:",
          invalidProducts
        );
      }

      /**
       * Update products
       */
      if (page === 1) {
        setAllProducts(validProducts);
      } else {
        setAllProducts((prevProducts) => [
          ...prevProducts,
          ...validProducts,
        ]);
      }

      /**
       * Pagination
       *
       * Use backend totalProducts for pagination.
       */
      const totalProductsCount = Number(dashData?.totalProducts || 0);

      const totalPages =
        totalProductsCount > 0
          ? Math.ceil(totalProductsCount / limit)
          : 0;

      setHasMore(
        page < totalPages &&
          apiProducts.length > 0
      );

      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load products. Please try again."
      );
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  }, []);

  /**
   * Initial API call
   */
  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  /**
   * Load next page
   */
  const handleLoadMore = () => {
    if (isFetchingMore || !hasMore) {
      return;
    }

    const nextPage = currentPage + 1;

    setCurrentPage(nextPage);

    fetchProducts(nextPage);
  };

  /**
   * Retry
   */
  const handleRetry = () => {
    setCurrentPage(1);
    setHasMore(true);
    setError(null);
    setAllProducts([]);

    fetchProducts(1);
  };

  /**
   * Error state
   */
  if (error && allProducts.length === 0 && !isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />

        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Something went wrong
        </h2>

        <p className="text-gray-600 mb-4 text-center">
          {error}
        </p>

        <button
          onClick={handleRetry}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  /**
   * Initial loading
   */
  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      {/* ================= HERO ================= */}
      <section className="py-2 my-2 sm:py-12 sm:my-8">
        <ResponsiveHeroSection />
      </section>

      {/* ================= PRODUCTS ================= */}
      <section className="w-full py-8 min-h-screen">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              All Products
            </h2>

            <div className="flex flex-col items-end">
              <span className="text-gray-500 text-sm font-medium">
                Showing {allProducts.length} Products
              </span>
            </div>
          </div>

          {/* ================= EMPTY STATE ================= */}
          {allProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <PackageX className="w-16 h-16 mb-4 text-gray-300" />

              <p className="text-lg">
                No products found.
              </p>
            </div>
          ) : (
            <>
              {/* ================= PRODUCT GRID ================= */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">

                {allProducts.map((product) => {
                  /**
                   * Safety check.
                   *
                   * Even though we filter products in fetchProducts,
                   * this prevents invalid data from crashing the UI.
                   */
                  if (
                    !product ||
                    typeof product.name !== "string" ||
                    !product.name.trim()
                  ) {
                    return null;
                  }

                  const productName = product.name.trim();

                  const productRate = Number(product.Rate) || 0;
                  const productMRP = Number(product.MRP) || 0;
                  const productStock = Number(product.stock) || 0;

                  /**
                   * Calculate discount from MRP and Rate.
                   */
                  const discount =
                    productMRP > 0 &&
                    productRate > 0 &&
                    productMRP > productRate
                      ? Math.round(
                          ((productMRP - productRate) / productMRP) * 100
                        )
                      : 0;

                  /**
                   * Product image
                   */
                  const productImage =
                    Array.isArray(product.images) &&
                    product.images.length > 0 &&
                    product.images[0]?.url
                      ? product.images[0].url
                      : null;

                  /**
                   * Unit
                   */
                  const productUnit =
                    productName.split(" ").pop() || "";

                  return (
                    <PharmacyProductCard
                      key={product._id}
                      id={product._id}
                      rid={product.rid}

                      name={productName}

                      price={productRate}

                      originalPrice={
                        productMRP > 0 ? productMRP : productRate
                      }

                      mrp={productMRP}

                      discount={discount}

                      image={productImage}

                      imageUrl={productImage}

                      unit={productUnit}

                      /**
                       * Keep your existing stock logic.
                       */
                      stock={productStock < 3}

                      inStock={productStock}

                      className="w-full"
                    />
                  );
                })}

                {/* ================= SKELETONS ================= */}
                {isFetchingMore &&
                  Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={`skeleton-${index}`}
                      className="w-full h-[320px] bg-gray-100 rounded-lg animate-pulse"
                    />
                  ))}
              </div>

              {/* ================= LOAD MORE ================= */}
              <div className="mt-12 flex justify-center pb-8">

                {hasMore ? (
                  <button
                    onClick={handleLoadMore}
                    disabled={isFetchingMore}
                    className="
                      group
                      relative
                      inline-flex
                      items-center
                      justify-center
                      px-8
                      py-3
                      font-semibold
                      text-white
                      bg-blue-600
                      rounded-full
                      transition-all
                      duration-200
                      hover:bg-blue-700
                      hover:shadow-lg
                      hover:-translate-y-0.5
                      disabled:opacity-70
                      disabled:cursor-not-allowed
                      disabled:hover:transform-none
                    "
                  >
                    {isFetchingMore ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />

                        Loading...
                      </>
                    ) : (
                      <>
                        <span>
                          Load More
                        </span>

                        <span
                          className="
                            absolute
                            -right-2
                            top-0
                            h-3
                            w-3
                            rounded-full
                            bg-red-400
                            opacity-0
                            transition-all
                            duration-300
                            group-hover:opacity-100
                            group-hover:right-[-4px]
                          "
                        />
                      </>
                    )}
                  </button>
                ) : (
                  allProducts.length > 0 && (
                    <div
                      className="
                        text-center
                        text-gray-500
                        py-4
                        font-medium
                        bg-gray-50
                        px-6
                        rounded-full
                      "
                    >
                      🎉 You’ve reached the end of the list
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <LazyComponent>
        <section className="py-2 my-2 sm:py-12 sm:my-8 bg-gray-50">
          <WhyChooseUsSection />
        </section>
      </LazyComponent>
    </Suspense>
  );
};

export default Home;