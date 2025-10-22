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

    // Add to audience/contact list
    // Note: You'll need to create an audience in Resend dashboard first
    const { error } = await resend.contacts.create({
      email: email,
      firstName: name || '',
      // Replace with your actual audience ID from Resend dashboard
      audienceId: process.env.RESEND_AUDIENCE_ID || '',
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again.' },
        { status: 500 }
      );
    }

    // Send welcome email
    await resend.emails.send({
      from: 'Healthcare Reframed <noreply@healthcarereframed.com>', // Replace with your verified domain
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
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 40px 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2F2C2C; font-size: 28px; margin: 0;">Healthcare Reframed</h1>
                <p style="color: #EC7A5B; font-size: 16px; margin: 10px 0 0 0;">Transforming Healthcare Together</p>
              </div>
              
              <div style="margin-bottom: 30px;">
                <h2 style="color: #2F2C2C; font-size: 22px; margin-bottom: 15px;">Welcome${name ? `, ${name}` : ''}!</h2>
                <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
                  Thank you for joining our movement to transform healthcare. You're now part of a community of healthcare leaders, 
                  innovators, and advocates working to create a better system for everyone.
                </p>
                <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
                  You'll receive updates on:
                </p>
                <ul style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                  <li>New interviews with healthcare innovators</li>
                  <li>Insights on healthcare transformation</li>
                  <li>Opportunities to get involved</li>
                  <li>Updates on the movement's progress</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://healthcarereframed.com'}" 
                   style="background-color: #EC7A5B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                  Explore Our Content
                </a>
              </div>
              
              <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
                <p style="color: #999; font-size: 14px; margin: 0;">
                  Healthcare Reframed - Reimagining the future of healthcare
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully subscribed! Check your email for a welcome message.' 
    });

  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}