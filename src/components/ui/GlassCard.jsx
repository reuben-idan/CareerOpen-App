import { forwardRef } from 'react';

const GlassCard = forwardRef(({ 
  className = '', 
  children, 
  variant = 'default',
  blur = 'md',
  ...props 
}, ref) => {
  const variants = {
    default: 'bg-white/10 border-white/20',
    primary: 'bg-blue-500/10 border-blue-500/20',
    success: 'bg-green-500/10 border-green-500/20',
    warning: 'bg-yellow-500/10 border-yellow-500/20',
    danger: 'bg-red-500/10 border-red-500/20',
  };

  const blurLevels = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
  };

  const classes = [
    'rounded-2xl border shadow-xl transition-all duration-300',
    'hover:shadow-2xl hover:scale-[1.02]',
    variants[variant],
    blurLevels[blur],
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={ref}
      className={classes}
      {...props}
    >
      {children}
    </div>
  );
});

GlassCard.displayName = 'GlassCard';

export default GlassCard;