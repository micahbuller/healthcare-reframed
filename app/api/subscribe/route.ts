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
      from: 'Healthcare Reframed <onboarding@resend.dev>', // Using Resend's default domain
      to: [email],
      subject: 'Welcome to Healthcare Reframed!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Healthcare Reframed</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Courier New', monospace; background-color: #FFFBF7; color: #2F2C2C;">
            <div style="max-width: 500px; margin: 60px auto; padding: 0 20px;">
              
              <!-- Header - USAL Style -->
              <div style="border-bottom: 2px solid #2F2C2C; padding-bottom: 40px; margin-bottom: 60px;">
                <h1 style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; letter-spacing: 4px; text-transform: uppercase; margin: 0; color: #2F2C2C;">
                  HEALTHCARE REFRAMED
                </h1>
                <p style="font-family: 'Courier New', monospace; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin: 20px 0 0 0; color: #EC7A5B;">
                  WELCOME TO THE MOVEMENT
                </p>
              </div>
              
              <!-- Main Content - Minimal -->
              <div style="margin-bottom: 60px;">
                ${name ? `<p style="font-family: 'Courier New', monospace; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 30px; color: #2F2C2C;">HELLO, ${name.toUpperCase()}</p>` : ''}
                
                <p style="font-family: 'Courier New', monospace; font-size: 14px; line-height: 1.8; margin-bottom: 30px; color: #2F2C2C;">
                  YOU ARE NOW PART OF A COMMUNITY TRANSFORMING HEALTHCARE. 
                  EXPECT INTERVIEWS, INSIGHTS, AND OPPORTUNITIES TO CREATE CHANGE.
                </p>
                
                <div style="border: 2px solid #EC7A5B; padding: 30px; margin: 40px 0;">
                  <p style="font-family: 'Courier New', monospace; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; margin: 0; color: #2F2C2C; text-align: center;">
                    NEW INTERVIEWS · HEALTHCARE INSIGHTS · MOVEMENT UPDATES
                  </p>
                </div>
              </div>
              
              <!-- CTA Button - Angular -->
              <div style="text-align: center; margin: 60px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://healthcarereframed.org'}" 
                   style="display: inline-block; background-color: #2F2C2C; color: #FFFBF7; padding: 15px 30px; text-decoration: none; font-family: 'Courier New', monospace; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; border: 2px solid #2F2C2C; transition: all 0.3s;">
                  EXPLORE CONTENT
                </a>
              </div>
              
              <!-- Footer - Minimal -->
              <div style="border-top: 2px solid #2F2C2C; padding-top: 40px; margin-top: 60px; text-align: center;">
                <p style="font-family: 'Courier New', monospace; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 20px 0; color: #2F2C2C;">
                  HEALTHCARE REFRAMED
                </p>
                <p style="font-family: 'Courier New', monospace; font-size: 9px; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 20px 0; color: #666;">
                  REIMAGINING THE FUTURE OF HEALTHCARE
                </p>
                
                <!-- Unsubscribe Link -->
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                  <a href="mailto:info@healthcarereframed.org?subject=Unsubscribe%20Request&body=Please%20unsubscribe%20${encodeURIComponent(email)}%20from%20your%20mailing%20list." 
                     style="font-family: 'Courier New', monospace; font-size: 9px; letter-spacing: 1px; text-transform: uppercase; color: #999; text-decoration: none;">
                    UNSUBSCRIBE
                  </a>
                </div>
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