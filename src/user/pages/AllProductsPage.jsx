import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SlidersHorizontal, X, ArrowLeft } from 'lucide-react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { productService } from '@/services/productService';
import useDebounce from '@/shared/hooks/useDebounce';
import SearchResults from '@/user/components/search/SearchResults';
import { SearchFilters, SortDropdown } from '@/user/components/search/SearchFilters';
import { Pagination } from '@/admin/components/ui/Pagination';

const AllProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [facets, setFacets] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Pagination State
  const [pagination, setPagination] = useState({
    currentPage: parseInt(searchParams.get('page') || '1', 10),
    totalPages: 1,
    totalItems: 0,
    limit: parseInt(searchParams.get('limit') || '12', 10)
  });
  
  // Parse URL params for filters
  const sort = searchParams.get('sort') || 'relevance';
  
  const [filters, setFilters] = useState({
     categories: searchParams.getAll('category'),
     priceRangeStr: searchParams.get('priceRange') || 'all', 
     inStock: searchParams.get('instock') === 'true',
     isFeatured: searchParams.get('featured') === 'true',
  });
  
  // Temporary filters state for mobile drawer
  const [tempFilters, setTempFilters] = useState(filters);

  const debouncedFilters = useDebounce(filters, 300);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const response = await productService.getAllProducts({
          page: pagination.currentPage,
          limit: pagination.limit,
          filters: {
            ...debouncedFilters,
            sort
          }
        });
        
        let fetchedProducts = response.data || [];
        
        // Logic: Display out of stock products last
        fetchedProducts = [...fetchedProducts].sort((a, b) => {
          if (a.inStock === b.inStock) return 0;
          return a.inStock ? -1 : 1;
        });

        setProducts(fetchedProducts);
        setPagination(prev => ({
          ...prev,
          totalPages: response.pagination?.totalPages || 1,
          totalItems: response.pagination?.totalItems || 0,
          currentPage: response.pagination?.currentPage || pagination.currentPage
        }));
        
        setFacets({}); // Facets can be populated if API supports it
      } catch (error) {
        console.error('Fetch paginated products failed:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.currentPage, pagination.limit, JSON.stringify(debouncedFilters), sort]);

  // Sync state with URL params when they change
  useEffect(() => {
    const pageInUrl = parseInt(searchParams.get('page') || '1', 10);
    const limitInUrl = parseInt(searchParams.get('limit') || '12', 10);
    
    if (pageInUrl !== pagination.currentPage || limitInUrl !== pagination.limit) {
      setPagination(prev => ({ 
        ...prev, 
        currentPage: pageInUrl,
        limit: limitInUrl 
      }));
    }

    setFilters(prev => ({
      ...prev,
      categories: searchParams.getAll('category'),
      inStock: searchParams.get('instock') === 'true',
      isFeatured: searchParams.get('featured') === 'true',
      priceRangeStr: searchParams.get('priceRange') || 'all',
    }));
  }, [searchParams, pagination.currentPage, pagination.limit]);

  const handlePageChange = (newPage) => {
    setSearchParams(prev => {
      prev.set('page', newPage.toString());
      return prev;
    });
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newLimit) => {
    setSearchParams(prev => {
      prev.set('limit', newLimit.toString());
      prev.set('page', '1'); // Reset to page 1
      return prev;
    });
  };

  const handleSortChange = (newSort) => {
     setSearchParams(prev => {
         prev.set('sort', newSort);
         prev.set('page', '1'); // Reset to page 1 on sort change
         return prev;
     });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setSearchParams(prev => {
       // Sync categories
       prev.delete('category');
       newFilters.categories.forEach(cat => prev.append('category', cat));
       
       // Sync other filters
       if (newFilters.priceRangeStr !== 'all') prev.set('priceRange', newFilters.priceRangeStr);
       else prev.delete('priceRange');
       
       if (newFilters.inStock) prev.set('instock', 'true');
       else prev.delete('instock');
       
       if (newFilters.isFeatured) prev.set('featured', 'true');
       else prev.delete('featured');

       prev.set('page', '1'); // Reset to page 1 on filter change
       return prev;
    });
  };

  const handleViewAll = () => {
    // 1. Reset URL params to remove filters
    setSearchParams({});
    // 2. Clear local filter state
    setFilters({
      categories: [],
      priceRangeStr: 'all',
      inStock: false,
      isFeatured: false,
    });
  };

  return (
    <div className="all-products-page-wrapper min-h-screen bg-gray-50/50">
      <style>{`
        .all-products-page-wrapper {
          padding-top: 30px;
          padding-bottom: 80px;
        }
        @media (min-width: 768px) {
          .all-products-page-wrapper {
            padding-top: 80px !important;
          }
        }
      `}</style>
      <div className="px-4 sm:px-6 lg:px-8" style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding:'10px' }}>
        
        {/* Header */}
        <div 
          style={{ 
            zIndex: 30, 
            backgroundColor: 'rgba(249, 250, 251, 0.95)', 
            backdropFilter: 'blur(8px)',
            paddingTop: '1rem',
            paddingBottom: '1rem',
            marginTop: '-1rem' // Compensate for padding to maintain visual flow
          }}
          className="flex flex-col md:flex-row justify-between items-start md:justify-items-center gap-4 mb-8 sticky top-[50px] sm:top-[60px] md:top-[85px]"
        >
          <div className="flex items-center gap-4">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium p-2 rounded-lg hover:bg-gray-100"
              aria-label="Go back to previous page"
            >
              <ArrowLeft size={20} />
            </button>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                All Products
              </h1>
              <p className="text-gray-500 text-sm mt-1.5 font-medium">
                {isLoading ? 'Loading...' : `${pagination.totalItems.toLocaleString()} items found`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-3 w-full md:w-auto">
             <button 
                onClick={() => {
                   setTempFilters(filters); // Initialize temp state with current real filters
                   setIsMobileFiltersOpen(true);
                }}
                className="lg:hidden flex items-center gap-1 sm:gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-700 shadow-sm active:scale-95 transition-all"
                style={{ padding: '5px 10px' }}
             >
                <SlidersHorizontal className="w-2.5 h-2.5 sm:w-4 sm:h-4" />
               <span className='text-[9px] sm:text-[12px]' style={{marginTop: '5px'}}>Filters</span>
             </button>
             <div className="ml-auto w-auto">
                <SortDropdown currentSort={sort} onSortChange={handleSortChange} />
             </div>
          </div>
        </div>

        <div className="flex gap-8 items-start">
           {/* Sidebar Filters (Desktop) */}
           <aside className="hidden lg:block w-72 shrink-0 sticky top-24">
              <SearchFilters 
                 filters={facets} 
                 selectedFilters={filters} 
                 onFilterChange={handleFilterChange} 
                 onViewAll={handleViewAll}
              />
           </aside>

           {/* Mobile Filters Drawer */}
           <AnimatePresence>
             {isMobileFiltersOpen && (
                <>
                  <Motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     onClick={() => setIsMobileFiltersOpen(false)}
                     className="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm lg:hidden"
                  />
                  <Motion.div
                     initial={{ x: '100%' }}
                     animate={{ x: 0 }}
                     exit={{ x: '100%' }}
                     transition={{ type: "spring", damping: 25, stiffness: 200 }}
                     className="fixed right-0 top-0 bottom-0 z-70 w-[320px] bg-white shadow-2xl lg:hidden"
                  >
                     <div className="flex flex-col h-full" style={{padding: '10px'}}>
                        <div className="flex justify-between items-center p-5 border-b border-gray-100">
                           <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                           <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                              <X className="w-5 h-5 text-gray-500" />
                           </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-5">
                           <SearchFilters 
                              filters={facets} 
                              selectedFilters={tempFilters} 
                              onFilterChange={setTempFilters}
                              className="shadow-none border-none p-0"
                           />
                        </div>
                        <div className="p-5 border-t border-gray-100 bg-gray-50">
                           <button 
                              onClick={() => {
                                 handleFilterChange(tempFilters);
                                 setIsMobileFiltersOpen(false);
                              }}
                              className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
                           >
                              Apply Filters
                           </button>
                        </div>
                     </div>
                  </Motion.div>
                </>
             )}
           </AnimatePresence>

           {/* Results Grid */}
           <main className="flex-1 min-w-0 flex flex-col gap-10">
               <SearchResults products={products} isLoading={isLoading} query="" onReset={handleViewAll} />
               
               {pagination.totalPages > 1 && !isLoading && (
                 <div className="mt-4 pb-10">
                    <Pagination 
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      totalItems={pagination.totalItems}
                      onPageChange={handlePageChange}
                      itemsPerPage={pagination.limit}
                      onItemsPerPageChange={handleItemsPerPageChange}
                      loading={isLoading}
                      variant="default"
                    />
                 </div>
               )}
           </main>
        </div>

      </div>
    </div>
  );
};

export default AllProductsPage;