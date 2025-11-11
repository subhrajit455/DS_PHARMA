import React from 'react';

const DeliveryAddressCard = ({ address, onChangeAddress }) => {
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
        Delivery Address
      </h3>
      <div
        style={{
          fontFamily: 'Gyrotrope',
          fontSize: '14px',
          color: '#374151',
          lineHeight: '1.6',
        }}
      >
        <p style={{ fontWeight: 600, marginBottom: '4px' }}>
          {address.name} - {address.phone}
        </p>
        <p>{address.address}</p>
      </div>
      <button
        onClick={onChangeAddress}
        className="w-full px-4 py-2 mt-3 font-medium transition-colors border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
        style={{
          fontFamily: 'Gyrotrope',
          fontSize: '14px',
          color: '#000000',
        }}
      >
        Change Address
      </button>
    </div>
  );
};

export default DeliveryAddressCard;