// Main Navigation component
export { default } from "./Navigation";

// Sub-components (for potential individual use)
export { DesktopNavigation } from "./DesktopNavigation";
export { MobileTopBar } from "./MobileTopBar";
export { MobileBottomNav } from "./MobileBottomNav";
export { SearchBar } from "./SearchBar";
export { SearchDropdown } from "./SearchDropdown";
export { CartButton } from "./CartButton";
export { UserProfileButton } from "./UserProfileButton";

// Hooks
export { useNavigationSearch } from "./hooks/useNavigationSearch";
export { useActiveNavItem } from "./hooks/useActiveNavItem";

// Constants
export { NAV_ITEMS, MOCK_PRODUCTS } from "./constants";
