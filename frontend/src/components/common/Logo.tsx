import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  onClick?: () => void
}

export default function Logo({ 
  size = 'md', 
  className,
  onClick 
}: LogoProps) {
  const sizes = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-16',
    xl: 'h-20'
  }

  const Component = onClick ? motion.button : motion.div

  return (
    <Component
      className={cn('flex items-center', className)}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.05 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
    >
      <img
        src="/CareerOpen Logo.png"
        alt="CareerOpen"
        className={cn('object-contain', sizes[size])}
      />
    </Component>
  )
}