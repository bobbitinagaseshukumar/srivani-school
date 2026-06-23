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
      console.log('--------------------------------------------------');
      console.log('⚠️ SIMULATED EMAIL DELIVERED (RESEND_API_KEY missing)');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`HTML: ${html}`);
      console.log('--------------------------------------------------');
      
      return NextResponse.json({
        success: true,
        simulated: true,
        message: 'Resend API key missing. Email simulated successfully.'
      }, { headers: CORS_HEADERS });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Sri Vani School <onboarding@resend.dev>',
        to,
        subject,
        html,
      }),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to send email via Resend');
    }

    return NextResponse.json({ success: true, data: json }, { headers: CORS_HEADERS });
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: CORS_HEADERS });
  }
}
