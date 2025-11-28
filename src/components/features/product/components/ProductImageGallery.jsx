import React from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';

const ProductImageGallery = ({ images, selectedImage, onImageSelect, onScroll }) => {
  return (
    <div className="flex gap-4">
      {/* Thumbnail Navigation */}
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={() => onScroll('up')}
          disabled={selectedImage === 0}
          className="p-1 transition-colors rounded-md cursor-pointer hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Scroll up"
        >
          <ChevronUp size={20} />
        </button>

        <div className="flex flex-col gap-3 overflow-hidden" style={{ maxHeight: '350px' }}>
          {images.map((image, index) => (
            <motion.button
              key={index}
              onClick={() => onImageSelect(index)}
              className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === index
                  ? 'border-orange-500 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={image}
                alt={`Product view ${index + 1}`}
                className="object-cover w-full h-full"
              />
            </motion.button>
          ))}
        </div>

        <button
          onClick={() => onScroll('down')}
          disabled={selectedImage === images.length - 1}
          className="p-1 transition-colors rounded-md cursor-pointer hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Scroll down"
        >
          <ChevronDown size={20} />
        </button>
      </div>

      {/* Main Image */}
      <div className="flex-1 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
        <motion.img
          key={selectedImage}
          src={images[selectedImage]}
          alt="Product"
          className="object-cover w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{ minHeight: '350px', maxHeight: '420px' }}
        />
      </div>
    </div>
  );
};

export default ProductImageGallery;