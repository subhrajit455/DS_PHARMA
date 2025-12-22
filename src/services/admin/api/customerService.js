import mockApi from "@/services/api/mockApi";
import useDataStore from "@/store/useDataStore";

export const customerService = {
  getCustomers: async (params) => {
    // Note: Search params handling can be pushed to mockApi if needed.
    // For now, we fetch all users (non-admin) and filter/transform here.
    const allUsers = await mockApi.getCustomers(); // returns non-admins

    // ✅ DEFENSIVE: Ensure allUsers is an array
    if (!Array.isArray(allUsers)) {
      console.error("getCustomers: Expected array, got:", typeof allUsers);
      return [];
    }

    let filtered = allUsers;
    const { search } = params || {};

    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter((u) => {
        // ✅ DEFENSIVE: Check for null/undefined before calling .toLowerCase()
        const name = u?.name || "";
        const email = u?.email || "";
        return (
          name.toLowerCase().includes(lowerSearch) ||
          email.toLowerCase().includes(lowerSearch)
        );
      });
    }

    const allOrders = await mockApi.getOrders();

    return filtered.map((u) => {
      const userOrders = allOrders.filter(
        (o) => o.customerName === u.name || o.customerId === u.id
      ); // Loose matching by name/id
      return {
        ...u,
        orders: userOrders.length,
        totalSpent: userOrders.reduce(
          (sum, o) => sum + (o.paymentBreakdown?.total || o.price || 0),
          0
        ),
        status: "Active",
        joined: "Jan 2024", // Mock if missing
      };
    });
  },

  getCustomer: async (id) => {
    const user = await mockApi.getCustomerById(id);
    const allOrders = await mockApi.getOrders();

    // Transform / Enrich
    const userOrders = allOrders.filter(
      (o) => o.customerName === user.name || o.customerId === user.id
    );

    // Enrich with addresses from global store if available
    const globalAddresses = useDataStore.getState().addresses;
    // Find the default address for this specific user if possible,
    // or just use the first one as 'Default'.
    const defaultAddr =
      globalAddresses.find((a) => a.isDefault) || globalAddresses[0];

    return {
      ...user,
      status: "Active",
      joined: "Jan 2024",
      orders: userOrders.length,
      totalSpent: userOrders.reduce(
        (sum, o) => sum + (o.paymentBreakdown?.total || o.price || 0),
        0
      ),
      recentOrders: userOrders.slice(0, 5).map((o) => ({
        id: o.id,
        date: o.timeline?.[0]?.date || "N/A",
        total: o.paymentBreakdown?.total || o.price || 0,
        status: o.status,
      })),
      address: defaultAddr
        ? `${defaultAddr.address}, ${defaultAddr.city}, ${defaultAddr.state} - ${defaultAddr.pincode}`
        : user.address?.street
        ? `${user.address.street}, ${user.address.city}, ${user.address.state}`
        : "N/A",
    };
  },
};
