import React from 'react';

const Loading = ({ size = 'medium', color = 'emerald-500', className = '' }) => {
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-4',
    large: 'h-12 w-12 border-4',
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-t-transparent border-${color} ${sizeClasses[size]}`}
      ></div>
    </div>
  );
};

export default Loading;
