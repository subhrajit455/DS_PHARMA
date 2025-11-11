import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

const HighlightedProductCard = ({
  id,
  name,
  price,
  originalPrice,
  discount,
  quantity,
  unit = 'piece',
  image,
  onAddToCart = () => {},
  onCardClick = () => {},
  className = ''
}) => {
  const discountPercentage = originalPrice && price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : discount;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart({ id, name, price, quantity, unit });
  };

  const handleCardClick = () => {
    onCardClick({ id, name, price, quantity, unit });
  };

  return (
    <motion.div
      className={`bg-white overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg w-full ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`${name} - ${quantity} ${unit} - ₹${price}`}
    >
      {/* Product Image */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-sky-100 to-sky-200 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Product Info */}
      <div className="p-3 relative">
        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 text-base mb-1 leading-tight text-left">
          {name}
        </h3>
        
        {/* Price and Discount Row */}
        <div className="flex items-center gap-2 mb-0">
          <span className="text-sm font-bold text-gray-900">
            ₹{price}
          </span>
          <span className="text-xs text-gray-500">
            /{unit}
          </span>
          {discountPercentage > 0 && (
            <span className="text-xs font-medium text-green-600">
              ({discountPercentage}% off)
            </span>
          )}
        </div>

        {/* Cart Icon - Positioned absolutely */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-1 right-3 w-7 h-7 bg-black rounded-md flex items-center justify-center transition-all duration-200 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          aria-label={`Add ${name} to cart`}
        >
          <ShoppingCart className="w-4 h-4 text-white" strokeWidth={2} />
        </button>
      </div>
    </motion.div>
  );
};

export default HighlightedProductCard;
