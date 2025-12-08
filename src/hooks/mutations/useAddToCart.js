import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "../../services/cartService";
import { useToastStore } from "../../store/useToastStore";
import { useCartStore } from "../../store/useCartStore";

/**
 * Hook to add product to cart
 */
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToastStore();

  return useMutation({
    mutationFn: ({ product, quantity = 1 }) => {
      // Optimistic update: Update local store immediately for instant UI feedback
      useCartStore.getState().addItem(product, quantity);

      // Use the service to ensure backend/mock synchronization
      return cartService.addItem({ ...product, quantity });
    },

    onSuccess: (data, variables) => {
      success(`Added ${variables.product.name} to cart!`);
      // Re-sync with backend to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },

    onError: (err) => {
      error("Failed to add product to cart");
      console.error(err);
      // If error, the next query invalidation would fix the state,
      // or we could force a refetch here to rollback
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
