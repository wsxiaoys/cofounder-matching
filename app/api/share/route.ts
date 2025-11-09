import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body from the request
    const data = await request.json();

    // Generate a UUID for the key
    const id = uuidv4();

    // Store the data in Upstash KV with the UUID as the key
    await redis.set(`share:${id}`, JSON.stringify(data));

    // Return the generated ID
    return NextResponse.json(
      { 
        id,
        url: `/api/share/${id}`
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error storing data:', error);
    return NextResponse.json(
      { error: 'Failed to store data' },
      { status: 500 }
    );
  }
}
