// Mock Address Data for Frontend-Only Mode
// ============================================================
// TODO: Replace with real API calls when backend is ready

export const MOCK_ADDRESSES = [
  {
    id: "addr-1",
    type: "Home",
    name: "Gourav Gupta",
    phone: "9876543210",
    address: "123 Main Street, Apartment 4B",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    isDefault: true,
  },
  {
    id: "addr-2",
    type: "Work",
    name: "Gourav Gupta",
    phone: "9876543210",
    address: "Tech Park, Building A, Floor 5",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560001",
    isDefault: false,
  },
];

// localStorage key for address persistence
export const ADDRESS_STORAGE_KEY = "dspharma_user_addresses";
