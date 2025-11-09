'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';

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

interface SharedData {
  founderAUrl?: string;
  founderBUrl?: string;
}

export default function SharedMatchingPage() {
  const [matchingData, setMatchingData] = useState<MatchingData | null>(null);
  const [sharedData, setSharedData] = useState<SharedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const loadSharedData = async () => {
      try {
        const shareId = params.id as string;
        console.log('🔗 Loading shared conversation data for ID:', shareId);
        
        // Fetch shared data from API
        const shareResponse = await fetch(`/api/share/${shareId}`);
        console.log('📡 Share response status:', shareResponse.status);
        
        if (!shareResponse.ok) {
          if (shareResponse.status === 404) {
            throw new Error('Shared data not found');
          }
          throw new Error('Failed to load shared data');
        }

        const sharedDataResult = await shareResponse.json();
        console.log('📦 Shared data loaded:', sharedDataResult);
        
        // Extract conversation data and founder URLs
        const { matchingData, founderAUrl, founderBUrl } = sharedDataResult;
        
        if (!matchingData || !matchingData.matchings) {
          throw new Error('Invalid shared data format');
        }

        // Set the data directly (no need to regenerate conversations)
        setMatchingData(matchingData);
        setSharedData({
          founderAUrl,
          founderBUrl
        } as SharedData);

        console.log('✅ Conversation data loaded directly from storage:', {
          sessionsCount: matchingData.matchings.length,
          founderAUrl,
          founderBUrl
        });

      } catch (error) {
        console.error('❌ Error loading shared conversation data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load shared data');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      loadSharedData();
    }
  }, [params.id]);

  const handleBackToHome = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-700 dark:text-gray-300">Loading shared matching data...</div>
        </div>
      </div>
    );
  }

  if (error || !matchingData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center max-w-md px-6">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {error || 'Data Not Found'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The shared matching data could not be loaded. It may have expired or the link is invalid.
          </p>
          <button
            onClick={handleBackToHome}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src="/icon.png"
                alt="Co-founder Matching Logo"
                width={48}
                height={48}
                className="rounded-lg shadow-md mr-4"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Shared Co-founder Matching Results
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Found {matchingData.matchings.length} matching sessions
                </p>
              </div>
            </div>
            <button
              onClick={handleBackToHome}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              ← Back to Home
            </button>
          </div>
          
          {sharedData && (sharedData.founderAUrl || sharedData.founderBUrl) && (
            <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {sharedData.founderAUrl && <div><strong>Founder A:</strong> {sharedData.founderAUrl}</div>}
                {sharedData.founderBUrl && <div><strong>Founder B:</strong> {sharedData.founderBUrl}</div>}
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

// Chat Window Component - Same as in the original matching page
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
