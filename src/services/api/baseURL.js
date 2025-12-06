// API Base Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const API_ENDPOINTS = {
  // Products
  PRODUCTS: "/products",
  PRODUCT_BY_ID: (id) => `/products/${id}`,
  CATEGORIES: "/categories",
  CATEGORY_PRODUCTS: (id) => `/categories/${id}/products`,

  // Cart
  CART: "/cart",
  CART_ADD: "/cart/add",
  CART_UPDATE: "/cart/update",
  CART_REMOVE: "/cart/remove",

  // Orders
  ORDERS: "/orders",
  ORDER_BY_ID: (id) => `/orders/${id}`,
  CREATE_ORDER: "/orders/create",

  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  PROFILE: "/auth/profile",

  // Payments
  PAYMENTS: "/payments",
  INITIATE_PAYMENT: "/payments/initiate",
  VERIFY_PAYMENT: "/payments/verify",

  // Search
  SEARCH: "/search",
  SEARCH_SUGGEST: "/search/suggest",
};
