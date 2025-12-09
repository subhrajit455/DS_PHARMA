import React, { useState } from 'react'; // Added Rect import though not strictly needed in new JSX transform, good for compat
import { motion as Motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '@/hooks/queries/useProducts'; // Updated hook path
import Loading from '@/components/common/Loading';
import ErrorState from '@/components/common/ErrorState';

const PopularCategoriesSection = ({
  categories: propCategories = [], // Accept categories from backend
}) => {
  const [, setHoveredCategory] = useState(null);
  const navigate = useNavigate();
  const { data: categoryData, isLoading, isError } = useCategories();

  const fetchedCategories = categoryData?.data || [];
  const displayCategories = propCategories.length > 0 ? propCategories : fetchedCategories;

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

  if (isLoading && propCategories.length === 0) return <Loading className="py-12" />;
  if (isError && propCategories.length === 0) return null; // Or minor error state

  return (
    <section
      className="w-full py-6 mb-6 flex flex-col items-center"
      style={{
        background: 'linear-gradient(135deg, #A5E8DC 0%, #B8F0E8 100%)',
        minHeight: '180px',
        marginBottom: '3rem'

      }}
      aria-labelledby="popular-categories-heading"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ml-8 sm:ml-12 lg:ml-16"
        style={{
          marginLeft: '',
          marginTop: '22px'
        }}>
        {/* Section Header - Compact Spacing */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between mb-4 lg:mb-6 gap-1 sm:gap-2 ml-4 sm:ml-6 lg:ml-8">
          <h2
            id="popular-categories-heading"
            className="text-center sm:text-left flex-1"
            style={{
              fontFamily: 'Gyrotrope',
              fontWeight: 600,
              fontSize: '22px',
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
                textDecoration: 'underline',
                textDecorationSkipInk: 'auto',
                textUnderlineOffset: '4px',
                textDecorationThickness: '2px',
                textDecorationColor: '#111827',
                display: 'inline-block',
                lineHeight: '1.2',
              }}
            >
              Popular Categories
            </span>
          </h2>
        </div>

        {/* Categories Grid - Responsive & Dynamic */}
        <Motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex overflow-x-auto pb-4 hide-scrollbar w-full grid-col sm:gap-0.5 md:gap-1 sm:max-w-2xl sm:xl:max-w-3xl sm:ml-12 lg:ml-16 sm:overflow-visible sm:pb-0"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            gap: '1rem' // Gap for mobile flex layout
          }}
        >
          {displayCategories.map((category, index) => (
            <Motion.div
              key={category.id || `category-${category.name}-${index}`}
              variants={itemVariants}
              className="flex flex-col items-center group cursor-pointer shrink-0 sm:shrink sm:w-auto max-w-[100px]"
              style={{
                // Mobile width handled by class or default behavior
              }}
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              role="button"
              tabIndex={0}
              aria-label={`View ${category.name} products`}
              onClick={() => navigate(`/category/${encodeURIComponent(category.name)}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/category/${encodeURIComponent(category.name)}`);
                }
              }}
            >
              {/* Mobile Width Controller */}
              <div className="sm:hidden" style={{ width: '22vw', minWidth: '80px', height: '0' }}></div>

              {/* Category Image */}
              <Motion.div
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
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/src/assets/images/medicine.jpeg';
                    }}
                  />
                </div>
              </Motion.div>

              {/* Category Name */}
              <h3
                className="text-center w-full px-1"
                style={{
                  fontFamily: 'Gyrotrope',
                  fontWeight: 500,
                  fontSize: '12px',
                  marginTop: '8px',
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
            </Motion.div>
          ))}
        </Motion.div>
      </div>
    </section>
  );
};

export default PopularCategoriesSection;