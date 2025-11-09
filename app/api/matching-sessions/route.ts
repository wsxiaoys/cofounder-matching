import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

// Define the type for founder persona
interface FounderPersona {
  description: string;
}

// Define the type for the request body
interface MatchingSessionRequest {
  founderA: FounderPersona;
  founderB: FounderPersona;
  num?: number; // Number of matching sessions to generate (default: 3)
}

// Define the schema for a conversation message
const messageSchema = z.object({
  role: z.enum(['founderA', 'founderB']),
  content: z.string().describe('The message content from this founder')
});

// Define the schema for a single matching session
const matchingSessionSchema = z.object({
  history: z.array(messageSchema).describe('Conversation history between the two founders, alternating between founderA and founderB, 6-10 messages total')
});

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

    // Get number of sessions to generate (default to 3)
    const numSessions = body.num && body.num > 0 ? body.num : 3;

    // Generate matching sessions with conversation history using AI in parallel
    const sessionPromises = Array.from({ length: numSessions }, (_, i) => 
      generateObject({
        model: openai('gpt-4o-mini'),
        schema: matchingSessionSchema,
        prompt: `You are a co-founder matching assistant. Generate a realistic conversation scenario between two founders who are exploring a potential co-founder partnership.

Founder A Profile:
${body.founderA.description}

Founder B Profile:
${body.founderB.description}

Create a natural conversation where:
- The founders introduce themselves and their backgrounds
- They explore potential synergies and complementary skills
- They discuss their goals, experience, and what they're looking for in a co-founder
- The conversation feels authentic and progresses naturally
- The conversation should have 6-10 messages alternating between founderA and founderB
- Explore different aspects of the potential partnership (e.g., technical fit, vision alignment, work style compatibility)

Make the conversation feel realistic, professional, and exploratory - they should be getting to know each other and evaluating fit.`
      }).then(result => ({
        id: `session_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
        history: result.object.history
      }))
    );

    // Wait for all sessions to be generated in parallel
    const matchings = await Promise.all(sessionPromises);

    // Return list of matching sessions
    return NextResponse.json({ 
      matchings 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating matching session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: Add GET method to retrieve sample sessions
export async function GET() {
  // Return sample matching sessions with conversation history
  return NextResponse.json({
    matchings: [
      {
        id: `session_sample_1_${Math.random().toString(36).substr(2, 9)}`,
        history: [
          { role: 'founderA' as const, content: 'Hi, I am a technical founder looking for a business partner.' },
          { role: 'founderB' as const, content: 'Hello! I am a business-focused founder with experience in SaaS. Tell me about your technical background.' },
          { role: 'founderA' as const, content: 'I have 8 years in full-stack development, specializing in AI/ML applications.' },
          { role: 'founderB' as const, content: 'Perfect! I have experience bringing AI products to market. Let us discuss potential opportunities.' }
        ]
      },
      {
        id: `session_sample_2_${Math.random().toString(36).substr(2, 9)}`,
        history: [
          { role: 'founderA' as const, content: 'I am building a fintech platform and need a co-founder with regulatory experience.' },
          { role: 'founderB' as const, content: 'Interesting! I have experience in fintech compliance and banking partnerships.' },
          { role: 'founderA' as const, content: 'Great! Can you share your experience with regulatory frameworks?' },
          { role: 'founderB' as const, content: 'I have worked on PCI compliance, KYC/AML processes, and have banking partnerships in place.' },
          { role: 'founderA' as const, content: 'This sounds like a great match! When can we schedule a call?' }
        ]
      }
    ]
  });
}