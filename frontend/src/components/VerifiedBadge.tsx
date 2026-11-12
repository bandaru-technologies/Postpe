import { BadgeCheck } from 'lucide-react'
import { cn } from '../lib/utils'

interface VerifiedBadgeProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showText?: boolean
}

export default function VerifiedBadge({
  size = 'sm',
  className,
  showText = false,
}: VerifiedBadgeProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-blue-400',
        className,
      )}
      title="Verified User"
    >
      <BadgeCheck className={cn(sizes[size], 'fill-blue-500/20')} />
      {showText && (
        <span className="text-xs font-medium text-blue-400">Verified</span>
      )}
    </span>
  )
}
