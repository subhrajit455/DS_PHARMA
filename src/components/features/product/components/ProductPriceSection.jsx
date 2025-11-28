import React from 'react';

const ProductPriceSection = ({ price, originalPrice, discount, stock, specialOffer }) => {
  return (
    <div className="bg-white rounded-lg p-6 ">
      {/* Price Section */}
      <div className="mb-6" style={{ marginBottom: '1rem', padding: '10px' }}>
        <div className="flex items-center gap-3 mb-2">
          <span
            style={{
              fontFamily: 'Gyrotrope',
              fontSize: '20px',
              fontWeight: 600,
              color: '#000000',
            }}
          >
            ₹{price}
          </span>
          <span
            style={{
              fontFamily: 'Gyrotrope',
              fontSize: '14px',
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
              fontSize: '12px',
              fontWeight: 600,
              color: '#10B981',
              backgroundColor: '#D1FAE5',
              padding: '2px 6px',
              borderRadius: '6px'
            }}
          >
            {discount}% Off
          </span>
        </div>
        <p
          style={{
            fontFamily: 'Gyrotrope',
            fontSize: '12px',
            color: '#EF4444',
            fontWeight: 500
          }}
        >
          Hurry, only {stock} in stock
        </p>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        {/* Special Offer */}
      <div
        className="mb-6 p-4 rounded-lg border-2"
        style={{
          borderColor: '#FED7AA',
          backgroundColor: '#FFF7ED',
          padding: '10px',
        }}
      >
        <h3
          style={{
            fontFamily: 'Gyrotrope',
            fontSize: '14px',
            fontWeight: 600,
            color: '#000000',
            marginBottom: '8px'
          }}
        >
          Special Offer For You
        </h3>
        <div className="flex items-start gap-2 w-[220px] bg-white rounded-lg shadow-sm" style={{ padding: '5px' }}>
          <div className="w-[40px] h-[40px] rounded-lg shadow-sm overflow-hidden">
            <img src="" alt="" />
          </div>
          <div className="flex flex-col justify-center" style={{ marginTop: '5px' }}>
          <span
            style={{
              fontFamily: 'Gyrotrope',
              fontSize: '10px',
              fontWeight: 600,
              color: '#000000'
            }}
          >
            {specialOffer.title}
          </span>
          <p
          style={{
            fontFamily: 'Gyrotrope',
            fontSize: '8px',
            color: '#6B7280',
            marginTop: '4px'
          }}
        >
          {specialOffer.code}
        </p>
        </div>
        </div>
        
      </div>
      </div>

      
    </div>
  );
};

export default ProductPriceSection;