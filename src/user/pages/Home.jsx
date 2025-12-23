import ResponsiveHeroSection from '@/user/components/sections/HeroSection';
import PopularCategoriesSection from '@/user/components/sections/PopularCategoriesSection';
import BannerSection from '@/user/components/sections/BannerSection';
import HighlightedCategorySection from '@/user/components/sections/HighlightedCategorySection';
import PharmacyProductsShowcase from '@/user/components/sections/PharmacyProductsShowcase';
import WhyChooseUsSection from '@/user/components/sections/WhyChooseUsSection';
import AlertBanner from '@/user/components/sections/alerts/AlertBanner';

import useDataStore from '@/store/useDataStore';
import { useCategories } from '@/shared/hooks/queries/useProducts';
import Loading from '@/shared/components/common/Loading';
import ErrorState from '@/shared/components/common/ErrorState';

const Home = () => {
  // Use categories from store to check visibility (Source of Truth)
  const storeCategories = useDataStore(state => state.categories);
  
  // Get categories from API source
  const { data: categoryData, isLoading, isError } = useCategories();
  
  // We filter out any "All" or empty categories AND hidden categories
  const allCategories = categoryData?.data || [];
  const validCategories = allCategories.filter(c => {
      const catName = typeof c === 'string' ? c : c.name;
      if (catName === 'All') return false;
      
      // Check if this category is visible in the store
      const storeCat = storeCategories.find(sc => sc.name === catName);
      // Default to true if not found (legacy safety), otherwise respect isVisible
      const isVisible = storeCat ? (storeCat.isVisible !== false) : true;
      return isVisible;
  });

  // Dynamic layout logic: Split categories into two chunks
  const midIndex = Math.ceil(validCategories.length / 2);
  const firstHalfCategories = validCategories.slice(0, midIndex);
  const secondHalfCategories = validCategories.slice(midIndex);

  if (isLoading) return <Loading className="h-screen" />;
  if (isError) return <ErrorState message="Failed to load homepage" />;

  return (
    <>
      {/* Top Alerts */}
      <AlertBanner position="top" />

      {/* Hero Section */}
      <section className="py-2 my-2 sm:py-12 sm:my-8">
        <ResponsiveHeroSection />
      </section>

      {/* Popular Categories Section */}
      <section className="py-2 my-2 sm:py-12 sm:my-8">
        <PopularCategoriesSection />
      </section>

      {/* First Block of Pharmacy Products (Top Half of Categories) */}
      <PharmacyProductsShowcase categories={firstHalfCategories} />

      {/* Banner Section */}
      <section className="py-2 my-2 sm:py-12 sm:my-8">
        <BannerSection />
      </section>

      {/* Highlighted / Featured Category Section (Admin Controlled) */}
      <section className="py-2 my-2 sm:py-12 sm:my-8">
        <HighlightedCategorySection />
      </section>

      {/* Second Block of Pharmacy Products (Bottom Half of Categories) */}
      <PharmacyProductsShowcase categories={secondHalfCategories} />

      {/* Second Banner Section (Optional - kept if original layout had multiple banners) */}
      <section className="py-2 my-2 sm:py-12 sm:my-8">
        <BannerSection />
      </section>

      {/* Why Choose Us Section */}
      <section className="py-2 my-2 sm:py-12 sm:my-8">
        <WhyChooseUsSection />
      </section>


      {/* Bottom Alerts */}
      <AlertBanner position="bottom" />
    </>
  );
};

export default Home;
