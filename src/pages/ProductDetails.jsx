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
      '/src/assets/images/medicine.jpeg',
      '/src/assets/images/medicine.jpeg',
      '/src/assets/images/medicine.jpeg',
      '/src/assets/images/medicine.jpeg',
      '/src/assets/images/medicine.jpeg'
    ],
    specialOffer: {
      title: '15% off on SBI Cards',
      code: 'T&C Applied'
    }
  };

  const suggestedItems = [
    { id: 1, name: 'Paracetamol', price: 12, originalPrice: 15, discount: 5, image: '/src/assets/images/medicine.jpeg' },
    { id: 2, name: 'Paracetamol', price: 12, originalPrice: 15, discount: 5, image: '/src/assets/images/medicine.jpeg' },
    { id: 3, name: 'Paracetamol', price: 12, originalPrice: 15, discount: 5, image: '/src/assets/images/medicine.jpeg' },
    { id: 4, name: 'Paracetamol', price: 12, originalPrice: 15, discount: 5, image: '/src/assets/images/medicine.jpeg' },
    { id: 5, name: 'Paracetamol', price: 12, originalPrice: 15, discount: 5, image: '/src/assets/images/medicine.jpeg' }
  ];

  const scrollThumbnails = (direction) => {
    if (direction === 'up' && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    } else if (direction === 'down' && selectedImage < product.images.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="grow" style={{ paddingTop: '140px' }}>
        <div className="flex flex-col items-center w-full px-6 lg:px-12">
          <div className="mx-auto max-w-7xl">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 mb-6 text-gray-700 transition-colors cursor-pointer hover:text-gray-900"
              style={{ fontFamily: 'Gyrotrope', fontSize: '16px', fontWeight: 500 }}
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>

            {/* Product Section */}
            <div className="grid grid-cols-1 gap-8 mb-12 lg:grid-cols-2">
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
                    fontSize: '24px',
                    fontWeight: 600,
                    color: '#000000',
                    marginBottom: '16px',
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
            <div className="mb-10">
              <h2
                style={{
                  fontFamily: 'Gyrotrope',
                  fontSize: '24px',
                  fontWeight: 600,
                  color: '#000000',
                  marginBottom: '1.5rem'
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
                  Suggested Medicine
                </span>
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-6 lg:gap-8" style={{ paddingBottom: '25px' }}>
                {suggestedItems.map((item) => (
                  <PharmacyProductCard
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    originalPrice={item.originalPrice}
                    discount={item.discount}
                    quantity="1 piece"
                    imageUrl={item.image}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
