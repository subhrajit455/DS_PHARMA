import apiClient from "./apiClient";
import { API_ENDPOINTS } from "./baseURL";

// Helper to filter products locally
import useDataStore from "@/store/useDataStore";

const getFilteredProducts = (query, filters, sort) => {
  // Use store as source of truth
  let results = useDataStore.getState().products || [];

  // 1. Text Search
  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.genericName?.toLowerCase().includes(q) ||
        p.manufacturer?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) // Added category search for better UX
    );
  }

  // 2. Filters
  if (filters?.categories?.length > 0) {
    results = results.filter((p) => filters.categories.includes(p.category));
  }
  if (filters?.manufacturers?.length > 0) {
    results = results.filter((p) =>
      filters.manufacturers.includes(p.manufacturer)
    );
  }
  if (filters?.priceRange) {
    const [min, max] = filters.priceRange;
    results = results.filter((p) => p.price >= min && p.price <= max);
  }
  if (filters?.prescriptionRequired !== undefined) {
    results = results.filter(
      (p) => p.prescriptionRequired === filters.prescriptionRequired
    );
  }
  if (filters?.inStock) {
    results = results.filter((p) => p.inStock);
  }

  if (filters?.isHighlighted) {
    results = results.filter((p) => p.isHighlighted);
  }

  if (filters?.isFeatured) {
    results = results.filter((p) => p.isFeatured);
  }

  // 3. Sorting
  if (sort) {
    switch (sort) {
      case "price_asc":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        results.sort((a, b) => b.price - a.price);
        break;
      case "name_asc":
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // relevance (no-op for now)
        break;
    }
  }

  return results;
};

// MOCK SERVICE (Enable by default for now)
const USE_MOCK = true;

const searchService = {
  getSuggestions: async (query) => {
    if (USE_MOCK) {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 200));
      if (!query) return [];
      const q = query.toLowerCase();
      const allProducts = useDataStore.getState().products || [];
      const suggestions = allProducts
        .filter((p) => p.name?.toLowerCase().includes(q))
        .map((p) => ({
          id: p.id,
          name: p.name,
          type: "product",
          slug: p.id, // using ID as slug for mock
        }))
        .slice(0, 5);
      return { data: suggestions };
    }
    return apiClient.get(API_ENDPOINTS.SEARCH_SUGGEST, { params: { query } });
  },

  searchProducts: async ({ query, filters, sort, page = 1, limit = 20 }) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const filtered = getFilteredProducts(query, filters, sort);

      const start = (page - 1) * limit;
      const paginated = filtered.slice(start, start + limit);

      // Extract facets from full filtered list (before pagination) for dynamic filters
      const categories = [...new Set(filtered.map((p) => p.category))];
      const manufacturers = [...new Set(filtered.map((p) => p.manufacturer))];
      const minPrice = Math.min(...filtered.map((p) => p.price));
      const maxPrice = Math.max(...filtered.map((p) => p.price));

      return {
        data: {
          products: paginated,
          total: filtered.length,
          page,
          pages: Math.ceil(filtered.length / limit),
          facets: {
            categories,
            manufacturers,
            priceRange: [minPrice, maxPrice],
          },
        },
      };
    }
    return apiClient.get(API_ENDPOINTS.SEARCH, {
      params: { query, ...filters, sort, page, limit },
    });
  },
};

export default searchService;
