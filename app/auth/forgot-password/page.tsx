"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import AuthLayout from '@/components/auth/auth-layout'
import ModernInput from '@/components/auth/modern-input'
import ModernButton from '@/components/auth/modern-button'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset email')
      }

      // For demo purposes, show the reset link in console
      if (data.resetLink) {
        console.log('Demo Reset Link:', window.location.origin + data.resetLink)
      }

      setSent(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <AuthLayout 
        title="Check Your Email" 
        subtitle="We've sent password reset instructions to your email"
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
            <h3 className="text-xl font-semibold text-white mb-2">Email Sent!</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              We've sent a password reset link to <strong className="text-white">{email}</strong>.
              Check your inbox and follow the instructions to reset your password.
            </p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <p className="text-blue-400 text-sm">
              <strong>Didn't receive the email?</strong> Check your spam folder or try again in a few minutes.
            </p>
          </div>

          <div className="space-y-3">
            <ModernButton
              onClick={() => {
                setSent(false)
                setEmail('')
              }}
              variant="secondary"
              className="w-full"
            >
              Try Different Email
            </ModernButton>

            <Link href="/auth/signin">
              <ModernButton variant="ghost" className="w-full">
                <ArrowLeft size={16} />
                Back to Sign In
              </ModernButton>
            </Link>
          </div>
        </motion.div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout 
      title="Forgot Password?" 
      subtitle="No worries! Enter your email and we'll send you reset instructions"
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
          <ModernInput
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={20} />}
            placeholder="Enter your email address"
            required
          />
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <h4 className="text-white font-medium mb-2 flex items-center gap-2">
            <Mail size={16} />
            What happens next?
          </h4>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• We'll send a secure link to your email</li>
            <li>• Click the link to create a new password</li>
            <li>• The link expires in 24 hours for security</li>
          </ul>
        </div>

        <ModernButton
          type="submit"
          loading={loading}
          className="w-full"
          size="lg"
          icon={!loading && <Send size={20} />}
        >
          {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
        </ModernButton>

        <div className="text-center space-y-4">
          <p className="text-sm text-gray-400">
            Remember your password?
          </p>
          
          <Link href="/auth/signin">
            <ModernButton variant="ghost" className="w-full">
              <ArrowLeft size={16} />
              Back to Sign In
            </ModernButton>
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}
