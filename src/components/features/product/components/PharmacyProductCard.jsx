import React from 'react';
/* eslint-disable-next-line no-unused-vars */
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CartIcon from '../../../../assets/icons/Cart.png';

const PharmacyProductCard = ({
  id,
  name,
  price,
  originalPrice,
  discount,
  quantity,
  unit = 'piece',
  imageUrl,
  onAddToCart = () => { },
  onCardClick = () => { },
  className = ''
}) => {
  const navigate = useNavigate();

  const discountPercentage = originalPrice && price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : discount;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart({ id, name, price, quantity, unit });
  };

  const handleCardClick = () => {
    navigate(`/product/${id}`);
    onCardClick({ id, name, price, quantity, unit });
  };

  return (
    <motion.div
      className={`bg-transparent overflow-hidden rounded-lg cursor-pointer transition-all duration-300 hover:shadow-lg w-full ${className}`}
      style={{ maxWidth: '320px', padding: '10px' }}
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
      <div className="relative overflow-hidden aspect-4/3 bg-linear-to-br from-sky-100 to-sky-200">
        <img
          src={imageUrl}
          alt={name}
          className="object-cover w-full h-full px-2 py-2"
          loading="lazy"
        />
        {/* Dark shadow gradient on upper half */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            height: '50%',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.15), transparent)'
          }}
        />
      </div>

      {/* Product Info */}
      <div className="relative pt-2 translate-y-1/8" >
        {/* Product Name */}
        <h3 className="flex items-center justify-start text-[14px] font-semibold leading-tight text-left text-gray-900 min-h-8">
          {name}
        </h3>

        {/* Price and Discount Row */}
        <div className="flex items-center gap-1 sm:gap-1 mb-2 pr-8 sm:pr-0">
          <span className="text-[10px] sm:text-[12px] font-bold text-gray-900" title={`₹${price}`}>
            ₹{price}
          </span>
          <span className="text-[8px] sm:text-[10px] text-gray-900 font-medium">
            /{unit}
          </span>
          {discountPercentage > 0 && (
            <span className="text-[6px] sm:text-[8px] font-medium text-green-600 truncate">
              ({discountPercentage}% off)
            </span>
          )}
        </div>

        {/* Cart Icon - Positioned absolutely */}
        <button
          onClick={handleAddToCart}
          className="absolute flex items-center justify-center transition-all duration-200 -translate-y-1/2 rounded-full shadow-md cursor-pointer right-0 top-1/2 hover:scale-110 focus:outline-none w-7 h-7 sm:w-[35px] sm:h-[35px]"
          aria-label={`Add ${name} to cart`}
          style={{
            backgroundColor: '#f5f5f5',
            border: '1px solid #e8e8e8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img
            src={CartIcon}
            alt="Add to Cart"
            style={{
              width: '15px',
              height: '15px',
              objectFit: 'contain'
            }}
          />
        </button>
      </div>
    </motion.div>
  );
};


export default PharmacyProductCard;
