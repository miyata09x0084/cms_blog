/**
 * @jest-environment node
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '../contact';

const mockSend = jest.fn();
jest.mock('resend', () => ({
  Resend: jest.fn(() => ({
    emails: { send: (...args: unknown[]) => mockSend(...args) },
  })),
}));

function makeReq(overrides: Partial<NextApiRequest> = {}): NextApiRequest {
  return {
    method: 'POST',
    body: {
      name: 'Ryo',
      email: 'ryo@example.com',
      body: 'これは10文字以上の本文。',
      turnstileToken: 'tk-1',
    },
    headers: { 'x-forwarded-for': '203.0.113.5' },
    ...overrides,
  } as unknown as NextApiRequest;
}

function makeRes(): NextApiResponse & { _status: number; _body: unknown } {
  const res: any = { _status: 200, _body: undefined };
  res.status = (code: number) => {
    res._status = code;
    return res;
  };
  res.json = (body: unknown) => {
    res._body = body;
    return res;
  };
  return res;
}

beforeEach(() => {
  process.env.RESEND_API_KEY = 'test-resend';
  process.env.TURNSTILE_SECRET_KEY = 'test-secret';
  process.env.CONTACT_TO_EMAIL = 'to@example.com';
  mockSend.mockReset();
  mockSend.mockResolvedValue({ id: 'mail-1' });
  jest.spyOn(global, 'fetch').mockResolvedValue({
    json: async () => ({ success: true }),
  } as Response);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('POST /api/contact', () => {
  it('returns 200 ok on full success and calls Resend with proper args', async () => {
    const req = makeReq();
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(200);
    expect(res._body).toEqual({ ok: true });
    expect(mockSend).toHaveBeenCalledTimes(1);
    const arg = mockSend.mock.calls[0][0];
    expect(arg.to).toBe('to@example.com');
    expect(arg.replyTo).toBe('ryo@example.com');
    expect(arg.subject).toContain('Ryo');
    expect(arg.text).toContain('これは10文字以上の本文。');
  });

  it('returns 405 for GET', async () => {
    const req = makeReq({ method: 'GET' });
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(405);
    expect(res._body).toEqual({ ok: false, error: 'method_not_allowed' });
  });

  it('returns 400 invalid_input when name is empty (Turnstile and Resend not called)', async () => {
    const req = makeReq({ body: { name: '', email: 'ryo@example.com', body: 'これは10文字以上の本文。', turnstileToken: 'tk' } } as Partial<NextApiRequest>);
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(400);
    expect(res._body).toEqual({ ok: false, error: 'invalid_input', fields: ['name'] });
    expect(global.fetch).not.toHaveBeenCalled();
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('returns 400 captcha_failed when Turnstile says success:false', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ success: false }),
    } as Response);
    const req = makeReq();
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(400);
    expect(res._body).toEqual({ ok: false, error: 'captcha_failed' });
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('returns 400 captcha_failed when Turnstile fetch itself rejects', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('network'));
    const req = makeReq();
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(400);
    expect(res._body).toEqual({ ok: false, error: 'captcha_failed' });
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('returns 502 send_failed when Resend throws', async () => {
    mockSend.mockRejectedValueOnce(new Error('resend down'));
    const req = makeReq();
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(502);
    expect(res._body).toEqual({ ok: false, error: 'send_failed' });
  });
});

describe('POST /api/contact: env missing', () => {
  it('returns 500 internal when RESEND_API_KEY is missing', async () => {
    delete process.env.RESEND_API_KEY;
    const req = makeReq();
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(500);
    expect(res._body).toEqual({ ok: false, error: 'internal' });
    expect(global.fetch).not.toHaveBeenCalled();
    expect(mockSend).not.toHaveBeenCalled();
  });
});

describe('POST /api/contact: subject sanitization', () => {
  it('removes \\r and \\n from name when building subject (header injection guard)', async () => {
    const req = makeReq({
      body: {
        name: 'Ryo\r\nMiyata',
        email: 'ryo@example.com',
        body: 'これは10文字以上の本文。',
        turnstileToken: 'tk',
      },
    } as Partial<NextApiRequest>);
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(200);
    const arg = mockSend.mock.calls[0][0];
    expect(arg.subject).not.toMatch(/[\r\n]/);
    expect(arg.subject).toContain('Ryo Miyata');
  });
});
