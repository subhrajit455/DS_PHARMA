import React from 'react';
import ProductCategorySection from './ProductCategorySection';
import { PRODUCTS } from '@/data/sampleData';

const PharmacyProductsShowcase = () => {
  // Filter products from mock data
  const paracetamolProducts = PRODUCTS.filter(p => p.category === "Fever & Pain").slice(0, 5);
  const antibioticProducts = PRODUCTS.filter(p => p.category === "Antibiotics").slice(0, 5);
  // Add another category for variety if needed, e.g. Skin Care or Vitamins
  const vitaminProducts = PRODUCTS.filter(p => p.category === "Vitamins & Supplements").slice(0, 5);

  const handleAddToCart = (product) => {
    console.log('Added to cart:', product);
    // Implement cart logic here
  };

  const handleProductClick = (product) => {
    console.log('Product clicked:', product);
    // Implement navigation to product detail page
  };

  const handleViewAll = (categoryTitle) => {
    console.log('View all clicked for:', categoryTitle);
    // Implement navigation to category page
  };

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
        {/* Pain Relief Category */}
        <div className="mb-12 lg:mb-16">
          <ProductCategorySection
            title="Fever & Pain Relief"
            products={paracetamolProducts}
            onAddToCart={handleAddToCart}
            onProductClick={handleProductClick}
            onViewAll={handleViewAll}
            className="py-0 bg-transparent mb-0"
          />
        </div>

        {/* Antibiotics Category */}
        <div className="mb-12 lg:mb-16">
          <ProductCategorySection
            title="Antibiotics"
            products={antibioticProducts}
            onAddToCart={handleAddToCart}
            onProductClick={handleProductClick}
            onViewAll={handleViewAll}
            className="py-0 bg-transparent mb-0"
          />
        </div>

        {/* Vitamins Category */}
        <ProductCategorySection
          title="Vitamins & Supplements"
          products={vitaminProducts}
          onAddToCart={handleAddToCart}
          onProductClick={handleProductClick}
          onViewAll={handleViewAll}
          className="py-0 bg-transparent mb-0"
        />
      </div>
    </section>
    </>
  );
};

export default PharmacyProductsShowcase;
