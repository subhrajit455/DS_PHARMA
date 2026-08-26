import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Filter, Eye, Package } from "lucide-react";
import toastUtil from "@/shared/utils/toast";
import { Button } from "@/admin/components/ui/Button";
import { Input } from "@/admin/components/ui/Input";
import { Badge } from "@/admin/components/ui/Badge";
import { Card, CardContent } from "@/admin/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/admin/components/ui/Table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/admin/components/ui/DropdownMenu";
import { Pagination } from "@/admin/components/ui/Pagination";
import Loading from "@/shared/components/common/Loading";
import { adminOrderUrl } from "@/config/userApi";
import OrderDetailsModal from "./OrderDetailsModal";

// Presentational-only helper: maps an order status to badge colors.
// Does not affect any data or logic.
const ORDER_STATUS_STYLES = {
  Processing: "bg-[#FBF1D9] text-[#8A6600] border border-[#EFDBA0]",
  Shipped: "bg-[#E4EEF3] text-[#2E5A70] border border-[#C7DEE7]",
  "Out for Delivery": "bg-[#F3E4DC] text-[#8A4B2C] border border-[#E7D8CC]",
  Delivered: "bg-[#E7EEE7] text-[#3A5340] border border-[#CFE0CF]",
  Cancelled: "bg-[#FBE7E7] text-[#8E2E3A] border border-[#F3D3D3]",
};

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeStatus, setActiveStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statuses = [
    "All",
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  const fetchOrders = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(adminOrderUrl.getAllOrders, {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchQuery || undefined,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      const apiData = response.data?.data;

      setOrders(apiData?.orders || []);
      setTotalPages(apiData?.totalPages || 1);
    } catch (error) {
      console.error(error);
      toastUtil.error("Failed to fetch orders");
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, currentPage, itemsPerPage]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${adminOrderUrl.updateOrderStatus}/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        },
      );

      toastUtil.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      console.error(error);
      toastUtil.error("Failed to update status");
    }
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex h-[50vh] items-center justify-center bg-[#F7F6F2]">
        <Loading size="large" text="Loading orders..." />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col space-y-5 bg-[#F7F6F2] p-4 sm:p-6">
      <div className="container-max mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
         
          <h2 className="mt-1 flex items-center gap-2 text-2xl font-bold tracking-tight text-[#1E2A38] sm:text-3xl">
            Orders
            <Package className="h-6 w-6 text-blue-500" />
          </h2>
          <p className="mt-1 text-sm text-[#6B7580]">
            Manage and track customer orders
          </p>
        </div>
      </div>

      <Card className="rounded-2xl border border-[#E7E3DA] bg-white shadow-sm card-improved animate-fade-in">
        <CardContent className="p-4 sm:p-5">
          {/* Filters */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg border border-[#E7E3DA] bg-white px-3.5 py-2 text-sm font-medium text-[#1E2A38] shadow-sm transition-colors hover:border-[#D8D2C4] hover:bg-[#FAF9F6] soft-transition">
                <Filter size={16} className="text-blue-500" />
                {activeStatus === "All" ? "Filter Status" : activeStatus}
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {statuses.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => setActiveStatus(status)}
                  >
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B3AFA4]"
                size={16}
              />
              <Input
                placeholder="Search order…"
                placeholderTextColor="gray-500"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="border-blue-400 focus-visible:ring-[#B5502D]/20"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-auto rounded-xl border border-[#E7E3DA] animate-fade-in">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#E7E3DA] bg-[#FAF9F6] hover:bg-[#FAF9F6]">
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-[#8A93A0]">
                    Order ID
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-[#8A93A0]">
                    Date
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-[#8A93A0]">
                    Shop Name
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-[#8A93A0]">
                    Total
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-[#8A93A0]">
                    Payment
                  </TableHead>
                   <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-[#8A93A0]">
                    Method
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-[#8A93A0]">
                    Status
                  </TableHead>
                  <TableHead className="text-right text-[11px] font-semibold uppercase tracking-wider text-[#8A93A0]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-14 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F3E4DC]">
                          <Package className="h-6 w-6 text-[#B5502D]" />
                        </div>
                        <p className="text-sm font-semibold text-[#1E2A38]">
                          No orders found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  orders
                    .filter((order) =>
                      activeStatus === "All"
                        ? true
                        : order.orderStatus === activeStatus,
                    )
                    .map((order) => (
                      <TableRow
                        key={order._id}
                        className="cursor-pointer border-b border-[#EDEAE2] transition-colors hover:bg-[#FAF9F6]"
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsModalOpen(true);
                        }}
                      >
                        <TableCell className="font-mono text-[13px] font-semibold text-[#1E2A38]">
                          #{order._id.slice(-6).toUpperCase()}
                        </TableCell>

                        <TableCell className="text-sm text-[#55636F]">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>

                        <TableCell className="text-sm font-medium text-[#1E2A38]">
                          {order.CustomerDetails?.CustName || "N/A"}
                        </TableCell>

                        <TableCell className="text-sm text-[#55636F]">
                          {order.ProductDetails?.length || 0} items
                        </TableCell>

                        <TableCell className="text-sm font-bold text-[#1E2A38]">
                          ₹ {Number(order.PaymentDetails?.totalInvoiceValue || 0).toFixed(2)}
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant={
                              order.PaymentDetails?.paymentmode == "0"
                                ? "success"
                                : "secondary"
                            }
                            className={
                              order.PaymentDetails?.paymentmode == "0"
                                ? "border border-[#CFE0CF] bg-[#E7EEE7] text-[#3A5340]"
                                : "border border-[#E7D8CC] bg-[#F3E4DC] text-blue-500"
                            }
                          >
                            {order.PaymentDetails?.paymentmode == "1"
                              ? "COD"
                              : "ONLINE" || "N/A"}
                          </Badge>
                        </TableCell>

                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <select
                            value={order.orderStatus || "Processing"}
                            onChange={(e) =>
                              handleStatusUpdate(order._id, e.target.value)
                            }
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm outline-none transition-all focus:ring-2 focus:ring-[#B5502D]/20 ${
                              ORDER_STATUS_STYLES[
                                order.orderStatus || "Processing"
                              ] || "bg-[#EEEFF1] text-[#4B5563] border border-[#E2E4E8]"
                            }`}
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for Delivery">
                              Out for Delivery
                            </option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </TableCell>

                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 text-[#55636F] hover:bg-[#F3E4DC] hover:text-[#B5502D]"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOrder(order);
                              setIsModalOpen(true);
                            }}
                          >
                            Details <Eye size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {!isLoading && orders.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={(val) => {
            setItemsPerPage(val);
            setCurrentPage(1);
          }}
        />
      )}

      {/* Order Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={setIsModalOpen}
      />
      </div>
    </div>
  );
};

export default OrdersList;