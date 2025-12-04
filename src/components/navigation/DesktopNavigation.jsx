import { motion as Motion } from 'framer-motion';

import { NAV_ITEMS } from './constants';
import { SearchBar } from './SearchBar';
import { CartButton } from './CartButton';
import { UserProfileButton } from './UserProfileButton';

/**
 * Desktop navigation bar component
 */
export const DesktopNavigation = ({
  activeItem,
  onNavClick,
  onProductSelect,
  searchProps,
  totalCartItems,
  isAuthenticated,
  user
}) => {
  const handleKeyDown = (event, itemName, href) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onNavClick(itemName, href);
    }
  };

  return (
    <Motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      role="navigation"
      aria-label="Main navigation"
      className="navigation-desktop hidden md:block absolute top-8 left-1/2 transform -translate-x-1/2 z-50 mx-10"
      style={{ width: 'calc(100% - 80px)', maxWidth: '1280px' }}
    >
      <div
        className="navigation-desktop-inner bg-[hsla(169,59%,78%,1)] backdrop-blur-md rounded-[48px] px-7 flex items-center justify-around shadow-[0_4px_24px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] border border-white/20"
        style={{ padding: '0.4rem 1rem' }}
      >
        {/* Spacer */}
        <div className="flex-1 md:hidden lg:block"></div>

        {/* Navigation Links */}
        <div className="nav-links-container flex gap-5 items-center ">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.name}
              href={item.href}
              tabIndex={0}
              role="link"
              aria-current={activeItem === item.name ? 'page' : undefined}
              className="nav-link-item cursor-pointer relative outline-none transition-all duration-200 ease-out hover:opacity-70 focus:outline-2 focus:outline-black/30 focus:outline-offset-1 no-underline"
              style={{
                fontFamily: 'Gyrotrope',
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: '100%',
                color: '#000000',
                paddingBottom: '5px',
                textDecoration: 'none'
              }}
              onClick={(e) => {
                e.preventDefault();
                onNavClick(item.name, item.href);
              }}
              onKeyDown={(e) => handleKeyDown(e, item.name, item.href)}
            >
              {item.name}
              {activeItem === item.name && (
                <Motion.div
                  layoutId="activeNavUnderline"
                  className="absolute bottom-px left-1/2 -translate-x-1/2 w-[120%] flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-1 h-1 rounded-full bg-black shrink-0" />
                  <div className="h-[2px] bg-black flex-1" />
                  <div className="w-1 h-1 rounded-full bg-black shrink-0" />
                </Motion.div>
              )}
            </a>
          ))}
        </div>

        {/* Right Side Icons */}
        <div className="nav-icons-container flex gap-3 items-center flex-1 justify-end">
          <SearchBar
            {...searchProps}
            onProductSelect={onProductSelect}
            className="nav-search-icon relative w-[30px] h-[28px] lg:w-[38px] lg:h-[35px] flex items-center justify-center"
          />
          <CartButton totalCartItems={totalCartItems} className="nav-cart-icon w-9 h-9" />
          <UserProfileButton
            isAuthenticated={isAuthenticated}
            user={user}
            className="nav-user-profile"
            showName={true}
          />
        </div>
      </div>
    </Motion.nav>
  );
};
