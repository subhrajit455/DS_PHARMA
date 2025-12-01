import React from 'react';
import { Card, Button } from '@/components/common';

const DeliveryAddressCard = ({ address, onChangeAddress, className }) => {
  if (!address) return null;

  return (
    <Card className={`p-3 sm:p-4 mb-[10px] lg:mb-0 ${className || ''}`} style={{ padding: '10px 5px' }}>
      <div className="flex flex-col h-full justify-between">
        <div className="flex-1">
          <h3 className="mb-2 sm:mb-3 text-xs sm:text-sm font-semibold text-gray-900" style={{ fontFamily: 'Gyrotrope', margin: '8px sm:12px' }}>
            Delivery Address
          </h3>
          <div className="mb-2 sm:mb-3 text-[10px] sm:text-xs leading-relaxed text-gray-700" style={{ fontFamily: 'Gyrotrope', margin: '8px sm:12px' }}>
            <p className="mb-1 font-semibold">
              {address.name} - {address.phone}
            </p>
            <p>{address.address}</p>
          </div>
        </div>
        <div className="flex justify-end mt-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={onChangeAddress}
            className='text-[10px] sm:text-xs'
            style={{ padding: '4px 8px sm:4px sm:12px', width: 'auto', margin: '8px sm:12px' }}
          >
            Change Address
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DeliveryAddressCard;