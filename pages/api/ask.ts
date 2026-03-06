import type { NextApiRequest, NextApiResponse } from 'next';
import { streamText, convertToModelMessages } from 'ai';
import { openai, ASK_RIO_MODEL, ASK_RIO_SYSTEM_PROMPT } from '../../lib/ai-config';

// Simple in-memory rate limiting: 10 queries per IP per hour
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60 * 60 * 1000 });
    return false;
  }

  if (entry.count >= 10) return true;
  entry.count++;
  return false;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket.remoteAddress ||
    'unknown';

  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages are required.' });
  }

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: openai(ASK_RIO_MODEL),
    system: ASK_RIO_SYSTEM_PROMPT,
    messages: modelMessages,
    maxOutputTokens: 150,
  });

  result.pipeUIMessageStreamToResponse(res);
}
