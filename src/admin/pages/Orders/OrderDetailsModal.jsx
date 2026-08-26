import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/admin/components/ui/Dialog";
import { Button } from "@/admin/components/ui/Button";
import { Badge } from "@/admin/components/ui/Badge";
import { Card } from "@/admin/components/ui/Card";

const OrderDetailsModal = ({ order, isOpen, onClose }) => {
  if (!order) return null;

  console.log("Order details in modal", order);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center ">
            <DialogTitle>
              Order Details #{order._id?.slice(-6).toUpperCase()}
             
            </DialogTitle>
            <Badge
              variant={
                order.orderStatus === "Delivered" ? "success" : "secondary"
              }
            >
              {order.orderStatus || ""}
            </Badge>
          </div>
          <p className="text-sm text-gray-500">
            Placed on{" "}
            {order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : ""}
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Customer Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">
              Customer Information
            </h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">CustomerId:</span>
                <span className="font-medium text-gray-900">
                  {order.CustomerDetails?.CustomerID || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Name:</span>
                <span className="font-medium text-gray-900">
                  {order.CustomerDetails?.CustName || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email:</span>
                <span className="font-medium text-gray-900">
                  {order.CustomerDetails?.CustEmail || "---"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phone:</span>
                <span className="font-medium text-gray-900">
                  {order.CustomerDetails?.CustMobile || "---"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Address:</span>
                <span className="font-medium text-gray-900">
                  {order.CustomerDetails?.Address || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">
              Shipping Address
            </h3>
            <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
              <p className="font-medium">
                {order.CustomerDetails?.shipname || "N/A"}
              </p>
            </div>
            <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
              <p className="font-medium">
                {order.CustomerDetails?.shipAdd1 || "N/A"}
              </p>
            </div>
            <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
              <p className="font-medium">
                {order.CustomerDetails?.shipAdd2 || ""}
              </p>
            </div>
            <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
              <p className="font-medium">
                {order.CustomerDetails?.shipAdd3 || ""}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">
              Order Items ({order.ProductDetails?.length || 0})
            </h3>
            <div className="space-y-3">
              {order.ProductDetails?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-white border border-gray-100 p-3 rounded-lg"
                >
                  <img
                    src={item.images?.[0]?.url || "https://jetsonpharma.com/wp-content/uploads/2023/05/medicine-placeholder-300x300.png"}
                    alt={item.name || "Product image"}
                    className="w-16 h-16 object-cover rounded-md border border-gray-200"
                    onError={(e) => (e.target.src = "https://jetsonpharma.com/wp-content/uploads/2023/05/medicine-placeholder-300x300.png")}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">Code: {item.code}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p>Qty: {item.Quantity}</p>
                    <p className="font-medium">₹{item.Rate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">
              Payment Summary
            </h3>
            <div className="bg-emerald-50/50 p-4 rounded-lg flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium">
                  {order.PaymentDetails?.paymentmode === 1
                    ? "COD"
                    : order.PaymentDetails?.paymentmode === 0
                      ? "ONLINE"
                      : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount</span>
                <span className="font-medium">
                  {order.PaymentDetails?.totalAmount || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount</span>
                <span className="font-medium">
                  {order.PaymentDetails?.totalDiscountAmount || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total</span>
                <span className="font-medium">
                  {order.PaymentDetails?.totalInvoiceValue || "N/A"}
                </span>
              </div>
              <div className="border-t border-emerald-200 pt-2 mt-2 flex justify-between font-bold text-lg text-emerald-900">
                <span>Grand Total</span>
                <span>₹{order.PaymentDetails?.totalInvoiceValue || 0}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => onClose(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
