import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OrderProductCard from "../components/ui/OrderProductCard";
import DeliveryAddressCard from "../components/ui/DeliveryAddressCard";
import AppliedCouponCard from "../components/ui/AppliedCouponCard";
import PaymentBreakdownCard from "../components/ui/PaymentBreakdownCard";
import OrderContactSection from "../components/ui/OrderContactSection";

const OrderDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Order data
  const order = {
    id: "964368966",
    trackingId: "EKFC9469943995",
    courierName: "EKART",
    productName: "Pharmeasy Fish Oil 1000mg Soft Gelatin 60 Capsules",
    price: 1500,
    quantity: 1,
    image: "/src/assets/images/medicine.jpeg",
    status: "On the Way",
    expectedDelivery: "18th Dec, 2025",
    deliveryPartner: "Pickup Up Your Courier. Will Be Delivered Soon.",
    contactAgent: "_",
    pin: "_",
    otp: "_",
    customerAddress: {
      name: "Bikram Dumriya",
      phone: "9999999999",
      address: "A/B, Section Lane, Odisha, Noida, 744115",
    },
    appliedCoupon: {
      address: "A/B, Section Lane, Odisha, Noida, 744115",
    },
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
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Main Content */}
      <main
        className="grow"
        style={{ paddingTop: "140px", paddingBottom: "60px" }}
      >
        <div
          className="w-full"
          style={{ maxWidth: "1200px", margin: "0 auto" }}
        >
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-6">
              <h1
                style={{
                  fontFamily: "Gyrotrope",
                  fontSize: "24px",
                  fontWeight: 600,
                  color: "#000000",
                }}
              >
                Order Details
              </h1>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Left Section */}
              <div className="lg:col-span-2">
                <OrderProductCard
                  order={order}
                  onCancel={() => navigate("/orders")}
                />
              </div>

              {/* Right Section */}
              <div className="lg:col-span-1">
                <div className="sticky space-y-4 top-32">
                  <DeliveryAddressCard
                    address={order.customerAddress}
                    onChangeAddress={() => {}}
                  />
                  <AppliedCouponCard coupon={order.appliedCoupon} />
                  <PaymentBreakdownCard breakdown={order.paymentBreakdown} />
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <OrderContactSection
              onShareDetails={() => {}}
              onDownloadReceipt={() => {}}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetails;
