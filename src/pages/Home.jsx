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
      <section className="py-12 my-8">
        <ResponsiveHeroSection />
      </section>

      {/* Popular Categories Section */}
      <section className="py-12 my-8">
        <PopularCategoriesSection />
      </section>

      {/* Pharmacy Products Showcase */}
      <section className="py-12 my-8">
        <PharmacyProductsShowcase />
      </section>

      {/* Banner Section */}
      <section className="py-12 my-8">
        <BannerSection />
      </section>

      {/* Highlighted Category Section */}
      <section className="py-12 my-8">
        <HighlightedCategorySection />
      </section>

      {/* Pharmacy Products Showcase */}
      <section className="py-12 my-8">
        <PharmacyProductsShowcase />
      </section>

      {/* Banner Section */}
      <section className="py-12 my-8">
        <BannerSection />
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 my-8">
        <WhyChooseUsSection />
      </section>

      {/* About Us Section */}
      <section className="py-12 my-8">
        <AboutUsSection />
      </section>
    </>
  );
};

export default Home;
