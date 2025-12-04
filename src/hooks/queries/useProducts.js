import { useQuery } from '@tanstack/react-query';
import { productService } from '../../services/productService';

/**
 * Hook to fetch products with filters
 * @param {Object} filters - Query parameters
 */
export const useProducts = (filters = {}) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // Previously cacheTime
  });
};
