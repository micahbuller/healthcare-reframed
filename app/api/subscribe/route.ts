import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    // Validate input
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Try to add to audience/contact list first
    let contactError = null;
    try {
      const { error: audienceError } = await resend.contacts.create({
        email: email,
        firstName: name || '',
        audienceId: process.env.RESEND_AUDIENCE_ID || '',
      });
      
      if (audienceError) {
        contactError = audienceError;
        console.warn('Contact creation failed, but continuing with email:', audienceError);
      }
    } catch (error) {
      contactError = error;
      console.warn('Contact creation failed, but continuing with email:', error);
    }

    // Send welcome email (always attempt this)
    const { error: emailError } = await resend.emails.send({
      from: 'Healthcare Reframed <noreply@healthcarereframed.org>', // Using your verified domain
      to: [email],
      subject: 'Welcome to Healthcare Reframed',
      headers: {
        'List-Unsubscribe': `mailto:info@healthcarereframed.org?subject=Unsubscribe%20Request&body=Please%20unsubscribe%20${encodeURIComponent(email)}`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
      text: `
Welcome to Healthcare Reframed

${name ? `Hello, ${name}` : 'Hello'}

You are now part of a community transforming healthcare. Expect interviews, insights, and opportunities to create change.

You'll receive:
- New interviews with healthcare innovators
- Healthcare insights and analysis  
- Movement updates and opportunities

Visit our website: ${process.env.NEXT_PUBLIC_APP_URL || 'https://healthcarereframed.org'}

To unsubscribe, reply to this email with "Unsubscribe" in the subject line.

Healthcare Reframed
Reimagining the future of healthcare
      `,
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Healthcare Reframed</title>
          </head>
          <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #ffffff; color: #333333; line-height: 1.6;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
              
              <!-- Header -->
              <div style="border-bottom: 1px solid #e0e0e0; padding-bottom: 20px; margin-bottom: 30px; text-align: center;">
                <h1 style="font-size: 24px; font-weight: bold; margin: 0; color: #2F2C2C;">
                  Healthcare Reframed
                </h1>
                <p style="font-size: 14px; margin: 10px 0 0 0; color: #EC7A5B;">
                  Welcome to the Movement
                </p>
              </div>
              
              <!-- Main Content -->
              <div style="margin-bottom: 30px;">
                ${name ? `<p style="font-size: 16px; margin-bottom: 20px; color: #333333;">Hello ${name},</p>` : '<p style="font-size: 16px; margin-bottom: 20px; color: #333333;">Hello,</p>'}
                
                <p style="font-size: 16px; margin-bottom: 20px; color: #333333;">
                  Thank you for joining our community of healthcare leaders, innovators, and advocates working to transform healthcare.
                </p>
                
                <p style="font-size: 16px; margin-bottom: 20px; color: #333333;">
                  You'll receive updates on:
                </p>
                
                <ul style="font-size: 16px; margin-bottom: 20px; color: #333333; padding-left: 20px;">
                  <li style="margin-bottom: 8px;">New interviews with healthcare innovators</li>
                  <li style="margin-bottom: 8px;">Insights on healthcare transformation</li>
                  <li style="margin-bottom: 8px;">Opportunities to get involved</li>
                </ul>
              </div>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://healthcarereframed.org'}" 
                   style="display: inline-block; background-color: #EC7A5B; color: #ffffff; padding: 12px 24px; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 4px;">
                  Explore Our Content
                </a>
              </div>
              
              <!-- Footer -->
              <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 30px; text-align: center;">
                <p style="font-size: 14px; margin: 0 0 10px 0; color: #666666;">
                  Healthcare Reframed
                </p>
                <p style="font-size: 12px; margin: 0 0 20px 0; color: #999999;">
                  Reimagining the future of healthcare
                </p>
                
                <!-- Unsubscribe -->
                <p style="font-size: 12px; margin: 0; color: #999999;">
                  <a href="mailto:info@healthcarereframed.org?subject=Unsubscribe%20Request&body=Please%20unsubscribe%20${encodeURIComponent(email)}%20from%20your%20mailing%20list." 
                     style="color: #999999; text-decoration: underline;">
                    Unsubscribe
                  </a>
                </p>
              </div>
              
            </div>
          </body>
        </html>
      `,
    });

    if (emailError) {
      console.error('Resend email error:', emailError);
      return NextResponse.json(
        { error: 'Failed to send welcome email. Please try again.' },
        { status: 500 }
      );
    }

    // Return success (even if contact creation failed, email was sent)
    const successMessage = contactError 
      ? 'Successfully subscribed! Check your email for a welcome message. (Note: Contact may need to be manually added to audience)'
      : 'Successfully subscribed! Check your email for a welcome message.';

    return NextResponse.json({ 
      success: true, 
      message: successMessage 
    });

  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}