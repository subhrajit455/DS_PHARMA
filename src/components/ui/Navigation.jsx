import { motion } from 'framer-motion';
import { Search, User, Home, Package, Info, Phone, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CartIcon from '../../assets/icons/Cart.png';

// Mock product data for search suggestions
const MOCK_PRODUCTS = [
  { id: 1, name: 'Paracetamol 500mg', price: 12, image: '/src/assets/images/medicine.jpeg', category: 'Pain Relief' },
  { id: 2, name: 'Pharmeasy Fish Oil 1000mg', price: 1500, image: '/src/assets/images/medicine.jpeg', category: 'Supplements' },
  { id: 3, name: 'Vitamin D3 Capsules', price: 450, image: '/src/assets/images/medicine.jpeg', category: 'Vitamins' },
  { id: 4, name: 'Aspirin 75mg', price: 25, image: '/src/assets/images/medicine.jpeg', category: 'Cardiovascular' },
  { id: 5, name: 'Amoxicillin 250mg', price: 85, image: '/src/assets/images/medicine.jpeg', category: 'Antibiotics' },
];

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Orders', href: '/orders', icon: Package },
    { name: 'About Us', href: '#about', icon: Info },
    { name: 'Contact Us', href: '#contact', icon: Phone }
  ];

  // Determine active item based on current route
  const getActiveItem = () => {
    const path = location.pathname;
    if (path === '/') return 'Home';
    if (path.startsWith('/orders')) return 'Orders';
    // For hash-based navigation, check hash
    if (location.hash === '#about') return 'About Us';
    if (location.hash === '#contact') return 'Contact Us';
    return 'Home';
  };

  const activeItem = getActiveItem();

  // Debounced search effect
  useEffect(() => {
    if (searchQuery.trim()) {
      const timer = setTimeout(() => {
        const filtered = MOCK_PRODUCTS.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered);
      }, 300); // 300ms debounce delay

      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Click outside to close search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation for search
  const handleSearchKeyDown = (e) => {
    if (!isSearchOpen || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleProductSelect(searchResults[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsSearchOpen(false);
        setSelectedIndex(-1);
        searchInputRef.current?.blur();
        break;
      default:
        break;
    }
  };

  const handleProductSelect = (product) => {
    navigate(`/product/${product.id}`);
    setSearchQuery('');
    setIsSearchOpen(false);
    setSelectedIndex(-1);
  };

  const handleNavClick = (itemName, href) => {
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

  const handleKeyDown = (event, itemName, href) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNavClick(itemName, href);
    }
  };

  const SearchDropdown = ({ results, selectedIndex, onSelect }) => {
    if (!isSearchOpen || results.length === 0) return null;

    return (
      <div
        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-y-auto z-50"
        role="listbox"
        aria-label="Search suggestions"
      >
        {results.map((product, index) => (
          <div
            key={product.id}
            id={`search-option-${index}`}
            role="option"
            aria-selected={index === selectedIndex}
            className={`flex items-center gap-2 p-2 cursor-pointer transition-colors ${index === selectedIndex ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            onClick={() => onSelect(product)}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-10 h-10 object-cover rounded-md"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-xs text-gray-900 truncate" style={{ fontFamily: 'Gyrotrope' }}>
                {product.name}
              </p>
              <p className="text-[10px] text-gray-500" style={{ fontFamily: 'Gyrotrope' }}>
                {product.category}
              </p>
            </div>
            <p className="font-bold text-xs text-gray-900 whitespace-nowrap" style={{ fontFamily: 'Gyrotrope' }}>
              ₹{product.price}
            </p>
          </div>
        ))}
      </div>
    );
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
        style={{ width: 'calc(100% - 80px)', maxWidth: '1280px' }}
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
                    ? 'underline decoration-2'
                    : 'hover:underline hover:decoration-2'
                  }
                hover:opacity-70
                focus:outline-2 focus:outline-black/30 focus:outline-offset-1
              `}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.name, item.href);
                }}
                onKeyDown={(e) => handleKeyDown(e, item.name, item.href)}
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
            {/* Search Icon with Dropdown */}
            <div className="relative w-[38px] h-[35px] flex items-center justify-center" ref={searchRef}>
              {!isSearchOpen ? (
                <button
                  onClick={() => {
                    setIsSearchOpen(true);
                    setTimeout(() => searchInputRef.current?.focus(), 100);
                  }}
                  aria-label="Open search"
                  tabIndex={0}
                  type="button"
                  className="w-full h-full rounded-full bg-white flex items-center justify-center border-none cursor-pointer transition-all duration-200 ease-out shadow-[0_2px_8px_rgba(0,0,0,0.1)] outline-none hover:scale-[1.08] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] focus:outline-2 focus:outline-black/30 focus:outline-offset-2"
                >
                  <Search size={18} strokeWidth={2.5} color="#000000" />
                </button>
              ) : (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md z-50 w-[190px]">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSelectedIndex(-1);
                    }}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Search products..."
                    className="outline-none text-xs flex-1 bg-transparent min-w-0"
                    style={{ fontFamily: 'Gyrotrope', padding: '0.5rem' }}
                    role="combobox"
                    aria-label="Search products"
                    aria-expanded={searchResults.length > 0}
                    aria-controls="search-results"
                    aria-activedescendant={selectedIndex >= 0 ? `search-option-${selectedIndex}` : undefined}
                    aria-autocomplete="list"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="hover:opacity-70 transition-opacity"
                      aria-label="Clear search"
                    >
                      <X size={12} strokeWidth={2.5} color="#666" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (!searchQuery) {
                        setIsSearchOpen(false);
                      }
                    }}
                    className="hover:opacity-70 transition-opacity"
                    aria-label="Search"
                  >
                    <Search size={25} strokeWidth={2.5} color="#000000" />
                  </button>

                  {/* Dropdown inside the expanded container to match width/position */}
                  <div className="absolute top-full left-0 right-0 mt-2">
                    <SearchDropdown
                      results={searchResults}
                      selectedIndex={selectedIndex}
                      onSelect={handleProductSelect}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Cart Icon */}
            <button
              aria-label="Shopping cart"
              tabIndex={0}
              type="button"
              onClick={() => navigate('/cart')}
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center border-none cursor-pointer transition-all duration-200 ease-out shadow-md outline-none hover:scale-110 hover:shadow-lg focus:outline-2 focus:outline-black/30 focus:outline-offset-2"
            >
              <img
                src={CartIcon}
                alt="Cart"
                style={{
                  width: '20px',
                  height: '20px',
                  objectFit: 'contain'
                }}
              />
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
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.name, item.href);
                  }}
                  onKeyDown={(e) => handleKeyDown(e, item.name, item.href)}
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
                onClick={() => {
                  // On mobile, could open a modal or navigate to search page
                  setIsSearchOpen(!isSearchOpen);
                }}
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
                <img
                  src={CartIcon}
                  alt="Cart"
                  style={{
                    width: '20px',
                    height: '20px',
                    objectFit: 'contain'
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>
    </>
  );
};

export default Navigation;
