import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCartStore } from '../../store/useCartStore';
import { useToastStore } from '../../store/useToastStore';

/**
 * Hook to add product to cart
 */
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const addItem = useCartStore((state) => state.addItem);
  const { success, error } = useToastStore();
  
  return useMutation({
    mutationFn: ({ product, quantity = 1 }) => {
      // For local state, this is synchronous
      // If you have a backend API, replace with: cartService.addToCart(product.id, quantity)
      return Promise.resolve(addItem(product, quantity));
    },
    
    onSuccess: (data, variables) => {
      success(`Added ${variables.product.name} to cart!`);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    
    onError: (err) => {
      error('Failed to add product to cart');
      console.error(err);
    },
  });
};
