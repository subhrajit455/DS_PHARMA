import { useState, useEffect, useRef } from "react";
import { MOCK_PRODUCTS } from "../constants";

/**
 * Hook to manage navigation search functionality
 */
export const useNavigationSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  // Debounced search effect
  useEffect(() => {
    if (searchQuery.trim()) {
      const timer = setTimeout(() => {
        const filtered = MOCK_PRODUCTS.filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered);
      }, 300);

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

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    isSearchOpen,
    setIsSearchOpen,
    selectedIndex,
    setSelectedIndex,
    searchRef,
    searchInputRef,
  };
};
