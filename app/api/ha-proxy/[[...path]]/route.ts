import { NextRequest, NextResponse } from 'next/server';

const HA_URL = 'http://192.168.0.111:8123';
const HA_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJiOGMwMjk2OGJmOTg0OGM0YmJhYTFhMmQzOGI0NmMxYSIsImlhdCI6MTc3MTc4MDAyMywiZXhwIjoyMDg3MTQwMDIzfQ.rug65vKQlnAHWP1lGZ6COHF9_5ahFCN8eIyiF-7ZcgI';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET /api/ha-proxy/states - Get all entity states
export async function GET(request: NextRequest) {
  const path = request.nextUrl.pathname.replace('/api/ha-proxy/', '');
  
  try {
    const response = await fetch(`${HA_URL}/api/${path}`, {
      headers: {
        'Authorization': `Bearer ${HA_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `HA returned ${response.status}` },
        { status: response.status, headers: corsHeaders }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { headers: corsHeaders });
  } catch (error) {
    console.error('HA Proxy Error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to Home Assistant', details: String(error) },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST /api/ha-proxy/services/... - Call HA services
export async function POST(request: NextRequest) {
  const path = request.nextUrl.pathname.replace('/api/ha-proxy/', '');
  const body = await request.json();
  
  try {
    const response = await fetch(`${HA_URL}/api/${path}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HA_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `HA returned ${response.status}` },
        { status: response.status, headers: corsHeaders }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { headers: corsHeaders });
  } catch (error) {
    console.error('HA Proxy Error:', error);
    return NextResponse.json(
      { error: 'Failed to call Home Assistant service', details: String(error) },
      { status: 500, headers: corsHeaders }
    );
  }
}