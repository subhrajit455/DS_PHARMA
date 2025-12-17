import ResponsiveHeroSection from '../components/sections/HeroSection';
import PopularCategoriesSection from '../components/sections/PopularCategoriesSection';
import BannerSection from '../components/sections/BannerSection';
import HighlightedCategorySection from '../components/sections/HighlightedCategorySection';
import PharmacyProductsShowcase from '../components/sections/PharmacyProductsShowcase';
import WhyChooseUsSection from '../components/sections/WhyChooseUsSection';
import AboutUsSection from '../components/sections/AboutUsSection';
import AlertBanner from '../components/sections/alerts/AlertBanner';

import { useCategories } from '@/hooks/queries/useProducts';
import Loading from '@/components/common/Loading';
import ErrorState from '@/components/common/ErrorState';

const Home = () => {
  const { data: categoryData, isLoading, isError } = useCategories();
  
  // Get categories from API source
  // We filter out any "All" or empty categories if necessary
  const allCategories = categoryData?.data || [];
  const validCategories = allCategories.filter(c => c !== "All");

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

      {/* About Us Section */}
      <section className="py-2 my-2 sm:py-12 sm:my-8">
        <AboutUsSection />
      </section>

      {/* Bottom Alerts */}
      <AlertBanner position="bottom" />
    </>
  );
};

export default Home;
