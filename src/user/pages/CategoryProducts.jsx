import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { Package, PackageX, Loader2 } from 'lucide-react';
import { PharmacyProductCard } from '@/user/components/product';
import productService from '@/services/productService';
import BackButton from '@/shared/components/BackButton';
import { ProductGridSkeleton } from '@/shared/components/skeletons/ProductSkeleton';

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  // State
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('Category Products');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  // Refs
  const observerRef = useRef(null);
  const fetchingRef = useRef(false);
  const currentCategoryRef = useRef(null);

  // 1. Fetch Category Details & Initial Products
  useEffect(() => {
    let isMounted = true;
    
    // Cancel previous requests when category changes
    if (currentCategoryRef.current !== categoryId) {
      productService.cleanupActiveRequests(`category_${categoryId}`);
    }
    
    currentCategoryRef.current = categoryId;
    
    const initFetch = async () => {
      if (!categoryId) return;
      
      setLoading(true);
      setError(false);
      setPage(1);
      setProducts([]);
      setHasMore(true);
      fetchingRef.current = false;
      
      try {
        // Parallel fetch for speed
        const [categories, productRes] = await Promise.all([
          productService.getAllCategories(),
          productService.getProductsByCategory(categoryId, 1, 12)
        ]);

        if (!isMounted) return;

        // Set Category Name
        const currentCat = categories.find(c => c.id === categoryId);
        if (currentCat) setCategoryName(currentCat.name);

        // Set Products
        if (productRes) {
          // Ensure all products have proper image fallbacks
          const productsWithImages = productRes.data?.map(product => {
            if (!product.image || !product.images || product.images.length === 0) {
              return productService.normalizeProduct(product);
            }
            return product;
          }) || [];
          
          setProducts(productsWithImages);
          setTotalItems(productRes.pagination?.totalItems || 0);
          setHasMore(productRes.pagination?.hasMore || false);
        }
      } catch (err) {
        console.error("Initial fetch failed:", err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initFetch();
    
    return () => { 
      isMounted = false;
      // Cancel requests when component unmounts or category changes
      if (currentCategoryRef.current === categoryId) {
        productService.cleanupActiveRequests(`category_${categoryId}`);
      }
    };
  }, [categoryId]);

  // 2. Fetch Next Page
  const fetchNextPage = useCallback(async () => {
    // Prevent duplicate calls
    if (fetchingRef.current || !hasMore || loadingMore) {
      return;
    }
    
    fetchingRef.current = true;
    setLoadingMore(true);
    
    try {
      const nextPage = page + 1;
      const result = await productService.getProductsByCategory(categoryId, nextPage, 12);
      
      if (result && result.data && Array.isArray(result.data)) {
        // Ensure new products have proper image fallbacks
        const newProducts = result.data.map(product => {
          if (!product.image || !product.images || product.images.length === 0) {
            return productService.normalizeProduct(product);
          }
          return product;
        });
        
        setProducts(prev => [...prev, ...newProducts]);
        setPage(nextPage);
        setHasMore(result.pagination?.hasMore || false);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to fetch next page:", err);
      // Don't set hasMore to false on error - allow retry
    } finally {
      setLoadingMore(false);
      fetchingRef.current = false;
    }
  }, [categoryId, hasMore, page, loadingMore]);

  // 3. Infinite Scroll Intersection Observer
  const lastElementRef = useCallback(node => {
    // Don't observe if loading or no more items
    if (loading || !hasMore) return;
    
    // Disconnect previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !fetchingRef.current) {
          fetchNextPage();
        }
      },
      {
        root: null, // viewport
        rootMargin: '100px', // Trigger 100px before reaching element
        threshold: 0.1,
      }
    );

    if (node) {
      observerRef.current.observe(node);
    }
  }, [loading, hasMore, fetchNextPage]);
  
  // Clean up observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleProductClick = (product) => {
    navigate(`/product/${product.id || product._id}`);
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div style={{ paddingTop: '30px' }}>
      <style>{` 
         @media (min-width: 768px) { 
           .category-container { 
             padding-top: 80px !important; 
           } 
         }
         @media (max-width: 639px) {
           .category-products-container {
             padding-left: 5px !important;
             padding-right: 5px !important;
           }
         }
         @media (min-width: 640px) and (max-width: 1290px) {
           .category-products-container {
             padding-left: 5px !important;
             padding-right: 5px !important;
           }
         }
       `}</style>
      <div className="category-container flex flex-col min-h-screen bg-gray-50">
        <main className="grow">
          <div className="category-products-container flex flex-col items-center w-full px-4 md:px-6 lg:px-12">
            <div className="mx-auto max-w-7xl w-full">
              {/* Top Header */}
              <div className="mb-6" style={{ marginBottom: '1.5rem' }}>
                <BackButton fallbackRoute="/" label="Back to Home" className="inline-flex" />
              </div>

              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1
                      style={{
                        fontFamily: 'Gyrotrope',
                        fontSize: '28px',
                        fontWeight: 700,
                        color: '#111827',
                        lineHeight: '1.2'
                      }}
                    >
                      {categoryName}
                    </h1>
                    <p
                      style={{
                        fontFamily: 'Gyrotrope',
                        fontSize: '14px',
                        color: '#6B7280',
                        marginTop: '0.5rem'
                      }}
                    >
                      {totalItems} products available
                    </p>
                  </div>
                </div>
              </div>

              {/* Content States */}
              {loading ? (
                <ProductGridSkeleton count={12} />
              ) : error ? (
                <div className="py-20 flex flex-col items-center justify-center text-center bg-white rounded-3xl shadow-sm border border-gray-100 px-4">
                  <PackageX className="w-16 h-16 text-red-100 mb-4" />
                  <h2
                    style={{
                      fontFamily: 'Gyrotrope',
                      fontSize: '20px',
                      fontWeight: 700,
                      color: '#111827',
                      marginBottom: '0.5rem'
                    }}
                  >
                    Something went wrong
                  </h2>
                  <p className="text-gray-500 max-w-sm mb-8">We couldn't load the products. The server might be temporarily unavailable.</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-100"
                    style={{ fontFamily: 'Gyrotrope' }}
                  >
                    Try Again
                  </button>
                </div>
              ) : products.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center bg-white rounded-3xl shadow-sm border border-gray-100 px-4">
                  <Package className="w-16 h-16 text-gray-200 mb-4" />
                  <h2
                    style={{
                      fontFamily: 'Gyrotrope',
                      fontSize: '20px',
                      fontWeight: 700,
                      color: '#111827',
                      marginBottom: '0.5rem'
                    }}
                  >
                    No products found
                  </h2>
                  <p className="text-gray-500 max-w-sm">We don't have any items in this category yet. Check back soon!</p>
                </div>
              ) : (
                <>
                  <Motion.div 
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {products.map((product, index) => (
                      <Motion.div 
                        key={`${product.id}-${index}`}
                        variants={itemVariants}
                        ref={index === products.length - 1 ? lastElementRef : null}
                      >
                        <PharmacyProductCard 
                           {...product} 
                           onCardClick={() => handleProductClick(product)}
                        />
                      </Motion.div>
                    ))}
                  </Motion.div>

                  {/* Loading More Indicator */}
                  {loadingMore && (
                    <div className="mt-12 flex justify-center py-4">
                      <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-md border border-gray-100">
                        <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                        <span
                          style={{
                            fontFamily: 'Gyrotrope',
                            fontSize: '14px',
                            fontWeight: 700,
                            color: '#374151'
                          }}
                        >
                          Loading more products...
                        </span>
                      </div>
                    </div>
                  )}

                  {/* End of list message */}
                  {!hasMore && products.length > 0 && (
                    <div className="mt-16 text-center">
                      <div className="inline-flex items-center gap-3 px-6 py-2 bg-gray-100 rounded-full">
                         <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                         <span
                           style={{
                             fontFamily: 'Gyrotrope',
                             fontSize: '12px',
                             fontWeight: 700,
                             color: '#6B7280',
                             textTransform: 'uppercase',
                             letterSpacing: '0.1em'
                           }}
                         >
                           You've reached the end
                         </span>
                         <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CategoryProducts;
