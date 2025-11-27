import React from 'react';
import { Card, Button } from '@/components/common';
import OrderTimeline from './OrderTimeline';

const OrderProductCard = ({ order, onCancel }) => {
  return (
    <Card className="p-6 min-h-[350px]">
      {/* Product Info */}
      <div className="flex gap-4 mb-6">
        {/* Product Image */}
        <div>
          <div className="overflow-hidden rounded-lg w-28 h-28 bg-linear-to-br from-sky-100 to-sky-200 shrink-0">
            <img
              src={order.image}
              alt={order.productName}
              className="object-cover w-full h-full"
            />
          </div>
          <p
            className="mt-4 text-sm text-center text-gray-600"
            style={{ fontFamily: 'Gyrotrope' }}
          >
            Qty: {order.quantity}
          </p>
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <h3
            className="mb-3 text-lg font-semibold text-gray-900"
            style={{ fontFamily: 'Gyrotrope' }}
          >
            {order.productName}
          </h3>
          <p
            className="mb-4 text-2xl font-bold text-gray-900"
            style={{ fontFamily: 'Gyrotrope' }}
          >
            ₹{order.price}
          </p>

          {/* Timeline */}
          <OrderTimeline
            timeline={order.timeline}
            deliveryPartner={order.deliveryPartner}
          />
        </div>
      </div>

      {/* Order Details Grid */}
      <div className="grid grid-cols-2 gap-4 pt-6 mb-6 border-t border-gray-200">
        <OrderDetail label="Order ID" value={order.id} />
        <OrderDetail label="Contact Agent" value={order.contactAgent} />
        <OrderDetail label="Tracking ID" value={order.trackingId} />
        <OrderDetail label="Pin" value={order.pin} />
        <OrderDetail label="Courier Name" value={order.courierName} />
        <OrderDetail label="OTP" value={order.otp} />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-start pt-4 border-t border-gray-200">
        <Button variant="outline" size="md" onClick={onCancel}>
          Cancel Order
        </Button>
      </div>
    </Card>
  );
};

const OrderDetail = ({ label, value }) => (
  <div>
    <p
      className="text-sm text-gray-600"
      style={{ fontFamily: 'Gyrotrope', marginBottom: '4px' }}
    >
      {label}:
      <span className="ml-1 font-semibold text-gray-900">{value}</span>
    </p>
  </div>
);

export default OrderProductCard;