import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'glass' | 'solid' | 'outline'
  hover?: boolean
  clickable?: boolean
  onClick?: () => void
}

export default function Card({ 
  children, 
  className, 
  variant = 'glass',
  hover = false,
  clickable = false,
  onClick
}: CardProps) {
  const variants = {
    glass: 'glass-panel',
    solid: 'bg-white shadow-lg border border-gray-200',
    outline: 'border-2 border-gray-200 bg-transparent'
  }

  const Component = clickable ? motion.button : motion.div

  return (
    <Component
      className={cn(
        'rounded-2xl p-6 transition-all duration-200',
        variants[variant],
        hover && 'hover:shadow-xl hover:scale-[1.02]',
        clickable && 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-ocean-400',
        className
      )}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -2 } : undefined}
      whileTap={clickable ? { scale: 0.98 } : undefined}
    >
      {children}
    </Component>
  )
}