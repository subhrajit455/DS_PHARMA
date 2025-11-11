import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus } from 'lucide-react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        padding: '10px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06)',
        border: '1px solid #E5E7EB'
      }}
    >
      <div className="flex gap-4">
        {/* Product Image */}
        <div
          className="shrink-0 overflow-hidden"
          style={{ 
            width: '72px', 
            height: '72px',
            borderRadius: '8px',
            backgroundColor: '#F3F4F6'
          }}
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-4">
              <h3
                style={{
                  fontFamily: 'Gyrotrope',
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#000000',
                  marginBottom: '6px',
                  lineHeight: '1.4',
                  letterSpacing: '-0.01em'
                }}
              >
                {item.name}
              </h3>
              <div className="flex items-center gap-2">
                <span
                  style={{
                    fontFamily: 'Gyrotrope',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#000000'
                  }}
                >
                  ₹{item.price}
                </span>
                <span
                  style={{
                    fontFamily: 'Gyrotrope',
                    fontSize: '13px',
                    fontWeight: 400,
                    color: '#9CA3AF',
                    textDecoration: 'line-through'
                  }}
                >
                  ₹{item.originalPrice}
                </span>
                <span
                  style={{
                    fontFamily: 'Gyrotrope',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#10B981',
                    backgroundColor: '#D1FAE5',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}
                >
                  {item.discount}% Off
                </span>
              </div>
          
          </div>
          <div className='flex flex-col items-end'>

          {/* Delete Button */}
            <button
              onClick={() => onRemove(item.id)}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
              aria-label="Remove item"
              style={{
                alignSelf: 'flex-end',
                marginBottom: '12px'
              }}
            >
              <Trash2 size={16} color="#EF4444" strokeWidth={2} />
            </button>

          {/* Quantity Controls */}
          
          <div className="flex items-center justify-end">
            <button
              onClick={() => onUpdateQuantity(item.id, -1)}
              className="flex items-center justify-center border hover:bg-gray-50 transition-colors cursor-pointer"
              aria-label="Decrease quantity"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                border: '1px solid #D1D5DB'
              }}
            >
              <Minus size={14} strokeWidth={2.5} />
            </button>
            <span
              style={{
                fontFamily: 'Gyrotrope',
                fontSize: '14px',
                fontWeight: 600,
                color: '#000000',
                minWidth: '24px',
                textAlign: 'center'
              }}
            >
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, 1)}
              className="flex items-center justify-center border hover:bg-gray-50 transition-colors cursor-pointer"
              aria-label="Increase quantity"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                border: '1px solid #D1D5DB'
              }}
            >
              <Plus size={14} strokeWidth={2.5} />
            </button>
          
          </div>
            
          </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
