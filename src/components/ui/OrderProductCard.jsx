import React from 'react';
import OrderTimeline from './OrderTimeline';

const OrderProductCard = ({ order, onCancel }) => {
  return (
    <div
      className="bg-white rounded-lg p-6 shadow-sm border min-h-[350px] border-gray-200 mb-6"
      style={{ padding: '10px' }}
    >
      {/* Product Info */}
      <div className="flex gap-4 mb-6">
        <div>
          <div
            className="overflow-hidden rounded-lg shrink-0 bg-linear-to-br from-sky-100 to-sky-200"
            style={{ width: '120px', height: '120px' }}
          >
            <img
              src={order.image}
              alt={order.productName}
              className="object-cover w-full h-full"
            />
          </div>
          {/* Quantity */}
          <div className="flex justify-center mt-4">
            <p
              style={{
                fontFamily: 'Gyrotrope',
                fontSize: '14px',
                color: '#6B7280',
              }}
            >
              Qty: {order.quantity}
            </p>
          </div>
        </div>

        <div className="flex-1">
          <h3
            style={{
              fontFamily: 'Gyrotrope',
              fontSize: '18px',
              fontWeight: 600,
              color: '#000000',
              marginBottom: '12px',
            }}
          >
            {order.productName}
          </h3>
          <p
            style={{
              fontFamily: 'Gyrotrope',
              fontSize: '20px',
              fontWeight: 700,
              color: '#000000',
              marginBottom: '16px',
            }}
          >
            ₹{order.price}
          </p>

          <OrderTimeline timeline={order.timeline} deliveryPartner={order.deliveryPartner} />
        </div>
      </div>

      {/* Order Details */}
      <OrderDetailsGrid order={order} />

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="px-6 py-2 font-semibold transition-colors border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
          style={{
            fontFamily: 'Gyrotrope',
            fontSize: '14px',
            color: '#000000',
          }}
        >
          Cancel Order
        </button>
      </div>
    </div>
  );
};

const OrderDetailsGrid = ({ order }) => (
  <div className="grid grid-cols-2 gap-4 pt-6 mb-6 border-t border-gray-200">
    <div>
      <DetailRow label="Order ID" value={order.id} />
      <DetailRow label="Tracking ID" value={order.trackingId} />
      <DetailRow label="Courier Name" value={order.courierName} />
    </div>
    <div>
      <DetailRow label="Contact Agent" value={order.contactAgent} />
      <DetailRow label="Pin" value={order.pin} />
      <DetailRow label="OTP" value={order.otp} />
    </div>
  </div>
);

const DetailRow = ({ label, value }) => (
  <p
    style={{
      fontFamily: 'Gyrotrope',
      fontSize: '13px',
      color: '#6B7280',
      marginBottom: '4px',
    }}
  >
    {label}:{' '}
    <span style={{ color: '#000000', fontWeight: 600 }}>
      {value}
    </span>
  </p>
);

export default OrderProductCard;