import { CartButton } from './CartButton';
import { UserProfileButton } from './UserProfileButton';

/**
 * Mobile top bar component
 */
export const MobileTopBar = ({ totalCartItems, isAuthenticated, user }) => {
  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[rgba(165,232,220,0.95)] backdrop-blur-md border-b border-white/20 shadow-sm px-4 py-5 mt-5" style={{ padding: '10px 5px' }}>
      <div className="flex items-center justify-between">
        <span
          style={{
            fontFamily: 'Gyrotrope',
            fontSize: '20px',
            fontWeight: 700,
            color: '#000000',
            letterSpacing: '0.05em'
          }}
        >
          DS Pharma
        </span>

        <div className="flex items-center gap-3">
          <CartButton totalCartItems={totalCartItems} className="w-8 h-8" />
          <UserProfileButton 
            isAuthenticated={isAuthenticated} 
            user={user} 
            className="w-8 h-8 p-0 justify-center" 
            showName={false}
          />
        </div>
      </div>
    </div>
  );
};
