// Email utilities for DriveLine Recruit
// Note: In production, these functions should be called from a secure backend API

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY || 'your-resend-api-key'
const FROM_EMAIL = 'noreply@drivelinerecruit.net'

// Email templates
export const emailTemplates = {
  welcomeRecruiter: (firstName, lastName) => ({
    subject: 'Welcome to DriveLine Recruit - Your Application is Under Review',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to DriveLine Recruit</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to DriveLine Recruit!</h1>
            <p>Your journey in transportation recruiting starts here</p>
          </div>
          <div class="content">
            <h2>Hello ${firstName} ${lastName},</h2>
            <p>Thank you for your interest in joining the DriveLine Recruit team! We've received your recruiter application and are excited to review your qualifications.</p>
            
            <h3>What happens next?</h3>
            <ul>
              <li><strong>Application Review:</strong> Our team will carefully review your application within 2-3 business days</li>
              <li><strong>Initial Contact:</strong> If your application meets our criteria, we'll reach out to schedule an interview</li>
              <li><strong>Onboarding:</strong> Successful candidates will receive comprehensive training and access to our platform</li>
            </ul>
            
            <p>In the meantime, feel free to explore our website and learn more about the opportunities available in transportation recruiting.</p>
            
            <a href="https://drivelinerecruit.net" class="button">Visit Our Website</a>
            
            <p>If you have any questions, please don't hesitate to contact our support team.</p>
            
            <p>Best regards,<br>
            The DriveLine Recruit Team</p>
          </div>
          <div class="footer">
            <p>© 2025 DriveLine Recruit. All rights reserved.</p>
            <p>This email was sent to ${firstName} ${lastName} regarding your recruiter application.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to DriveLine Recruit!
      
      Hello ${firstName} ${lastName},
      
      Thank you for your interest in joining the DriveLine Recruit team! We've received your recruiter application and are excited to review your qualifications.
      
      What happens next?
      - Application Review: Our team will carefully review your application within 2-3 business days
      - Initial Contact: If your application meets our criteria, we'll reach out to schedule an interview
      - Onboarding: Successful candidates will receive comprehensive training and access to our platform
      
      In the meantime, feel free to explore our website at https://drivelinerecruit.net
      
      If you have any questions, please don't hesitate to contact our support team.
      
      Best regards,
      The DriveLine Recruit Team
    `
  }),

  adminNotification: (applicationData) => ({
    subject: `New Recruiter Application - ${applicationData.first_name} ${applicationData.last_name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Recruiter Application</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1e3a8a; color: white; padding: 20px; text-align: center; }
          .content { background: #f8fafc; padding: 20px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #1e3a8a; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Recruiter Application Received</h2>
          </div>
          <div class="content">
            <div class="field">
              <span class="label">Name:</span> ${applicationData.first_name} ${applicationData.last_name}
            </div>
            <div class="field">
              <span class="label">Email:</span> ${applicationData.email}
            </div>
            <div class="field">
              <span class="label">Phone:</span> ${applicationData.phone}
            </div>
            <div class="field">
              <span class="label">Experience:</span> ${applicationData.experience}
            </div>
            <div class="field">
              <span class="label">How they heard about us:</span> ${applicationData.how_did_you_hear}
            </div>
            <div class="field">
              <span class="label">US Resident:</span> ${applicationData.is_us_resident ? 'Yes' : 'No'}
            </div>
            ${applicationData.previous_experience ? `
            <div class="field">
              <span class="label">Previous Experience:</span><br>
              ${applicationData.previous_experience}
            </div>
            ` : ''}
            ${applicationData.education ? `
            <div class="field">
              <span class="label">Education:</span> ${applicationData.education}
            </div>
            ` : ''}
            ${applicationData.availability ? `
            <div class="field">
              <span class="label">Availability:</span> ${applicationData.availability}
            </div>
            ` : ''}
            <p><strong>Please review this application in your admin dashboard.</strong></p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      New Recruiter Application Received
      
      Name: ${applicationData.first_name} ${applicationData.last_name}
      Email: ${applicationData.email}
      Phone: ${applicationData.phone}
      Experience: ${applicationData.experience}
      How they heard about us: ${applicationData.how_did_you_hear}
      US Resident: ${applicationData.is_us_resident ? 'Yes' : 'No'}
      
      ${applicationData.previous_experience ? `Previous Experience: ${applicationData.previous_experience}` : ''}
      ${applicationData.education ? `Education: ${applicationData.education}` : ''}
      ${applicationData.availability ? `Availability: ${applicationData.availability}` : ''}
      
      Please review this application in your admin dashboard.
    `
  })
}

// Send email function (should be called from backend in production)
export const sendEmail = async (to, template) => {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject: template.subject,
        html: template.html,
        text: template.text,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: error.message }
  }
}

// Send welcome email to new recruiter
export const sendWelcomeEmail = async (email, firstName, lastName) => {
  const template = emailTemplates.welcomeRecruiter(firstName, lastName)
  return await sendEmail(email, template)
}

// Send admin notification for new application
export const sendAdminNotification = async (applicationData) => {
  const template = emailTemplates.adminNotification(applicationData)
  // Replace with actual admin email
  const adminEmail = 'admin@drivelinerecruit.net'
  return await sendEmail(adminEmail, template)
}

