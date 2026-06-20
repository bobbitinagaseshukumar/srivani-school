import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import AppState from '../../../models/AppState';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function GET() {
  try {
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
    console.error('❌ API GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    
    const body = await req.json();
    
    // Update or insert the state document with key 'main'
    const updatedState = await AppState.findOneAndUpdate(
      { stateKey: 'main' },
      { $set: body },
      { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true }
    );
    
    return NextResponse.json(
      { success: true, data: updatedState },
      { headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error('❌ API POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
