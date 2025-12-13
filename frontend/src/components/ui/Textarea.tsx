import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  variant?: 'glass' | 'solid'
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  className,
  label,
  error,
  helperText,
  variant = 'glass',
  ...props
}, ref) => {
  const variants = {
    glass: 'glass-input',
    solid: 'bg-white border-gray-300 focus:border-ocean-500'
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <motion.textarea
        ref={ref}
        className={cn(
          'w-full px-4 py-3 rounded-xl border transition-all duration-200 resize-none',
          'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-ocean-400',
          variants[variant],
          error && 'border-red-300 focus:border-red-500 focus:ring-red-400',
          className
        )}
        whileFocus={{ scale: 1.01 }}
        {...props}
      />
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

export default Textarea