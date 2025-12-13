import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface GlassPanelProps {
  children: React.ReactNode
  className?: string
  blur?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function GlassPanel({ 
  children, 
  className, 
  blur = 'xl' 
}: GlassPanelProps) {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md', 
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  }

  return (
    <motion.div
      className={cn(
        'glass-panel rounded-2xl p-6',
        blurClasses[blur],
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}