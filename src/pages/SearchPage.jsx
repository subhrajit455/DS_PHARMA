import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import searchService from '@/services/api/searchService';
import useDebounce from '@/hooks/useDebounce';
import SearchResults from '@/components/features/search/SearchResults';
import { SearchFilters, SortDropdown } from '@/components/features/search/SearchFilters';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [facets, setFacets] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Parse URL params
  const query = searchParams.get('query') || '';
  const sort = searchParams.get('sort') || 'relevance';
  
  const [filters, setFilters] = useState({
     categories: searchParams.getAll('category'),
     priceRangeStr: null, 
     inStock: searchParams.get('instock') === 'true',
  });
  
  // Temporary filters state for mobile drawer
  const [tempFilters, setTempFilters] = useState(filters);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const response = await searchService.searchProducts({
          query: debouncedQuery,
          filters,
          sort,
          page: 1,
          limit: 50
        });
        setProducts(response?.data?.products || []);
        setFacets(response?.data?.facets || {});
      } catch (error) {
        console.error('Search failed:', error);
        setProducts([]); // Reset to empty array on error
        setFacets({}); // Reset facets on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, JSON.stringify(filters), sort]);

  const handleSortChange = (newSort) => {
     setSearchParams(prev => {
         prev.set('sort', newSort);
         return prev;
     });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleViewAll = () => {
    // 1. Reset URL params to remove query and filters
    setSearchParams({});
    // 2. Clear local filter state
    setFilters({
      categories: [],
      priceRangeStr: null,
      inStock: false,
    });
    // 3. Clear search input (if any)
    const searchInput = document.querySelector('input[type="search"]');
    if (searchInput) searchInput.value = '';
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pt-6 pb-20">
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
          className="flex flex-col md:flex-row justify-between items-start md:justify-items-center gap-4 mb-8 sticky md:sticky top-[40px] sm:top-[60px] md:top-0"
        >
          <div>
             <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
               {query ? (
                  <>Results for <span className="text-emerald-600">"{query}"</span></>
               ) : 'All Products'}
             </h1>
             <p className="text-gray-500 text-sm mt-1.5 font-medium">
               {isLoading ? 'Searching...' : `${products.length} items found`}
             </p>
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
                  <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     onClick={() => setIsMobileFiltersOpen(false)}
                     className="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm lg:hidden"
                  />
                  <motion.div
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
                                 setFilters(tempFilters); // Apply temp filters to real state
                                 setIsMobileFiltersOpen(false);
                              }}
                              className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
                           >
                              Apply Filters
                           </button>
                        </div>
                     </div>
                  </motion.div>
                </>
             )}
           </AnimatePresence>

           {/* Results Grid */}
           <main className="flex-1 min-w-0 ">
               <SearchResults products={products} isLoading={isLoading} query={query} onReset={handleViewAll} />
           </main>
        </div>

      </div>
    </div>
  );
};

export default SearchPage;
