import { forwardRef } from 'react';

const GlassInput = forwardRef(({ 
  className = '', 
  type = 'text',
  placeholder,
  error,
  label,
  ...props 
}, ref) => {
  const classes = [
    'w-full px-4 py-3 rounded-xl border backdrop-blur-md transition-all duration-300',
    'bg-white/10 border-white/20 text-white placeholder-white/60',
    'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50',
    'hover:bg-white/15',
    error ? 'border-red-500/50 focus:ring-red-500/50' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-white/80">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={classes}
        placeholder={placeholder}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
});

GlassInput.displayName = 'GlassInput';

export default GlassInput;