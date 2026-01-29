import React, { useState, useEffect, lazy, Suspense } from 'react';
import ResponsiveHeroSection from '@/user/components/sections/HeroSection';
import PopularCategoriesSection from '@/user/components/sections/PopularCategoriesSection';
import LazyComponent from '@/shared/components/LazyComponent';
import productService from '@/services/productService';

// Lazy load non-critical sections
const HighlightedCategorySection = lazy(() => import('@/user/components/sections/HighlightedCategorySection'));
const BannerSection = lazy(() => import('@/user/components/sections/BannerSection'));
const PharmacyProductsShowcase = lazy(() => import('@/user/components/sections/PharmacyProductsShowcase'));
const WhyChooseUsSection = lazy(() => import('@/user/components/sections/WhyChooseUsSection'));

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const data = await productService.getAllCategories();
        if (isMounted) {
          // Filter out hidden categories if any survive service layer
          const visibleCategories = (data || []).filter(c => c.isVisible !== false);
          setCategories(visibleCategories);
        }
      } catch (err) {
        console.error("Home page failed to load categories:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCategories();
    return () => { isMounted = false; };
  }, []);
  
  // Dynamic layout logic: Split categories into two chunks
  const midIndex = Math.ceil(categories.length / 2);
  const firstHalfCategories = categories.slice(0, midIndex);
  const secondHalfCategories = categories.slice(midIndex);

  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>

      {/* Hero Section */}
      <section className="py-2 my-2 sm:py-12 sm:my-8">
        <ResponsiveHeroSection />
      </section>

      {/* Popular Categories Section */}
      <section className="py-2 my-2 sm:py-12 sm:my-8">
        <PopularCategoriesSection />
      </section>

      {/* First Block of Pharmacy Products (Top Half of Categories) */}
      {!loading && firstHalfCategories.length > 0 && (
        <LazyComponent>
          <PharmacyProductsShowcase categories={firstHalfCategories} />
        </LazyComponent>
      )}

      {/* Static Banner Section */}
      <LazyComponent>
        <BannerSection />
      </LazyComponent>



      {/* Featured Products Section (Reverted to HighlightedCategorySection) */}
      <LazyComponent>
        <section className="py-2 my-2 sm:py-12 sm:my-8 bg-gray-50/20">
          <HighlightedCategorySection />
        </section>
      </LazyComponent>

      <LazyComponent>
        <BannerSection />
      </LazyComponent>

      {/* Second Block of Pharmacy Products (Bottom Half of Categories) */}
      {!loading && secondHalfCategories.length > 0 && (
        <LazyComponent>
          <PharmacyProductsShowcase categories={secondHalfCategories} />
        </LazyComponent>
      )}


      {/* Why Choose Us Section */}
      <LazyComponent>
        <section className="py-2 my-2 sm:py-12 sm:my-8">
          <WhyChooseUsSection />
        </section>
      </LazyComponent>


    </Suspense>
  );
};

export default Home;
