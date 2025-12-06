/**
 * User Data for DS Pharma
 * This file contains user-specific data, profiles, and initial state.
 * It is designed to be the source of truth for user management in this mock environment.
 */

// --- Mock Users ---
export const USERS = [
  {
    id: 1,
    name: "Gourav Gupta",
    email: "demo@dspharma.com",
    password: "demo123",
    phone: "+91 9876543210",
    role: "admin",
    address: {
      street: "123 Tech Park",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
    },
    orders: [],
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya@example.com",
    password: "user123",
    phone: "+91 9876543211",
    role: "user",
    address: {
      street: "45 Green Way",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
    },
    orders: [],
  },
  {
    id: 3,
    name: "Rahul Verma",
    email: "rahul@example.com",
    password: "user123",
    phone: "+91 9876543212",
    role: "user",
    address: {
      street: "78 Lake View",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
    },
    orders: [],
  },
  {
    id: 4,
    name: "Sarah Jenkins",
    email: "sarah@example.com",
    password: "user123",
    phone: "+91 9876543213",
    role: "user",
    address: {
      street: "90 Beach Road",
      city: "Goa",
      state: "Goa",
      pincode: "403001",
    },
    orders: [],
  },
];

// --- Mock Orders ---
export const MOCK_ORDERS = [
  {
    id: "964368966",
    productName: "Pharmeasy Fish Oil 1000mg Soft Gelatin 60 Capsules",
    customerName: "Gourav Gupta",
    phone: "4664938723",
    address: "A/B, Section Lane, Odisha, Noida, 744115",
    status: "In Process",
    statusColor: "#FF7A59",
    statusBg: "#FF7A59",
    expectedDelivery: "18th Dec, 2025",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80", // Using remote image instead of local asset
    trackingId: "EKFC9469943995",
    courierName: "EKART",
    price: 1500,
    quantity: 1,
    paymentBreakdown: {
      totalCartValue: 1500,
      discount: 1000,
      coupon: 200,
      gst: 94,
      deliveryCharges: 40,
      total: 1364,
    },
    timeline: [
      { status: "Order Placed", completed: true },
      { status: "On The Way", completed: true, active: true },
      { status: "Expected Delivery", date: "18th Dec, 2025", completed: false },
      { status: "Out For Delivery", completed: false },
      { status: "Delivered", completed: false },
    ],
    customerAddress: {
      name: "Gourav Gupta",
      phone: "9999999999",
      address: "A/B, Section Lane, Odisha, Noida, 744115",
    },
    appliedCoupon: {
      code: "SAVE200",
      discount: 200,
    },
  },
  {
    id: "964368967",
    productName: "Pharmeasy Fish Oil 1000mg Soft Gelatin 60 Capsules",
    customerName: "Gourav Gupta",
    phone: "4664938723",
    address: "A/B, Section Lane, Odisha, Noida, 744115",
    status: "Waiting For Pick Up",
    statusColor: "#FF8C6B",
    statusBg: "#FF8C6B",
    expectedDelivery: "18th Dec, 2025",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "964368968",
    productName: "Pharmeasy Fish Oil 1000mg Soft Gelatin 60 Capsules",
    customerName: "Gourav Gupta",
    phone: "4664938723",
    address: "A/B, Section Lane, Odisha, Noida, 744115",
    status: "On the Way",
    statusColor: "#FF9E7D",
    statusBg: "#FF9E7D",
    expectedDelivery: "18th Dec, 2025",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "964368969",
    productName: "Pharmeasy Fish Oil 1000mg Soft Gelatin 60 Capsules",
    customerName: "Gourav Gupta",
    phone: "4664938723",
    address: "A/B, Section Lane, Odisha, Noida, 744115",
    status: "Out For Delivery",
    statusColor: "#5FD4A0",
    statusBg: "#5FD4A0",
    phoneNumber: "+919999999999 Ext. 121",
    expectedDelivery: "18th Dec, 2025",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "964368970",
    productName: "Pharmeasy Fish Oil 1000mg Soft Gelatin 60 Capsules",
    customerName: "Gourav Gupta",
    phone: "4664938723",
    address: "A/B, Section Lane, Odisha, Noida, 744115",
    status: "Delivered",
    statusColor: "#059669",
    statusBg: "#059669",
    deliveredDate: "17 Dec, 2025",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "964368971",
    productName: "Pharmeasy Fish Oil 1000mg Soft Gelatin 60 Capsules",
    customerName: "Gourav Gupta",
    phone: "4664938723",
    address: "A/B, Section Lane, Odisha, Noida, 744115",
    status: "Returned",
    statusColor: "#FF6B6B",
    statusBg: "#FF6B6B",
    deliveredDate: "17 Dec, 2025",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
  },
];

// --- Initial User State ---
// This represents the state of a new or unauthenticated user session
export const INITIAL_USER_STATE = {
  isAuthenticated: false,
  currentUser: null,
  cart: [],
  wishlist: [],
  notifications: [],
  recentSearches: [],
  preferences: {
    darkMode: false,
    emailNotifications: true,
  },
};

/**
 * Helper to get a user by email (Simulates DB lookup)
 * @param {string} email
 * @returns {object|undefined} User object
 */
export const getUserByEmail = (email) => {
  return USERS.find((u) => u.email === email);
};

/**
 * Helper to get a user by ID
 * @param {string|number} id
 * @returns {object|undefined} User object
 */
export const getUserById = (id) => {
  return USERS.find((u) => u.id === id);
};
