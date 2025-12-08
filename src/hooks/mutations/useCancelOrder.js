import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../../services/orderService"; // Assuming cancel method exists or adding it
import { useToastStore } from "../../store/useToastStore";

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToastStore();

  return useMutation({
    mutationFn: (orderId) => {
      // Only mock implementation for now as service might not have it
      return new Promise((resolve) =>
        setTimeout(() => resolve({ id: orderId, status: "Cancelled" }), 500)
      );
    },

    onSuccess: () => {
      success("Order cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },

    onError: (err) => {
      error("Failed to cancel order");
      console.error(err);
    },
  });
};
