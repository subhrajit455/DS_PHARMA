import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Filter, Eye, Sparkles } from "lucide-react";
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
      <div className="flex h-[50vh] items-center justify-center">
        <Loading size="large" text="Loading orders..." />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4 p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            Orders <Sparkles className="text-emerald-500" />
          </h2>
          <p className="text-gray-500 text-sm">
            Manage and track customer orders
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          {/* Filters */}
          <div className="flex justify-between mb-4">
            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 border px-3 py-2 rounded">
                <Filter size={16} />
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
            <div className="relative w-72">
              <Search
                className="absolute right-3 top-3 text-gray-500"
                size={16}
              />
              <Input
                placeholder="Search Order..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-auto border rounded">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Shop Name</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No Orders Found
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
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsModalOpen(true);
                        }}
                      >
                        <TableCell>
                          #{order._id.slice(-6).toUpperCase()}
                        </TableCell>

                        <TableCell>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>

                        <TableCell>
                          {order.CustomerDetails?.CustName || "N/A"}
                        </TableCell>

                        <TableCell>
                          {order.ProductDetails?.length || 0} items
                        </TableCell>

                        <TableCell className="font-bold">
                          ₹{order.PaymentDetails?.totalInvoiceValue || 0}
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant={
                              order.PaymentDetails?.paymentmode == "0"
                                ? "success"
                                : "secondary"
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
                            className="border p-1 rounded"
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
  );
};

export default OrdersList;
