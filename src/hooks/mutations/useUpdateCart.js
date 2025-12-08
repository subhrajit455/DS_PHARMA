import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "../../services/cartService";
import { useToastStore } from "../../store/useToastStore";

export const useUpdateCart = () => {
  const queryClient = useQueryClient();
  const { error } = useToastStore();

  return useMutation({
    mutationFn: ({ itemId, quantity }) =>
      cartService.updateItem(itemId, quantity),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },

    onError: (err) => {
      error("Failed to update cart");
      console.error(err);
    },
  });
};
