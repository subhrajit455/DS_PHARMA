import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Button } from "@/components/common";
import {
  OrderProductCard,
  DeliveryAddressCard,
  PaymentBreakdownCard,
  OrderContactSection
} from "@/components/features/order";
import { AppliedCouponCard } from "@/components/features/payment";
import SuggestedItemsSection from "@/components/sections/SuggestedItemsSection";

const OrderDetails = () => {
  const navigate = useNavigate();
  useParams();

  const order = {
    id: "964368966",
    trackingId: "EKFC9469943995",
    courierName: "EKART",
    productName: "Pharmeasy Fish Oil 1000mg Soft Gelatin 60 Capsules",
    price: 1500,
    quantity: 1,
    image: "/src/assets/images/medicine.jpeg",
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

  const suggestedItems = [
    { id: 1, name: 'Paracetamol', price: 12, originalPrice: 15, discount: 5, image: '/src/assets/images/medicine.jpeg' },
    { id: 2, name: 'Paracetamol', price: 12, originalPrice: 15, discount: 5, image: '/src/assets/images/medicine.jpeg' },
    { id: 3, name: 'Paracetamol', price: 12, originalPrice: 15, discount: 5, image: '/src/assets/images/medicine.jpeg' },
    { id: 4, name: 'Paracetamol', price: 12, originalPrice: 15, discount: 5, image: '/src/assets/images/medicine.jpeg' },
    { id: 5, name: 'Paracetamol', price: 12, originalPrice: 15, discount: 5, image: '/src/assets/images/medicine.jpeg' }
  ];

  const handleCancelOrder = () => navigate("/orders");
  const handleChangeAddress = () => console.log("Change address");
  const handleShareDetails = () => console.log("Share details");
  const handleDownloadReceipt = () => console.log("Download receipt");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Main Content */}
      <main
        className="grow"
        style={{ paddingTop: "140px", paddingBottom: "60px" }}
      >
        <div
          className="w-full px-4 mx-auto max-w-7xl"
          style={{ maxWidth: "1240px", margin: "0 auto" }}
        >
          {/* Header */}
          <div className="mb-6">
            <h1
              className="mb-6 text-2xl font-bold text-gray-900"
              style={{
                fontFamily: "Gyrotrope",
                fontSize: "22px",
                fontWeight: 600,
                color: "#000000",
                marginBottom: "10px"
              }}
            >
              Order Details
            </h1>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 gap-6" style={{ gridTemplateColumns: 'repeat(1, minmax(0, 1fr))' }}
            data-lg-grid="true">
            <style>{`
              @media (min-width: 1024px) {
                [data-lg-grid="true"] {
                  grid-template-columns: 70% 30% !important;
                }
              }
            `}</style>
            {/* Left Section */}
            <div>
              <OrderProductCard order={order} onCancel={handleCancelOrder} />
              {/* Contact Section */}
          <Card className="mt-6 w-full" style={{marginTop: '12px' }}>
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between" style={{ padding: '8px', }}>
              <p
                className="font-medium text-gray-600 text-md"
                style={{ fontFamily: "Gyrotrope"}}
              >
                Contact Customer Care
              </p>
              <div className="flex gap-3">
                <Button
                  variant="success"
                  size="md"
                  onClick={handleShareDetails}
                  style={{ padding: '4px' }}
                >
                  Share Order Details
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleDownloadReceipt}
                  style={{ padding: '4px' }}
                >
                  Download Receipt
                </Button>
              </div>
            </div>
          </Card>
            </div>

            {/* Right Section */}
            <div className="py-2" >
              <div className="sticky space-y-4 top-30 min-h-[300px]">
                <DeliveryAddressCard
                  address={order.customerAddress}
                  onChangeAddress={handleChangeAddress}
                />
                <AppliedCouponCard coupon={order.appliedCoupon} />
                <PaymentBreakdownCard breakdown={order.paymentBreakdown} />
              </div>
            </div>
          </div>

          

          {/* Suggested Items Section */}
          <SuggestedItemsSection
            title="Suggested Items"
            items={suggestedItems}
            titleStyle={{
              marginBottom: '20px',
              marginTop: '40px'
            }}
            containerStyle={{ marginBottom: '20px' }}
          />
        </div>
      </main>
    </div>
  );
};

export default OrderDetails;
