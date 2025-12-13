import { forwardRef } from 'react';

const GlassButton = forwardRef(({ 
  className = '', 
  children, 
  variant = 'primary',
  size = 'md',
  disabled = false,
  ...props 
}, ref) => {
  const variants = {
    primary: 'bg-blue-500/20 border-blue-500/30 text-blue-100 hover:bg-blue-500/30',
    secondary: 'bg-gray-500/20 border-gray-500/30 text-gray-100 hover:bg-gray-500/30',
    success: 'bg-green-500/20 border-green-500/30 text-green-100 hover:bg-green-500/30',
    danger: 'bg-red-500/20 border-red-500/30 text-red-100 hover:bg-red-500/30',
    ghost: 'bg-transparent border-white/20 text-white hover:bg-white/10',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };

  const classes = [
    'rounded-xl border backdrop-blur-md font-medium transition-all duration-300',
    'hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50',
    variants[variant],
    sizes[size],
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      className={classes}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

GlassButton.displayName = 'GlassButton';

export default GlassButton;