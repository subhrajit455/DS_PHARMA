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
import { useOrderDetails } from "@/hooks/queries/useOrders";

import { useProducts } from '@/hooks/queries/useProducts';

const OrderDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Fetch order details using React Query
  const { data: orderResponse, isLoading } = useOrderDetails(id);
  
  const order = orderResponse?.data;
  
  // Suggestions
  const { data: suggestionsData } = useProducts({ limit: 5 });
  const suggestedItems = suggestionsData?.data || [];

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen pt-20">
      <div className="w-12 h-12 border-4 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
    </div>
  );
  
  if (!order) return (
    <div className="flex justify-center items-center min-h-screen pt-20">
      <h2 className="text-xl font-semibold text-gray-700 font-gyrotrope">Order not found</h2>
    </div>
  );

  // Normalize payment breakdown (handle both totals and paymentBreakdown)
  const paymentBreakdown = order.paymentBreakdown || order.totals || {
    totalCartValue: 0,
    discount: 0,
    coupon: 0,
    gst: 0,
    deliveryCharges: 0,
    total: 0
  };

  // Normalize customer address (handle both customerAddress and deliveryAddress)
  const customerAddress = order.customerAddress || order.deliveryAddress || {
    name: order.customerName || 'N/A',
    phone: order.phone || 'N/A',
    address: order.address || 'N/A'
  };

  const handleCancelOrder = () => navigate("/orders");
  const handleChangeAddress = () => console.log("Change address");
  const handleShareDetails = () => console.log("Share details");
  const handleDownloadReceipt = () => console.log("Download receipt");

  return (
    <div style={{ paddingTop: '20px' }}>
      <style>{` 
         @media (min-width: 768px) { 
           .order-details-container { 
             padding-top: 80px !important; 
           } 
         }
         @media (max-width: 639px) {
           .order-details-container {
             padding-left: 5px !important;
             padding-right: 5px !important;
           }
         }
         @media (min-width: 640px) and (max-width: 1290px) {
           .order-details-container {
             padding-left: 5px !important;
             padding-right: 5px !important;
           }
         }
       `}</style>
      <div className="order-details-container w-full pt-4 pb-16 lg:pt-32 lg:pb-16">
        <div
          className="w-full px-4 mx-auto"
          style={{ maxWidth: "1280px", margin: "10px auto" }}
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
                <Card className="mt-6 w-full" style={{ marginTop: '10px' }}>
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
              <div className="py-2">
                <div className="flex flex-col space-y-4 lg:space-y-0 lg:gap-4">
                  <DeliveryAddressCard
                    address={customerAddress}
                    onChangeAddress={handleChangeAddress}
                  />
                  <AppliedCouponCard coupon={order.appliedCoupon} />
                  <PaymentBreakdownCard breakdown={paymentBreakdown} />
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
        </div>
      </div>
  );
};

export default OrderDetails;
