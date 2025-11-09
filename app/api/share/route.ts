import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body from the request
    const data = await request.json();

    // Debug: Print what we're storing
    console.log('💾 Storing data in Redis:');
    console.log('Type:', typeof data);
    console.log('Value:', data);
    console.log('JSON stringified:', JSON.stringify(data));

    // Generate a UUID for the key
    const id = uuidv4();

    // Store the data in Upstash KV with the UUID as the key
    const stringifiedData = JSON.stringify(data);
    console.log('📝 Stringified data to store:', stringifiedData);
    
    await redis.set(`share:${id}`, stringifiedData);
    console.log('✅ Data stored successfully with key:', `share:${id}`);

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
