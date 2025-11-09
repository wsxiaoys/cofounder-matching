'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

export default function MatchingPage() {
  const [matchingData, setMatchingData] = useState<MatchingData | null>(null);
  const [founderAUrl, setFounderAUrl] = useState<string>('');
  const [founderBUrl, setFounderBUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get data from sessionStorage
    try {
      const storedMatchingData = sessionStorage.getItem('matchingData');
      const storedFounderAUrl = sessionStorage.getItem('founderAUrl');
      const storedFounderBUrl = sessionStorage.getItem('founderBUrl');

      if (!storedMatchingData) {
        // If no data available, redirect back to home
        router.push('/');
        return;
      }

      const parsedData = JSON.parse(storedMatchingData);
      setMatchingData(parsedData);
      setFounderAUrl(storedFounderAUrl || '');
      setFounderBUrl(storedFounderBUrl || '');
    } catch (error) {
      console.error('Error loading matching data:', error);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleBackClick = () => {
    // Clear sessionStorage when going back
    sessionStorage.removeItem('matchingData');
    sessionStorage.removeItem('founderAUrl');
    sessionStorage.removeItem('founderBUrl');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!matchingData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-lg mb-4">No matching data found</div>
          <button
            onClick={handleBackClick}
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
                  Co-founder Matching Results
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Found {matchingData.matchings.length} matching sessions
                </p>
              </div>
            </div>
            <button
              onClick={handleBackClick}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              ← Back
            </button>
          </div>
          
          {(founderAUrl || founderBUrl) && (
            <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {founderAUrl && <div><strong>Founder A:</strong> {founderAUrl}</div>}
                {founderBUrl && <div><strong>Founder B:</strong> {founderBUrl}</div>}
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
