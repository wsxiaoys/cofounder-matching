import { NextRequest, NextResponse } from 'next/server';

// Define the type for founder persona
interface FounderPersona {
  description: string;
}

// Define the type for the request body
interface MatchingSessionRequest {
  founderA: FounderPersona;
  founderB: FounderPersona;
}

// Define the type for the response
interface MatchingSessionResponse {
  id: string;
  history: Array<{
    role: 'assistant' | 'user';
    content: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body from the request
    const body: MatchingSessionRequest = await request.json();

    // Validate the request body
    if (!body.founderA || !body.founderB) {
      return NextResponse.json(
        { error: 'Both founderA and founderB are required' },
        { status: 400 }
      );
    }

    if (!body.founderA.description || !body.founderB.description) {
      return NextResponse.json(
        { error: 'Descriptions are required for both founders' },
        { status: 400 }
      );
    }
    // Generate a unique session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create sample conversation history for the matching session
    const sampleHistory = [
      { role: 'assistant' as const, content: 'I\'ve analyzed both founder profiles. Let me help facilitate this introduction.' },
      { role: 'user' as const, content: 'Tell me about the potential match between these two founders.' },
      { role: 'assistant' as const, content: `Based on the descriptions, I see a complementary partnership opportunity. Founder A (${body.founderA.description}) and Founder B (${body.founderB.description}) appear to have different but potentially compatible skill sets.` }
    ];

    // Create the matching session response
    const matchingSession: MatchingSessionResponse = {
      id: sessionId,
      history: sampleHistory
    };

    // Here you could add logic to:
    // 1. Calculate compatibility score based on persona descriptions
    // 2. Store the session in a database
    // 3. Send notifications, etc.

    // Return a list of matching sessions (for now, just the current one)
    return NextResponse.json({ 
      matchings: [matchingSession] 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating matching session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: Add GET method to retrieve sessions
export async function GET() {
  // This would typically fetch from a database
  // For now, return an empty array or sample data
  return NextResponse.json({
    sessions: [],
    message: 'Matching sessions endpoint is working'
  });
}