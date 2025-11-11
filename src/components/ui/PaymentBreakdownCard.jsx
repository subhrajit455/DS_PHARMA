import React from 'react';
import { Card } from './index';

const PaymentBreakdownCard = ({ breakdown }) => {
  return (
    <Card className="p-4">
      <h3 className="mb-3 text-base font-semibold text-gray-900" style={{ fontFamily: 'Gyrotrope' }}>
        Payment Breakdown
      </h3>
      <div className="space-y-2">
        <BreakdownRow label="Total Cart Value" value={breakdown.totalCartValue} />
        <BreakdownRow label="Discount" value={breakdown.discount} isDeduction />
        <BreakdownRow label="Coupon" value={breakdown.coupon} isDeduction />
        <BreakdownRow label="GST" value={breakdown.gst} />
        <BreakdownRow label="Delivery Charges" value={breakdown.deliveryCharges} />
        <div className="pt-2 mt-2 border-t border-gray-200">
          <BreakdownRow label="Total" value={breakdown.total} isTotal />
        </div>
      </div>
    </Card>
  );
};

const BreakdownRow = ({ label, value, isDeduction, isTotal }) => (
  <div className="flex justify-between text-sm">
    <span
      className={isTotal ? 'font-bold text-gray-900' : 'text-gray-600'}
      style={{ fontFamily: 'Gyrotrope' }}
    >
      {label}
    </span>
    <span
      className={`font-semibold ${isDeduction ? 'text-green-600' : 'text-gray-900'} ${
        isTotal ? 'text-base' : ''
      }`}
      style={{ fontFamily: 'Gyrotrope' }}
    >
      {isDeduction ? '-' : ''}₹{value}
    </span>
  </div>
);

export default PaymentBreakdownCard;