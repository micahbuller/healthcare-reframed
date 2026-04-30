import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is not set');
  }
  return new Resend(apiKey);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message, honeypot } = body;

    // Honeypot bot check
    if (honeypot) {
      return NextResponse.json({ success: true });
    }

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const safeName = name.trim().slice(0, 200);
    const safeEmail = email.trim().slice(0, 200);
    const safeSubject = (subject || 'Contact Form Submission').toString().trim().slice(0, 200);
    const safeMessage = message.trim().slice(0, 5000);

    const resend = getResendClient();

    await resend.emails.send({
      from: 'Healthcare Reframed <noreply@healthcarereframed.org>',
      to: 'info@healthcarereframed.org',
      replyTo: safeEmail,
      subject: `[Contact] ${safeSubject}`,
      text: `Name: ${safeName}\nEmail: ${safeEmail}\n\n${safeMessage}`,
      html: `<p><strong>From:</strong> ${safeName} &lt;${safeEmail}&gt;</p><p><strong>Subject:</strong> ${safeSubject}</p><hr/><p>${safeMessage.replace(/\n/g, '<br/>')}</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
