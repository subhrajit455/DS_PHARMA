import React from 'react';
import { motion } from 'framer-motion';
import PharmacyProductCard from '../ui/PharmacyProductCard';

const ProductCategorySection = ({
  title = 'Product Category Title',
  products = [],
  onViewAll = () => {},
  onAddToCart = () => {},
  onProductClick = () => {},
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
    <section className={`w-full py-6 lg:py-8 bg-gray-50 mb-6 ${className}`} style={{ width: '100%' }}>
      {/* Full-width Container with Centered Content */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header - Compact Spacing */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between mb-4 lg:mb-6 gap-3 sm:gap-4">
          <h2 
            className="text-center sm:text-left flex-1"
            style={{
              fontFamily: 'Gyrotrope',
              fontWeight: 600,
              fontSize: '24px',
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
                borderBottom: '2px solid #111827',
                paddingBottom: '1px',
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
        <div className="w-full flex justify-center relative">
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-6 lg:gap-8 w-full max-w-7xl justify-items-center"
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
                className={`w-full max-w-[240px] ${index === 5 ? 'sm:hidden' : ''}`}
              >
                <PharmacyProductCard
                  {...product}
                  onAddToCart={onAddToCart}
                  onCardClick={onProductClick}
                  className="h-full w-full"
                />
              </motion.div>
            ))}
          </motion.div>
          
          {/* View All Button - Bottom Right Corner (Small Devices Only) */}
          <button
            onClick={handleViewAll}
            className="sm:hidden absolute -bottom-3 right-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 z-10"
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
          <div className="w-full flex justify-center mt-6 lg:hidden">
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-6 w-full max-w-7xl justify-items-center"
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
                    className="h-full w-full"
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
