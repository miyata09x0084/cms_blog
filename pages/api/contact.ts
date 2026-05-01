import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import { validate } from '../../lib/validateContact';

type ApiResponse =
  | { ok: true }
  | { ok: false; error: 'method_not_allowed' }
  | { ok: false; error: 'invalid_input'; fields: string[] }
  | { ok: false; error: 'captcha_failed' }
  | { ok: false; error: 'send_failed' }
  | { ok: false; error: 'internal' };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const { TURNSTILE_SECRET_KEY, RESEND_API_KEY, CONTACT_TO_EMAIL } = process.env;
  if (!TURNSTILE_SECRET_KEY || !RESEND_API_KEY || !CONTACT_TO_EMAIL) {
    console.error('[contact] missing env');
    return res.status(500).json({ ok: false, error: 'internal' });
  }

  const { name, email, body, turnstileToken } = (req.body ?? {}) as Record<string, unknown>;

  const fields = validate({ name, email, body, turnstileToken });
  if (fields.length > 0) {
    return res.status(400).json({ ok: false, error: 'invalid_input', fields });
  }

  const ip = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ?? '';
  let captchaPassed = false;
  try {
    const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: TURNSTILE_SECRET_KEY,
        response: String(turnstileToken),
        remoteip: ip,
      }),
      signal: AbortSignal.timeout(5000),
    });
    const json = (await verify.json()) as { success?: boolean };
    captchaPassed = json.success === true;
  } catch (e) {
    console.warn('[contact] turnstile fetch failed', { ip });
    captchaPassed = false;
  }
  if (!captchaPassed) {
    return res.status(400).json({ ok: false, error: 'captcha_failed' });
  }

  const safeName = String(name).replace(/[\r\n]+/g, ' ');
  const safeEmail = String(email);
  const safeBody = String(body);

  try {
    const resend = new Resend(RESEND_API_KEY);
    const result = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: CONTACT_TO_EMAIL,
      replyTo: safeEmail,
      subject: `[ryo-miyata.jp] ${safeName} からのお問い合わせ`,
      text: `From: ${safeName} <${safeEmail}>\n\n${safeBody}`,
    });
    if (result.error) {
      console.error('[contact] resend api error', result.error);
      return res.status(502).json({ ok: false, error: 'send_failed' });
    }
  } catch (e) {
    console.error('[contact] resend failed', e);
    return res.status(502).json({ ok: false, error: 'send_failed' });
  }

  return res.status(200).json({ ok: true });
}
