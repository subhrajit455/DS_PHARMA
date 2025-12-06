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

import { PRODUCTS } from '@/data/sampleData';
import { MOCK_ORDERS } from '@/data/userData';

const OrderDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Fetch order details using React Query
  const { data: orderData } = useOrderDetails(id);

  // Mock data as fallback
  const mockOrder = MOCK_ORDERS.find(o => o.id === id) || MOCK_ORDERS[0];

  // Use real data if available, otherwise mock
  const order = orderData || mockOrder;

  const suggestedItems = PRODUCTS.slice(0, 5).map(p => ({
    ...p,
    image: p.image || p.imageUrl 
  }));

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
      <div className="orders-container flex flex-col min-h-screen bg-gray-50">
        {/* Main Content */}
        <main
          className="grow"
          style={{ paddingBottom: "20px" }}
        >
          <div
            className="order-details-container w-full px-4 mx-auto max-w-7xl"
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
