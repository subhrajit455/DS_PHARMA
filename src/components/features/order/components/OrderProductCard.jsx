import React from 'react';
import { Card, Button } from '@/components/common';
import OrderTimeline from './OrderTimeline';

const OrderProductCard = ({ order, onCancel }) => {
  return (
    <Card className=" min-h-[330px]" style={{ padding: '12px' }}>
      {/* Product Info */}
      <div className="flex gap-4 mb-6">
        

        {/* Product Details */}
        <div className="flex-1">
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

          {/* Timeline */}
          <OrderTimeline
            timeline={order.timeline}
            deliveryPartner={order.deliveryPartner}
          />
        </div>
        {/* Product Image */}
        <div>
          <div className="overflow-hidden rounded-lg w-28 h-28 bg-linear-to-br from-sky-100 to-sky-200 shrink-0 " style={{ margin:'10px' }}>
            <img
              src={order.image}
              alt={order.productName}
              className="object-cover w-full h-full"
              
            />
          </div>
          <p
            className="mt-4 text-xs text-center text-gray-600"
            style={{ fontFamily: 'Gyrotrope', marginBottom:'10px',}}
          >
            Qty: {order.quantity}
          </p>

          {/* Action Buttons */}
        <div className="flex justify-center pt-4 " style={{ marginTop:'15px', }}>
        <Button variant="outline" size="sm" onClick={onCancel} style={{ padding:'2px'}}>
        <span style={{ fontFamily: 'Gyrotrope',fontSize:'10px' }}>
          Cancel Order
        </span>
        </Button>
      </div>
        </div>
        
      </div>

      {/* Order Details Grid */}
      <div className="grid grid-cols-2 gap-4 pt-6 mb-6" style={{ marginTop:'20px' }}>
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