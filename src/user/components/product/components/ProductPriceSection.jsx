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
        <div className="flex items-center gap-2 mt-2">
          <div 
            className={`w-2 h-2 rounded-full ${
              stock === 0 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 
              stock <= 5 ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 
              'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
            }`}
          />
          <span
            style={{
              fontFamily: 'Gyrotrope',
              fontSize: '13px',
              fontWeight: 600,
              color: stock === 0 ? '#EF4444' : stock <= 5 ? '#F59E0B' : '#10B981',
            }}
          >
            {stock === 0 ? 'Out of Stock' : stock <= 5 ? `Hurry, only ${stock} left in stock!` : 'In Stock'}
          </span>
        </div>
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
          <div className="w-10 h-10 rounded-lg shadow-sm overflow-hidden">
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