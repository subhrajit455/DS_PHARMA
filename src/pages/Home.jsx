import ResponsiveHeroSection from '../components/sections/HeroSection';
import PopularCategoriesSection from '../components/sections/PopularCategoriesSection';
import BannerSection from '../components/sections/BannerSection';
import HighlightedCategorySection from '../components/sections/HighlightedCategorySection';
import PharmacyProductsShowcase from '../components/sections/PharmacyProductsShowcase';
import WhyChooseUsSection from '../components/sections/WhyChooseUsSection';
import AboutUsSection from '../components/sections/AboutUsSection';

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <ResponsiveHeroSection />
      
      {/* Popular Categories Section */}
      <PopularCategoriesSection />
      
      {/* Pharmacy Products Showcase */}
      <PharmacyProductsShowcase />

      {/* Banner Section */}
      <BannerSection />

      {/* Highlighted Category Section */}
      <HighlightedCategorySection />

       {/* Pharmacy Products Showcase */}
      <PharmacyProductsShowcase />

      {/* Banner Section */}
      <BannerSection />

      {/* Why Choose Us Section */}
      <WhyChooseUsSection />

      {/* About Us Section */}
      <AboutUsSection />
    </>
  );
};

export default Home;
