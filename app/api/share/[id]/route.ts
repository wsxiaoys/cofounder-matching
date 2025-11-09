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

    // If data doesn't exist, return 404
    if (!data) {
      return NextResponse.json(
        { error: 'Data not found' },
        { status: 404 }
      );
    }

    // Parse and return the stored JSON
    const parsedData = JSON.parse(data);
    return NextResponse.json(parsedData, { status: 200 });
  } catch (error) {
    console.error('Error retrieving data:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve data' },
      { status: 500 }
    );
  }
}
