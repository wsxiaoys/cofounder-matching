import { NextRequest, NextResponse } from 'next/server';
import { scrapeLinkedInProfile } from '@/lib/scraper';

function extractLinkedInUsername(input: string): string | null {
  // Remove leading/trailing whitespace
  input = input.trim();
  
  // Regex to match various LinkedIn URL formats
  // Matches: https://www.linkedin.com/in/username/, https://linkedin.com/in/username, linkedin.com/in/username, etc.
  const urlRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)\/?/i;
  const match = input.match(urlRegex);
  
  if (match && match[1]) {
    return match[1];
  }
  
  // If no URL pattern matched, assume it's already a username (alphanumeric, dashes, underscores)
  if (/^[a-zA-Z0-9_-]+$/.test(input)) {
    return input;
  }
  
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username: input } = body;

    if (!input) {
      return NextResponse.json(
        { error: 'LinkedIn URL or username is required' },
        { status: 400 }
      );
    }

    const username = extractLinkedInUsername(input);

    if (!username) {
      return NextResponse.json(
        { error: 'Invalid LinkedIn URL or username format' },
        { status: 400 }
      );
    }

    const profileData = await scrapeLinkedInProfile(username);

    return NextResponse.json(profileData);
  } catch (error) {
    console.error('Error scraping LinkedIn profile:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to scrape LinkedIn profile',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}