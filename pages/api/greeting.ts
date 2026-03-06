import type { NextApiRequest, NextApiResponse } from 'next';
import { generateText } from 'ai';
import { openai, GREETING_MODEL } from '../../lib/ai-config';

const cache = new Map<string, { messages: string[]; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

const DEFAULT_MESSAGES = [
  'Welcome to my website!',
  'Feel free to look around.',
  'Thanks for stopping by!',
];

function getTimeOfDay(hour: number): string {
  if (hour < 6) return 'late night';
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  if (hour < 22) return 'evening';
  return 'late night';
}

function getReferrerSource(referrer?: string): string {
  if (!referrer) return 'direct';
  if (referrer.includes('github')) return 'GitHub';
  if (referrer.includes('linkedin')) return 'LinkedIn';
  return 'other';
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { hour = new Date().getHours(), referrer, isReturning } = req.body;

  const timeOfDay = getTimeOfDay(hour);
  const referrerSource = getReferrerSource(referrer);
  const cacheKey = `${timeOfDay}-${referrerSource}-${!!isReturning}`;

  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return res.status(200).json({ messages: cached.messages });
  }

  try {
    const { text } = await generateText({
      model: openai(GREETING_MODEL),
      prompt: `Generate exactly 3 short greeting messages for a personal website visitor.

Context:
- Time of day: ${timeOfDay} (visitor's local time: ${hour}:00)
- Visitor came from: ${referrerSource}
- Returning visitor: ${isReturning ? 'yes' : 'no'}

Rules:
- Each message must be under 50 characters
- Natural, warm, and slightly witty tone
- Adapt to time of day and context
- If from GitHub, subtly reference coding/projects
- If from LinkedIn, reference professional work
- If returning, acknowledge their return
- English only

Return ONLY a valid JSON array of 3 strings. No other text.
Example: ["Good morning! Coffee's brewing.", "Let's build something cool.", "Welcome — take your time."]`,
      maxOutputTokens: 150,
    });

    const messages = JSON.parse(text.trim());

    if (Array.isArray(messages) && messages.every((m: unknown) => typeof m === 'string')) {
      cache.set(cacheKey, { messages, timestamp: Date.now() });
      return res.status(200).json({ messages });
    }

    return res.status(200).json({ messages: DEFAULT_MESSAGES });
  } catch {
    return res.status(200).json({ messages: DEFAULT_MESSAGES });
  }
}
