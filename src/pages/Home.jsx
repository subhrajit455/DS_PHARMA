import ResponsiveHeroSection from '../components/sections/HeroSection';
import PopularCategoriesSection from '../components/sections/PopularCategoriesSection';
import BannerSection from '../components/sections/BannerSection';
import HighlightedCategorySection from '../components/sections/HighlightedCategorySection';
import PharmacyProductsShowcase from '../components/sections/PharmacyProductsShowcase';
import WhyChooseUsSection from '../components/sections/WhyChooseUsSection';
import AboutUsSection from '../components/sections/AboutUsSection';
import AlertBanner from '../components/sections/alerts/AlertBanner';

const Home = () => {
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

      {/* Pharmacy Products Showcase */}
      <section className="py-2 my-2 sm:py-12 sm:my-8">
        <PharmacyProductsShowcase />
      </section>

      {/* Banner Section */}
      <section className="py-2 my-2 sm:py-12 sm:my-8">
        <BannerSection />
      </section>

      {/* Highlighted Category Section */}
      <section className="py-2 my-2 sm:py-12 sm:my-8">
        <HighlightedCategorySection />
      </section>

      {/* Pharmacy Products Showcase */}
      <section className="py-2 my-2 sm:py-12 sm:my-8">
        <PharmacyProductsShowcase />
      </section>

      {/* Banner Section */}
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
