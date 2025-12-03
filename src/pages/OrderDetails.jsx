import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Button } from "@/components/ui";
import {
  OrderProductCard,
  DeliveryAddressCard,
  PaymentBreakdownCard,
  OrderContactSection
} from "@/components/features/order";
import { AppliedCouponCard } from "@/components/features/payment";
import SuggestedItemsSection from "@/components/sections/SuggestedItemsSection";

import medicineImage from '../assets/images/medicine.jpeg';

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
    image: medicineImage, // Added image property to order if needed, or just for consistency
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
    customerAddress: {
      name: 'Gourav Gupta',
      phone: '9999999999',
      address: 'A/B, Section Lane, Odisha, Noida, 744115'
    },
    appliedCoupon: {
      code: 'SAVE200',
      discount: 200
    }
  };

  const suggestedItems = [
    { id: 1, name: 'Paracetamol', price: 12, originalPrice: 15, discount: 5, image: medicineImage },
    { id: 2, name: 'Paracetamol', price: 12, originalPrice: 15, discount: 5, image: medicineImage },
    { id: 3, name: 'Paracetamol', price: 12, originalPrice: 15, discount: 5, image: medicineImage },
    { id: 4, name: 'Paracetamol', price: 12, originalPrice: 15, discount: 5, image: medicineImage },
    { id: 5, name: 'Paracetamol', price: 12, originalPrice: 15, discount: 5, image: medicineImage }
  ];

  const handleCancelOrder = () => navigate("/orders");
  const handleChangeAddress = () => console.log("Change address");
  const handleShareDetails = () => console.log("Share details");
  const handleDownloadReceipt = () => console.log("Download receipt");

  return (
    <div style={{ paddingTop: '60px' }}>
      <style>{` 
         @media (min-width: 768px) { 
           .orders-container { 
             padding-top: 80px !important; 
           } 
         } 
       `}</style>
      <div className="orders-container flex flex-col min-h-screen bg-gray-50">
        {/* Main Content */}
        <main
          className="grow"
          style={{ paddingBottom: "20px" }}
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
                <Card className="mt-6 w-full" style={{ marginTop: '12px' }}>
                  <div className="flex flex-col gap-3 p-3 sm:gap-4 sm:p-4 sm:flex-row sm:items-center sm:justify-between" style={{ padding: '3px 8px' }}>
                    <p
                      className="font-medium text-gray-600 text-[10px] sm:text-base"
                      style={{ fontFamily: "Gyrotrope" }}
                    >
                      Contact Customer Care
                    </p>
                    <div className="flex gap-2 sm:gap-3">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={handleShareDetails}
                        className="text-[10px] sm:text-sm h-6 sm:h-8"
                        style={{ padding: '0 8px' }}
                      >
                        Share Order Details
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleDownloadReceipt}
                        className="text-[10px] sm:text-sm h-6 sm:h-8"
                        style={{ padding: '0 8px' }}
                      >
                        Download Receipt
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Section */}
              <div className="py-2 lg:h-full">
                <div className="flex flex-col space-y-4 lg:space-y-0 lg:h-full lg:gap-4 min-h-[300px]">
                  <DeliveryAddressCard
                    address={order.customerAddress}
                    onChangeAddress={handleChangeAddress}
                    className="lg:flex-1"
                  />
                  <AppliedCouponCard coupon={order.appliedCoupon} className="lg:flex-1" />
                  <PaymentBreakdownCard breakdown={order.paymentBreakdown} className="lg:flex-1" />
                </div>
              </div>
            </div>



            {/* Suggested Items Section */}
            <SuggestedItemsSection
              title="Suggested Items"
              items={suggestedItems}
              titleStyle={{
                marginBottom: '10px',
                marginTop: '40px'
              }}
              containerStyle={{ marginBottom: '20px' }}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrderDetails;
