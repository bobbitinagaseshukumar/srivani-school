import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import AppState from '../../../models/AppState';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const FALLBACK_RENDER_URL = 'https://srivani-school-pedda-kottala.onrender.com/api/data';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined.');
    }
    
    await connectDB();
    
    // Find the state document (key: 'main')
    let state = await AppState.findOne({ stateKey: 'main' });
    
    if (!state) {
      console.log('ℹ️ No existing AppState document found in MongoDB. Client should initialize it.');
      return NextResponse.json(
        { success: true, data: null },
        { headers: CORS_HEADERS }
      );
    }
    
    return NextResponse.json(
      { success: true, data: state },
      { headers: CORS_HEADERS }
    );
  } catch (error) {
    console.warn('⚠️ API GET failed, attempting Render proxy fallback:', error.message);
    try {
      const proxyRes = await fetch(FALLBACK_RENDER_URL);
      const json = await proxyRes.json();
      return NextResponse.json(json, { headers: CORS_HEADERS });
    } catch (proxyError) {
      console.error('❌ Render proxy fallback also failed:', proxyError);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500, headers: CORS_HEADERS }
      );
    }
  }
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined.');
    }
    
    await connectDB();
    
    // Update or insert the state document with key 'main'
    // Strip internal MongoDB fields to prevent immutable field errors
    const { _id, __v, createdAt, updatedAt, ...cleanBody } = body;
    const updatedState = await AppState.findOneAndUpdate(
      { stateKey: 'main' },
      { $set: cleanBody },
      { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true }
    );
    
    return NextResponse.json(
      { success: true, data: updatedState },
      { headers: CORS_HEADERS }
    );
  } catch (error) {
    console.warn('⚠️ API POST failed, attempting Render proxy fallback:', error.message);
    try {
      const proxyRes = await fetch(FALLBACK_RENDER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const json = await proxyRes.json();
      return NextResponse.json(json, { headers: CORS_HEADERS });
    } catch (proxyError) {
      console.error('❌ Render proxy fallback also failed:', proxyError);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500, headers: CORS_HEADERS }
      );
    }
  }
}
