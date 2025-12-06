import React from 'react';
import { SearchX } from 'lucide-react';
import PharmacyProductCard from '@/components/features/product/components/PharmacyProductCard';
import SearchSkeleton from './SearchSkeleton';

const SearchResults = ({ products, isLoading, query }) => {
  if (isLoading) {
    return <SearchSkeleton />;
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-72px)] py-20 bg-white rounded-3xl border border-gray-100 shadow-sm text-center px-4">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
           <SearchX className="w-10 h-10 text-gray-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">
           We couldn't find any products matching "{query}". Try checking for typos or using broader keywords.
        </p>
        <button 
           onClick={() => window.location.reload()} // Simple reset or could use a prop to clear filters
           className="px-6 py-2.5 bg-emerald-500 text-white font-medium rounded-full hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/30"
           style={{ padding: '5px 10px', marginTop: '12px' }}
        >
           View All Products
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <PharmacyProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          originalPrice={product.mrp}
          quantity="1"
          unit="strip"
          imageUrl={product.image}
          className="h-full hover:-translate-y-1 transition-transform"
        />
      ))}
    </div>
  );
};

export default SearchResults;
