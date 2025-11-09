'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


export default function Home() {
  const [founderAUrl, setFounderAUrl] = useState('');
  const [founderBUrl, setFounderBUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleNext = async () => {
    if (!founderAUrl.trim() || !founderBUrl.trim()) {
      alert('Please enter both LinkedIn URLs');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Get LinkedIn profiles for both founders
      console.log('Fetching LinkedIn profiles...');
      
      const [founderAResponse, founderBResponse] = await Promise.all([
        fetch('/api/linkedin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: founderAUrl })
        }),
        fetch('/api/linkedin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: founderBUrl })
        })
      ]);

      if (!founderAResponse.ok || !founderBResponse.ok) {
        throw new Error('Failed to fetch LinkedIn profiles');
      }

      const founderAData = await founderAResponse.json();
      const founderBData = await founderBResponse.json();

      // Step 2: Convert raw LinkedIn data to string descriptions
      const founderADescription = JSON.stringify(founderAData);
      const founderBDescription = JSON.stringify(founderBData);

      console.log('LinkedIn raw data converted to descriptions:', { 
        founderALength: founderADescription.length, 
        founderBLength: founderBDescription.length 
      });

      // Step 3: Call matching-sessions API
      const matchingResponse = await fetch('/api/matching-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          founderA: { description: founderADescription },
          founderB: { description: founderBDescription },
          num: 5 // Generate 5 sessions
        })
      });

      if (!matchingResponse.ok) {
        throw new Error('Failed to generate matching sessions');
      }

      const matchingData = await matchingResponse.json();
      
      // Step 4: Navigate to results page with the data
      // Store data in sessionStorage to pass to next page
      sessionStorage.setItem('matchingData', JSON.stringify(matchingData));
      sessionStorage.setItem('founderAUrl', founderAUrl);
      sessionStorage.setItem('founderBUrl', founderBUrl);
      
      router.push('/matching');

    } catch (error) {
      console.error('Error processing founders:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="w-full max-w-md px-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image
                src="/icon.png"
                alt="Co-founder Matching Logo"
                width={64}
                height={64}
                className="rounded-lg shadow-md"
                priority
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Co-founder Matching
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Enter two LinkedIn profile URLs to start matching
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="founderA" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Founder A's LinkedIn URL
              </label>
              <input
                id="founderA"
                type="url"
                value={founderAUrl}
                onChange={(e) => setFounderAUrl(e.target.value)}
                placeholder="https://linkedin.com/in/founder-a"
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="founderB" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Founder B's LinkedIn URL
              </label>
              <input
                id="founderB"
                type="url"
                value={founderBUrl}
                onChange={(e) => setFounderBUrl(e.target.value)}
                placeholder="https://linkedin.com/in/founder-b"
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <button
              onClick={handleNext}
              disabled={!founderAUrl.trim() || !founderBUrl.trim() || isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Generate Matches →'
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

