import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Eye,
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  Building,
  Calendar,
} from "lucide-react";
import toastUtil from "@/shared/utils/toast";
import { Button } from "@/admin/components/ui/Button";
import { Card, CardContent } from "@/admin/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/admin/components/ui/Table";
import { Pagination } from "@/admin/components/ui/Pagination";
import { Badge } from "@/admin/components/ui/Badge";
import customerService from "@/services/customerService";

const CustomerRow = React.memo(({ customer, onView }) => {
  // Extract phone number from address if embedded
  const extractPhoneFromAddress = (address) => {
    if (!address) return { cleanAddress: "", extractedPhone: "" };

    // Match Indian phone numbers (10 digits starting with 6-9)
    const phoneRegex = /\b[6-9]\d{9}\b/g;
    const phoneMatches = address.match(phoneRegex);

    if (phoneMatches && phoneMatches.length > 0) {
      // Remove phone numbers from address
      const cleanAddress = address.replace(phoneRegex, "").trim();
      return { cleanAddress, extractedPhone: phoneMatches[0] };
    }

    return { cleanAddress: address, extractedPhone: "" };
  };

  const { cleanAddress, extractedPhone } = extractPhoneFromAddress(
    customer.address,
  );

  // Get the best phone number available
  const phoneNumber =
    customer.phone ||
    customer.mobile ||
    customer.contact_number ||
    extractedPhone;

  return (
    <TableRow className="group border-b border-gray-100/80 hover:bg-blue-50/30 transition-all duration-150">
      <TableCell className="py-4 px-6">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-12 h-12 bg-blue-100 flex items-center justify-center rounded-xl border border-blue-200">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
              {customer.name || customer.party_name || "N/A"}
            </span>
            <span className="text-[11px] text-gray-500 font-mono mt-0.5">
              ID: {customer.code }
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell className="py-4 px-6 hidden lg:table-cell">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{phoneNumber || "N/A"}</span>
        </div>
      </TableCell>
      <TableCell className="py-4 px-6 hidden xl:table-cell">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600 truncate max-w-[200px]">
            {customer.email1 || customer.email2 || "N/A"}
          </span>
        </div>
      </TableCell>
      <TableCell className="py-4 px-6 hidden md:table-cell">
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600 truncate max-w-[150px]">
            {customer.company ||
              customer.organization ||
              customer.business_name ||
              "N/A"}
          </span>
        </div>
      </TableCell>
      <TableCell className="py-4 px-6 hidden lg:table-cell">
        <div className="flex flex-col gap-1 max-w-[200px]">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex flex-col gap-0.5 min-w-0">
              {cleanAddress && (
                <span className="text-sm text-gray-600 leading-tight">
                  {cleanAddress}
                </span>
              )}
              {customer.city && (
                <span className="text-xs text-gray-500 leading-tight">
                  {customer.city}
                  {customer.state && `, ${customer.state}`}
                  {customer.pincode && ` - ${customer.pincode}`}
                </span>
              )}
              {customer.country && (
                <span className="text-xs text-gray-500 leading-tight">
                  {customer.country}
                </span>
              )}
              {!cleanAddress &&
                !customer.city &&
                !customer.state &&
                !customer.pincode &&
                !customer.country && (
                  <span className="text-sm text-gray-400 italic">
                    No address
                  </span>
                )}
            </div>
          </div>
        </div>
      </TableCell>
      {/* <TableCell className="py-4 px-6 text-center">
        <Badge
          variant={
            customer.status === "active" || customer.is_active
              ? "success"
              : "secondary"
          }
          className="px-3"
        >
          {customer.status || (customer.is_active ? "Active" : "Inactive")}
        </Badge>
      </TableCell> */}
      {/* <TableCell className="py-4 px-6 hidden xl:table-cell text-center">
        <div className="flex items-center justify-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-500">
            {customer.createdAt
              ? new Date(customer.createdAt).toLocaleDateString()
              : "N/A"}
          </span>
        </div>
      </TableCell> */}
      {/* <TableCell className="py-4 px-6 text-right">
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            onClick={() => onView(customer)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </TableCell> */}
    </TableRow>
  );
});

CustomerRow.displayName = "CustomerRow";

const CustomersList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 25,
    total: 0,
    totalPages: 1,
  });

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pagination.currentPage,
        limit: pagination.limit,
        query: search,
        sortBy: "name",
        order: 1,
        is_deleted: 0,
      };

      const response = await customerService.getAllCustomers(params);
      console.log("Fetched customers response:", response);

      // Handle different response structures
      const customerData = response.data.parties;
      const totalCount =
        response.data.totalActiveParties ||0;
      const totalPagesCount =
        response.data.totalPages ||
        response.data.pages ||
        Math.ceil(totalCount / pagination.limit);

      setCustomers(Array.isArray(customerData) ? customerData : []);
      setPagination((prev) => ({
        ...prev,
        total: totalCount,
        totalPages: totalPagesCount,
      }));
    } catch (err) {
      console.error("Failed to fetch customers:", err);
      setError(err.message || "Failed to fetch customers");
      toastUtil.error("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [pagination.currentPage, pagination.limit, search]);

  // Handle page change
  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    const scrollTarget = document.querySelector("#admin-customer-table");
    if (scrollTarget) {
      scrollTarget.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (limit) => {
    setPagination((prev) => ({ ...prev, limit, currentPage: 1 }));
  };

  // Handle search change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Handle view customer
  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setViewModalOpen(true);
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-[#F9FAFB] overflow-hidden">
      {/* Header Section */}
      <header className="shrink-0 px-6 py-4 bg-white border-b border-gray-200/80 shadow-sm z-30">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Customers Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your customer database and party information
            </p>
          </div>
          {/* <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              className="flex-1 sm:flex-none h-10 px-4 font-semibold text-gray-700 hover:bg-gray-50 border-gray-300 transition-all active:scale-95"
              onClick={() => navigate("/admin/dashboard")}
            >
              Dashboard
            </Button>
            <Button
              onClick={() => navigate("/admin/customers/new")}
              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all active:scale-95 h-10 px-5 font-bold"
            >
              <Plus className="mr-2 h-4 w-4" />
              <span>Add Customer</span>
            </Button>
          </div> */}
        </div>
      </header>

      {/* Search Toolbar */}
      <div className="shrink-0 px-6 py-4 bg-gray-50/50 border-b border-gray-200/60 z-20">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full max-w-xl group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search customers by name, phone, or email..."
              value={search}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300/80 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm group-hover:border-gray-400"
            />
          </div>
          <div className="flex items-center gap-2 ml-auto shrink-0 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            <Badge
              variant="secondary"
              className="cursor-default bg-white border-gray-200 text-gray-600"
            >
              {pagination.total.toLocaleString()} Customers Found
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden p-4 sm:p-6 lg:p-8 bg-gray-50/30">
        <div className="max-w-[1600px] mx-auto h-full flex flex-col">
          <Card className="flex-1 flex flex-col min-h-0 border border-gray-200/80 shadow-xl shadow-gray-200/40 bg-white rounded-2xl overflow-hidden">
            <CardContent className="flex flex-col flex-1 p-0 overflow-hidden">
              {/* Scrollable Table Area */}
              <div
                id="admin-customer-table"
                className="flex-1 overflow-auto no-scrollbar relative"
              >
                <Table className="relative border-collapse min-w-full">
                  <TableHeader className="sticky top-0 z-20">
                    <TableRow className="bg-gray-50 border-b border-gray-200 hover:bg-gray-50">
                      <TableHead className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50 z-20">
                        Customer Information
                      </TableHead>
                      <TableHead className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell sticky top-0 bg-gray-50 z-20">
                        Phone
                      </TableHead>
                      <TableHead className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider hidden xl:table-cell sticky top-0 bg-gray-50 z-20">
                        Email
                      </TableHead>
                      <TableHead className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell sticky top-0 bg-gray-50 z-20">
                        Company
                      </TableHead>
                      <TableHead className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell sticky top-0 bg-gray-50 z-20">
                        Address
                      </TableHead>
                      {/* <TableHead className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center sticky top-0 bg-gray-50 z-20">
                        Status
                      </TableHead> */}
                      {/* <TableHead className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider hidden xl:table-cell sticky top-0 bg-gray-50 z-20">
                        Created
                      </TableHead> */}
                      {/* <TableHead className="py-4 px-6 text-right text-[11px] font-bold text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50 z-20">
                        Actions
                      </TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      // Loading skeleton
                      Array.from({ length: pagination.limit }, (_, i) => (
                        <TableRow key={i}>
                          <TableCell className="py-4 px-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse" />
                              <div className="flex flex-col gap-2">
                                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
                                <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 px-6 hidden lg:table-cell">
                            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                          </TableCell>
                          <TableCell className="py-4 px-6 hidden xl:table-cell">
                            <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
                          </TableCell>
                          <TableCell className="py-4 px-6 hidden md:table-cell">
                            <div className="w-28 h-4 bg-gray-200 rounded animate-pulse" />
                          </TableCell>
                          <TableCell className="py-4 px-6 hidden lg:table-cell">
                            <div className="w-36 h-4 bg-gray-200 rounded animate-pulse" />
                          </TableCell>
                          <TableCell className="py-4 px-6 text-center">
                            <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse mx-auto" />
                          </TableCell>
                          <TableCell className="py-4 px-6 hidden xl:table-cell text-center">
                            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse mx-auto" />
                          </TableCell>
                          <TableCell className="py-4 px-6 text-right">
                            <div className="w-18 h-9 bg-gray-200 rounded animate-pulse ml-auto" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : error ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-96 text-center">
                          <div className="flex flex-col items-center justify-center p-12">
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
                              <Users className="w-10 h-10 text-red-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">
                              Error loading customers
                            </h3>
                            <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
                              {error}
                            </p>
                            <Button
                              onClick={fetchCustomers}
                              className="mt-4 bg-blue-600 hover:bg-blue-700"
                            >
                              Try Again
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : customers.length > 0 ? (
                      customers.map((customer) => (
                        <CustomerRow
                          key={customer._id || customer.id}
                          customer={customer}
                          onView={handleViewCustomer}
                        />
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="h-96 text-center">
                          <div className="flex flex-col items-center justify-center p-12">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                              <Users className="w-10 h-10 text-gray-200" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">
                              No customers found
                            </h3>
                            <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
                              {search
                                ? "Try adjusting your search terms."
                                : "Start by adding your first customer."}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Footer */}
              <div className="shrink-0 px-6 py-4 bg-white border-t border-gray-200/80 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.total}
                  onPageChange={handlePageChange}
                  itemsPerPage={pagination.limit}
                  onItemsPerPageChange={handleItemsPerPageChange}
                  loading={loading}
                  variant="enterprise"
                  className="shadow-none border-none p-0 bg-transparent"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Customer View Modal - Placeholder for now */}
      {viewModalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Customer Details</h3>
            <div className="space-y-2">
              <p>
                <strong>Name:</strong>{" "}
                {selectedCustomer.name || selectedCustomer.party_name}
              </p>
              <p>
                <strong>Phone:</strong>{" "}
                {selectedCustomer.phone || selectedCustomer.mobile}
              </p>
              <p>
                <strong>Email:</strong> {selectedCustomer.email}
              </p>
              <p>
                <strong>Company:</strong> {selectedCustomer.company}
              </p>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={() => setViewModalOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersList;
