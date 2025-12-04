import { useLocation } from "react-router-dom";

/**
 * Hook to determine the active navigation item based on current route
 */
export const useActiveNavItem = () => {
  const location = useLocation();

  const getActiveItem = () => {
    const path = location.pathname;
    if (path === "/") return "Home";
    if (path.startsWith("/orders")) return "Orders";
    // For hash-based navigation
    if (location.hash === "#about") return "About Us";
    if (location.hash === "#contact") return "Contact Us";
    return "Home";
  };

  return getActiveItem();
};
