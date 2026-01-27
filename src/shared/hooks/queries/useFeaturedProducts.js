import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { featuredService } from "@/services/admin/api/featuredService";
import { toast } from "react-hot-toast";

/**
 * Hook to fetch all featured products
 */
export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ["featured-products"],
    queryFn: featuredService.getFeaturedProducts,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch all products for admin selection
 * @param {Object} params - Query parameters (search, page, etc)
 */
export const useAllProducts = (params = {}) => {
  return useQuery({
    queryKey: ["products", "all", params],
    queryFn: () => featuredService.getAllProducts(params),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to add a product to the featured list
 */
/**
 * Hook to add a product to the featured list (Optimistic Update)
 */
export const useAddFeaturedProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId) => featuredService.addToFeatured(productId),
    onMutate: async (productId) => {
      // 1. Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["featured-products"] });

      // 2. Snapshot the previous value
      const previousFeatured = queryClient.getQueryData(["featured-products"]);

      // 3. Optimistically update to the new value
      queryClient.setQueryData(["featured-products"], (old) => {
        // Handle different data structures (array or { data: [] })
        const oldData = Array.isArray(old) ? old : old?.data || [];

        // Check if already exists to prevent duplicates in UI
        if (
          oldData.some(
            (item) =>
              item.product?._id === productId ||
              item._id === productId ||
              item.productId === productId,
          )
        ) {
          return old;
        }

        // Mock a new featured item for immediate display
        // Note: We don't have the full product details here usually, but we try access query cache or use placeholder
        // Ideally we would look up the product in 'products' cache to display details
        const productDetails = queryClient
          .getQueryData(["products", "all", {}])
          ?.data?.find((p) => p._id === productId) || {
          _id: productId,
          name: "Loading...",
          price: "...",
        };

        const newFeaturedItem = {
          _id: `temp-${Date.now()}`, // Temporary ID until backend confirms
          product: productDetails,
          productId: productId,
          isOptimistic: true,
        };

        return Array.isArray(old)
          ? [...old, newFeaturedItem]
          : { ...old, data: [...oldData, newFeaturedItem] };
      });

      // Return a context object with the snapshotted value
      return { previousFeatured };
    },
    onError: (err, newTodo, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousFeatured) {
        queryClient.setQueryData(
          ["featured-products"],
          context.previousFeatured,
        );
      }
      const message =
        err.response?.data?.message || "Failed to add to featured";
      toast.error(message);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure server sync
      queryClient.invalidateQueries({ queryKey: ["featured-products"] });
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Added to featured products");
    },
  });
};

/**
 * Hook to remove a product from the featured list (Optimistic Update)
 */
export const useRemoveFeaturedProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => featuredService.removeFromFeatured(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["featured-products"] });
      const previousFeatured = queryClient.getQueryData(["featured-products"]);

      queryClient.setQueryData(["featured-products"], (old) => {
        const oldData = Array.isArray(old) ? old : old?.data || [];
        // Filter out the item with the given ID (Featured ID)
        // We also handle valid Product ID filtering just in case logic mixed up
        const newData = oldData.filter(
          (item) => item._id !== id && item.product?._id !== id,
        );

        return Array.isArray(old) ? newData : { ...old, data: newData };
      });

      return { previousFeatured };
    },
    onError: (err, id, context) => {
      if (context?.previousFeatured) {
        queryClient.setQueryData(
          ["featured-products"],
          context.previousFeatured,
        );
      }
      const message =
        err.response?.data?.message || "Failed to remove from featured";
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["featured-products"] });
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Removed from featured products");
    },
  });
};
