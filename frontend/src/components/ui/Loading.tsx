import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'spinner' | 'dots' | 'pulse'
  className?: string
  text?: string
}

export default function Loading({ 
  size = 'md', 
  variant = 'spinner',
  className,
  text 
}: LoadingProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const Spinner = () => (
    <motion.div
      className={cn(
        'border-2 border-gray-200 border-t-ocean-500 rounded-full',
        sizes[size]
      )}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  )

  const Dots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn(
            'bg-ocean-500 rounded-full',
            size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'
          )}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  )

  const Pulse = () => (
    <motion.div
      className={cn(
        'bg-ocean-500 rounded-full',
        sizes[size]
      )}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity
      }}
    />
  )

  const variants = {
    spinner: <Spinner />,
    dots: <Dots />,
    pulse: <Pulse />
  }

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-3', className)}>
      {variants[variant]}
      {text && (
        <motion.p
          className="text-sm text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}