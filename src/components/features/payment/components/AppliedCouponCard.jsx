import React from 'react';

const AppliedCouponCard = ({ coupon }) => {
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm" style={{ marginBottom: '5px' }}>
      <h3
        style={{
          fontFamily: 'Gyrotrope',
          fontSize: '14px',
          fontWeight: 600,
          color: '#F97316',
          padding: '12px 12px 0px 12px',
        }}
      >
        Applied Coupon
      </h3>
      <p
        style={{
          fontFamily: 'Gyrotrope',
          fontSize: '12px',
          color: '#374151',
          marginBottom: '12px',
          padding: '0px 12px 12px 12px',
        }}
      >
        {coupon.address}
      </p>
    </div>
  );
};

export default AppliedCouponCard;
