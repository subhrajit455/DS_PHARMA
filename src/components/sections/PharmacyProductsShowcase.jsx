import React from 'react';
import ProductCategorySection from './ProductCategorySection';

const PharmacyProductsShowcase = () => {
  // Sample product data matching the design
  const paracetamolProducts = [
    {
      id: 1,
      name: 'Paracetamol',
      price: 1200,
      originalPrice: 1500,
      quantity: 2,
      unit: 'piece',
      imageUrl: '/src/assets/images/medicine.jpeg',
      discount: 5
    },
    {
      id: 2,
      name: 'Paracetamol',
      price: 12,
      originalPrice: 15,
      quantity: 2,
      unit: 'piece',
      imageUrl: '/src/assets/images/medicine.jpeg',
      discount: 5
    },
    {
      id: 3,
      name: 'Paracetamol',
      price: 12,
      originalPrice: 15,
      quantity: 2,
      unit: 'piece',
      imageUrl: '/src/assets/images/medicine.jpeg',
      discount: 5
    },
    {
      id: 4,
      name: 'Paracetamol',
      price: 12,
      originalPrice: 15,
      quantity: 2,
      unit: 'piece',
      imageUrl: '/src/assets/images/medicine.jpeg',
      discount: 5
    },
    {
      id: 5,
      name: 'Paracetamol',
      price: 12,
      originalPrice: 15,
      quantity: 2,
      unit: 'piece',
      imageUrl: '/src/assets/images/medicine.jpeg',
      discount: 5
    }
  ];

  const antibioticProducts = [
    {
      id: 6,
      name: 'Amoxicillin',
      price: 25,
      originalPrice: 30,
      quantity: 10,
      unit: 'capsule',
      imageUrl: '/src/assets/images/medicine.jpeg',
      discount: 17
    },
    {
      id: 7,
      name: 'Azithromycin',
      price: 45,
      originalPrice: 50,
      quantity: 6,
      unit: 'tablet',
      imageUrl: '/src/assets/images/medicine.jpeg',
      discount: 10
    },
    {
      id: 8,
      name: 'Ciprofloxacin',
      price: 35,
      originalPrice: 40,
      quantity: 10,
      unit: 'tablet',
      imageUrl: '/src/assets/images/medicine.jpeg',
      discount: 12
    },
    {
      id: 9,
      name: 'Doxycycline',
      price: 28,
      originalPrice: 32,
      quantity: 8,
      unit: 'capsule',
      imageUrl: '/src/assets/images/medicine.jpeg',
      discount: 12
    },
    {
      id: 10,
      name: 'Erythromycin',
      price: 22,
      originalPrice: 25,
      quantity: 12,
      unit: 'tablet',
      imageUrl: '/src/assets/images/medicine.jpeg',
      discount: 12
    }
  ];

  const handleAddToCart = (product) => {
    console.log('Added to cart:', product);
    // Implement cart logic here
  };

  const handleProductClick = (product) => {
    console.log('Product clicked:', product);
    // Implement navigation to product detail page
  };

  const handleViewAll = (categoryTitle) => {
    console.log('View all clicked for:', categoryTitle);
    // Implement navigation to category page
  };

  return (
    <>
      <style>{`
        @media (max-width: 639px) {
          .pharmacy-products-showcase {
            padding-left: 5px !important;
            padding-right: 5px !important;
          }
        }
        @media (min-width: 640px) and (max-width: 1290px) {
          .pharmacy-products-showcase {
            padding-left: 5px !important;
            padding-right: 5px !important;
          }
        }
      `}</style>
      <section className="pharmacy-products-showcase w-full bg-gray-50 py-16 lg:py-20 mb-25 flex justify-center items-center" style={{ width: '100%' }}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Pain Relief Category */}
        <div className="mb-12 lg:mb-16">
          <ProductCategorySection
            title="Pain Relief"
            products={paracetamolProducts}
            onAddToCart={handleAddToCart}
            onProductClick={handleProductClick}
            onViewAll={handleViewAll}
            className="py-0 bg-transparent mb-0"
          />
        </div>

        {/* Antibiotics Category */}
        <ProductCategorySection
          title="Antibiotics"
          products={antibioticProducts}
          onAddToCart={handleAddToCart}
          onProductClick={handleProductClick}
          onViewAll={handleViewAll}
          className="py-0 bg-transparent mb-0"
        />
      </div>
    </section>
    </>
  );
};

export default PharmacyProductsShowcase;
