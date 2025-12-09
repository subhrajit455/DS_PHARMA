import React from 'react';
import { motion as Motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAddToCart } from '../../../../hooks/mutations/useAddToCart';
import useDataStore from '../../../../store/useDataStore';
import CartIcon from '../../../../assets/icons/Cart.png';

const PharmacyProductCard = ({
  id,
  name,
  price,
  originalPrice,
  mrp,
  discount,
  quantity,
  unit = 'piece',
  imageUrl,
  image,
  stock,
  inStock = true,
  onCardClick = () => { },
  className = ''
}) => {
  const navigate = useNavigate();
  const { mutate: addToCart, isPending } = useAddToCart();
  
  // Wishlist from global store
  const wishlist = useDataStore((state) => state.wishlist);
  const addToWishlist = useDataStore((state) => state.addToWishlist);
  const removeFromWishlist = useDataStore((state) => state.removeFromWishlist);
  
  const isInWishlist = wishlist.some((item) => item.id === id);

  // Handle image prop variation (image vs imageUrl)
  const displayImage = imageUrl || image || '/src/assets/images/medicine.jpeg';
  
  // Use mrp or originalPrice for comparison price
  const comparisonPrice = mrp || originalPrice;

  const discountPercentage = comparisonPrice && price && comparisonPrice > price
    ? Math.round(((comparisonPrice - price) / comparisonPrice) * 100)
    : discount || 0;
    
  // Determine if product is available
  const isAvailable = inStock && (stock === undefined || stock > 0);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isAvailable) return;
    
    addToCart({
      product: { 
        id, 
        name, 
        price, 
        originalPrice: comparisonPrice || price,
        discount: discountPercentage || 0,
        quantity, 
        unit, 
        image: displayImage 
      },
      quantity: 1
    });
  };
  
  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    if (isInWishlist) {
      removeFromWishlist(id);
    } else {
      addToWishlist({
        id,
        name,
        price,
        originalPrice: comparisonPrice || price,
        discount: discountPercentage,
        image: displayImage,
        unit,
      });
    }
  };

  const handleCardClick = () => {
    navigate(`/product/${id}`);
    onCardClick({ id, name, price, quantity, unit });
  };

  return (
    <Motion.div
      className={`bg-transparent overflow-hidden rounded-lg cursor-pointer transition-all duration-300 hover:shadow-lg w-full ${className} ${!isAvailable ? 'opacity-60' : ''}`}
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
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white shadow-sm transition-all"
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart 
            size={16} 
            className={isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'} 
          />
        </button>
        
        {/* Out of Stock Badge */}
        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="px-3 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
        
        {/* Discount Badge */}
        {discountPercentage > 0 && isAvailable && (
          <div className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold text-white bg-green-500 rounded">
            {discountPercentage}% OFF
          </div>
        )}
        
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
        <div className="flex items-center gap-1 sm:gap-2 mb-2 pr-10 sm:pr-12">
          <span className="text-[12px] sm:text-[14px] font-bold text-gray-900" title={`₹${price}`}>
            ₹{price}
          </span>
          {comparisonPrice && comparisonPrice > price && (
            <span className="text-[10px] sm:text-[11px] text-gray-400 line-through">
              ₹{comparisonPrice}
            </span>
          )}
          <span className="text-[8px] sm:text-[10px] text-gray-500 font-medium">
            /{unit}
          </span>
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
          .neumorphic-cart-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        `}</style>
        
        {/* Cart Icon - Positioned absolutely */}
        <button
          onClick={handleAddToCart}
          disabled={isPending || !isAvailable}
          className={`absolute flex items-center justify-center -translate-y-1/2 cursor-pointer right-0 top-1/2 focus:outline-none w-8 h-8 sm:w-10 sm:h-10 neumorphic-cart-btn`}
          aria-label={isAvailable ? `Add ${name} to cart` : 'Out of stock'}
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
