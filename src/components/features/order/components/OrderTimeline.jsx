import React from 'react';

const OrderTimeline = ({ timeline, deliveryPartner }) => {
  // Filter to show only 4 main steps (remove 'Expected Delivery' middle step)
  const filteredTimeline = timeline.filter((_, index) => index !== 2);

  return (
    <div>
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-2">
        {filteredTimeline.map((step, index) => (
          <TimelineStep key={index} step={step} isLast={index === filteredTimeline.length - 1} />
        ))}
      </div>
      

      {/* Delivery Partner Message */}
      <p
        className="mt-8 text-sm font-medium text-center text-green-700"
        style={{ fontFamily: 'Gyrotrope', margin: '14px 0px' }}
      >
        Delivery Partner: {deliveryPartner}
      </p>
    </div>
  );
};

const TimelineStep = ({ step, isLast }) => (
  <div className="relative flex flex-col items-center flex-1">
  
    {/* Connector Line */}
    {!isLast && (
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
      className="text-xs font-medium text-center max-w-[100px] my-1"
      style={{
        fontFamily: 'Gyrotrope',
        color: step.completed || step.active ? '#000000' : '#9CA3AF',
        fontWeight: step.active ? 600 : 400,
      }}
    >
      {step.status}
    </p>

    {/* Date Label - Show with step if available */}
    {step.date && (
      <p
        className="text-xs text-center text-green-700"
        style={{ fontFamily: 'Gyrotrope', marginTop: '5px' }}
      >
        {step.date}
      </p>
    )}
  </div>
);

export default OrderTimeline;
