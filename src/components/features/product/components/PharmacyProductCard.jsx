import React from 'react';
import { motion as Motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAddToCart } from '../../../../hooks/mutations/useAddToCart';
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
  image,
  onCardClick = () => { },
  className = ''
}) => {
  const navigate = useNavigate();
  const { mutate: addToCart, isPending } = useAddToCart();

  // Handle image prop variation (image vs imageUrl)
  const displayImage = imageUrl || image || '/src/assets/images/medicine.jpeg';

  const discountPercentage = originalPrice && price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : discount;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({
      product: { 
        id, 
        name, 
        price, 
        originalPrice: originalPrice || price,
        discount: discountPercentage || 0,
        quantity, 
        unit, 
        image: displayImage 
      },
      quantity: 1
    });
  };

  const handleCardClick = () => {
    navigate(`/product/${id}`);
    onCardClick({ id, name, price, quantity, unit });
  };

  return (
    <Motion.div
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
          src={displayImage}
          alt={name}
          className="object-cover w-full h-full px-2 py-2"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = '/src/assets/images/medicine.jpeg';
          }}
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
          {name.length > 15 ? `${name.substring(0, 15)}...` : name}
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

        <style>{`
          .neumorphic-cart-btn {
            transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4), inset 0 -2px 3px -1px rgba(0, 0, 0, 0.2), 0 -5px 8px -1px rgba(255, 255, 255, 0.6), inset 0 2px 3px -1px rgba(255, 255, 255, 0.2), inset 0 0 3px 1px rgba(255, 255, 255, 0.8), inset 0 10px 15px 0 rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            background: #eaeaea;
            color: #333;
          }
          .neumorphic-cart-btn:active {
            filter: blur(0.5px);
            box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.3), inset 0 -5px 15px 1px rgba(255, 255, 255, 0.9), 0 -5px 8px -1px rgba(255, 255, 255, 0.6), inset 0 5px 15px 0 rgba(0, 0, 0, 0.3), inset 0 0 5px 1px rgba(255, 255, 255, 0.6);
            transform: translateY(-50%) scale(0.95);
          }
        `}</style>
        
        {/* Cart Icon - Positioned absolutely */}
        <button
          onClick={handleAddToCart}
          disabled={isPending}
          className={`absolute flex items-center justify-center -translate-y-1/2 cursor-pointer right-0 top-1/2 focus:outline-none w-8 h-8 sm:w-10 sm:h-10 neumorphic-cart-btn ${isPending ? 'opacity-50' : ''}`}
          aria-label={`Add ${name} to cart`}
        >
          <img
            src={CartIcon}
            alt="Add to Cart"
            style={{
              width: '16px',
              height: '16px',
              objectFit: 'contain',
              opacity: 0.8
            }}
          />
        </button>
      </div>
    </Motion.div>
  );
};


export default PharmacyProductCard;
