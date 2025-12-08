import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],

      // Actions
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.id === product.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { ...product, quantity }],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      // Method to sync data from API
      setData: (items) => {
        // Ensure items is always an array to prevent crashes
        const validItems = Array.isArray(items) ? items : [];
        set({ items: validItems });
      },

      // Computed values (getters)
      getTotalItems: () => {
        const items = get().items;
        return Array.isArray(items)
          ? items.reduce((total, item) => total + item.quantity, 0)
          : 0;
      },

      getTotalPrice: () => {
        const items = get().items;
        return Array.isArray(items)
          ? items.reduce((total, item) => total + item.price * item.quantity, 0)
          : 0;
      },

      getItemQuantity: (productId) => {
        const items = get().items;
        if (!Array.isArray(items)) return 0;
        const item = items.find((item) => item.id === productId);
        return item ? item.quantity : 0;
      },
    }),
    {
      name: "ds-pharma-cart-v2", // Updated key to bypass corrupted data
      version: 1,
    }
  )
);
