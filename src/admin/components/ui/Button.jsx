import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

const Button = React.forwardRef(({ className, variant = 'default', size = 'default', isLoading, children, ...props }, ref) => {
  const variants = {
    default: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm',
    destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',
    outline: 'border border-gray-200 bg-white hover:bg-gray-100 text-gray-900',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200/80',
    ghost: 'hover:bg-gray-100 hover:text-gray-900',
    link: 'text-emerald-600 underline-offset-4 hover:underline',
  };

  const sizes = {
    default: 'h-9 px-4 py-2',
    sm: 'h-8 rounded-md px-3 text-xs',
    lg: 'h-10 rounded-md px-8',
    icon: 'h-9 w-9',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
