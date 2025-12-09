import React, { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { ArrowLeft, Package } from 'lucide-react';
import { PharmacyProductCard } from '@/components/features/product';
import { useProducts } from '@/hooks/queries/useProducts';
import { useCartStore } from '@/store/useCartStore';
import Loading from '@/components/common/Loading';
import ErrorState from '@/components/common/ErrorState';

const CategoryProducts = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCartStore();

  // Decode category name from URL
  const decodedCategory = decodeURIComponent(categoryName);

  // Fetch products by category
  const { data, isLoading, isError } = useProducts({ category: decodedCategory });
  
  const products = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map(p => ({
      ...p,
      quantity: '1',
      unit: 'box',
      imageUrl: p.image,
      discount: p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0
    }));
  }, [data]);

  const handleAddToCart = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      productName: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  if (isLoading) return <Loading className="min-h-[60vh]" />;
  if (isError) return <ErrorState message="Failed to load products" className="my-20" />;

  return (
    <div style={{ paddingTop: '3rem' }}>
      <style>{`
        @media (min-width: 768px) {
          .category-container {
            padding-top: 80px !important;
          }
        }
        @media (max-width: 639px) {
          .category-container {
            padding-left: 5px !important;
            padding-right: 5px !important;
          }
        }
        @media (min-width: 640px) and (max-width: 1290px) {
          .category-container {
            padding-left: 5px !important;
            padding-right: 5px !important;
          }
        }
      `}</style>
      
      <div className="category-container w-full pt-4 pb-16 lg:pt-32 lg:pb-16 bg-gray-50 min-h-screen">
        <div className="w-full px-4 mx-auto" style={{ maxWidth: "1240px", margin: "10px auto" }}>

        <button
              onClick={() => navigate(-1)}
              className="sm:hidden flex items-center gap-1 text-gray-600 hover:text-emerald-600 transition-colors"
              style={{ fontFamily: 'Gyrotrope', marginBottom: '1rem' }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline" style={{ marginTop: '5px' }}>Back</span>
            </button>
          
          {/* Header */}
          <div className="mb-6 flex items-center gap-4">
            
            
            <h1
              className="text-2xl font-bold text-gray-900 flex-1"
              style={{ fontFamily: 'Gyrotrope' }}
            >
              {decodedCategory}
            </h1>
            
            <div className="flex items-center gap-2 text-gray-500">
              <Package className="w-5 h-5" />
              <span style={{ fontFamily: 'Gyrotrope', fontSize: '14px' }}>
                {products.length} Products
              </span>
            </div>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <Motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {products.map((product) => (
                <Motion.div
                  key={product.id}
                  variants={itemVariants}
                >
                  <PharmacyProductCard
                    {...product}
                    onAddToCart={handleAddToCart}
                    onCardClick={handleProductClick}
                    className="h-full"
                  />
                </Motion.div>
              ))}
            </Motion.div>
          ) : (
            <div className="flex flex-col min-h-[60vh] items-center justify-center py-16 text-center">
              <Package className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Gyrotrope' }}>
                No Products Found
              </h3>
              <p className="text-gray-500 mb-6" style={{ fontFamily: 'Gyrotrope' }}>
                We couldn't find any products in this category.
              </p>
              <Link
                to="/"
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                style={{ fontFamily: 'Gyrotrope', padding: '5px 12px' }}
              >
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryProducts;
