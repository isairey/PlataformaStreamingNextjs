'use client'

import { useState, forwardRef } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModernInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  icon?: React.ReactNode
}

const ModernInput = forwardRef<HTMLInputElement, ModernInputProps>(
  ({ label, error, icon, type, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(false)

    const isPassword = type === 'password'
    const inputType = isPassword && showPassword ? 'text' : type

    return (
      <div className="relative">
        <div className="relative">
          {/* Icon */}
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
              {icon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            type={inputType}
            className={cn(
              "peer w-full px-4 py-4 bg-netflix-gray/50 border-2 border-gray-700 rounded-xl text-white placeholder-transparent transition-all duration-200 focus:outline-none focus:border-netflix-red focus:bg-netflix-gray/70",
              icon && "pl-12",
              isPassword && "pr-12",
              error && "border-red-500 focus:border-red-500",
              className
            )}
            placeholder={label}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              setIsFocused(false)
              setHasValue(e.target.value.length > 0)
            }}
            onChange={(e) => {
              setHasValue(e.target.value.length > 0)
              props.onChange?.(e)
            }}
            {...props}
          />

          {/* Floating Label */}
          <label
            className={cn(
              "absolute left-4 transition-all duration-200 pointer-events-none",
              icon && "left-12",
              (isFocused || hasValue || props.value) 
                ? "top-2 text-xs text-netflix-red font-medium"
                : "top-1/2 transform -translate-y-1/2 text-gray-400"
            )}
          >
            {label}
          </label>

          {/* Password Toggle */}
          {isPassword && (
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-400 rounded-full"></span>
            {error}
          </p>
        )}

        {/* Focus Ring */}
        <div
          className={cn(
            "absolute inset-0 rounded-xl transition-all duration-200 pointer-events-none",
            isFocused && !error && "ring-2 ring-netflix-red/50"
          )}
        />
      </div>
    )
  }
)

ModernInput.displayName = 'ModernInput'

export default ModernInput
