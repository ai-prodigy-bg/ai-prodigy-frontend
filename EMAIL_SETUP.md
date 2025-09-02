# Email Setup Guide for Contact Form

This guide explains how to set up the email functionality for the Prodigy Labs contact form.

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install nodemailer @types/nodemailer
   ```

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your email service credentials
   ```

3. **Deploy to Vercel**
   - Add environment variables in Vercel Dashboard
   - Deploy and test the contact form

## Email Service Options

### Option 1: Gmail (For Testing)

**Pros:** Easy to set up, free
**Cons:** Lower sending limits, requires app passwords

**Setup:**
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use these environment variables:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   EMAIL_FROM=your-email@gmail.com
   EMAIL_TO=recipient@prodigylabs.com
   ```

### Option 2: Resend (Recommended for Production)

**Pros:** Developer-friendly, good deliverability, reasonable pricing
**Cons:** Requires custom domain verification

**Setup:**
1. Sign up at [resend.com](https://resend.com)
2. Verify your sending domain
3. Generate an API key
4. Use these environment variables:
   ```env
   EMAIL_HOST=smtp.resend.com
   EMAIL_PORT=587
   EMAIL_USER=resend
   EMAIL_PASS=your-resend-api-key
   EMAIL_FROM=contact@yourdomain.com
   EMAIL_TO=recipient@prodigylabs.com
   ```

### Option 3: Other SMTP Services

Popular alternatives:
- **Mailgun**: Reliable, good for high volume
- **SendGrid**: Enterprise-grade, detailed analytics
- **Postmark**: Excellent for transactional emails
- **Amazon SES**: Cost-effective for high volume

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `EMAIL_HOST` | SMTP server hostname | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port (587 for TLS, 465 for SSL) | `587` |
| `EMAIL_USER` | SMTP username/email | `user@example.com` |
| `EMAIL_PASS` | SMTP password/API key | `app-password-123` |
| `EMAIL_FROM` | Sender email address | `contact@prodigylabs.com` |
| `EMAIL_TO` | Recipient email address | `team@prodigylabs.com` |

## Vercel Deployment

### Adding Environment Variables in Vercel Dashboard:

1. Go to your project in Vercel Dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable with appropriate values:
   - Name: `EMAIL_HOST`, Value: `smtp.resend.com`
   - Name: `EMAIL_PORT`, Value: `587`
   - Name: `EMAIL_USER`, Value: `resend`
   - Name: `EMAIL_PASS`, Value: `your-api-key`
   - Name: `EMAIL_FROM`, Value: `contact@yourdomain.com`
   - Name: `EMAIL_TO`, Value: `team@prodigylabs.com`

### Using Vercel CLI:
```bash
vercel env add EMAIL_HOST
vercel env add EMAIL_PORT
vercel env add EMAIL_USER
vercel env add EMAIL_PASS
vercel env add EMAIL_FROM
vercel env add EMAIL_TO
```

## Testing the Contact Form

### Local Development:
1. Create `.env.local` with your credentials
2. Start development server: `npm run dev`
3. Test the form at `http://localhost:3000`
4. Check console/logs for any errors

### Production Testing:
1. Deploy to Vercel with environment variables
2. Test the live contact form
3. Check Vercel Function logs for any issues

## API Endpoint Usage

The contact form API is available at `/api/contact` and accepts POST requests with this JSON structure:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "projectType": "Web Development",
  "message": "I'm interested in building a new website..."
}
```

### Success Response:
```json
{
  "success": true,
  "message": "Thank you for your message! We'll get back to you within 24 hours.",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Error Response:
```json
{
  "success": false,
  "error": "Please check your form data.",
  "validationErrors": [
    {
      "field": "email",
      "message": "Please enter a valid email address"
    }
  ]
}
```

## Troubleshooting

### Common Issues:

1. **"Server configuration error"**
   - Check that all environment variables are set
   - Verify variable names match exactly

2. **"Email service temporarily unavailable"**
   - SMTP connection failed
   - Check host, port, username, and password
   - Verify network connectivity

3. **"Authentication failed"**
   - Wrong username/password
   - For Gmail: Use App Password, not regular password
   - For Resend: Use API key as password

4. **Emails not being delivered**
   - Check spam folder
   - Verify sender domain is authenticated
   - Check email service logs

### Debug Mode:
Set `NODE_ENV=development` to see detailed error messages in API responses.

## Security Notes

- Never commit actual credentials to version control
- Use different credentials for development and production
- Consider using different sender addresses for different environments
- Regularly rotate API keys and passwords
- Monitor email sending logs for suspicious activity

## Rate Limiting

Consider adding rate limiting to prevent abuse:
- Vercel functions have built-in execution limits
- Consider using Redis or database to track submission frequency
- Implement client-side form submission cooldowns