import { useMutation, useQueryClient } from "@tanstack/react-query";
import useDataStore from "../../store/useDataStore";
import { useToastStore } from "../../store/useToastStore";

/**
 * Hook to add product to cart
 */
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToastStore();

  return useMutation({
    mutationFn: async ({ product, quantity = 1 }) => {
      // Direct update to Global Data Store
      // Mimics API + Store update in one go for this architecture
      useDataStore.getState().addToCart(product, quantity);

      // Simulate network delay if desired, or return immediate success
      return { success: true };
    },

    onSuccess: (data, variables) => {
      success(`Added ${variables.product.name} to cart!`);
      // Invalidate if we had other queries, but here store is the source
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },

    onError: (err) => {
      error("Failed to add product to cart");
      console.error(err);
    },
  });
};
