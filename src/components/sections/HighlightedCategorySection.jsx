import React from 'react';
import { motion as Motion } from 'framer-motion';
import { PharmacyProductCard } from '@/components/features/product';

const HighlightedCategorySection = () => {
  // Sample products data
  const products = [
    {
      id: 1,
      name: 'Paracetamol',
      quantity: '12',
      unit: 'piece',
      price: 150,
      originalPrice: 200,
      discount: 25,
      imageUrl: '/src/assets/images/medicine.jpeg'
    },
    {
      id: 2,
      name: 'Paracetamol',
      quantity: '12',
      unit: 'piece',
      price: 150,
      originalPrice: 200,
      discount: 25,
      imageUrl: '/src/assets/images/medicine.jpeg'
    },
    {
      id: 3,
      name: 'Paracetamol',
      quantity: '12',
      unit: 'piece',
      price: 150,
      originalPrice: 200,
      discount: 25,
      imageUrl: '/src/assets/images/medicine.jpeg'
    },
    {
      id: 4,
      name: 'Paracetamol',
      quantity: '12',
      unit: 'piece',
      price: 150,
      originalPrice: 200,
      discount: 25,
      imageUrl: '/src/assets/images/medicine.jpeg'
    },
    {
      id: 5,
      name: 'Paracetamol',
      quantity: '12',
      unit: 'piece',
      price: 150,
      originalPrice: 200,
      discount: 25,
      imageUrl: '/src/assets/images/medicine.jpeg'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const handleAddToCart = (product) => {
    console.log('Add to cart:', product);
  };

  const handleProductClick = (product) => {
    console.log('Product clicked:', product);
  };

  const handleViewAll = () => {
    console.log('View all clicked');
  };

  return (
    <section
      className="w-full sm:py-16 min-h-[300px] sm:min-h-[350px] lg:py-24 mb-8 flex justify-center items-center"
      style={{
        width: '100%',
        backgroundColor: '#FFF6D3',
        marginBottom: '3rem'
      }}
    >
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 ">

        {/* Section Header - Compact Spacing */}
        <div className="w-full flex flex-row items-start justify-between sm:flex-row sm:items-center mb-4 lg:mb-6 gap-3 sm:gap-4">
          <h2
            className="text-left sm:text-left flex-1"
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
              High-lighted Category Title
            </span>
          </h2>
          <button
            onClick={handleViewAll}
            className="bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 sm:px-10 sm:py-3 lg:px-12 lg:py-3.5 rounded-md shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 whitespace-nowrap"
            aria-label="View all products"
            style={{
              fontFamily: 'Gyrotrope',
              fontWeight: 600,
              fontSize: '12px',
              lineHeight: '100%',
              letterSpacing: '0%',
              padding: '6px 12px'
            }}
          >
            View All
          </button>
        </div>

        {/* Products Grid - Compact Responsive Layout */}
        <div className="w-full flex justify-center relative">
          <Motion.div
            className="flex w-full overflow-x-auto pb-4 hide-scrollbar sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-6 lg:gap-8 max-w-7xl sm:justify-items-center sm:pb-0"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              gap: '1rem'
            }}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20px" }}
          >
            {/* Show all products */}
            {products.map((product, index) => (
              <Motion.div
                key={product.id}
                variants={itemVariants}
                transition={{
                  delay: index * 0.08,
                  duration: 0.5,
                  ease: "easeOut"
                }}
                className="w-[calc(50%-0.5rem)] min-w-[160px] shrink-0 sm:w-auto sm:min-w-0 sm:shrink sm:max-w-[240px]"
              >
                <PharmacyProductCard
                  {...product}
                  onAddToCart={handleAddToCart}
                  onCardClick={handleProductClick}
                  className="h-full w-full"
                />
              </Motion.div>
            ))}
          </Motion.div>


        </div>
      </div>
    </section>
  );
};

export default HighlightedCategorySection;
