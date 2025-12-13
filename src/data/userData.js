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
// --- Mock Orders ---
export const MOCK_ORDERS = [
  {
    id: "964368972",
    productName: "Dolo 650 Tablet 15s",
    customerName: "Priya Sharma",
    customerId: 2,
    phone: "+91 9876543211",
    address: "45 Green Way, Mumbai, 400001",
    status: "Order Placed",
    statusColor: "#10B981",
    statusBg: "#10B981",
    expectedDelivery: "20th Dec, 2025",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
    price: 33.75,
    quantity: 2,
    paymentBreakdown: {
      totalCartValue: 67.5,
      discount: 0,
      coupon: 0,
      gst: 8,
      deliveryCharges: 40,
      total: 115.5,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    timeline: [
      { status: "Order Placed", completed: true, active: true, date: "Today" },
    ],
  },
  {
    id: "964368971",
    productName: "Shelcal 500 Tablet",
    customerName: "Rahul Verma",
    customerId: 3,
    phone: "+91 9876543212",
    address: "78 Lake View, Delhi, 110001",
    status: "In Process",
    statusColor: "#FF7A59",
    statusBg: "#FF7A59",
    expectedDelivery: "19th Dec, 2025",
    image:
      "https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=400&q=80",
    price: 119,
    quantity: 1,
    paymentBreakdown: {
      totalCartValue: 119,
      discount: 10,
      coupon: 0,
      gst: 14,
      deliveryCharges: 40,
      total: 163,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    timeline: [
      {
        status: "Order Placed",
        completed: true,
        active: false,
        date: "Yesterday",
      },
      {
        status: "Confirmed",
        completed: true,
        active: false,
        date: "Yesterday",
      },
      { status: "In Process", completed: true, active: true, date: "Today" },
    ],
  },
  {
    id: "964368970",
    productName: "Revital H Capsule",
    customerName: "Sarah Jenkins",
    customerId: 4,
    phone: "+91 9876543213",
    address: "90 Beach Road, Goa, 403001",
    status: "On The Way",
    statusColor: "#F59E0B",
    statusBg: "#F59E0B",
    expectedDelivery: "18th Dec, 2025",
    image:
      "https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=400&q=80",
    price: 310,
    quantity: 1,
    paymentBreakdown: {
      totalCartValue: 310,
      discount: 0,
      coupon: 50,
      gst: 37,
      deliveryCharges: 0,
      total: 297,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    timeline: [
      {
        status: "Order Placed",
        completed: true,
        active: false,
        date: "11 Dec",
      },
      { status: "Shipped", completed: true, active: true, date: "Yesterday" },
    ],
  },
  {
    id: "964368969",
    productName: "Volini Gel 30g",
    customerName: "Ram Kumar",
    customerId: null, // Guest
    phone: "+91 9876543214",
    address: "Sector 15, Chandigarh",
    status: "Delivered",
    statusColor: "#059669",
    statusBg: "#059669",
    deliveredDate: "12th Dec, 2025",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80",
    price: 125,
    quantity: 2,
    paymentBreakdown: {
      totalCartValue: 250,
      discount: 0,
      coupon: 0,
      gst: 30,
      deliveryCharges: 40,
      total: 320,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    timeline: [
      { status: "Delivered", completed: true, active: true, date: "12 Dec" },
    ],
  },
  {
    id: "964368968",
    productName: "Accu-Chek Active",
    customerName: "Priya Sharma",
    customerId: 2,
    phone: "+91 9876543211",
    address: "45 Green Way, Mumbai",
    status: "Cancelled",
    statusColor: "#EF4444",
    statusBg: "#EF4444",
    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80",
    price: 950,
    quantity: 1,
    paymentBreakdown: {
      totalCartValue: 950,
      discount: 50,
      coupon: 0,
      gst: 114,
      deliveryCharges: 0,
      total: 1014,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    timeline: [
      { status: "Cancelled", completed: true, active: true, date: "10 Dec" },
    ],
  },
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
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
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
      {
        status: "Order Placed",
        completed: true,
        active: false,
        date: "15 Dec, 2025",
      },
      {
        status: "Confirmed",
        completed: true,
        active: false,
        date: "15 Dec, 2025",
      },
      {
        status: "In Process",
        completed: true,
        active: true,
        date: "16 Dec, 2025",
      },
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
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
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
