import { useNavigate } from 'react-router-dom';

/**
 * Search results dropdown component
 */
export const SearchDropdown = ({ results, selectedIndex, onSelect, isOpen }) => {
  const navigate = useNavigate();

  if (!isOpen || results.length === 0) return null;

  const handleSelect = (product) => {
    onSelect(product);
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-y-auto z-50"
      role="listbox"
      aria-label="Search suggestions"
      id="search-results"
    >
      {results.map((product, index) => (
        <div
          key={product.id}
          id={`search-option-${index}`}
          role="option"
          aria-selected={selectedIndex === index}
          onClick={() => handleSelect(product)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSelect(product);
          }}
          tabIndex={0}
          className={`p-4 flex items-center gap-4 cursor-pointer transition-colors border-b last:border-b-0 ${
            selectedIndex === index
              ? 'bg-teal-50 border-teal-100'
              : 'hover:bg-gray-50 border-gray-100'
          }`}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-12 h-12 object-cover rounded-lg bg-gray-100"
          />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Gyrotrope' }}>
              {product.name}
            </h4>
            <p className="text-xs text-gray-500" style={{ fontFamily: 'Gyrotrope' }}>
              {product.category}
            </p>
          </div>
          <span className="text-sm font-bold text-teal-600" style={{ fontFamily: 'Gyrotrope' }}>
            ₹{product.price}
          </span>
        </div>
      ))}
    </div>
  );
};
