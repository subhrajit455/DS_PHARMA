import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/productService";

/**
 * Hook to fetch products with filters
 * @param {Object} filters - Query parameters
 */
export const useProducts = (filters = {}) => {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => productService.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // Previously cacheTime
  });
};

/**
 * Hook to fetch all categories
 */
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => productService.getCategories(),
    staleTime: 60 * 60 * 1000, // 1 hour (categories don't change often)
  });
};
