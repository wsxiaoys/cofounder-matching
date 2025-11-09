import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Retrieve the data from Upstash KV using the UUID key
    const data = await redis.get<string>(`share:${id}`);

    // Debug: Print the raw data
    console.log('🔍 Raw data from Redis:');
    console.log('Type:', typeof data);
    console.log('Value:', data);
    console.log('JSON stringified:', JSON.stringify(data));

    // If data doesn't exist, return 404
    if (!data) {
      return NextResponse.json(
        { error: 'Data not found' },
        { status: 404 }
      );
    }

    // Check if data is already an object (not a string)
    let parsedData;
    if (typeof data === 'string') {
      console.log('📄 Data is string, parsing JSON...');
      parsedData = JSON.parse(data);
    } else {
      console.log('📦 Data is already an object, using directly...');
      parsedData = data;
    }

    console.log('✅ Final parsed data:', parsedData);
    return NextResponse.json(parsedData, { status: 200 });
  } catch (error) {
    console.error('Error retrieving data:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve data' },
      { status: 500 }
    );
  }
}
