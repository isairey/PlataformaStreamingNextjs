"use client"

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Lock, Eye, EyeOff, CheckCircle, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import AuthLayout from '@/components/auth/auth-layout'
import ModernInput from '@/components/auth/modern-input'
import ModernButton from '@/components/auth/modern-button'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Password strength validation
  const getPasswordStrength = (password: string) => {
    let strength = 0
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
    
    Object.values(checks).forEach(check => check && strength++)
    return { strength, checks }
  }

  const passwordStrength = getPasswordStrength(password)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (passwordStrength.strength < 3) {
      setError('Password is too weak. Please choose a stronger password.')
      setLoading(false)
      return
    }

    if (!token) {
      setError('Invalid reset token. Please request a new password reset.')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password')
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <AuthLayout 
        title="Password Reset Successful" 
        subtitle="Your password has been updated successfully"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-2">All Set!</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your password has been successfully updated. You can now sign in with your new password.
            </p>
          </div>

          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
            <p className="text-green-400 text-sm">
              <strong>Security tip:</strong> Make sure to keep your new password safe and don't share it with anyone.
            </p>
          </div>

          <Link href="/auth/signin">
            <ModernButton className="w-full" size="lg" icon={<ArrowRight size={20} />}>
              Continue to Sign In
            </ModernButton>
          </Link>
        </motion.div>
      </AuthLayout>
    )
  }

  if (!token) {
    return (
      <AuthLayout 
        title="Invalid Reset Link" 
        subtitle="This password reset link is invalid or has expired"
      >
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-red-500" />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Link Expired</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/auth/forgot-password">
              <ModernButton className="w-full">
                Request New Reset Link
              </ModernButton>
            </Link>

            <Link href="/auth/signin">
              <ModernButton variant="ghost" className="w-full">
                Back to Sign In
              </ModernButton>
            </Link>
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout 
      title="Reset Your Password" 
      subtitle="Enter your new password below"
    >
      <form onSubmit={onSubmit} className="space-y-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
          >
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}

        <div className="space-y-4">
          <div>
            <ModernInput
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={20} />}
              required
              minLength={8}
            />
            
            {/* Password Strength Indicator */}
            {password && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 space-y-2"
              >
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        level <= passwordStrength.strength
                          ? passwordStrength.strength <= 2
                            ? 'bg-red-500'
                            : passwordStrength.strength <= 3
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                          : 'bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(passwordStrength.checks).map(([key, passed]) => (
                    <div key={key} className={`flex items-center gap-1 ${passed ? 'text-green-400' : 'text-gray-500'}`}>
                      <CheckCircle size={12} className={passed ? 'opacity-100' : 'opacity-30'} />
                      <span>
                        {key === 'length' && '8+ characters'}
                        {key === 'lowercase' && 'Lowercase'}
                        {key === 'uppercase' && 'Uppercase'}
                        {key === 'number' && 'Number'}
                        {key === 'special' && 'Special char'}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <ModernInput
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={<Lock size={20} />}
            error={confirmPassword && password !== confirmPassword ? 'Passwords do not match' : undefined}
            required
          />
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <h4 className="text-white font-medium mb-2 flex items-center gap-2">
            <Lock size={16} />
            Password Requirements
          </h4>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• At least 8 characters long</li>
            <li>• Include uppercase and lowercase letters</li>
            <li>• Include at least one number</li>
            <li>• Include at least one special character</li>
          </ul>
        </div>

        <ModernButton
          type="submit"
          loading={loading}
          className="w-full"
          size="lg"
          disabled={passwordStrength.strength < 3}
          icon={!loading && <CheckCircle size={20} />}
        >
          {loading ? 'Updating Password...' : 'Update Password'}
        </ModernButton>

        <div className="text-center">
          <Link href="/auth/signin">
            <ModernButton variant="ghost" className="w-full">
              Back to Sign In
            </ModernButton>
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}
