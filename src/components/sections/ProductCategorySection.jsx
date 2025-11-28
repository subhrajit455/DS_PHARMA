import React from 'react';
import { motion } from 'framer-motion';
import { PharmacyProductCard } from '@/components/features/product';

const ProductCategorySection = ({
  title = 'Product Category Title',
  products = [],
  onViewAll = () => { },
  onAddToCart = () => { },
  onProductClick = () => { },
  className = ''
}) => {
  const handleViewAll = () => {
    onViewAll(title);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className={`w-full py-6 lg:py-8 bg-gray-50 mb-6 ${className}`} style={{ width: '100%', marginBottom: '3rem' }}>
      {/* Full-width Container with Centered Content */}
      <div className="w-full px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">

        {/* Section Header - Compact Spacing */}
        <div className="flex flex-col items-center justify-between w-full gap-3 mb-4 sm:flex-row lg:mb-6 sm:gap-4">
          <h2
            className="flex-1 text-center sm:text-left"
            style={{
              fontFamily: 'Gyrotrope',
              fontWeight: 600,
              fontSize: '22px',
              lineHeight: '100%',
              letterSpacing: '0%',
              color: '#111827',
              marginBottom: '5px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                textDecoration: 'underline',
                textDecorationSkipInk: 'auto',
                textUnderlineOffset: '4px',
                textDecorationThickness: '2px',
                textDecorationColor: '#111827',
                display: 'inline-block',
                lineHeight: '1.2',
              }}
            >
              {title}
            </span>
          </h2>
          <button
            onClick={handleViewAll}
            className="hidden sm:block bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-3 lg:px-12 lg:py-3.5 rounded-md shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 whitespace-nowrap"
            aria-label={`View all products in ${title}`}
            style={{
              fontFamily: 'Gyrotrope',
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: '100%',
              letterSpacing: '0%',
              padding: '4px 8px'
            }}
          >
            View All
          </button>
        </div>

        {/* Products Grid - Compact Responsive Layout */}
        <div className="relative flex justify-center w-full">
          <motion.div
            className="grid w-full grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-6 lg:gap-8 max-w-7xl justify-items-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20px" }}
          >
            {/* Show 6 products on mobile (3 pairs), 5 on larger screens */}
            {products.slice(0, 6).map((product, index) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                transition={{
                  delay: index * 0.08,
                  duration: 0.5,
                  ease: "easeOut"
                }}
                className={`w-full max-w-60 ${index === 5 ? 'sm:hidden' : ''}`}
              >
                <PharmacyProductCard
                  {...product}
                  onAddToCart={onAddToCart}
                  onCardClick={onProductClick}
                  className="w-full h-full"
                />
              </motion.div>
            ))}
          </motion.div>

          {/* View All Button - Bottom Right Corner (Small Devices Only) */}
          <button
            onClick={handleViewAll}
            className="absolute z-10 px-6 py-2 text-white transition-all duration-200 transform rounded-full shadow-lg sm:hidden -bottom-3 right-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            aria-label={`View all products in ${title}`}
            style={{
              fontFamily: 'Gyrotrope',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            View All
          </button>
        </div>

        {/* Additional Products for Medium Screens (if needed) */}
        {products.length > 6 && (
          <div className="flex justify-center w-full mt-6 lg:hidden">
            <motion.div
              className="grid w-full grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 sm:gap-6 max-w-7xl justify-items-center"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-20px" }}
            >
              {products.slice(6).map((product, index) => (
                <motion.div
                  key={`additional-${product.id}`}
                  variants={itemVariants}
                  transition={{ delay: index * 0.08 }}
                  className="w-full max-w-[240px]"
                >
                  <PharmacyProductCard
                    {...product}
                    onAddToCart={onAddToCart}
                    onCardClick={onProductClick}
                    className="w-full h-full"
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};


export default ProductCategorySection;
