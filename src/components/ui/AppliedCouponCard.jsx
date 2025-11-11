import React from 'react';

const AppliedCouponCard = ({ coupon }) => {
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3
        style={{
          fontFamily: 'Gyrotrope',
          fontSize: '16px',
          fontWeight: 600,
          color: '#F97316',
          marginBottom: '12px',
        }}
      >
        Applied Coupon
      </h3>
      <p
        style={{
          fontFamily: 'Gyrotrope',
          fontSize: '14px',
          color: '#374151',
        }}
      >
        {coupon.address}
      </p>
    </div>
  );
};

export default AppliedCouponCard;
