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
  RefreshCw,
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

  const displayName = customer.name || customer.party_name || "N/A";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";

  return (
    <TableRow className="group border-b border-[#EDEAE2] transition-colors duration-150 hover:bg-[#FAF9F6]">
      <TableCell className="py-4 px-6">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E7D8CC] bg-[#F3E4DC] text-sm font-bold text-blue-500">
              {initials}
            </div>
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold text-[#1E2A38] transition-colors group-hover:text-blue-500">
              {displayName}
            </span>
            <span className="mt-0.5 font-mono text-[11px] text-[#8A93A0]">
              ID: {customer.code}
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell className="py-4 px-6 hidden lg:table-cell">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 shrink-0 text-[#B3AFA4]" />
          <span className="text-sm text-[#55636F]">{phoneNumber || "N/A"}</span>
        </div>
      </TableCell>
      <TableCell className="py-4 px-6 hidden xl:table-cell">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 shrink-0 text-[#B3AFA4]" />
          <span className="max-w-[200px] truncate text-sm text-[#55636F]">
            {customer.email1 || customer.email2 || "N/A"}
          </span>
        </div>
      </TableCell>
      <TableCell className="py-4 px-6 hidden md:table-cell">
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 shrink-0 text-[#B3AFA4]" />
          <span className="max-w-[150px] truncate text-sm text-[#55636F]">
            {customer.company ||
              customer.organization ||
              customer.business_name ||
              "N/A"}
          </span>
        </div>
      </TableCell>
      <TableCell className="py-4 px-6 hidden lg:table-cell">
        <div className="flex max-w-[220px] flex-col gap-1">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#B3AFA4]" />
            <div className="flex min-w-0 flex-col gap-0.5">
              {cleanAddress && (
                <span className="text-sm leading-tight text-[#55636F]">
                  {cleanAddress}
                </span>
              )}
              {customer.city && (
                <span className="text-xs leading-tight text-[#8A93A0]">
                  {customer.city}
                  {customer.state && `, ${customer.state}`}
                  {customer.pincode && ` - ${customer.pincode}`}
                </span>
              )}
              {customer.country && (
                <span className="text-xs leading-tight text-[#8A93A0]">
                  {customer.country}
                </span>
              )}
              {!cleanAddress &&
                !customer.city &&
                !customer.state &&
                !customer.pincode &&
                !customer.country && (
                  <span className="text-sm italic text-[#B3AFA4]">
                    No address
                  </span>
                )}
            </div>
          </div>
        </div>
      </TableCell>

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
        response.data.totalActiveParties || 0;
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
    <div className="flex h-screen max-h-screen flex-col overflow-hidden bg-[#F7F6F2] overflow-x-hidden">
      {/* Header Section */}
      <header className="z-30 shrink-0 border-b border-[#E7E3DA] bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-[1600px] flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>

            <h1 className="mt-1 text-xl font-bold tracking-tight text-[#1E2A38] sm:text-2xl">
              Customers
            </h1>
            <p className="mt-1 text-sm text-[#6B7580]">
              Manage your customer database and party information
            </p>
          </div>
       
        </div>
      </header>

      {/* Search Toolbar */}
      <div className="z-20 shrink-0 border-b border-[#E7E3DA] bg-[#FAF9F6] px-6 py-4">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mx-auto flex max-w-[1600px] w-full flex-col items-center gap-4 md:flex-row"
          role="search"
          aria-label="Search customers"
        >
          <div className="relative w-full max-w-xl">
            <label htmlFor="customer-search" className="sr-only">
              Search customers by name, phone, or email
            </label>
{/* 
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-[#B3AFA4]" />
            </div> */}

            <input
              id="customer-search"
              type="search"
              inputMode="search"
              placeholder="Search customers by name, phone, or email…"
              value={search}
              onChange={handleSearchChange}
              className="block h-11 w-full rounded-xl border border-[#E7E3DA] bg-white py-2.5 pl-10 pr-12 text-sm text-[#1E2A38] placeholder:text-[#B3AFA4] shadow-sm soft-transition focus-glow"
            />

            {/* Clear / Reset button */}
            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setSearch("");
                  setPagination((p) => ({ ...p, currentPage: 1 }));
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
              >
                ×
              </button>
            )}
          </div>

              <div className="flex w-full shrink-0 items-center gap-3 justify-end md:w-auto">
              <div
                className="inline-flex items-center rounded-full bg-[#F3E4DC] px-3 py-1 text-xs font-semibold text-blue-500 shadow-sm"
                aria-live="polite"
              >
                <Users className="h-4 w-4 mr-10 text-blue-500 hidden sm:inline" />
                <span className="text-sm font-bold mr-1">{pagination.total.toLocaleString()}</span>
                <span className="md:inline-block text-xs text-[#55636F]">Customers</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPagination((p) => ({ ...p, currentPage: 1 }));
                  fetchCustomers();
                }}
                disabled={loading}
                aria-busy={loading}
                className="inline-flex h-10 w-24 items-center justify-center gap-2 rounded-xl bg-[#0096FF] px-4 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition-all hover:bg-[#0096FF] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 soft-transition"
                aria-label="Refresh customers"
              >
                <RefreshCw className={`h-4 w-4 text-[#6B7280] ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{loading ? "Refreshing" : "Refresh"}</span>
              </button>
            </div>
        </form>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden bg-[#F7F6F2] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto flex h-full max-w-[1600px] flex-col">
          <Card className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#E7E3DA] bg-white shadow-sm card-improved animate-fade-in">
            <CardContent className="flex flex-1 flex-col overflow-hidden p-0">
              {/* Scrollable Table Area */}
              <div
                id="admin-customer-table"
                className="no-scrollbar relative flex-1 overflow-auto overflow-x-auto"
              >
                <Table className="relative min-w-full border-collapse">
                  <TableHeader className="sticky top-0 z-20">
                    <TableRow className="border-b border-[#E7E3DA] bg-[#FAF9F6] hover:bg-[#FAF9F6]">
                      <TableHead className="sticky top-0 z-20 bg-[#FAF9F6] px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-[#8A93A0]">
                        Customer Information
                      </TableHead>
                      <TableHead className="sticky top-0 z-20 hidden bg-[#FAF9F6] px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-[#8A93A0] lg:table-cell">
                        Phone
                      </TableHead>
                      <TableHead className="sticky top-0 z-20 hidden bg-[#FAF9F6] px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-[#8A93A0] xl:table-cell">
                        Email
                      </TableHead>
                      <TableHead className="sticky top-0 z-20 hidden bg-[#FAF9F6] px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-[#8A93A0] md:table-cell">
                        Company
                      </TableHead>
                      <TableHead className="sticky top-0 z-20 hidden bg-[#FAF9F6] px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-[#8A93A0] lg:table-cell">
                        Address
                      </TableHead>
            
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      // Loading skeleton
                      Array.from({ length: pagination.limit }, (_, i) => (
                        <TableRow key={i} className="border-b border-[#EDEAE2]">
                          <TableCell className="py-4 px-6">
                            <div className="flex items-center gap-4">
                              <div className="h-11 w-11 animate-pulse rounded-xl bg-[#EDEAE2]" />
                              <div className="flex flex-col gap-2">
                                <div className="h-4 w-32 animate-pulse rounded bg-[#EDEAE2]" />
                                <div className="h-3 w-20 animate-pulse rounded bg-[#EDEAE2]" />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 px-6 hidden lg:table-cell">
                            <div className="h-4 w-24 animate-pulse rounded bg-[#EDEAE2]" />
                          </TableCell>
                          <TableCell className="py-4 px-6 hidden xl:table-cell">
                            <div className="h-4 w-32 animate-pulse rounded bg-[#EDEAE2]" />
                          </TableCell>
                          <TableCell className="py-4 px-6 hidden md:table-cell">
                            <div className="h-4 w-28 animate-pulse rounded bg-[#EDEAE2]" />
                          </TableCell>
                          <TableCell className="py-4 px-6 hidden lg:table-cell">
                            <div className="h-4 w-36 animate-pulse rounded bg-[#EDEAE2]" />
                          </TableCell>
                          <TableCell className="py-4 px-6 text-center">
                            <div className="mx-auto h-6 w-16 animate-pulse rounded-full bg-[#EDEAE2]" />
                          </TableCell>
                          <TableCell className="py-4 px-6 hidden xl:table-cell text-center">
                            <div className="mx-auto h-4 w-20 animate-pulse rounded bg-[#EDEAE2]" />
                          </TableCell>
                          <TableCell className="py-4 px-6 text-right">
                            <div className="ml-auto h-9 w-18 animate-pulse rounded bg-[#EDEAE2]" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : error ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-96 text-center">
                          <div className="flex flex-col items-center justify-center p-12">
                            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#FBE7E7]">
                              <Users className="h-10 w-10 text-blue-500" />
                            </div>
                            <h3 className="text-lg font-bold text-[#1E2A38]">
                              Error loading customers
                            </h3>
                            <p className="mx-auto mt-1 max-w-xs text-sm text-[#8A93A0]">
                              {error}
                            </p>
                            <Button
                              onClick={fetchCustomers}
                              className="mt-4 bg-[#1E2A38] text-white hover:bg-[#141D28]"
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
                            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#F3E4DC]">
                              <Users className="h-10 w-10 text-blue-500" />
                            </div>
                            <h3 className="text-lg font-bold text-[#1E2A38]">
                              No customers found
                            </h3>
                            <p className="mx-auto mt-1 max-w-xs text-sm text-[#8A93A0]">
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
              <div className="z-30 shrink-0 border-t border-[#E7E3DA] bg-white px-6 py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.03)]">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.total}
                  onPageChange={handlePageChange}
                  itemsPerPage={pagination.limit}
                  onItemsPerPageChange={handleItemsPerPageChange}
                  loading={loading}
                  variant="enterprise"
                  className="border-none bg-transparent p-0 shadow-none"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Customer View Modal - Placeholder for now */}
      {viewModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E2A38]/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl border border-[#E7E3DA] bg-white p-6 shadow-xl card-improved animate-pop">
            <h3 className="mb-4 text-lg font-bold text-[#1E2A38]">
              Customer Details
            </h3>
            <div className="space-y-2.5 text-sm text-[#3B4652]">
              <p>
                <span className="font-semibold text-[#1E2A38]">Name: </span>
                {selectedCustomer.name || selectedCustomer.party_name}
              </p>
              <p>
                <span className="font-semibold text-[#1E2A38]">Phone: </span>
                {selectedCustomer.phone || selectedCustomer.mobile}
              </p>
              <p>
                <span className="font-semibold text-[#1E2A38]">Email: </span>
                {selectedCustomer.email}
              </p>
              <p>
                <span className="font-semibold text-[#1E2A38]">Company: </span>
                {selectedCustomer.company}
              </p>
            </div>
            <div className="mt-5 flex justify-end">
              <Button
                onClick={() => setViewModalOpen(false)}
                className="bg-[#1E2A38] text-white hover:bg-[#141D28]"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersList;