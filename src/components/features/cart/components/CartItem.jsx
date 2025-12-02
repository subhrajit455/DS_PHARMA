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
          className="shrink-0 overflow-hidden w-16 h-16 md:w-[72px] md:h-[72px] rounded-lg bg-gray-100"
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
            <div className="flex-1 pr-4 text-bottom">
              <h3
                className="font-gyrotrope text-xs md:text-[16px] font-semibold text-black mb-5 leading-relaxed tracking-tight pt-2"
              >
                {item.name}
              </h3>
              <div className="flex items-center gap-2 mt-15" style={{
                paddingTop: '8px'
              }}>
                <span className="font-gyrotrope text-xs md:text-[16px] font-bold text-black">
                  ₹{item.price}
                </span>
                <span className="font-gyrotrope text-xs md:text-[13px] font-normal text-gray-400 line-through">
                  ₹{item.originalPrice}
                </span>
                <span className="font-gyrotrope text-[10px] md:text-[11px] font-semibold text-emerald-500 bg-emerald-100 px-1.5 py-0.5 rounded">
                  {item.discount}% Off
                </span>
              </div>

            </div>
            <div className='flex flex-col items-end'>

              {/* Delete Button */}
              <button
                onClick={() => onRemove(item.id)}
                className="p-1.5 hover:bg-gray-100 rounded-md transition-colors cursor-pointer self-end mb-3"
                aria-label="Remove item"
              style={{
                alignSelf: 'flex-end',
                marginBottom: '12px'
              }}
              >
                <Trash2 size={16} color="#EF4444" strokeWidth={2} />
              </button>

              {/* Quantity Controls */}

              <div className="flex items-center justify-end" style={{
                paddingTop: '8px'
              }}>
                <button
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  className="flex items-center justify-center border hover:bg-gray-50 transition-colors cursor-pointer w-6 h-6 md:w-7 md:h-7 rounded-md border-gray-300"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} strokeWidth={2.5} />
                </button>
                <span className="font-gyrotrope text-xs md:text-sm font-semibold text-black min-w-[24px] text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(item.id, 1)}
                  className="flex items-center justify-center border hover:bg-gray-50 transition-colors cursor-pointer w-6 h-6 md:w-7 md:h-7 rounded-md border-gray-300"
                  aria-label="Increase quantity"
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
