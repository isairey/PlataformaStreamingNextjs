import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // Always return success for security (don't reveal if email exists)
    if (!user) {
      return NextResponse.json({ 
        message: 'If an account with that email exists, we sent a reset link.' 
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Delete any existing reset tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id }
    })

    // Save the reset token to database
    await prisma.passwordResetToken.create({
      data: {
        token: resetToken,
        userId: user.id,
        expiresAt: resetTokenExpiry,
      }
    })

    // Send email if email service is configured (SendGrid or Gmail)
    const hasEmailConfig = (process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL) || 
                          (process.env.EMAIL_USER && process.env.EMAIL_PASS);
    
    if (hasEmailConfig) {
      try {
        await sendPasswordResetEmail(email, resetToken)
        console.log(`✅ Password reset email sent to: ${email}`)
      } catch (emailError) {
        console.error('❌ Failed to send email:', emailError)
        // Don't fail the request if email fails, just log it
      }
    } else {
      // For development - log the reset link
      console.log(`🔗 Reset link for ${email}: ${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`)
      console.log('💡 Configure SendGrid or Gmail to send actual emails')
    }

    return NextResponse.json({ 
      message: 'If an account with that email exists, we sent a reset link.',
      // For development only - remove in production
      ...(process.env.NODE_ENV === 'development' && {
        resetLink: `/auth/reset-password?token=${resetToken}`
      })
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
