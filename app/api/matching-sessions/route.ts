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

// Generate mock matching sessions for development
function generateMockMatchingSessions(numSessions: number = 5) {
  const mockConversations = [
    [
      { role: 'founderA' as const, content: 'Hi! I\'m excited to connect. I\'m a technical founder with 8 years of experience in full-stack development, particularly in AI/ML applications. What\'s your background？' },
      { role: 'founderB' as const, content: 'Great to meet you! I\'m a business-focused founder with experience scaling SaaS companies. I\'ve led go-to-market strategies for 3 successful B2B startups. Your AI/ML expertise sounds fascinating - what kind of applications have you built?' },
      { role: 'founderA' as const, content: 'I\'ve built recommendation engines, natural language processing tools, and recently worked on computer vision for healthcare diagnostics. I\'m looking for someone who can help bring these technologies to market effectively. What industries have you focused on?' },
      { role: 'founderB' as const, content: 'I\'ve primarily worked in healthcare and fintech SaaS. Your computer vision work in healthcare particularly interests me - that\'s a space I know well from the business side. What stage are you at with your current projects?' },
      { role: 'founderA' as const, content: 'I have a few prototypes, but I struggle with customer discovery and market validation. I tend to over-engineer solutions. What\'s your approach to early-stage product development?' },
      { role: 'founderB' as const, content: 'That\'s exactly where I can help! I always start with customer interviews and lean validation before any development. I\'ve helped teams pivot early to avoid building the wrong thing. Would you be open to collaborating on validating one of your healthcare projects?' },
      { role: 'founderA' as const, content: 'Absolutely! I think we could complement each other well. What would be your ideal co-founder arrangement in terms of equity and responsibilities?' },
      { role: 'founderB' as const, content: 'I typically look for equal partnership with clear role definitions. I\'d handle business strategy, fundraising, and go-to-market while you focus on product and technology. Does that align with what you\'re looking for?' }
    ],
    [
      { role: 'founderA' as const, content: 'Hello! I\'m building a fintech platform focused on SMB lending. I have the technical foundation but need someone with regulatory and business expertise. What\'s your experience in fintech?' },
      { role: 'founderB' as const, content: 'Perfect timing! I\'ve spent 6 years in fintech compliance and have deep experience with lending regulations, KYC/AML processes, and banking partnerships. What stage is your platform at?' },
      { role: 'founderA' as const, content: 'I have an MVP that can assess creditworthiness using alternative data sources, but I\'m struggling with regulatory compliance and partnership development. What\'s been your biggest challenge in bringing fintech products to market?' },
      { role: 'founderB' as const, content: 'Regulatory approval is always the biggest hurdle, but I\'ve built relationships with key regulators and have a proven compliance framework. I\'ve also established partnerships with 3 major banks. What\'s your competitive advantage in the SMB lending space?' },
      { role: 'founderA' as const, content: 'Our algorithm can approve loans in under 10 minutes using real-time business data - social media, transaction patterns, supplier relationships. Traditional lenders take weeks. But I need help positioning this to banks and regulators.' },
      { role: 'founderB' as const, content: 'That\'s impressive! Speed is crucial in SMB lending. I can help frame this as a risk-reduction tool for banks rather than disruption. I\'ve seen similar positioning work well with regulators. What\'s your fundraising timeline?' },
      { role: 'founderA' as const, content: 'I\'m hoping to raise a Series A in the next 6 months. I have some investor interest but they want to see regulatory progress and banking partnerships first.' },
      { role: 'founderB' as const, content: 'I can definitely help with both. I have strong relationships with fintech VCs and can accelerate the regulatory and partnership processes. This could be a great fit - when can we dive deeper into the specifics?' }
    ],
    [
      { role: 'founderA' as const, content: 'Hi there! I\'m a product designer turned entrepreneur working on a B2B SaaS tool for remote team collaboration. I\'ve got great design and user experience skills but need technical co-founder. What\'s your technical background?' },
      { role: 'founderB' as const, content: 'Nice to meet you! I\'m a senior backend engineer with 10 years of experience building scalable SaaS platforms. I\'ve led technical teams and have deep expertise in cloud architecture and security. What specific collaboration problems are you solving?' },
      { role: 'founderA' as const, content: 'I\'m focusing on async decision-making for distributed teams. Current tools like Slack are great for communication but terrible for structured decision processes. I\'ve validated this with 50+ customer interviews. What draws you to the collaboration space?' },
      { role: 'founderB' as const, content: 'I\'ve experienced this pain firsthand managing remote engineering teams. Decision threads get lost in chat, context is missing, and follow-up is inconsistent. Your structured approach sounds promising. What does your customer validation show as the biggest pain points?' },
      { role: 'founderA' as const, content: 'Teams lose 3-4 hours per week just trying to track down decision contexts and outcomes. They want something more structured than Slack but less formal than project management tools. I have designs and user flows ready.' },
      { role: 'founderB' as const, content: 'That\'s a clear problem with measurable impact. I can build the backend infrastructure to handle real-time collaboration, notifications, and integrations with existing tools. Have you thought about your technical architecture requirements?' },
      { role: 'founderA' as const, content: 'I know we\'ll need real-time sync, robust permissions, and integrations with Slack, Teams, and project management tools. But honestly, the technical architecture is where I need a strong partner.' },
      { role: 'founderB' as const, content: 'That\'s exactly where I can add value. I\'ve built similar real-time collaboration features before. Your customer validation gives me confidence in the market need. What\'s your vision for team structure and growth?' }
    ],
    [
      { role: 'founderA' as const, content: 'Hello! I\'m a former management consultant working on supply chain optimization for e-commerce. I have strong business strategy skills and industry connections but need technical expertise for our ML-driven solution. What\'s your background?' },
      { role: 'founderB' as const, content: 'Great to connect! I\'m a data scientist and ML engineer with 7 years of experience building predictive models for logistics and supply chain companies. Supply chain optimization is fascinating - what specific problems are you tackling?' },
      { role: 'founderA' as const, content: 'E-commerce companies lose 15-20% of revenue to stockouts and overstock situations. I want to build predictive inventory management that factors in seasonality, trends, and external events. I\'ve secured LOIs from 3 mid-size retailers.' },
      { role: 'founderB' as const, content: 'That\'s a massive opportunity! I\'ve built similar models before - demand forecasting is complex but solvable with the right data and algorithms. What data sources are you planning to use beyond historical sales?' },
      { role: 'founderA' as const, content: 'We want to incorporate social media sentiment, weather data, economic indicators, and competitor pricing. The challenge is making it actionable for non-technical retail teams.' },
      { role: 'founderB' as const, content: 'Smart approach! I\'ve worked on similar multi-source prediction models. The key is building intuitive dashboards that translate ML insights into clear business actions. I can handle the technical implementation while you focus on customer success and business development.' },
      { role: 'founderA' as const, content: 'Exactly what I was hoping for! I have strong relationships with potential customers and understand their workflows, but I need someone who can build robust, scalable ML systems. What\'s your experience with real-time data processing?' },
      { role: 'founderB' as const, content: 'I\'ve built real-time ML pipelines that process millions of data points daily. For supply chain, low latency is crucial - inventory decisions can\'t wait hours for batch processing. This sounds like a perfect match of complementary skills.' }
    ],
    [
      { role: 'founderA' as const, content: 'Hi! I\'m a former startup founder (successful exit) looking to build in the climate tech space. I have fundraising experience and business development skills but need technical co-founder for a carbon tracking platform. What\'s your interest in climate tech?' },
      { role: 'founderB' as const, content: 'Climate tech is my passion! I\'m a software engineer with 5 years at cleantech startups, plus a background in environmental science. I\'ve been looking for the right co-founder to build something impactful. What\'s your vision for carbon tracking?' },
      { role: 'founderA' as const, content: 'I want to help SMBs measure and reduce their carbon footprint affordably. Current solutions are enterprise-focused and expensive. I see a huge opportunity in the 50M+ small businesses that need simple, automated carbon accounting.' },
      { role: 'founderB' as const, content: 'Brilliant! I\'ve seen this gap too - most solutions require dedicated sustainability teams that SMBs don\'t have. What\'s your approach to making carbon tracking simple enough for a restaurant or retail store to use?' },
      { role: 'founderA' as const, content: 'Automated data integration with their existing systems - POS, accounting software, utilities. We calculate emissions automatically and provide simple, actionable recommendations. No manual data entry or complex reporting.' },
      { role: 'founderB' as const, content: 'That\'s the right approach! I can build the integrations and emissions calculation engine. I\'ve worked with carbon accounting standards before and understand the technical challenges. Have you validated demand with potential SMB customers?' },
      { role: 'founderA' as const, content: 'I\'ve talked to 40+ small business owners. They want to be sustainable but don\'t know where to start. They\'ll pay $50-200/month for automated tracking plus recommendations. Many mentioned it would help with customer acquisition too.' },
      { role: 'founderB' as const, content: 'Strong validation and clear willingness to pay! The customer acquisition angle is smart - sustainability is becoming a competitive advantage. With your business expertise and my technical background, we could build something really impactful. What\'s your timeline?' }
    ]
  ];

  // Generate the requested number of sessions by cycling through mock conversations
  const matchings = Array.from({ length: numSessions }, (_, i) => {
    const conversationIndex = i % mockConversations.length;
    return {
      id: `session_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
      history: mockConversations[conversationIndex]
    };
  });

  return matchings;
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

    // Check if we're in development environment
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (isDevelopment) {
      console.log('🔧 Development mode: Using mock matching sessions data');
      
      // Add a small delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const matchings = generateMockMatchingSessions(numSessions);
      
      return NextResponse.json({ 
        matchings 
      }, { status: 201 });
    }

    // Production: Use real AI generation
    console.log('🤖 Production mode: Generating real AI matching sessions');
    
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