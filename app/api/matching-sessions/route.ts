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

    // Define challenging scenarios that reveal character
    const scenarios = [
      "A major competitor just launched a product similar to your idea and raised $50M. Discuss how each founder would respond and what this means for the partnership.",
      "You're 3 months into building together and running out of money faster than expected. One founder wants to pivot, the other wants to double down. Navigate this disagreement.",
      "Comment on why Notion succeeded where Evernote struggled. Use this to explore each founder's product philosophy and strategic thinking.",
      "Discuss the recent controversies around OpenAI's leadership changes. What does this reveal about your views on governance, equity, and founder dynamics?",
      "You're both from different cities. One founder insists on SF/remote, the other wants NYC/in-person. Debate the best approach and what you're willing to compromise on.",
      "A friend's startup just failed after 2 years. Dissect what went wrong and what each founder would do differently, revealing risk tolerance and decision-making style.",
      "Debate whether Cyberpunk 2077's launch was a failure of ambition or execution. Use this to explore how each handles setbacks and complex problem-solving.",
      "Your biggest potential customer demands an enterprise feature that would delay your product by 6 months. One founder sees revenue, the other sees distraction. Work through this.",
      "Discuss Airbnb's response to regulatory challenges in different cities. What does this reveal about each founder's approach to legal/ethical gray areas?",
      "You disagree fundamentally on whether to build with the hot new technology (AI/crypto/etc) or proven boring tech. Have an honest debate that reveals technical philosophy.",
      "One founder's spouse is skeptical about them doing a startup again. Discuss work-life balance expectations and what happens when personal life conflicts with company needs.",
      "Your first hire turned out to be a bad fit but is a nice person. One founder wants to fire them quickly, the other wants to coach them longer. Navigate this people decision."
    ];

    // Generate matching sessions with conversation history using AI in parallel
    const sessionPromises = Array.from({ length: numSessions }, (_, i) => {
      // Select a scenario for this session (cycle through scenarios if more sessions than scenarios)
      const scenario = scenarios[i % scenarios.length];
      
      return generateObject({
        model: openai('gpt-4o-mini'),
        schema: matchingSessionSchema,
        prompt: `You are simulating a CHALLENGING and REVEALING conversation between two potential co-founders. This is NOT a polite introduction - this is a deep, somewhat uncomfortable discussion designed to expose their true character, decision-making style, and values.

Founder A Profile:
${body.founderA.description}

Founder B Profile:
${body.founderB.description}

SCENARIO TO EXPLORE:
${scenario}

CRITICAL INSTRUCTIONS:
- Start directly into the challenging scenario - NO pleasantries or basic introductions
- Make the founders DISAGREE on meaningful aspects - reveal their different perspectives
- Push them to defend their positions with specific reasoning and past experiences
- Include moments of tension, vulnerability, or strong opinions
- Have them probe each other's weak spots and uncomfortable truths
- The conversation should reveal: decision-making under pressure, values conflicts, ego/humility balance, risk tolerance, communication style under stress
- Include 8-12 messages alternating between founderA and founderB
- Make responses authentic with real emotions - frustration, excitement, doubt, conviction
- Don't let them agree too easily - make them work through disagreements
- End without necessarily reaching consensus - real partnerships have ongoing tensions

This should feel like a REAL, high-stakes conversation where both founders are evaluating "can I trust this person with my next 5-10 years?" Make it challenging, personal, and revealing of character.`
      }).then(result => ({
        id: `session_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
        scenario: scenario,
        history: result.object.history
      }));
    });

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
  // Return sample challenging matching sessions
  return NextResponse.json({
    matchings: [
      {
        id: `session_sample_1_${Math.random().toString(36).substr(2, 9)}`,
        scenario: "A major competitor just launched a product similar to your idea and raised $50M.",
        history: [
          { role: 'founderA' as const, content: 'So TechGiant just announced their new product. It\'s basically what we planned to build, and they raised $50M. What\'s your honest take?' },
          { role: 'founderB' as const, content: 'I\'m not going to lie - my stomach dropped when I saw the news. But big companies often build the wrong thing. They have money but move slowly. What\'s your reaction?' },
          { role: 'founderA' as const, content: 'I think we need to pivot immediately. Going head-to-head with them is suicide. We should find an adjacent space they\'re not covering.' },
          { role: 'founderB' as const, content: 'Wait - pivot after one competitor announcement? That seems reactive. What if we double down and build faster, better? Use their validation as proof the market exists.' },
          { role: 'founderA' as const, content: 'That\'s incredibly naive. They have 50 million dollars and a brand. We have what, 6 months runway? I\'ve seen startups die this way.' },
          { role: 'founderB' as const, content: 'And I\'ve seen startups pivot themselves to death. Every time something scary happens, they change direction. Look, I get the fear, but we need conviction in our differentiation.' }
        ]
      },
      {
        id: `session_sample_2_${Math.random().toString(36).substr(2, 9)}`,
        scenario: "Your first hire turned out to be a bad fit but is a nice person.",
        history: [
          { role: 'founderA' as const, content: 'We need to talk about Sarah. She\'s been here 3 months and I don\'t think it\'s working. Her code quality is inconsistent and she misses deadlines.' },
          { role: 'founderB' as const, content: 'She\'s trying hard though. And she\'s really nice - great culture fit. Maybe we haven\'t given her enough coaching? It\'s only been 3 months.' },
          { role: 'founderA' as const, content: 'Being nice doesn\'t ship product. At this stage we need people who can hit the ground running. Every week we wait costs us velocity we can\'t afford.' },
          { role: 'founderB' as const, content: 'This feels harsh. What message does it send if we fire someone this quickly? Plus, you interviewed her too - we both made this decision.' },
          { role: 'founderA' as const, content: 'Yes, and I made a mistake. I\'d rather admit it now than drag it out. The kind thing is to let her go find a better fit, not string her along in a role where she\'s struggling.' }
        ]
      }
    ]
  });
}