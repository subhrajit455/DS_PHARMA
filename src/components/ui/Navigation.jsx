import { motion } from 'framer-motion';
import { Search, ShoppingCart, User, Home, Package, Info, Phone } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const [activeItem, setActiveItem] = useState('Home');
  const navigate = useNavigate();
  
  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Orders', href: '/orders', icon: Package },
    { name: 'About Us', href: '#about', icon: Info },
    { name: 'Contact Us', href: '#contact', icon: Phone }
  ];

  const handleNavClick = (itemName, href) => {
    setActiveItem(itemName);
    if (href.startsWith('/')) {
      navigate(href);
    } else if (href.startsWith('#')) {
      // Scroll to section
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleKeyDown = (event, itemName) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNavClick(itemName);
    }
  };

  return (
    <>
      {/* Desktop Navigation - Top */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        role="navigation"
        aria-label="Main navigation"
        className="hidden md:block absolute top-12 left-1/2 transform -translate-x-1/2 z-50 mx-10"
        style={{ width: 'calc(100% - 160px)', maxWidth: '1180px' }}
      >
      <div 
        className="bg-[rgba(165,232,220,0.9)] backdrop-blur-md rounded-[48px] px-7 flex items-center justify-between shadow-[0_4px_24px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] border border-white/20"
        style={{ paddingTop: '0.4rem', paddingBottom: '0.4rem' }}
      >
        {/* Spacer for left side */}
        <div className="flex-1"></div>
        
        {/* Navigation Links - Centered */}
        <div className="flex gap-8 items-center">
          {navItems.map((item, index) => (
            <a
              key={item.name}
              href={item.href}
              tabIndex={0}
              role="link"
              aria-current={activeItem === item.name ? 'page' : undefined}
              style={{
                fontFamily: 'Gyrotrope',
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: '100%',
                letterSpacing: '0%',
                color: '#000000'
              }}
              className={`
                cursor-pointer relative outline-none
                transition-all duration-200 ease-out
                ${activeItem === item.name 
                  ? 'underline decoration-2 underline-offset-[5px]' 
                  : 'hover:underline hover:decoration-2 hover:underline-offset-[5px]'
                }
                hover:opacity-70
                focus:outline-2 focus:outline-black/30 focus:outline-offset-1
              `}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.name, item.href);
              }}
              onKeyDown={(e) => handleKeyDown(e, item.name)}
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Right Side Icons */}
        <div 
          className="flex gap-3 items-center flex-1 justify-end"
          style={{ paddingRight: '1rem' }}
        >
          {/* Search Icon */}
          <button
            aria-label="Search"
            tabIndex={0}
            type="button"
            className="w-[38px] h-[35px] rounded-full bg-white flex items-center justify-center border-none cursor-pointer transition-all duration-200 ease-out shadow-[0_2px_8px_rgba(0,0,0,0.1)] outline-none hover:scale-[1.08] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] focus:outline-2 focus:outline-black/30 focus:outline-offset-2"
          >
            <Search size={18} strokeWidth={2.5} color="#000000" />
          </button>

          {/* Cart Icon */}
          <button
            aria-label="Shopping cart"
            tabIndex={0}
            type="button"
            onClick={() => navigate('/cart')}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center border-none cursor-pointer transition-all duration-200 ease-out shadow-md outline-none hover:scale-110 hover:shadow-lg focus:outline-2 focus:outline-black/30 focus:outline-offset-2"
          >
            <ShoppingCart size={18} strokeWidth={2.5} color="#000000" />
          </button>

          {/* User Profile */}
          <button
            aria-label="User profile - Bikram"
            tabIndex={0}
            type="button"
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2.5 bg-white rounded-full py-1.5 pl-1.5 pr-[18px] shadow-[0_2px_8px_rgba(0,0,0,0.1)] cursor-pointer border-none transition-all duration-200 ease-out outline-none hover:scale-[1.03] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] focus:outline-2 focus:outline-black/30 focus:outline-offset-2"
          >
            <div className="w-[38px] h-[35px] rounded-full bg-gray-200 flex items-center justify-center">
              <User size={16} strokeWidth={2.5} color="#000000" />
            </div>
            <span className="font-sans text-sm font-medium text-black tracking-[0.01em]"
            style={{ paddingRight: '1rem' }}>
              Hi, Bikram
            </span>
          </button>
        </div>
      </div>
    </motion.nav>

      {/* Mobile Navigation - Bottom (React Native Style) */}
      <motion.nav
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        role="navigation"
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom)'
        }}
      >
        <div 
          className="bg-[rgba(165,232,220,0.95)] backdrop-blur-md border-t border-white/20 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
          style={{
            paddingTop: '0.75rem',
            paddingBottom: '0.75rem',
            paddingLeft: '1rem',
            paddingRight: '1rem'
          }}
        >
          <div className="flex items-center justify-around max-w-screen-xl mx-auto">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeItem === item.name;
              
              return (
                <a
                  key={item.name}
                  href={item.href}
                  tabIndex={0}
                  role="button"
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => handleNavClick(item.name)}
                  onKeyDown={(e) => handleKeyDown(e, item.name)}
                  className={`
                    flex flex-col items-center justify-center gap-1
                    px-3 py-2 rounded-lg
                    transition-all duration-200 ease-out
                    ${isActive 
                      ? 'text-black' 
                      : 'text-gray-700'
                    }
                    active:scale-95
                    focus:outline-2 focus:outline-black/30 focus:outline-offset-1
                  `}
                  style={{
                    minWidth: '60px'
                  }}
                >
                  <IconComponent 
                    size={22} 
                    strokeWidth={isActive ? 2.5 : 2}
                    color={isActive ? '#000000' : '#4B5563'}
                  />
                  <span
                    style={{
                      fontFamily: 'Gyrotrope',
                      fontSize: '11px',
                      fontWeight: isActive ? 600 : 500,
                      lineHeight: '1',
                    }}
                  >
                    {item.name}
                  </span>
                  {isActive && (
                    <div 
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
                      style={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        backgroundColor: '#000000',
                        marginTop: '2px'
                      }}
                    />
                  )}
                </a>
              );
            })}
            
            {/* Search and Cart Icons on Mobile */}
            <div className="flex items-center gap-2 ml-2">
              <button
                aria-label="Search"
                tabIndex={0}
                type="button"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center border-none cursor-pointer transition-all duration-200 ease-out shadow-sm outline-none active:scale-95 focus:outline-2 focus:outline-black/30 focus:outline-offset-1"
              >
                <Search size={18} strokeWidth={2.5} color="#000000" />
              </button>
              
              <button
                aria-label="Shopping cart"
                tabIndex={0}
                type="button"
                onClick={() => navigate('/cartDetails')}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center border-none cursor-pointer transition-all duration-200 ease-out shadow-md outline-none active:scale-95 focus:outline-2 focus:outline-black/30 focus:outline-offset-1"
              >
                <ShoppingCart size={18} strokeWidth={2.5} color="#000000" />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>
    </>
  );
};

export default Navigation;
