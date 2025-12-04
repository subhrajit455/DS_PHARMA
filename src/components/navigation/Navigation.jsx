import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useNavigationSearch } from './hooks/useNavigationSearch';
import { useActiveNavItem } from './hooks/useActiveNavItem';
import { DesktopNavigation } from './DesktopNavigation';
import { MobileTopBar } from './MobileTopBar';
import { MobileBottomNav } from './MobileBottomNav';

/**
 * Main Navigation component - orchestrates all navigation sub-components
 */
const Navigation = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const totalCartItems = useCartStore((state) => state.getTotalItems());
  const activeItem = useActiveNavItem();
  
  const searchProps = useNavigationSearch();

  const handleNavClick = (itemName, href) => {
    if (href.startsWith('/')) {
      navigate(href);
    } else if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleProductSelect = (product) => {
    navigate(`/product/${product.id}`);
    searchProps.setSearchQuery('');
    searchProps.setIsSearchOpen(false);
    searchProps.setSelectedIndex(-1);
  };

  return (
    <>
      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 767px) {
          .nav-links-container {
            gap: 0.5rem !important;
          }
          .nav-link-item {
            font-size: 13px !important;
            padding-bottom: 6px !important;
            white-space: nowrap !important;
          }
          .nav-icons-container {
            gap: 0.5rem !important;
            padding-right: 0.5rem !important;
            flex-shrink: 0 !important;
          }
          .nav-search-icon {
            width: 32px !important;
            height: 30px !important;
          }
          .nav-search-icon svg {
            width: 16px !important;
            height: 16px !important;
          }
          .nav-cart-icon {
            width: 32px !important;
            height: 32px !important;
          }
          .nav-cart-icon img {
            width: 16px !important;
            height: 16px !important;
          }
          .nav-user-profile {
            width: 32px !important;
            height: 32px !important;
            padding: 0 !important;
          }
          .nav-user-profile svg {
            width: 16px !important;
            height: 16px !important;
          }
          .nav-user-name {
            display: none !important;
          }
          .nav-user-avatar-container {
            width: 32px !important;
            height: 32px !important;
          }
          .nav-user-avatar-container svg {
            width: 16px !important;
            height: 16px !important;
          }
          .nav-search-expanded {
            width: 160px !important;
            padding: 0.375rem 0.75rem !important;
          }
          .nav-search-expanded input {
            font-size: 11px !important;
            padding: 0.25rem !important;
          }
          .nav-search-expanded svg {
            width: 16px !important;
            height: 16px !important;
          }
        }
        @media (min-width: 768px) and (max-width: 900px) {
          .nav-links-container {
            gap: 0.75rem !important;
          }
          .nav-link-item {
            font-size: 12px !important;
          }
          .nav-user-text {
            font-size: 11px !important;
          }
        }
      `}</style>

      {/* Desktop Navigation */}
      <DesktopNavigation
        activeItem={activeItem}
        onNavClick={handleNavClick}
        onProductSelect={handleProductSelect}
        searchProps={searchProps}
        totalCartItems={totalCartItems}
        isAuthenticated={isAuthenticated}
        user={user}
      />

      {/* Mobile Top Bar */}
      <MobileTopBar
        totalCartItems={totalCartItems}
        isAuthenticated={isAuthenticated}
        user={user}
      />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeItem={activeItem}
        onNavClick={handleNavClick}
      />
    </>
  );
};

export default Navigation;
