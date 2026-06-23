import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function POST(req) {
  try {
    const { to, subject, html } = await req.json();
    
    if (!to || !subject || !html) {
      return NextResponse.json({ success: false, error: 'Missing required parameters: to, subject, or html.' }, { status: 400, headers: CORS_HEADERS });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.log('==================================================');
      console.log('🏫 SRI VANI PORTAL SIMULATED EMAIL DELIVERED');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log('-------------------------');
      console.log(html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
      console.log('==================================================');
      
      return NextResponse.json({
        success: true,
        simulated: true,
        message: 'Resend API key missing. Simulated successfully.'
      }, { headers: CORS_HEADERS });
    }

    const resend = new Resend(apiKey);
    resend.emails.send({
      from: 'Sri Vani School <onboarding@resend.dev>',
      to,
      subject,
      html,
    }).catch(err => {
      console.error('❌ Background Resend dispatch error:', err.message);
    });

    return NextResponse.json({ success: true, data: { status: 'dispatched' } }, { headers: CORS_HEADERS });
  } catch (error) {
    console.error('❌ Resend send error:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: CORS_HEADERS });
  }
}
