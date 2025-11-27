import React from 'react';
import { Card, Button } from '@/components/common';

const DeliveryAddressCard = ({ address, onChangeAddress }) => {
  return (
    <Card className="p-4">
      <h3 className="mb-3 text-base font-semibold text-gray-900" style={{ fontFamily: 'Gyrotrope' }}>
        Delivery Address
      </h3>
      <div className="mb-3 text-sm leading-relaxed text-gray-700" style={{ fontFamily: 'Gyrotrope' }}>
        <p className="mb-1 font-semibold">
          {address.name} - {address.phone}
        </p>
        <p>{address.address}</p>
      </div>
      <Button variant="outline" size="full" onClick={onChangeAddress}>
        Change Address
      </Button>
    </Card>
  );
};

export default DeliveryAddressCard;