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

import medicineImage from '../assets/images/medicine.jpeg';

const ProductDetails = () => {
  const navigate = useNavigate();
  useParams();
  const [selectedImage, setSelectedImage] = useState(0);

  const product = {
    id: 1,
    name: 'Pharmeasy Fish Oil 1000mg Soft Gelatin 60 Capsules',
    price: 1500,
    originalPrice: 1800,
    discount: 25,
    stock: 15,
    images: [
      medicineImage,
      medicineImage,
      medicineImage,
      medicineImage,
      medicineImage
    ],
    specialOffer: {
      title: '15% off on SBI Cards',
      code: 'T&C Applied'
    }
  };

  const suggestedItems = [
    { id: 1, name: 'Paracetamol', price: 12, originalPrice: 15, discount: 5, image: medicineImage },
    { id: 2, name: 'Paracetamol', price: 12, originalPrice: 15, discount: 5, image: medicineImage },
    { id: 3, name: 'Paracetamol', price: 12, originalPrice: 15, discount: 5, image: medicineImage },
    { id: 4, name: 'Paracetamol', price: 12, originalPrice: 15, discount: 5, image: medicineImage },
    { id: 5, name: 'Paracetamol', price: 12, originalPrice: 15, discount: 5, image: medicineImage }
  ];

  const scrollThumbnails = (direction) => {
    if (direction === 'up' && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    } else if (direction === 'down' && selectedImage < product.images.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
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
                    onAddToCart={() => navigate('/cart')}
                    onViewCart={() => navigate('/cart')}
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
