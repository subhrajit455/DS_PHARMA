import { motion } from 'framer-motion';
import { useState } from 'react';

const PopularCategoriesSection = ({ 
  categories = [], // Accept categories from backend
  onCategoryClick = () => {} // Callback for category click
}) => {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // Default/fallback categories if none provided
  const defaultCategories = [
    {
      id: 1,
      name: 'Diabetes',
      image: '/src/assets/images/medicine.jpeg',
      alt: 'Diabetes care products and medications'
    },
    {
      id: 2,
      name: 'Heart Care',
      image: '/src/assets/images/medicine.jpeg',
      alt: 'Heart care products'
    },
    {
      id: 3,
      name: 'Vitamins',
      image: '/src/assets/images/medicine.jpeg',
      alt: 'Vitamins and supplements'
    },
    {
      id: 4,
      name: 'Pain Relief',
      image: '/src/assets/images/medicine.jpeg',
      alt: 'Pain relief medications'
    }
  ];

  // Use provided categories or fallback to default
  const displayCategories = categories.length > 0 ? categories : defaultCategories;

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
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  return (
    <section 
      className="w-full py-6 mb-6 flex flex-col items-center"
      style={{
        background: 'linear-gradient(135deg, #A5E8DC 0%, #B8F0E8 100%)',
        minHeight: '160px',
        
      }}
      aria-labelledby="popular-categories-heading"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ml-8 sm:ml-12 lg:ml-16"
      style={{
        marginLeft: ''
      }}>
        {/* Section Header - Compact Spacing */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between mb-4 lg:mb-6 gap-1 sm:gap-2 ml-4 sm:ml-6 lg:ml-8">
          <h2 
            id="popular-categories-heading"
            className="text-center sm:text-left flex-1"
            style={{
              fontFamily: 'Gyrotrope',
              fontWeight: 600,
              fontSize: '24px',
              lineHeight: '100%',
              letterSpacing: '0%',
              color: '#111827',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center'
          
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
              Popular Categories
            </span>
          </h2>
        </div>

        {/* Categories Grid - Responsive & Dynamic */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-0.5 sm:gap-0.5 md:gap-1 max-w-2xl xl:max-w-3xl w-full ml-8 sm:ml-12 lg:ml-16"
        >
            {displayCategories.map((category, index) => (
              <motion.div
                key={category.id}
                variants={itemVariants}
                className="flex flex-col items-center group cursor-pointer"
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                role="button"
                tabIndex={0}
                aria-label={`View ${category.name} products`}
                onClick={() => onCategoryClick(category)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onCategoryClick(category);
                  }
                }}
              >
                {/* Category Image */}
                <motion.div
                  className="relative mb-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  <div 
                    className="rounded-full overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300 mx-auto"
                    style={{
                      width: '80px',
                      height: '80px',
                      background: '#FFFFFF',
                      border: '1px solid rgba(0, 0, 0, 0.05)',
                      flexShrink: 0
                    }}
                  >
                    <img
                      src={category.image}
                      alt={category.alt}
                      className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                </motion.div>

                {/* Category Name */}
                <h3
                  className="text-center w-full px-1"
                  style={{
                    fontFamily: 'Gyrotrope',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '1.2',
                    color: '#000000',
                    letterSpacing: '0',
                    wordBreak: 'break-word',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {category.name}
                </h3>
              </motion.div>
            ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PopularCategoriesSection;