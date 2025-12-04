import { Search, X } from 'lucide-react';
import { SearchDropdown } from './SearchDropdown';

/**
 * Search bar component with expanding functionality
 */
export const SearchBar = ({
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
  onProductSelect,
  className = ''
}) => {
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
          onProductSelect(searchResults[selectedIndex]);
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

  return (
    <div ref={searchRef} className={`relative ${className}`}>
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

          <div className="absolute top-full left-0 right-0 mt-2">
            <SearchDropdown
              results={searchResults}
              selectedIndex={selectedIndex}
              onSelect={onProductSelect}
              isOpen={isSearchOpen}
            />
          </div>
        </div>
      )}
    </div>
  );
};
