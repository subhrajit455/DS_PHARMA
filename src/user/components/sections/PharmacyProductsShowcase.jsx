import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCategorySection from './ProductCategorySection';
import { useProducts } from '@/shared/hooks/queries/useProducts';
import Loading from '@/shared/components/common/Loading';
import ErrorState from '@/shared/components/common/ErrorState';

// Inner component to fetch data for a single category
// Keeping it inside ensuring it's isolated and uses the hook cleanly
const CategorySectionItem = ({ categoryName }) => {
  const navigate = useNavigate();
  // Fetch products for this specific category
  const { data, isLoading, isError } = useProducts({ category: categoryName, limit: 10 });
  
  // Filter out hidden products
  const products = (data?.data || []).filter(p => p.isVisible !== false);

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  const handleViewAll = (categoryTitle) => {
    navigate(`/category/${encodeURIComponent(categoryTitle)}`);
  };

  if (isLoading) return <div className="w-full h-64 flex items-center justify-center"><Loading /></div>;
  if (isError) return null; // Skip sections that fail to load
  if (!products || products.length === 0) return null; // Skip empty categories

  return (
    <div className="mb-12 lg:mb-16 last:mb-0">
      <ProductCategorySection
        title={categoryName}
        products={products}
        onProductClick={handleProductClick}
        onViewAll={handleViewAll}
        className="py-0 bg-transparent mb-0"
      />
    </div>
  );
};

const PharmacyProductsShowcase = ({ categories = [] }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <>
      <style>{`
        @media (max-width: 639px) {
          .pharmacy-products-showcase {
            padding-left: 5px !important;
            padding-right: 5px !important;
          }
        }
        @media (min-width: 640px) and (max-width: 1290px) {
          .pharmacy-products-showcase {
            padding-left: 5px !important;
            padding-right: 5px !important;
          }
        }
      `}</style>
      <section className="pharmacy-products-showcase w-full bg-gray-50 py-16 lg:py-20 mb-25 flex justify-center items-center" style={{ width: '100%' }}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {categories.map((category) => (
             /* Check if category is object or string, handle both */
            <CategorySectionItem 
              key={typeof category === 'string' ? category : category.name} 
              categoryName={typeof category === 'string' ? category : category.name} 
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default PharmacyProductsShowcase;
