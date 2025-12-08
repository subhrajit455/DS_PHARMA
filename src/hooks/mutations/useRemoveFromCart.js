import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "../../services/cartService";
import { useToastStore } from "../../store/useToastStore";

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToastStore();

  return useMutation({
    mutationFn: (itemId) => cartService.removeItem(itemId),

    onSuccess: () => {
      success("Item removed from cart");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },

    onError: (err) => {
      error("Failed to remove item");
      console.error(err);
    },
  });
};
