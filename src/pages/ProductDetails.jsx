import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  PharmacyProductCard,
  ProductImageGallery,
  ProductPriceSection,
  ProductActionButtons,
  ProductDescription
} from '@/components/features/product';
import SuggestedItemsSection from '@/components/sections/SuggestedItemsSection';
import { useProductDetails } from '@/hooks/queries/useProductDetails';
import { useAddToCart } from '@/hooks/mutations/useAddToCart';

import { PRODUCTS } from '@/data/sampleData';

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Queries and Mutations
  const { data: productData } = useProductDetails(id);
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();
  
  // Find product from mock data
  const mockProductRaw = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];
  
  // Enhance mock product with extra details expected by the UI if missing
  const mockProduct = {
    ...mockProductRaw,
    images: mockProductRaw.image ? [mockProductRaw.image, mockProductRaw.image, mockProductRaw.image] : [],
    stock: mockProductRaw.inStock ? 50 : 0,
    originalPrice: mockProductRaw.mrp,
    discount: Math.round(((mockProductRaw.mrp - mockProductRaw.price) / mockProductRaw.mrp) * 100) || 0,
    specialOffer: {
        title: 'Bank Offer: 10% instant discount',
        code: 'SBI10'
    }
  };

  // Use real data if available, otherwise mock
  const product = productData || mockProduct;

  const suggestedItems = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 5);

  const scrollThumbnails = (direction) => {
    if (direction === 'up' && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    } else if (direction === 'down' && selectedImage < product.images.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice || product.price,
        discount: product.discount || 0,
        image: product.images[0],
      },
      quantity: 1
    });
  };

  return (
    <div style={{ paddingTop: '60px' }}>
      <style>{` 
         @media (min-width: 768px) { 
           .orders-container { 
             padding-top: 80px !important; 
           } 
         }
         @media (max-width: 639px) {
           .product-details-container {
             padding-left: 5px !important;
             padding-right: 5px !important;
           }
         }
         @media (min-width: 640px) and (max-width: 1290px) {
           .product-details-container {
             padding-left: 5px !important;
             padding-right: 5px !important;
           }
         }
       `}</style>
      <div className="orders-container flex flex-col min-h-screen bg-gray-50 ">
        <main className="grow">
          <div className="product-details-container flex flex-col items-center w-full px-4 md:px-6 lg:px-12">
            <div className="mx-auto max-w-7xl w-full">
              {/* Back Button */}
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 mb-4 sm:mb-6 text-gray-700 transition-colors cursor-pointer hover:text-gray-900"
                style={{ fontFamily: 'Gyrotrope', fontSize: '14px', fontWeight: 500, marginBottom: '1.5rem' }}
              >
                <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
                <span></span>
              </button>

              {/* Product Section */}
              <div className="grid grid-cols-1 gap-6 sm:gap-8 mb-8 sm:mb-12" style={{ gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', marginBottom: '1.5rem' }}
                data-lg-grid="true">
                <style>{`
                @media (min-width: 1024px) {
                  [data-lg-grid="true"] {
                    grid-template-columns: 2fr 3fr !important;
                  }
                }
              `}</style>
                <ProductImageGallery
                  images={product.images}
                  selectedImage={selectedImage}
                  onImageSelect={setSelectedImage}
                  onScroll={scrollThumbnails}
                />

                {/* Right - Product Info */}
                <div className="flex flex-col">
                  <h1
                    style={{
                      fontFamily: 'Gyrotrope',
                      fontSize: '18px',
                      fontWeight: 600,
                      color: '#000000',
                      marginBottom: '10px',
                      lineHeight: '1.4'
                    }}
                  >
                    {product.name}
                  </h1>

                  <ProductPriceSection
                    price={product.price}
                    originalPrice={product.originalPrice}
                    discount={product.discount}
                    stock={product.stock}
                    specialOffer={product.specialOffer}
                  />

                  <ProductActionButtons
                    onAddToCart={handleAddToCart}
                    onViewCart={() => navigate('/cart')}
                    isAdding={isAddingToCart}
                  />
                </div>
              </div>

              {/* Description Section */}
              <ProductDescription />

              {/* Suggested Medicine Section */}
              <SuggestedItemsSection
                title="Suggested Medicine"
                items={suggestedItems}
                className="mb-5"
                titleStyle={{
                  textDecorationThickness: '2px',
                  textDecorationColor: '#111827',
                  lineHeight: '1.2'
                }}
                containerStyle={{}}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductDetails;
