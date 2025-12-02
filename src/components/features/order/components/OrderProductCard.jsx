import React from 'react';
import { Card, Button } from '@/components/common';
import OrderTimeline from './OrderTimeline';

const OrderProductCard = ({ order, onCancel }) => {
  return (
    <Card className="min-h-[330px] ">
      {/* Product Info */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 border-[#64E5B8]" style={{ padding:'10px' }}>
        
        {/* Mobile Layout Container */}
        <div className="flex flex-row sm:hidden w-full gap-3">
           {/* Product Image (Mobile) */}
           <div className="overflow-hidden rounded-lg w-20 h-20 bg-linear-to-br from-sky-100 to-sky-200 shrink-0">
              <img
                src={order.image}
                alt={order.productName}
                className="object-cover w-full h-full"
              />
            </div>
            
            {/* Product Details (Mobile) */}
            <div className="flex-1 min-w-0">
              <h3
                className="mb-1 text-base font-semibold text-gray-900 truncate"
                style={{ fontFamily: 'Gyrotrope' }}
              >
                {order.productName}
              </h3>
              <p
                className="mb-1 text-base font-bold text-gray-900"
                style={{ fontFamily: 'Gyrotrope' }}
              >
                ₹{order.price}
              </p>
              <p
                className="text-xs text-gray-600"
                style={{ fontFamily: 'Gyrotrope' }}
              >
                Qty: {order.quantity}
              </p>
            </div>

             {/* Action Button (Mobile) */}
             <div className="shrink-0 flex items-start">
                <Button variant="outline" size="sm" onClick={onCancel} style={{ padding:'4px 8px', height: 'auto'}}>
                  <span style={{ fontFamily: 'Gyrotrope', fontSize:'10px' }}>
                    Cancel
                  </span>
                </Button>
             </div>
        </div>


        {/* Desktop Product Details */}
        <div className="hidden sm:block flex-1" style={{ padding:'10px' }}>
          <h3
            className="mb-3 text-lg font-semibold text-gray-900"
            style={{ fontFamily: 'Gyrotrope', marginBottom:'10px' }}
          >
            {order.productName}
          </h3>
          <p
            className="mb-4 text-lg font-bold text-gray-900"
            style={{ fontFamily: 'Gyrotrope', marginBottom:'15px' }}
          >
            ₹{order.price}
          </p>

          {/* Timeline (Desktop) */}
          <OrderTimeline
            timeline={order.timeline}
            deliveryPartner={order.deliveryPartner}
          />
        </div>
        
        {/* Desktop Product Image & Actions */}
        <div className="hidden sm:flex flex-col items-center justify-start  w-auto gap-0">
          <div className="overflow-hidden rounded-lg w-28 h-28 bg-linear-to-br from-sky-100 to-sky-200 shrink-0 " style={{ margin:'10px 5px' }}>
            <img
              src={order.image}
              alt={order.productName}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col items-center">
            <p
              className="mt-4 text-xs text-center text-gray-600"
              style={{ fontFamily: 'Gyrotrope', marginBottom:'5px',}}
            >
              Qty: {order.quantity}
            </p>

            {/* Action Buttons */}
            <div className="flex justify-center pt-4" style={{ marginTop:'10px' }}>
              <Button variant="outline" size="sm" onClick={onCancel} style={{ padding:'2px'}}>
              <span style={{ fontFamily: 'Gyrotrope',fontSize:'10px' }}>
                Cancel Order
              </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline (Mobile) - Moved outside the flex row */}
      <div className="block sm:hidden mb-6 mt-4" style={{ marginTop:'20px' }}>
         <OrderTimeline
            timeline={order.timeline}
            deliveryPartner={order.deliveryPartner}
          />
      </div>

      {/* Order Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-4 pt-4 sm:mb-4" style={{ marginTop:'10px', padding:'10px' }}>
        <OrderDetail label="Order ID" value={order.id} />
        <OrderDetail label="Contact Agent" value={order.contactAgent} />
        <OrderDetail label="Tracking ID" value={order.trackingId} />
        <OrderDetail label="Pin" value={order.pin} />
        <OrderDetail label="Courier Name" value={order.courierName} />
        <OrderDetail label="OTP" value={order.otp} />
      </div>
    </Card>
  );
};

const OrderDetail = ({ label, value }) => (
  <div>
    <p
      className="text-xs text-gray-600"
      style={{ fontFamily: 'Gyrotrope', marginBottom: '4px' }}
    >
      {label}:
      <span className="ml-1 font-semibold text-gray-900">{value}</span>
    </p>
  </div>
);

export default OrderProductCard;