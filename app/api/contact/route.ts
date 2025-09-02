/**
 * Vercel Serverless Function for Contact Form Submission
 * 
 * SETUP INSTRUCTIONS:
 * 1. Install dependencies: npm install nodemailer @types/nodemailer
 * 2. Set up environment variables in Vercel dashboard or .env.local:
 *    - EMAIL_USER: Your email service username/email
 *    - EMAIL_PASS: Your email service password/app password
 *    - EMAIL_HOST: SMTP host (e.g., smtp.gmail.com, smtp.resend.com)
 *    - EMAIL_PORT: SMTP port (usually 587 for TLS, 465 for SSL)
 *    - EMAIL_FROM: Sender email address
 *    - EMAIL_TO: Recipient email address
 * 
 * For Gmail:
 * - Use App Passwords instead of regular password
 * - Enable 2FA and generate App Password in Google Account settings
 * 
 * For Resend:
 * - Use your Resend API key as EMAIL_PASS
 * - Set EMAIL_HOST to smtp.resend.com
 * - Set EMAIL_PORT to 587
 */

import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { z } from 'zod'

// Form validation schema using Zod
const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  email: z.string()
    .email('Please enter a valid email address')
    .trim()
    .toLowerCase(),
  projectType: z.string()
    .min(1, 'Please select a project type')
    .max(100, 'Project type must be less than 100 characters'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters')
    .trim(),
})

// Branded HTML email template using Prodigy Labs branding
const createEmailTemplate = (formData: {
  name: string
  email: string
  projectType: string
  message: string
}) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission - Prodigy Labs</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
      <style>
        /* Reset styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          line-height: 1.6;
          color: #FAFAFA;
          background: linear-gradient(135deg, #1A1A1A 0%, #262626 100%);
          min-height: 100vh;
        }
        
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: #1A1A1A;
          border: 1px solid #4D4D4D;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 25px -5px rgba(139, 92, 246, 0.1), 0 10px 10px -5px rgba(139, 92, 246, 0.04);
        }
        
        .header {
          background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
          padding: 32px 24px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        
        .header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
          opacity: 0.3;
        }
        
        .logo {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #FAFAFA;
          margin-bottom: 8px;
          position: relative;
          z-index: 1;
          letter-spacing: -0.5px;
        }
        
        .tagline {
          font-size: 16px;
          color: rgba(250, 250, 250, 0.8);
          font-weight: 500;
          position: relative;
          z-index: 1;
        }
        
        .content {
          padding: 32px 24px;
          background: #262626;
        }
        
        .title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 24px;
          font-weight: 600;
          color: #FAFAFA;
          margin-bottom: 24px;
          text-align: center;
        }
        
        .form-section {
          background: #1A1A1A;
          border: 1px solid #4D4D4D;
          border-radius: 8px;
          padding: 24px;
          margin-bottom: 24px;
        }
        
        .field {
          margin-bottom: 20px;
        }
        
        .field:last-child {
          margin-bottom: 0;
        }
        
        .field-label {
          font-weight: 600;
          color: #8B5CF6;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
          display: block;
        }
        
        .field-value {
          color: #FAFAFA;
          font-size: 16px;
          line-height: 1.5;
          background: #333333;
          padding: 12px 16px;
          border-radius: 6px;
          border: 1px solid #4D4D4D;
          word-wrap: break-word;
        }
        
        .message-field .field-value {
          white-space: pre-wrap;
          min-height: 80px;
        }
        
        .footer {
          background: #1A1A1A;
          padding: 24px;
          text-align: center;
          border-top: 1px solid #4D4D4D;
        }
        
        .footer-text {
          color: #B3B3B3;
          font-size: 14px;
          margin-bottom: 16px;
        }
        
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
          color: #FAFAFA;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 14px 0 rgba(139, 92, 246, 0.2);
        }
        
        .timestamp {
          color: #B3B3B3;
          font-size: 12px;
          margin-top: 16px;
          text-align: center;
        }
        
        .accent-line {
          height: 3px;
          background: linear-gradient(90deg, #8B5CF6, #EC4899, #14B8A6);
          margin: 24px 0;
          border-radius: 2px;
        }
        
        @media (max-width: 600px) {
          .container {
            margin: 0 16px;
          }
          
          .header, .content, .footer {
            padding: 24px 16px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">PRODIGY LABS</div>
          <div class="tagline">Premium Digital Solutions</div>
        </div>
        
        <div class="content">
          <h1 class="title">New Contact Form Submission</h1>
          
          <div class="form-section">
            <div class="field">
              <label class="field-label">Contact Name</label>
              <div class="field-value">${formData.name}</div>
            </div>
            
            <div class="field">
              <label class="field-label">Email Address</label>
              <div class="field-value">${formData.email}</div>
            </div>
            
            <div class="field">
              <label class="field-label">Project Type</label>
              <div class="field-value">${formData.projectType}</div>
            </div>
            
            <div class="field message-field">
              <label class="field-label">Message</label>
              <div class="field-value">${formData.message}</div>
            </div>
          </div>
          
          <div class="accent-line"></div>
        </div>
        
        <div class="footer">
          <p class="footer-text">
            Respond to this inquiry promptly to maintain our premium service standards.
          </p>
          <a href="mailto:${formData.email}" class="cta-button">Reply to Contact</a>
          <div class="timestamp">
            Received: ${new Date().toLocaleString('en-US', {
              timeZone: 'UTC',
              dateStyle: 'full',
              timeStyle: 'medium'
            })} UTC
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = contactFormSchema.parse(body)

    // Check for required environment variables
    const requiredEnvVars = [
      'EMAIL_HOST',
      'EMAIL_PORT', 
      'EMAIL_USER',
      'EMAIL_PASS',
      'EMAIL_FROM',
      'EMAIL_TO'
    ]

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
    
    if (missingVars.length > 0) {
      console.error('Missing environment variables:', missingVars)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Server configuration error. Please contact the administrator.',
          details: process.env.NODE_ENV === 'development' 
            ? `Missing environment variables: ${missingVars.join(', ')}` 
            : undefined
        },
        { status: 500 }
      )
    }

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT!),
      secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Optional: Add these for better compatibility
      tls: {
        rejectUnauthorized: false // Only use in development
      }
    })

    // Verify SMTP connection
    try {
      await transporter.verify()
    } catch (verifyError) {
      console.error('SMTP connection failed:', verifyError)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email service temporarily unavailable. Please try again later.',
          details: process.env.NODE_ENV === 'development' 
            ? `SMTP verification failed: ${verifyError}` 
            : undefined
        },
        { status: 503 }
      )
    }

    // Prepare email content
    const subject = `New Contact Form Submission - ${validatedData.projectType} from ${validatedData.name}`
    const htmlContent = createEmailTemplate(validatedData)
    
    // Text fallback for email clients that don't support HTML
    const textContent = `
New Contact Form Submission - Prodigy Labs

Name: ${validatedData.name}
Email: ${validatedData.email}
Project Type: ${validatedData.projectType}

Message:
${validatedData.message}

Received: ${new Date().toISOString()}
    `.trim()

    // Send email
    const mailOptions = {
      from: `"Prodigy Labs Contact Form" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_TO,
      replyTo: validatedData.email,
      subject: subject,
      text: textContent,
      html: htmlContent,
      // Optional: Add headers for better deliverability
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    }

    await transporter.sendMail(mailOptions)

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you within 24 hours.',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Contact form error:', error)
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please check your form data.',
          validationErrors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }

    // Handle other errors
    return NextResponse.json(
      {
        success: false,
        error: 'Something went wrong. Please try again later.',
        details: process.env.NODE_ENV === 'development' 
          ? error instanceof Error ? error.message : 'Unknown error'
          : undefined
      },
      { status: 500 }
    )
  }
}

// Optional: Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}