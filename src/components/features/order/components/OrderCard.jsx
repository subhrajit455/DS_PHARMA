import React from 'react';
import { motion as Motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const OrderCard = ({ order, index }) => {
  const navigate = useNavigate();

  const  getStatusButton = (order) => {
    return (
      <div className="flex flex-col items-end w-auto gap-1">
        <button
          className="cursor-pointer transition-all duration-200 hover:opacity-90 active:scale-[0.98] w-auto h-[32px] sm:h-[40px] px-3 py-1.5 sm:px-5 sm:py-2.5 text-[10px] sm:text-[13px] min-w-[100px] sm:min-w-[160px]"
          style={{
            fontFamily: 'Gyrotrope',
            fontWeight: 600,
            borderRadius: '8px',
            border: 'none',
            color: '#FFFFFF',
            backgroundColor: order.statusBg,
            textAlign: 'center',
            boxShadow: 'none',
            letterSpacing: '0.01em',
            padding: '0px 12px'
          }}
        >
          {order.status}
        </button>
        {order.expectedDelivery && (
          <p 
            className="text-right text-[8px] sm:text-[12px]"
            style={{ 
            fontFamily: 'Gyrotrope', 
            color: '#10B981', 
            fontWeight: 500,
            lineHeight: '1.2',
            marginTop: '2px'
          }}>
            Expected Delivery: {order.expectedDelivery}
          </p>
        )}
        {order.deliveredDate && (
          <p 
            className="text-right text-[8px] sm:text-[12px]"
            style={{ 
            fontFamily: 'Gyrotrope', 
            color: '#10B981', 
            fontWeight: 500,
            lineHeight: '1.2',
            marginTop: '2px'
          }}>
            Delivered on {order.deliveredDate}
          </p>
        )}
        {order.phone && (
          <p 
            className="text-right text-[8px] sm:text-[12px]"
            style={{ 
            fontFamily: 'Gyrotrope', 
            color: '#000000', 
            fontWeight: 500,
            lineHeight: '1.2',
            marginTop: '2px'
          }}>
            {order.phone}
          </p>
        )}
      </div>
    );
  };

  return (
    <Motion.div
      key={order.id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      onClick={() => navigate(`/order/${order.id}`)}
      className="bg-white cursor-pointer transition-all duration-200 hover:shadow-md active:scale-[0.995] p-3 sm:p-5"
      style={{
        borderRadius: '8px',
        margin: '8px 0px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06)',
        border: '1px solid #64E5B8',
        fontFamily: 'Gyrotrope',
        padding: '10px'
      }}
    >
      <div className="flex flex-row items-center gap-3 sm:gap-4">
        {/* Product Image */}
        <div
          className="overflow-hidden shrink-0 w-[60px] h-[60px] sm:w-[80px] sm:h-[80px]"
          style={{ 
            borderRadius: '8px',
            backgroundColor: '#F3F4F6',
            flexShrink: 0
          }}
        >
          <img
            src={order.image}
            alt={order.productName}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>

        {/* Order Details */}
        <div className="flex flex-row items-center justify-between flex-1 min-w-0 gap-2">
          <div className="flex-1 min-w-0">
            <h3
              className="text-[10px] sm:text-[15px]"
              style={{
                fontFamily: 'Gyrotrope',
                fontWeight: 600,
                color: '#000000',
                marginBottom: '4px',
                lineHeight: '1.3',
                letterSpacing: '-0.01em',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {order.productName}
            </h3>
            <div
              className="text-[8px] sm:text-[13px]"
              style={{
                fontFamily: 'Gyrotrope',
                color: '#6B7280',
                lineHeight: '1.3'
              }}
            >
              <p style={{ marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <span style={{ fontWeight: 600, color: '#000000' }}>
                  {order.customerName} - {order.phone}
                </span>
              </p>
              <p style={{ 
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '100%'
              }}>
                {order.address}
              </p>
            </div>
          </div>

          {/* Status Button */}
          <div className="shrink-0">
            {getStatusButton(order)}
          </div>
        </div>
      </div>
    </Motion.div>
  );
};

export default OrderCard;

/* Mobile Responsive Breakpoints:
 * - 320px: Small phones (iPhone SE)
 * - 375px: Standard phones (iPhone 12/13)
 * - 414px: Large phones (iPhone 12 Pro Max)
 * - 480px: Small tablets
 * 
 * Touch-friendly minimum sizes:
 * - Buttons: 44x44px (Apple HIG)
 * - Interactive elements: 48x48px (Material Design)
 */
