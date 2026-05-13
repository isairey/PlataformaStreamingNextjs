'use client'

import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModernButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
}

const ModernButton = forwardRef<HTMLButtonElement, ModernButtonProps>(
  ({ children, loading, variant = 'primary', size = 'md', icon, className, disabled, ...props }, ref) => {
    const baseClasses = "relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed"
    
    const variants = {
      primary: "bg-netflix-red hover:bg-netflix-red/90 text-white focus:ring-netflix-red/50 shadow-lg hover:shadow-netflix-red/25",
      secondary: "bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500/50",
      ghost: "bg-transparent hover:bg-gray-800 text-gray-300 hover:text-white focus:ring-gray-500/50"
    }

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg"
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        )}
        {!loading && icon && (
          <span className="mr-2">{icon}</span>
        )}
        {children}
        
        {/* Ripple effect */}
        <span className="absolute inset-0 rounded-xl bg-white/10 opacity-0 transition-opacity duration-200 hover:opacity-100" />
      </button>
    )
  }
)

ModernButton.displayName = 'ModernButton'

export default ModernButton
