import React from 'react';

const OrderTimeline = ({ timeline, deliveryPartner }) => {
  return (
    <div className="relative">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-2">
        {timeline.map((step, index) => (
          <div
            key={index}
            className="relative flex flex-col items-center flex-1"
          >
            {/* Connector Line */}
            {index < timeline.length - 1 && (
              <div
                className="absolute top-3 left-1/2 w-full h-0.5"
                style={{
                  backgroundColor: step.completed ? '#10B981' : '#D1D5DB',
                  zIndex: 0,
                }}
              />
            )}

            {/* Status Dot */}
            <div
              className="relative z-10 w-6 h-6 mb-2 rounded-full"
              style={{
                backgroundColor: step.completed ? '#10B981' : '#D1D5DB',
                border: step.active ? '3px solid #059669' : 'none',
              }}
            />

            {/* Status Label */}
            <p
              style={{
                fontFamily: 'Gyrotrope',
                fontSize: '11px',
                fontWeight: step.active ? 600 : 400,
                color: step.completed || step.active ? '#000000' : '#9CA3AF',
                textAlign: 'center',
                maxWidth: '100px',
                margin: '5px 0',
              }}
            >
              {step.status}
            </p>
            {step.date && (
              <p
                style={{
                  fontFamily: 'Gyrotrope',
                  fontSize: '10px',
                  color: '#059669',
                  textAlign: 'center',
                  marginTop: '5px',
                }}
              >
                {step.date}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Delivery Partner Message */}
      <div className="text-center m-14">
        <p
          style={{
            fontFamily: 'Gyrotrope',
            fontSize: '12px',
            color: '#059669',
            fontWeight: 500,
            marginTop: '5px',
          }}
        >
          Delivery Partner: {deliveryPartner}
        </p>
      </div>
    </div>
  );
};

export default OrderTimeline;
