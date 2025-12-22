import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/productService";

/**
 * Hook to fetch all product categories
 */
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => productService.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes (categories don't change often)
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};
