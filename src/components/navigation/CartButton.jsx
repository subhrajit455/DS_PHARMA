import { useNavigate } from 'react-router-dom';
import CartIcon from '../../assets/icons/Cart.png';

/**
 * Cart button component with badge showing item count
 */
export const CartButton = ({ totalCartItems, className = '' }) => {
  const navigate = useNavigate();

  return (
    <button
      aria-label="Shopping cart"
      tabIndex={0}
      type="button"
      onClick={() => navigate('/cart')}
      className={`relative rounded-full w-[30px] h-[28px] lg:w-9 lg:h-9 bg-white flex items-center justify-center border-none cursor-pointer transition-all duration-200 ease-out shadow-md outline-none hover:scale-110 hover:shadow-lg focus:outline-2 focus:outline-black/30 focus:outline-offset-2 ${className}`}
    >
      <img
        src={CartIcon}
        alt="Cart"
        style={{
          objectFit: 'contain'
        }}
        className='w-4 h-4 lg:w-5 lg:h-5'
      />
      {totalCartItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[6px] rounded-full w-3 h-3 lg:w-4 lg:h-4 flex items-center justify-center font-bold">
          {totalCartItems}
        </span>
      )}
    </button>
  );
};
