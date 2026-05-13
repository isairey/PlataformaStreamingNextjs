import nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";

// Initialize SendGrid if API key is provided
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Create transporter for sending emails (Gmail fallback)
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // App password, bukan password biasa
    },
  });
};

// Send email using SendGrid or Gmail
const sendEmail = async (mailOptions: any) => {
  // Try SendGrid first if API key is available
  if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL) {
    console.log("Sending email via SendGrid...");
    
    const msg = {
      to: mailOptions.to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: "Screenly Support Team"
      },
      subject: mailOptions.subject,
      html: mailOptions.html,
      text: mailOptions.text,
      // Add categories for tracking and better deliverability
      categories: ['password-reset', 'transactional'],
      // Add custom args for tracking
      customArgs: {
        'email_type': 'password_reset',
        'app': 'screenly'
      },
      // Add tracking settings
      trackingSettings: {
        clickTracking: {
          enable: false // Disable for transactional emails
        },
        openTracking: {
          enable: false // Disable for transactional emails
        },
        subscriptionTracking: {
          enable: false
        }
      },
      // Add mail settings to improve deliverability
      mailSettings: {
        sandboxMode: {
          enable: false
        },
        bypassListManagement: {
          enable: true // For transactional emails
        }
      }
    };

    try {
      const response = await sgMail.send(msg);
      console.log("SendGrid email sent successfully:", response[0].statusCode);
      return { success: true, messageId: response[0].headers['x-message-id'] };
    } catch (error: any) {
      console.error("SendGrid error:", error.response?.body || error.message);
      throw new Error(`SendGrid failed: ${error.response?.body?.errors?.[0]?.message || error.message}`);
    }
  }
  
  // Fallback to Gmail/Nodemailer
  console.log("Sending email via Gmail/Nodemailer...");
  const transporter = createTransporter();
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Gmail email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Gmail error:", error);
    throw new Error("Failed to send email via Gmail");
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string
) => {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: {
      name: "Screenly - Movie Streaming",
      address: process.env.EMAIL_USER || process.env.SENDGRID_FROM_EMAIL!,
    },
    to: email,
    subject: "Password Reset Request - Screenly",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>Password Reset Request</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; line-height: 1.6; }
          .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #E50914, #B20710); padding: 30px 20px; text-align: center; }
          .logo { color: white; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: 1px; }
          .subtitle { color: #ffcccc; margin: 8px 0 0 0; font-size: 16px; }
          .content { padding: 40px 30px; color: #333333; }
          .greeting { font-size: 18px; margin-bottom: 20px; }
          .message { font-size: 16px; margin-bottom: 25px; }
          .cta-container { text-align: center; margin: 35px 0; }
          .cta-button { 
            display: inline-block; 
            background-color: #E50914; 
            color: white !important; 
            padding: 16px 32px; 
            text-decoration: none; 
            border-radius: 6px; 
            font-weight: 600; 
            font-size: 16px;
            border: none;
            cursor: pointer;
          }
          .cta-button:hover { background-color: #B20710; }
          .security-notice { 
            background-color: #f8f9fa; 
            border: 1px solid #e9ecef; 
            padding: 20px; 
            margin: 25px 0; 
            border-radius: 6px; 
            border-left: 4px solid #E50914;
          }
          .security-title { font-weight: 600; margin: 0 0 10px 0; color: #E50914; }
          .security-list { margin: 10px 0 0 0; padding-left: 20px; }
          .security-list li { margin: 5px 0; }
          .fallback-link { 
            background-color: #f8f9fa; 
            padding: 15px; 
            border-radius: 6px; 
            margin: 20px 0; 
            word-break: break-all; 
            font-family: 'Courier New', monospace; 
            font-size: 14px;
            border: 1px solid #e9ecef;
          }
          .footer { 
            background-color: #f8f9fa; 
            padding: 25px 30px; 
            text-align: center; 
            color: #6c757d; 
            font-size: 14px; 
            border-top: 1px solid #e9ecef; 
          }
          .footer-links { margin: 10px 0; }
          .footer-links a { color: #E50914; text-decoration: none; margin: 0 10px; }
          .unsubscribe { margin-top: 15px; font-size: 12px; }
          @media only screen and (max-width: 600px) {
            .email-container { margin: 0 10px; }
            .content { padding: 30px 20px; }
            .cta-button { padding: 14px 28px; font-size: 15px; }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1 class="logo">Screenly</h1>
            <p class="subtitle">Secure Password Reset</p>
          </div>
          
          <div class="content">
            <p class="greeting">Hello,</p>
            
            <p class="message">
              We received a request to reset the password for your Screenly account. 
              To proceed with resetting your password, please click the button below.
            </p>
            
            <div class="cta-container">
              <a href="${resetUrl}" class="cta-button">Reset Password</a>
            </div>
            
            <div class="security-notice">
              <p class="security-title">Security Information</p>
              <ul class="security-list">
                <li>This link is valid for 24 hours only</li>
                <li>If you did not request this reset, please ignore this email</li>
                <li>For security, do not share this link with anyone</li>
                <li>This link can only be used once</li>
              </ul>
            </div>
            
            <p>If the button above does not work, you can copy and paste the following link into your web browser:</p>
            
            <div class="fallback-link">
              ${resetUrl}
            </div>
            
            <p>If you did not request this password reset, no action is required. Your account remains secure.</p>
            
            <p>
              Best regards,<br>
              The Screenly Support Team
            </p>
          </div>
          
          <div class="footer">
            <p><strong>Screenly</strong> - Your Movie Streaming Platform</p>
            <div class="footer-links">
              <a href="${process.env.NEXTAUTH_URL}">Visit Website</a> |
              <a href="${process.env.NEXTAUTH_URL}/support">Support Center</a> |
              <a href="${process.env.NEXTAUTH_URL}/privacy">Privacy Policy</a>
            </div>
            <p>© 2024 Screenly. All rights reserved.</p>
            <p class="unsubscribe">
              This is a transactional email. You received this because you requested a password reset.
              <br>Our address: Screenly Inc., 123 Movie Street, Cinema City, CC 12345
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Password Reset Request - Screenly

Hello,

We received a request to reset the password for your Screenly account. To proceed with resetting your password, please visit the following link:

${resetUrl}

Security Information:
- This link is valid for 24 hours only
- If you did not request this reset, please ignore this email
- For security, do not share this link with anyone
- This link can only be used once

If you did not request this password reset, no action is required. Your account remains secure.

Best regards,
The Screenly Support Team

---
Screenly - Your Movie Streaming Platform
© 2024 Screenly. All rights reserved.

This is a transactional email. You received this because you requested a password reset.
Our address: Screenly Inc., 123 Movie Street, Cinema City, CC 12345
    `,
    // Add email headers to improve deliverability
    headers: {
      'X-Mailer': 'Screenly Password Reset System',
      'X-Priority': '1',
      'X-MSMail-Priority': 'High',
      'List-Unsubscribe': `<${process.env.NEXTAUTH_URL}/unsubscribe>`,
      'List-Id': 'Screenly Transactional Emails <transactional.screenly.com>',
    },
  };

  try {
    const result = await sendEmail(mailOptions);
    console.log("Password reset email sent:", result.messageId);
    return result;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};

// Send welcome email for new users
export const sendWelcomeEmail = async (email: string, name: string) => {
  const mailOptions = {
    from: {
      name: "Screenly - Movie Streaming",
      address: process.env.EMAIL_USER || process.env.SENDGRID_FROM_EMAIL!,
    },
    to: email,
    subject: "Welcome to Screenly! 🎬",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Screenly</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #0f0f0f; }
          .container { max-width: 600px; margin: 0 auto; background-color: #1a1a1a; }
          .header { background: linear-gradient(135deg, #E50914, #B20710); padding: 40px 20px; text-align: center; }
          .logo { color: white; font-size: 32px; font-weight: bold; margin: 0; }
          .content { padding: 40px 20px; color: #ffffff; }
          .button { display: inline-block; background-color: #E50914; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #888; font-size: 14px; border-top: 1px solid #333; }
          .feature { background-color: #2a2a2a; padding: 20px; margin: 15px 0; border-radius: 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">Screenly</h1>
            <p style="color: #ffcccc; margin: 10px 0 0 0;">Welcome to the Family!</p>
          </div>
          
          <div class="content">
            <h2 style="color: #ffffff; margin-top: 0;">Welcome, ${name}! 🎉</h2>
            <p>Thank you for joining Screenly! We're excited to have you as part of our movie-loving community.</p>
            
            <div class="feature">
              <h3 style="color: #E50914; margin-top: 0;">🎬 What you can do now:</h3>
              <ul>
                <li>Browse thousands of movies from TMDB</li>
                <li>Create your personal watchlist</li>
                <li>Watch trailers and get movie details</li>
                <li>Discover new movies with our recommendation system</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL}" class="button">Start Watching Now</a>
            </div>
            
            <p>If you have any questions or need help getting started, don't hesitate to reach out to our support team.</p>
            
            <p>Happy watching!<br>The Screenly Team</p>
          </div>
          
          <div class="footer">
            <p>© 2024 Screenly. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const result = await sendEmail(mailOptions);
    console.log("Welcome email sent:", result.messageId);
    return result;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    // Don't throw error for welcome email, it's not critical
    return { success: false, error: error };
  }
};
