import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../../services/orderService";
import { useCartStore } from "../../store/useCartStore"; // To clear cart
import { useToastStore } from "../../store/useToastStore";
import { useNavigate } from "react-router-dom";

export const usePlaceOrder = () => {
  const queryClient = useQueryClient();
  const clearCart = useCartStore((state) => state.clearCart);
  const { success, error } = useToastStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (orderData) => orderService.createOrder(orderData),

    onSuccess: (data) => {
      success("Order placed successfully!");
      clearCart(); // Clear local store
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      // Navigate to order confirmation or details
      if (data?.data?.id) {
        navigate(`/order-confirmation/${data.data.id}`);
      }
    },

    onError: (err) => {
      error("Failed to place order. Please try again.");
      console.error(err);
    },
  });
};
