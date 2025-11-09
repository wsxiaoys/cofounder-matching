# Co-founder Matching Demo

This is a [Next.js](https://nextjs.org) application that matches co-founders based on their LinkedIn profiles and generates simulated conversation scenarios using AI.

## Features

- **LinkedIn Profile Analysis**: Input LinkedIn URLs to extract professional information
- **AI-Powered Matching**: Generate realistic conversation scenarios between potential co-founders
- **Interactive Chat Windows**: View multiple matching sessions in an organized grid layout
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices

## Prerequisites

Before running this application, you'll need to set up the following API keys:

### Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# RapidAPI Key for LinkedIn Profile Scraper
# Get your key from: https://rapidapi.com/fresh-linkedin-profile-data-linkedin-profile-data/api/fresh-linkedin-scraper-api
RAPIDAPI_KEY=your_rapidapi_key_here

# OpenAI API Key for generating matching conversations
# Get your key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=your_openai_api_key_here
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables (see Prerequisites above)

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to Use

1. **Enter LinkedIn URLs**: On the home page, input two LinkedIn profile URLs (one for each potential co-founder)
2. **Generate Matches**: Click "Generate Matches" to analyze the profiles and create conversation scenarios
3. **View Results**: Browse through multiple AI-generated conversation windows showing how the co-founders might interact
4. **Explore Different Scenarios**: Each session shows a unique conversation flow based on the founders' backgrounds

## API Endpoints

- `POST /api/linkedin` - Scrapes LinkedIn profile data
- `POST /api/matching-sessions` - Generates AI-powered conversation scenarios

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS
- **AI Integration**: OpenAI GPT-4o-mini for conversation generation
- **LinkedIn Scraping**: RapidAPI Fresh LinkedIn Scraper
- **Language**: TypeScript

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
