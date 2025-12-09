import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCategorySection from './ProductCategorySection';
import { useProducts } from '@/hooks/queries/useProducts';

import Loading from '@/components/common/Loading';
import ErrorState from '@/components/common/ErrorState';

const PharmacyProductsShowcase = () => {
  const navigate = useNavigate();
  
  // Fetch products by category
  // In a real app, might want to use a specific "featured sections" endpoint to avoid waterfalls
  const { data: feverData, isLoading: isFeverLoading, isError: isFeverError } = useProducts({ category: "Fever & Pain", limit: 5 });
  const { data: antibioticData, isLoading: isAntibioticLoading, isError: isAntibioticError } = useProducts({ category: "Antibiotics", limit: 5 });
  const { data: vitaminData, isLoading: isVitaminLoading, isError: isVitaminError } = useProducts({ category: "Vitamins & Supplements", limit: 5 });
  const { data: stomachData, isLoading: isStomachLoading, isError: isStomachError } = useProducts({ category: "Stomach Care", limit: 5 });
  const { data: skinData, isLoading: isSkinLoading, isError: isSkinError } = useProducts({ category: "Skin Care", limit: 5 });
  const { data: coughData, isLoading: isCoughLoading, isError: isCoughError } = useProducts({ category: "Cough & Cold", limit: 5 });

  const paracetamolProducts = feverData?.data || [];
  const antibioticProducts = antibioticData?.data || [];
  const vitaminProducts = vitaminData?.data || [];
  const stomachProducts = stomachData?.data || [];
  const skinProducts = skinData?.data || [];
  const coughProducts = coughData?.data || [];

  const isLoading = isFeverLoading || isAntibioticLoading || isVitaminLoading || isStomachLoading || isSkinLoading || isCoughLoading;
  const isError = isFeverError || isAntibioticError || isVitaminError || isStomachError || isSkinError || isCoughError;

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  const handleViewAll = (categoryTitle) => {
    navigate(`/category/${encodeURIComponent(categoryTitle)}`);
  };

  if (isLoading) return <Loading className="py-20" />;
  if (isError) return <ErrorState message="Failed to load product showcase" />;

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
            onProductClick={handleProductClick}
            onViewAll={handleViewAll}
            className="py-0 bg-transparent mb-0"
          />
        </div>

        {/* Vitamins Category */}
        <div className="mb-12 lg:mb-16">
          <ProductCategorySection
            title="Vitamins & Supplements"
            products={vitaminProducts}
            onProductClick={handleProductClick}
            onViewAll={handleViewAll}
            className="py-0 bg-transparent mb-0"
          />
        </div>

        {/* Stomach Care Category */}
        <div className="mb-12 lg:mb-16">
          <ProductCategorySection
            title="Stomach Care"
            products={stomachProducts}
            onProductClick={handleProductClick}
            onViewAll={handleViewAll}
            className="py-0 bg-transparent mb-0"
          />
        </div>

        {/* Skin Care Category */}
        <div className="mb-12 lg:mb-16">
          <ProductCategorySection
            title="Skin Care"
            products={skinProducts}
            onProductClick={handleProductClick}
            onViewAll={handleViewAll}
            className="py-0 bg-transparent mb-0"
          />
        </div>

        {/* Cough & Cold Category */}
        <ProductCategorySection
          title="Cough & Cold"
          products={coughProducts}
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
