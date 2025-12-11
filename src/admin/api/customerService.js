import mockApi from "../../api/mockApi";

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

    // In a real app we would join orders here via API,
    // but the store holds them separately. Let's fetch orders to calculate stats.
    // Optimization: Store could return enriched users, but let's keep it simple.
    // Ideally we assume the user object already has 'orders' array or we skip detailed stats for list view.
    // But existing UI might expect totals.
    // Let's rely on the user object in the store having an 'orders' array if we implemented that link,
    // OR we fetch orders to map.
    // Given the complexity of joining in frontend, let's assume specific User structure or fetch orders.

    // Quick Fix: Let's fetch all orders once to map stats if needed, or skip for performance.
    // The previous implementation did a join.
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
      address: user.address
        ? `${user.address.street}, ${user.address.city}, ${user.address.state}`
        : "N/A",
    };
  },
};
