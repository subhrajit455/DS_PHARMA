import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { PRODUCTS, BANNERS, CATEGORY_DETAILS } from "../data/sampleData";
import { USERS, MOCK_ORDERS, INITIAL_USER_STATE } from "../data/userData";

// Unique name for localStorage key
const STORE_NAME = "ds-pharma-store";

const useDataStore = create(
  persist(
    (set) => ({
      // --- Data State ---
      products: PRODUCTS || [],
      orders: MOCK_ORDERS || [],
      users: USERS || [],
      banners: BANNERS || [],
      categories: CATEGORY_DETAILS || [],

      // --- User Session State ---
      currentUser: null,
      isAuthenticated: false,
      cart: [],
      wishlist: [],
      notifications: [],

      // --- Actions: Products ---
      setProducts: (products) => set({ products }),
      updateProduct: (updatedProduct) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === updatedProduct.id ? updatedProduct : p
          ),
        })),
      addProduct: (newProduct) =>
        set((state) => ({
          products: [newProduct, ...state.products],
        })),
      deleteProduct: (productId) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId),
        })),

      // --- Actions: Users ---
      addUser: (newUser) =>
        set((state) => ({
          users: [...state.users, newUser],
        })),

      // --- Actions: Orders ---
      placeOrder: (newOrder) =>
        set((state) => ({
          orders: [newOrder, ...state.orders],
          cart: [], // Clear cart after order
        })),
      updateOrderStatus: (orderId, status) =>
        set((state) => {
          const updatedOrders = state.orders.map((order) => {
            if (order.id === orderId) {
              // Create timeline entry
              const newTimeline = [
                ...(order.timeline || []),
                {
                  status: status,
                  completed: true,
                  active: true,
                  date: new Date().toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }),
                },
              ].map((t) => ({ ...t, active: t.status === status })); // Activate only new status

              return { ...order, status, timeline: newTimeline };
            }
            return order;
          });
          return { orders: updatedOrders };
        }),

      // --- Actions: Users / Auth ---
      login: (user) =>
        set({
          currentUser: user,
          isAuthenticated: true,
          cart: user.cart || [],
          wishlist: user.wishlist || [],
        }),
      logout: () => set(INITIAL_USER_STATE),
      updateUser: (updatedUser) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === updatedUser.id ? updatedUser : u
          ),
          currentUser:
            state.currentUser?.id === updatedUser.id
              ? updatedUser
              : state.currentUser,
        })),

      // --- Actions: Cart ---
      addToCart: (product, quantity = 1) =>
        set((state) => {
          const existingItem = state.cart.find(
            (item) => item.id === product.id
          );
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { ...product, quantity }] };
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        })),
      updateCartQuantity: (productId, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        })),
      clearCart: () => set({ cart: [] }),

      // --- Actions: Wishlist ---
      addToWishlist: (product) =>
        set((state) => {
          const exists = state.wishlist.find((item) => item.id === product.id);
          if (exists) return state; // Already in wishlist
          return { wishlist: [...state.wishlist, product] };
        }),
      removeFromWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.filter((item) => item.id !== productId),
        })),
      moveToCart: (productId) =>
        set((state) => {
          const product = state.wishlist.find((item) => item.id === productId);
          if (!product) return state;

          // Remove from wishlist
          const newWishlist = state.wishlist.filter(
            (item) => item.id !== productId
          );

          // Add to cart (or increment if exists)
          const existingCartItem = state.cart.find(
            (item) => item.id === productId
          );
          let newCart;
          if (existingCartItem) {
            newCart = state.cart.map((item) =>
              item.id === productId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            newCart = [...state.cart, { ...product, quantity: 1 }];
          }

          return { wishlist: newWishlist, cart: newCart };
        }),

      // --- Sync Helpers ---
      // This function effectively "reloads" the state from storage if called manually,
      // but zustand/persist handles most hydration automatically.
      // We can expose a reset/init if needed.
      resetToDefaults: () =>
        set({
          products: PRODUCTS,
          orders: MOCK_ORDERS,
          users: USERS,
          banners: BANNERS,
          categories: CATEGORY_DETAILS,
          ...INITIAL_USER_STATE,
        }),
    }),
    {
      name: STORE_NAME, // unique name in localStorage
      storage: createJSONStorage(() => localStorage), // explicitly use localStorage
      partialize: (state) => ({
        // Persist everything EXCEPT session-specific UI states if any.
        // For now, persist ALL data to ensure full sync.
        products: state.products,
        orders: state.orders,
        users: state.users,
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        cart: state.cart,
        wishlist: state.wishlist,
      }),
    }
  )
);

// Enable cross-tab sync via storage event
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === STORE_NAME) {
      useDataStore.persist.rehydrate();
    }
  });
}

export default useDataStore;
