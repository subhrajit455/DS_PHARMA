import React from 'react';

const ProductPriceSection = ({ price, originalPrice, discount, stock, specialOffer }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      {/* Price Section */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span
            style={{
              fontFamily: 'Gyrotrope',
              fontSize: '32px',
              fontWeight: 700,
              color: '#000000'
            }}
          >
            ₹{price}
          </span>
          <span
            style={{
              fontFamily: 'Gyrotrope',
              fontSize: '18px',
              fontWeight: 400,
              color: '#9CA3AF',
              textDecoration: 'line-through'
            }}
          >
            ₹{originalPrice}
          </span>
          <span
            style={{
              fontFamily: 'Gyrotrope',
              fontSize: '14px',
              fontWeight: 600,
              color: '#10B981',
              backgroundColor: '#D1FAE5',
              padding: '4px 12px',
              borderRadius: '6px'
            }}
          >
            {discount}% Off
          </span>
        </div>
        <p
          style={{
            fontFamily: 'Gyrotrope',
            fontSize: '14px',
            color: '#EF4444',
            fontWeight: 500
          }}
        >
          Hurry, only {stock} in stock
        </p>
      </div>

      {/* Special Offer */}
      <div
        className="mb-6 p-4 rounded-lg border-2"
        style={{
          borderColor: '#FED7AA',
          backgroundColor: '#FFF7ED'
        }}
      >
        <h3
          style={{
            fontFamily: 'Gyrotrope',
            fontSize: '16px',
            fontWeight: 600,
            color: '#000000',
            marginBottom: '8px'
          }}
        >
          Special Offer For You
        </h3>
        <div className="flex items-center gap-2">
          <span
            style={{
              fontFamily: 'Gyrotrope',
              fontSize: '14px',
              fontWeight: 600,
              color: '#000000'
            }}
          >
            {specialOffer.title}
          </span>
        </div>
        <p
          style={{
            fontFamily: 'Gyrotrope',
            fontSize: '12px',
            color: '#6B7280',
            marginTop: '4px'
          }}
        >
          {specialOffer.code}
        </p>
      </div>
    </div>
  );
};

export default ProductPriceSection;