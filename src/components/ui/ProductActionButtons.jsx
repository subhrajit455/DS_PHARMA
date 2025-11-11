import React from 'react';

const ProductActionButtons = ({ onAddToCart, onViewCart }) => {
  return (
    <div className="flex gap-3 mt-6">
      <button
        onClick={onAddToCart}
        className="flex-1 py-3 font-semibold transition-all duration-200 rounded-lg cursor-pointer hover:shadow-lg"
        style={{
          fontFamily: 'Gyrotrope',
          fontSize: '16px',
          backgroundColor: '#F97316',
          color: '#FFFFFF',
          border: 'none'
        }}
      >
        Add to Cart
      </button>
      <button
        onClick={onViewCart}
        className="px-6 py-3 font-semibold transition-all duration-200 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
        style={{
          fontFamily: 'Gyrotrope',
          fontSize: '16px',
          borderColor: '#F97316',
          color: '#F97316',
          backgroundColor: 'transparent'
        }}
      >
        View Cart &gt;&gt;
      </button>
    </div>
  );
};

export default ProductActionButtons;