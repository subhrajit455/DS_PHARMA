import React from 'react';
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
    <div
      className={`bg-white overflow-hidden rounded-lg cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md w-full ${className} ${!isAvailable ? 'opacity-60' : ''}`}
      style={{ maxWidth: '300px', padding: '10px' }}
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
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white shadow-sm transition-colors duration-150"
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          style={{ padding: '5px' }}
        >
          <Heart
            className={isInWishlist ? 'fill-red-500 text-red-500 w-3 h-3 sm:w-4 sm:h-4' : 'text-gray-400 w-3 h-3 sm:w-4 sm:h-4'}
          />
        </button>
        
        {/* Out of Stock Badge */}
        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="px-3 py-1 text-[8px] sm:text-xs font-semibold text-white bg-red-500 rounded-full" style={{ padding: '5px' }}>
              Out of Stock
            </span>
          </div>
        )}
        
        {/* Discount Badge */}
        {discountPercentage > 0 && isAvailable && (
          <div className="absolute top-2 left-2 px-2 py-0.5 text-[8px] sm:text-[10px] font-bold text-white bg-green-500 rounded" style={{ padding: '1px  5px' }}>
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
        <h3 className="flex items-center justify-start text-[10px] sm:text-[14px] font-semibold leading-tight text-left text-gray-900 min-h-8">
          {name.length > 15 ? `${name.substring(0, 13)}...` : name}
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

        {/* Cart Icon - Positioned absolutely */}
        <button
          onClick={handleAddToCart}
          disabled={isPending || !isAvailable}
          className="absolute flex items-center justify-center -translate-y-1/2 cursor-pointer right-0 top-1/2 focus:outline-none w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-150"
          aria-label={isAvailable ? `Add ${name} to cart` : 'Out of stock'}
        >
          <img
            className="w-2.5 h-2.5 sm:w-4.5 sm:h-4.5"
            src={CartIcon}
            alt="Add to Cart"
            style={{
              objectFit: 'contain',
              opacity: 0.8
            }}
          />
        </button>
      </div>
    </div>
  );
};


export default PharmacyProductCard;
