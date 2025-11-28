import React from 'react';
import { Card, Button } from '@/components/common';

const DeliveryAddressCard = ({ address, onChangeAddress }) => {
  return (
    <Card className="p-4" style={{ marginBottom: '5px' }}>
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <h3 className="mb-3 text-sm font-semibold text-gray-900" style={{ fontFamily: 'Gyrotrope', margin: '12px' }}>
            Delivery Address
          </h3>
          <div className="mb-3 text-xs leading-relaxed text-gray-700" style={{ fontFamily: 'Gyrotrope', margin: '12px' }}>
            <p className="mb-1 font-semibold">
              {address.name} - {address.phone}
            </p>
            <p>{address.address}</p>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onChangeAddress}
            className='text-xs'
            style={{ padding: '4px 12px', width: 'auto', margin:'12px' }}
          >
            Change Address
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DeliveryAddressCard;