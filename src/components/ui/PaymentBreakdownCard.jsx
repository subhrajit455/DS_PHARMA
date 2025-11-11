import React from 'react';

const PaymentBreakdownCard = ({ breakdown }) => {
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3
        style={{
          fontFamily: 'Gyrotrope',
          fontSize: '16px',
          fontWeight: 600,
          color: '#000000',
          marginBottom: '12px',
        }}
      >
        Payment Breakdown
      </h3>
      <div className="space-y-2">
        <BreakdownRow label="Total Cart Value" value={breakdown.totalCartValue} />
        <BreakdownRow label="Discount" value={-breakdown.discount} isDiscount />
        <BreakdownRow label="Coupon" value={-breakdown.coupon} isDiscount />
        <BreakdownRow label="GST" value={breakdown.gst} />
        <BreakdownRow label="Delivery Charges" value={breakdown.deliveryCharges} />
        <div className="pt-2 mt-2 border-t border-gray-200">
          <BreakdownRow label="Total" value={breakdown.total} isTotal />
        </div>
      </div>
    </div>
  );
};

const BreakdownRow = ({ label, value, isDiscount, isTotal }) => (
  <div className="flex justify-between">
    <span
      style={{
        fontFamily: 'Gyrotrope',
        fontSize: isTotal ? '16px' : '14px',
        color: '#6B7280',
        fontWeight: isTotal ? 700 : 400,
        color: isTotal ? '#000000' : '#6B7280',
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontFamily: 'Gyrotrope',
        fontSize: isTotal ? '16px' : '14px',
        fontWeight: 600,
        color: isDiscount ? '#10B981' : '#000000',
      }}
    >
      {isDiscount ? '-' : '+'}₹{Math.abs(value)}
    </span>
  </div>
);

export default PaymentBreakdownCard;