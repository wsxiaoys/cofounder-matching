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

    // Generate multiple matching sessions with conversation history between founders
    const sessions = [];
    
    // Create 3 sample matching sessions
    for (let i = 0; i < 3; i++) {
      const sessionId = `session_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create realistic conversation history between the founders
      const history = [
        { role: 'founderA' as const, content: `Hi, I saw your profile and think we might be a good match. ${body.founderA.description}` },
        { role: 'founderB' as const, content: `Hello! Thanks for reaching out. ${body.founderB.description} I would love to learn more about your background.` },
        { role: 'founderA' as const, content: "I am looking for a co-founder to help build a new product. I think your background could complement mine well." },
        { role: 'founderB' as const, content: "That sounds interesting! I am definitely open to exploring opportunities. What kind of product are you working on?" },
        { role: 'founderA' as const, content: "I am building an AI-powered platform for small businesses. What is your experience with B2B sales?" },
        { role: 'founderB' as const, content: "I have 5 years of experience in B2B SaaS sales, particularly in the SMB market. I have helped scale companies from seed to Series A." },
        { role: 'founderA' as const, content: "That is exactly what we need! Would you be interested in scheduling a call to discuss further?" },
        { role: 'founderB' as const, content: "Absolutely! I would love to learn more about your vision and see if we might be a good fit. When works for you?" }
      ];
      
      sessions.push({
        id: sessionId,
        history: history
      });
    }

    // Return list of matching sessions
    return NextResponse.json({ 
      matchings: sessions 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating matching session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: Add GET method to retrieve sessions with sample data
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