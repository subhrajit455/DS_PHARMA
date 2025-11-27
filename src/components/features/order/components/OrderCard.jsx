import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const OrderCard = ({ order, index }) => {
  const navigate = useNavigate();

  const  getStatusButton = (order) => {
    return (
      <div className="flex flex-col items-end w-full gap-1 sm:w-auto">
        <button
          className="cursor-pointer transition-all duration-200 hover:opacity-90 active:scale-[0.98] w-full sm:w-auto"
          style={{
            fontFamily: 'Gyrotrope',
            fontSize: '13px',
            fontWeight: 600,
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            color: '#FFFFFF',
            backgroundColor: order.statusBg,
            minWidth: '160px',
            height: '40px',
            textAlign: 'center',
            boxShadow: 'none',
            letterSpacing: '0.01em'
          }}
        >
          {order.status}
        </button>
        {order.expectedDelivery && (
          <p style={{ 
            fontFamily: 'Gyrotrope', 
            fontSize: '12px',
            color: '#10B981', 
            fontWeight: 500,
            textAlign: 'right',
            lineHeight: '1.4',
            marginTop: '2px'
          }}>
            Expected Delivery: {order.expectedDelivery}
          </p>
        )}
        {order.deliveredDate && (
          <p style={{ 
            fontFamily: 'Gyrotrope', 
            fontSize: '12px',
            color: '#10B981', 
            fontWeight: 500,
            textAlign: 'right',
            lineHeight: '1.4',
            marginTop: '2px'
          }}>
            Delivered on {order.deliveredDate}
          </p>
        )}
        {order.phone && (
          <p style={{ 
            fontFamily: 'Gyrotrope', 
            fontSize: '12px',
            color: '#000000', 
            fontWeight: 500,
            textAlign: 'right',
            lineHeight: '1.4',
            marginTop: '4px'
          }}>
            {order.phone}
          </p>
        )}
      </div>
    );
  };

  return (
    <motion.div
      key={order.id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      onClick={() => navigate(`/order/${order.id}`)}
      className="bg-white cursor-pointer transition-all duration-200 hover:shadow-md active:scale-[0.995]"
      style={{
        borderRadius: '12px',
        padding: '7px 20px',
        margin: '10px 0px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06)',
        border: '1px solid #E5E7EB',
        fontFamily: 'Gyrotrope'
      }}
    >
      <div className="flex flex-col items-start gap-4 sm:flex-row">
        {/* Product Image */}
        <div
          className="overflow-hidden shrink-0"
          style={{ 
            width: '80px', 
            height: '80px',
            borderRadius: '10px',
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
        <div className="flex flex-row items-start justify-between flex-1 min-w-0 gap-4">
          <div className="flex-1 min-w-0">
            <h3
              style={{
                fontFamily: 'Gyrotrope',
                fontSize: '15px',
                fontWeight: 600,
                color: '#000000',
                marginBottom: '8px',
                lineHeight: '1.4',
                letterSpacing: '-0.01em'
              }}
            >
              {order.productName}
            </h3>
            <div
              style={{
                fontFamily: 'Gyrotrope',
                fontSize: '13px',
                color: '#6B7280',
                lineHeight: '1.5'
              }}
            >
              <p style={{ marginBottom: '4px' }}>
                <span style={{ fontWeight: 600, color: '#000000' }}>
                  {order.customerName} - {order.phone}
                </span>
              </p>
              <p style={{ 
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
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
    </motion.div>
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
