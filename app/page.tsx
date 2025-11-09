'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [founderAUrl, setFounderAUrl] = useState('');
  const [founderBUrl, setFounderBUrl] = useState('');
  const router = useRouter();

  const handleNext = () => {
    if (founderAUrl.trim() && founderBUrl.trim()) {
      // 将URL作为查询参数传递到下一页
      const searchParams = new URLSearchParams({
        founderA: founderAUrl,
        founderB: founderBUrl
      });
      router.push(`/matching?${searchParams.toString()}`);
    } else {
      alert('Please enter both LinkedIn URLs');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="w-full max-w-md px-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Co-founder Matching
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Enter two LinkedIn profile URLs to start matching
            </p>
          </div>

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
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
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
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              />
            </div>

            <button
              onClick={handleNext}
              disabled={!founderAUrl.trim() || !founderBUrl.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Next →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
