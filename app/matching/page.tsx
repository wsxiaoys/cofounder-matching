'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Message {
  role: 'founderA' | 'founderB';
  content: string;
}

interface MatchingSession {
  id: string;
  history: Message[];
}

interface MatchingData {
  matchings: MatchingSession[];
}

// 示例数据 - 在实际应用中，这可能来自API
const sampleData: MatchingData = {
  "matchings": [
    {
      "id": "session_1762664964097_0_vgvw893yf",
      "history": [
        {
          "role": "founderA",
          "content": "Hi, I saw your profile and think we might be a good match. Technical co-founder with 5 years experience in AI/ML"
        },
        {
          "role": "founderB",
          "content": "Hello! Thanks for reaching out. Business co-founder with experience in B2B SaaS sales I would love to learn more about your background."
        },
        {
          "role": "founderA",
          "content": "I am looking for a co-founder to help build a new product. I think your background could complement mine well."
        },
        {
          "role": "founderB",
          "content": "That sounds interesting! I am definitely open to exploring opportunities. What kind of product are you working on?"
        },
        {
          "role": "founderA",
          "content": "I am building an AI-powered platform for small businesses. What is your experience with B2B sales?"
        },
        {
          "role": "founderB",
          "content": "I have 5 years of experience in B2B SaaS sales, particularly in the SMB market. I have helped scale companies from seed to Series A."
        },
        {
          "role": "founderA",
          "content": "That is exactly what we need! Would you be interested in scheduling a call to discuss further?"
        },
        {
          "role": "founderB",
          "content": "Absolutely! I would love to learn more about your vision and see if we might be a good fit. When works for you?"
        }
      ]
    },
    {
      "id": "session_1762664964097_1_6iqt6stt9",
      "history": [
        {
          "role": "founderA",
          "content": "Hi, I saw your profile and think we might be a good match. Technical co-founder with 5 years experience in AI/ML"
        },
        {
          "role": "founderB",
          "content": "Hello! Thanks for reaching out. Business co-founder with experience in B2B SaaS sales I would love to learn more about your background."
        },
        {
          "role": "founderA",
          "content": "I am looking for a co-founder to help build a new product. I think your background could complement mine well."
        },
        {
          "role": "founderB",
          "content": "That sounds interesting! I am definitely open to exploring opportunities. What kind of product are you working on?"
        },
        {
          "role": "founderA",
          "content": "I am building an AI-powered platform for small businesses. What is your experience with B2B sales?"
        },
        {
          "role": "founderB",
          "content": "I have 5 years of experience in B2B SaaS sales, particularly in the SMB market. I have helped scale companies from seed to Series A."
        },
        {
          "role": "founderA",
          "content": "That is exactly what we need! Would you be interested in scheduling a call to discuss further?"
        },
        {
          "role": "founderB",
          "content": "Absolutely! I would love to learn more about your vision and see if we might be a good fit. When works for you?"
        }
      ]
    },
    {
      "id": "session_1762664964097_2_ddbg3bw0z",
      "history": [
        {
          "role": "founderA",
          "content": "Hi, I saw your profile and think we might be a good match. Technical co-founder with 5 years experience in AI/ML"
        },
        {
          "role": "founderB",
          "content": "Hello! Thanks for reaching out. Business co-founder with experience in B2B SaaS sales I would love to learn more about your background."
        },
        {
          "role": "founderA",
          "content": "I am looking for a co-founder to help build a new product. I think your background could complement mine well."
        },
        {
          "role": "founderB",
          "content": "That sounds interesting! I am definitely open to exploring opportunities. What kind of product are you working on?"
        },
        {
          "role": "founderA",
          "content": "I am building an AI-powered platform for small businesses. What is your experience with B2B sales?"
        },
        {
          "role": "founderB",
          "content": "I have 5 years of experience in B2B SaaS sales, particularly in the SMB market. I have helped scale companies from seed to Series A."
        },
        {
          "role": "founderA",
          "content": "That is exactly what we need! Would you be interested in scheduling a call to discuss further?"
        },
        {
          "role": "founderB",
          "content": "Absolutely! I would love to learn more about your vision and see if we might be a good fit. When works for you?"
        }
      ]
    }
  ]
};

export default function MatchingPage() {
  const searchParams = useSearchParams();
  const [matchingData, setMatchingData] = useState<MatchingData | null>(null);
  
  const founderAUrl = searchParams.get('founderA');
  const founderBUrl = searchParams.get('founderB');

  useEffect(() => {
    // 在实际应用中，这里可能会调用API获取匹配数据
    // 现在我们使用示例数据
    setMatchingData(sampleData);
  }, []);

  if (!matchingData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Co-founder Matching Results
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Found {matchingData.matchings.length} matching sessions
              </p>
            </div>
            <Link 
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              ← Back
            </Link>
          </div>
          
          {founderAUrl && founderBUrl && (
            <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <div><strong>Founder A:</strong> {founderAUrl}</div>
                <div><strong>Founder B:</strong> {founderBUrl}</div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {matchingData.matchings.map((session, index) => (
            <ChatWindow 
              key={session.id} 
              session={session} 
              sessionNumber={index + 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Chat Window Component
function ChatWindow({ session, sessionNumber }: { session: MatchingSession; sessionNumber: number }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg h-96 flex flex-col">
      {/* Chat Header */}
      <div className="bg-blue-600 text-white p-3 rounded-t-lg">
        <h3 className="font-semibold text-sm">Session #{sessionNumber}</h3>
        <p className="text-xs text-blue-100">{session.id}</p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {session.history.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'founderA' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] p-2 rounded-lg text-sm ${
                message.role === 'founderA'
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  : 'bg-blue-500 text-white'
              }`}
            >
              <div className="text-xs font-semibold mb-1">
                {message.role === 'founderA' ? 'Founder A' : 'Founder B'}
              </div>
              <div>{message.content}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Footer */}
      <div className="p-2 border-t dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          {session.history.length} messages
        </div>
      </div>
    </div>
  );
}
