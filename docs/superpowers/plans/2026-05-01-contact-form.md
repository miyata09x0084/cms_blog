# お問い合わせフォーム Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Google Forms 外部リンクを廃止し、Resend + Cloudflare Turnstile による自前のお問い合わせフォーム `/contact` を Next.js Pages Router 上に実装する。

**Architecture:** `pages/contact.tsx`（薄いラッパー）→ `components/ContactForm.jsx`（idle/submitting/done/error の state machine）→ `pages/api/contact.ts`（Turnstile 検証 → Resend 送信）。バリデーションは `lib/validateContact.ts` の純関数を API・クライアント双方で共有。

**Tech Stack:** Next.js 13.2.4 (Pages Router) / TypeScript 5.3 / Tailwind / Resend SDK / Cloudflare Turnstile / Jest 29 + React Testing Library + next/jest

**Spec:** `docs/superpowers/specs/2026-05-01-contact-form-design.md`

---

## 事前準備（実装着手前のユーザー作業）

1. Resend API キー発行（https://resend.com/api-keys）
2. Cloudflare Turnstile サイト追加 → Site Key / Secret Key 発行
3. プロジェクトルートの `.env` に以下を追記：

```
RESEND_API_KEY=re_xxxxxxxxxxxx
TURNSTILE_SITE_KEY=0xAAAAAAAA...
TURNSTILE_SECRET_KEY=0xBBBBBBBB...
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0xAAAAAAAA...
CONTACT_TO_EMAIL=miyata09x0084@gmail.com
```

`TURNSTILE_SITE_KEY` と `NEXT_PUBLIC_TURNSTILE_SITE_KEY` は同値。後者だけがクライアント露出する。テストではこれら本物の値は使わずモックする。

---

## File Structure

| 種別 | パス | 責務 |
|---|---|---|
| 新規 | `jest.config.js` | next/jest プリセット呼び出し |
| 新規 | `jest.setup.ts` | `@testing-library/jest-dom` を import |
| 修正 | `package.json` | devDeps + test scripts 追加 |
| 修正 | `tsconfig.json` | stale `pages/api/contact.js` 参照を削除 |
| 新規 | `lib/validateContact.ts` | `validate()` 純関数（API・クライアント共有） |
| 新規 | `lib/__tests__/validateContact.test.ts` | validate() の Jest テスト |
| 新規 | `pages/api/contact.ts` | API ルート（Turnstile 検証 + Resend 送信） |
| 新規 | `pages/api/__tests__/contact.test.ts` | API ルートの Jest テスト |
| 新規 | `components/ContactForm.jsx` | フォーム本体 state machine |
| 新規 | `components/__tests__/ContactForm.test.jsx` | コンポーネント Jest テスト |
| 新規 | `pages/contact.tsx` | `/contact` ページ薄ラッパー |
| 修正 | `pages/index.tsx` | contact セクションのリンク差し替え |

---

## Task 1: テスト基盤の導入

**Files:**
- Modify: `package.json`
- Create: `jest.config.js`
- Create: `jest.setup.ts`
- Create: `lib/__tests__/sanity.test.ts`（動作確認用、Task 2 開始時に削除）

- [ ] **Step 1: Jest 関連 devDependencies のインストール**

```bash
npm install --save-dev jest@^29.7.0 jest-environment-jsdom@^29.7.0 @testing-library/react@^14.2.0 @testing-library/jest-dom@^6.4.0 @testing-library/user-event@^14.5.0 @types/jest@^29.5.0
```

期待: `added N packages` が表示。エラーなし。

- [ ] **Step 2: jest.config.js を作成**

```js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleDirectories: ['node_modules', '<rootDir>'],
};

module.exports = createJestConfig(customJestConfig);
```

正しい Jest オプション名は `setupFilesAfterEnv`（テストフレームワーク初期化後に実行）。`setupFiles` は初期化前なので RTL 用途では不可。

- [ ] **Step 3: jest.setup.ts を作成**

```ts
import '@testing-library/jest-dom';
```

- [ ] **Step 4: package.json に test scripts と devDependencies を反映**

`scripts` ブロックに追加（既存3行の下）：

```json
"test": "jest",
"test:watch": "jest --watch"
```

`devDependencies` には Step 1 で `npm install --save-dev` を使ったので自動追記されている。確認のみ。

- [ ] **Step 5: sanity test を作成**

`lib/__tests__/sanity.test.ts`:

```ts
describe('sanity', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 6: テスト実行で動作確認**

```bash
npm test
```

期待: `1 passed, 1 total`。

API ルート用に node 環境を後で使うが、それは Task 3 で個別 docblock 指定する。

- [ ] **Step 7: コミット**

```bash
git add package.json package-lock.json jest.config.js jest.setup.ts lib/__tests__/sanity.test.ts
git commit -m "テスト基盤を導入: Jest + RTL + next/jest"
```

---

## Task 2: `validate()` 純関数（TDD）

**Files:**
- Delete: `lib/__tests__/sanity.test.ts`
- Create: `lib/validateContact.ts`
- Create: `lib/__tests__/validateContact.test.ts`

- [ ] **Step 1: sanity test を削除**

```bash
rm lib/__tests__/sanity.test.ts
```

- [ ] **Step 2: 失敗するテストを書く（全16ケース）**

`lib/__tests__/validateContact.test.ts`:

```ts
import { validate } from '../validateContact';

const valid = {
  name: 'Ryo',
  email: 'ryo@example.com',
  body: 'これは10文字以上の本文。',
  turnstileToken: 'token-xyz',
};

describe('validate()', () => {
  it('returns empty array for fully valid input', () => {
    expect(validate(valid)).toEqual([]);
  });

  it('returns ["name"] when name is empty', () => {
    expect(validate({ ...valid, name: '' })).toEqual(['name']);
  });

  it('returns ["name"] when name exceeds 50 chars', () => {
    expect(validate({ ...valid, name: 'a'.repeat(51) })).toEqual(['name']);
  });

  it('returns ["name"] when name is whitespace only', () => {
    expect(validate({ ...valid, name: '   ' })).toEqual(['name']);
  });

  it('returns ["email"] when email is empty', () => {
    expect(validate({ ...valid, email: '' })).toEqual(['email']);
  });

  it('returns ["email"] when email lacks @', () => {
    expect(validate({ ...valid, email: 'invalid' })).toEqual(['email']);
  });

  it('returns ["email"] when email lacks domain dot', () => {
    expect(validate({ ...valid, email: 'a@b' })).toEqual(['email']);
  });

  it('returns ["email"] when email is 255 chars', () => {
    const longLocal = 'a'.repeat(250);
    expect(validate({ ...valid, email: `${longLocal}@b.cd` })).toEqual(['email']);
  });

  it('returns ["body"] when body is empty', () => {
    expect(validate({ ...valid, body: '' })).toEqual(['body']);
  });

  it('returns ["body"] when body is 9 chars', () => {
    expect(validate({ ...valid, body: 'a'.repeat(9) })).toEqual(['body']);
  });

  it('returns ["body"] when body is 2001 chars', () => {
    expect(validate({ ...valid, body: 'a'.repeat(2001) })).toEqual(['body']);
  });

  it('returns ["body"] when body trims to empty', () => {
    expect(validate({ ...valid, body: '          ' })).toEqual(['body']);
  });

  it('returns ["turnstileToken"] when token is empty string', () => {
    expect(validate({ ...valid, turnstileToken: '' })).toEqual(['turnstileToken']);
  });

  it('returns ["turnstileToken"] when token is undefined', () => {
    expect(validate({ ...valid, turnstileToken: undefined })).toEqual(['turnstileToken']);
  });

  it('returns ["name","email"] when both are bad (preserved order)', () => {
    expect(validate({ ...valid, name: '', email: 'bad' })).toEqual(['name', 'email']);
  });

  it('returns all four fields when all are bad', () => {
    expect(validate({ name: '', email: '', body: '', turnstileToken: '' })).toEqual([
      'name', 'email', 'body', 'turnstileToken',
    ]);
  });
});
```

- [ ] **Step 3: テスト失敗を確認**

```bash
npm test -- lib/__tests__/validateContact.test.ts
```

期待: `Cannot find module '../validateContact'`（モジュール不存在）。

- [ ] **Step 4: 最小実装を書く**

`lib/validateContact.ts`:

```ts
export interface ContactInput {
  name?: unknown;
  email?: unknown;
  body?: unknown;
  turnstileToken?: unknown;
}

export type ContactField = 'name' | 'email' | 'body' | 'turnstileToken';

export function validate(input: ContactInput): ContactField[] {
  const errors: ContactField[] = [];
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const email = typeof input.email === 'string' ? input.email.trim() : '';
  const body = typeof input.body === 'string' ? input.body.trim() : '';
  const token = typeof input.turnstileToken === 'string' ? input.turnstileToken : '';

  if (name.length < 1 || name.length > 50) errors.push('name');
  if (
    email.length === 0 ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    errors.push('email');
  }
  if (body.length < 10 || body.length > 2000) errors.push('body');
  if (token.length === 0) errors.push('turnstileToken');

  return errors;
}
```

- [ ] **Step 5: テスト緑を確認**

```bash
npm test -- lib/__tests__/validateContact.test.ts
```

期待: `16 passed`。

- [ ] **Step 6: コミット**

```bash
git add lib/validateContact.ts lib/__tests__/validateContact.test.ts
git rm lib/__tests__/sanity.test.ts
git commit -m "validate() 純関数を追加（TDD）"
```

---

## Task 3: `pages/api/contact.ts`（TDD）

**Files:**
- Modify: `tsconfig.json`（stale 参照削除）
- Create: `pages/api/contact.ts`
- Create: `pages/api/__tests__/contact.test.ts`

- [ ] **Step 1: tsconfig の stale 参照を削除**

`tsconfig.json` の `include` から `"pages/api/contact.js"` を削除。修正後の `include`：

```json
"include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", "components/Footer.jsx"]
```

`**/*.ts` で `pages/api/contact.ts` は自動的に拾われる。

- [ ] **Step 2: 失敗するテストを書く**

`pages/api/__tests__/contact.test.ts`:

```ts
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
```

- [ ] **Step 3: テスト失敗を確認**

```bash
npm test -- pages/api/__tests__/contact.test.ts
```

期待: `Cannot find module '../contact'`。

- [ ] **Step 4: 最小実装を書く**

`pages/api/contact.ts`:

```ts
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

  const { name, email, body, turnstileToken } = (req.body ?? {}) as Record<string, unknown>;

  const fields = validate({ name, email, body, turnstileToken });
  if (fields.length > 0) {
    return res.status(400).json({ ok: false, error: 'invalid_input', fields });
  }

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY!;
  const ip = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ?? '';
  let captchaPassed = false;
  try {
    const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: turnstileSecret,
        response: String(turnstileToken),
        remoteip: ip,
      }),
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
    const resend = new Resend(process.env.RESEND_API_KEY!);
    await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: process.env.CONTACT_TO_EMAIL!,
      replyTo: safeEmail,
      subject: `[ryo-miyata.jp] ${safeName} からのお問い合わせ`,
      text: `From: ${safeName} <${safeEmail}>\n\n${safeBody}`,
    });
  } catch (e) {
    console.error('[contact] resend failed', e);
    return res.status(502).json({ ok: false, error: 'send_failed' });
  }

  return res.status(200).json({ ok: true });
}
```

- [ ] **Step 5: resend SDK のインストール**

```bash
npm install resend
```

- [ ] **Step 6: テスト緑を確認**

```bash
npm test -- pages/api/__tests__/contact.test.ts
```

期待: 全ケース緑（合計7ケース）。

- [ ] **Step 7: 型チェック**

```bash
npx tsc --noEmit
```

期待: エラーなし。

- [ ] **Step 8: コミット**

```bash
git add pages/api/contact.ts pages/api/__tests__/contact.test.ts tsconfig.json package.json package-lock.json
git commit -m "POST /api/contact ルートを追加（TDD、Turnstile + Resend）"
```

---

## Task 4: ContactForm の idle 状態とフィールド入力

**Files:**
- Create: `components/ContactForm.jsx`
- Create: `components/__tests__/ContactForm.test.jsx`

このタスクでは ContactForm をマウントし、3フィールドが入力できて、Turnstile 未完了状態では送信ボタンが disabled になる挙動だけを実装する。送信処理（fetch）は次タスク。

- [ ] **Step 1: 失敗するテストを書く**

`components/__tests__/ContactForm.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '../ContactForm';

beforeEach(() => {
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = 'test-site-key';
  // Turnstile グローバル stub
  // eslint-disable-next-line no-undef
  window.turnstile = { reset: jest.fn() };
});

describe('<ContactForm /> idle', () => {
  it('renders all three fields and a disabled submit button', () => {
    render(<ContactForm />);
    expect(screen.getByLabelText(/NAME/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/EMAIL/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/MESSAGE/i)).toBeInTheDocument();
    const button = screen.getByRole('button', { name: /send message/i });
    expect(button).toBeDisabled();
  });

  it('keeps button disabled when fields are filled but Turnstile token is missing', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByLabelText(/NAME/i), 'Ryo');
    await user.type(screen.getByLabelText(/EMAIL/i), 'ryo@example.com');
    await user.type(screen.getByLabelText(/MESSAGE/i), 'これは10文字以上の本文。');
    expect(screen.getByRole('button', { name: /send message/i })).toBeDisabled();
  });
});
```

- [ ] **Step 2: テスト失敗を確認**

```bash
npm test -- components/__tests__/ContactForm.test.jsx
```

期待: `Cannot find module '../ContactForm'`。

- [ ] **Step 3: 最小実装を書く**

`components/ContactForm.jsx`:

```jsx
import React, { useEffect, useState } from 'react';

const inputClass =
  'w-full border border-current bg-transparent px-2 py-1.5 text-[13px] font-jp focus:outline-none focus:bg-[var(--fg)] focus:text-[var(--bg)]';
const labelClass = 'font-pixel text-[10px] tracking-wider opacity-70 block mb-1';

const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [body, setBody] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');

  useEffect(() => {
    const cb = (token) => setTurnstileToken(token);
    window.onTurnstileSuccess = cb;
    return () => {
      delete window.onTurnstileSuccess;
    };
  }, []);

  const canSubmit =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    body.trim().length > 0 &&
    turnstileToken.length > 0;

  return (
    <form>
      <div className="mb-4">
        <label className={labelClass} htmlFor="cf-name">NAME</label>
        <input
          id="cf-name"
          type="text"
          className={inputClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className={labelClass} htmlFor="cf-email">EMAIL</label>
        <input
          id="cf-email"
          type="email"
          className={inputClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className={labelClass} htmlFor="cf-body">MESSAGE</label>
        <textarea
          id="cf-body"
          rows={6}
          className={inputClass}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>

      <div
        className="cf-turnstile mb-4"
        data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
        data-callback="onTurnstileSuccess"
      />

      <button
        type="submit"
        disabled={!canSubmit}
        className="border border-current px-3 py-1.5 font-pixel text-[11px] hover:bg-[var(--fg)] hover:text-[var(--bg)] disabled:opacity-50"
      >
        ▸ send message
      </button>
    </form>
  );
};

export default ContactForm;
```

- [ ] **Step 4: テスト緑を確認**

```bash
npm test -- components/__tests__/ContactForm.test.jsx
```

期待: 2 passed。

- [ ] **Step 5: コミット**

```bash
git add components/ContactForm.jsx components/__tests__/ContactForm.test.jsx
git commit -m "ContactForm idle 状態を追加（TDD）"
```

---

## Task 5: ContactForm の submitting 状態と送信成功

**Files:**
- Modify: `components/ContactForm.jsx`
- Modify: `components/__tests__/ContactForm.test.jsx`

- [ ] **Step 1: 追加の失敗テストを書く**

`components/__tests__/ContactForm.test.jsx` の末尾に追加：

```jsx
describe('<ContactForm /> submitting and done', () => {
  it('enables button when Turnstile callback fires with a token', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByLabelText(/NAME/i), 'Ryo');
    await user.type(screen.getByLabelText(/EMAIL/i), 'ryo@example.com');
    await user.type(screen.getByLabelText(/MESSAGE/i), 'これは10文字以上の本文。');
    window.onTurnstileSuccess('tk-x');
    expect(screen.getByRole('button', { name: /send message/i })).toBeEnabled();
  });

  it('shows sending... while fetch is pending and replaces form on 200', async () => {
    let resolveFetch;
    jest.spyOn(global, 'fetch').mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFetch = () =>
            resolve({
              ok: true,
              json: async () => ({ ok: true }),
            });
        }),
    );

    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByLabelText(/NAME/i), 'Ryo');
    await user.type(screen.getByLabelText(/EMAIL/i), 'ryo@example.com');
    await user.type(screen.getByLabelText(/MESSAGE/i), 'これは10文字以上の本文。');
    window.onTurnstileSuccess('tk-x');

    await user.click(screen.getByRole('button', { name: /send message/i }));
    expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled();

    resolveFetch();
    expect(await screen.findByText(/message sent/i)).toBeInTheDocument();
    expect(screen.getByText(/back to home/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/NAME/i)).not.toBeInTheDocument();
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});
```

- [ ] **Step 2: テスト失敗を確認**

```bash
npm test -- components/__tests__/ContactForm.test.jsx
```

期待: `submitting` 関連の2ケースが失敗。

- [ ] **Step 3: ContactForm に state machine と submit ハンドラを追加**

`components/ContactForm.jsx` 全体を以下に置換：

```jsx
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const inputClass =
  'w-full border border-current bg-transparent px-2 py-1.5 text-[13px] font-jp focus:outline-none focus:bg-[var(--fg)] focus:text-[var(--bg)] disabled:opacity-50';
const labelClass = 'font-pixel text-[10px] tracking-wider opacity-70 block mb-1';

const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [body, setBody] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [status, setStatus] = useState('idle'); // idle | submitting | done

  useEffect(() => {
    window.onTurnstileSuccess = (token) => setTurnstileToken(token);
    return () => {
      delete window.onTurnstileSuccess;
    };
  }, []);

  const canSubmit =
    status === 'idle' &&
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    body.trim().length > 0 &&
    turnstileToken.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, body, turnstileToken }),
      });
      if (res.ok) {
        setStatus('done');
      } else {
        setStatus('idle');
      }
    } catch {
      setStatus('idle');
    }
  };

  if (status === 'done') {
    return (
      <div>
        <p className="font-pixel text-[16px]">▸ message sent.</p>
        <p className="font-jp text-[12px] mt-3 leading-[1.7] opacity-80">
          ありがとうございます。<br />
          通常 1〜3 営業日以内にお返事します。
        </p>
        <Link
          href="/"
          className="font-pixel text-[11px] underline mt-6 inline-block"
        >
          ▸ back to home
        </Link>
      </div>
    );
  }

  const fieldsDisabled = status === 'submitting';

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className={labelClass} htmlFor="cf-name">NAME</label>
        <input
          id="cf-name"
          type="text"
          className={inputClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={fieldsDisabled}
        />
      </div>

      <div className="mb-4">
        <label className={labelClass} htmlFor="cf-email">EMAIL</label>
        <input
          id="cf-email"
          type="email"
          className={inputClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={fieldsDisabled}
        />
      </div>

      <div className="mb-4">
        <label className={labelClass} htmlFor="cf-body">MESSAGE</label>
        <textarea
          id="cf-body"
          rows={6}
          className={inputClass}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={fieldsDisabled}
        />
      </div>

      <div
        className="cf-turnstile mb-4"
        data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
        data-callback="onTurnstileSuccess"
      />

      <button
        type="submit"
        disabled={!canSubmit}
        className="border border-current px-3 py-1.5 font-pixel text-[11px] hover:bg-[var(--fg)] hover:text-[var(--bg)] disabled:opacity-50"
      >
        {status === 'submitting' ? '▸ sending...' : '▸ send message'}
      </button>
    </form>
  );
};

export default ContactForm;
```

- [ ] **Step 4: テスト緑を確認**

```bash
npm test -- components/__tests__/ContactForm.test.jsx
```

期待: idle 2 + submitting/done 2 = 4 passed。

- [ ] **Step 5: コミット**

```bash
git add components/ContactForm.jsx components/__tests__/ContactForm.test.jsx
git commit -m "ContactForm submitting / done 状態を追加（TDD）"
```

---

## Task 6: ContactForm のエラー表示（バナー + Turnstile リセット）

**Files:**
- Modify: `components/ContactForm.jsx`
- Modify: `components/__tests__/ContactForm.test.jsx`

- [ ] **Step 1: 追加テストを書く**

`components/__tests__/ContactForm.test.jsx` 末尾に追加：

```jsx
describe('<ContactForm /> error banner', () => {
  it('shows generic banner and resets Turnstile when API returns 502 send_failed', async () => {
    const resetMock = jest.fn();
    window.turnstile = { reset: resetMock };
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 502,
      json: async () => ({ ok: false, error: 'send_failed' }),
    });

    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByLabelText(/NAME/i), 'Ryo');
    await user.type(screen.getByLabelText(/EMAIL/i), 'ryo@example.com');
    await user.type(screen.getByLabelText(/MESSAGE/i), 'これは10文字以上の本文。');
    window.onTurnstileSuccess('tk-x');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(await screen.findByText(/送信に失敗しました/)).toBeInTheDocument();
    expect(screen.getByLabelText(/NAME/i)).toBeInTheDocument(); // form still present
    expect(resetMock).toHaveBeenCalled();
  });

  it('shows captcha-specific banner when API returns 400 captcha_failed', async () => {
    window.turnstile = { reset: jest.fn() };
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ ok: false, error: 'captcha_failed' }),
    });

    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByLabelText(/NAME/i), 'Ryo');
    await user.type(screen.getByLabelText(/EMAIL/i), 'ryo@example.com');
    await user.type(screen.getByLabelText(/MESSAGE/i), 'これは10文字以上の本文。');
    window.onTurnstileSuccess('tk-x');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(await screen.findByText(/ロボット判定に失敗/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: テスト失敗を確認**

```bash
npm test -- components/__tests__/ContactForm.test.jsx
```

期待: error banner の2ケースが失敗。

- [ ] **Step 3: バナー表示と Turnstile リセットを実装**

`components/ContactForm.jsx` の `handleSubmit` を以下に差し替え、`status` を `idle | submitting | done` から `idle | submitting | done` のままで、別途 `errorCode` state を導入する：

```jsx
// state 追加
const [errorCode, setErrorCode] = useState(null); // null | 'captcha_failed' | 'send_failed' | 'network'

// handleSubmit 差し替え
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!canSubmit) return;
  setStatus('submitting');
  setErrorCode(null);
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, body, turnstileToken }),
    });
    if (res.ok) {
      setStatus('done');
      return;
    }
    const data = await res.json().catch(() => ({}));
    const code = data?.error === 'captcha_failed' ? 'captcha_failed' : 'send_failed';
    setErrorCode(code);
    setStatus('idle');
    if (typeof window !== 'undefined' && window.turnstile?.reset) {
      window.turnstile.reset();
    }
    setTurnstileToken('');
  } catch {
    setErrorCode('network');
    setStatus('idle');
    if (typeof window !== 'undefined' && window.turnstile?.reset) {
      window.turnstile.reset();
    }
    setTurnstileToken('');
  }
};
```

そして `<form>` の直前に以下のバナーを追加：

```jsx
{errorCode && (
  <div className="border border-current p-2 mb-3 font-pixel text-[11px]">
    {errorCode === 'captcha_failed'
      ? '▸ ロボット判定に失敗しました。再度お試しください'
      : '▸ 送信に失敗しました。少し時間をおいて再度お試しください'}
  </div>
)}
```

- [ ] **Step 4: テスト緑を確認**

```bash
npm test -- components/__tests__/ContactForm.test.jsx
```

期待: idle 2 + submitting/done 2 + error 2 = 6 passed。

- [ ] **Step 5: コミット**

```bash
git add components/ContactForm.jsx components/__tests__/ContactForm.test.jsx
git commit -m "ContactForm エラーバナーと Turnstile リセットを追加（TDD）"
```

---

## Task 7: ContactForm の inline クライアント側バリデーション

**Files:**
- Modify: `components/ContactForm.jsx`
- Modify: `components/__tests__/ContactForm.test.jsx`

- [ ] **Step 1: 追加テストを書く**

`components/__tests__/ContactForm.test.jsx` 末尾に追加：

```jsx
describe('<ContactForm /> inline validation', () => {
  it('shows inline email error and does not call fetch', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByLabelText(/NAME/i), 'Ryo');
    await user.type(screen.getByLabelText(/EMAIL/i), 'abc'); // invalid
    await user.type(screen.getByLabelText(/MESSAGE/i), 'これは10文字以上の本文。');
    window.onTurnstileSuccess('tk-x');
    await user.click(screen.getByRole('button', { name: /send message/i }));
    expect(await screen.findByText(/メールアドレスの形式/)).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('shows inline body length error', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByLabelText(/NAME/i), 'Ryo');
    await user.type(screen.getByLabelText(/EMAIL/i), 'ryo@example.com');
    await user.type(screen.getByLabelText(/MESSAGE/i), 'short');
    window.onTurnstileSuccess('tk-x');
    await user.click(screen.getByRole('button', { name: /send message/i }));
    expect(await screen.findByText(/10〜2000 文字/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: テスト失敗を確認**

```bash
npm test -- components/__tests__/ContactForm.test.jsx
```

期待: inline 関連の2ケースが失敗。

- [ ] **Step 3: validate を import し inline エラーを描画**

`components/ContactForm.jsx` の冒頭に追加：

```jsx
import { validate } from '../lib/validateContact';
```

state 追加：

```jsx
const [fieldErrors, setFieldErrors] = useState([]);
```

`handleSubmit` 先頭に追加（`if (!canSubmit) return;` の **直後**）：

```jsx
const errs = validate({ name, email, body, turnstileToken });
if (errs.length > 0) {
  setFieldErrors(errs);
  return;
}
setFieldErrors([]);
```

各フィールドの `<div className="mb-4">` の input/textarea の **直下** に inline エラーを追加：

```jsx
{fieldErrors.includes('name') && (
  <p className="font-pixel text-[10px] mt-1">▸ お名前を入力してください（50字以内）</p>
)}
```

```jsx
{fieldErrors.includes('email') && (
  <p className="font-pixel text-[10px] mt-1">▸ メールアドレスの形式が正しくありません</p>
)}
```

```jsx
{fieldErrors.includes('body') && (
  <p className="font-pixel text-[10px] mt-1">▸ 本文は 10〜2000 文字で入力してください</p>
)}
```

- [ ] **Step 4: テスト緑を確認**

```bash
npm test -- components/__tests__/ContactForm.test.jsx
```

期待: 全8ケース緑。

- [ ] **Step 5: 全テスト一括実行**

```bash
npm test
```

期待: validate 16 + API 7 + ContactForm 8 = 31 passed。

- [ ] **Step 6: 型チェック**

```bash
npx tsc --noEmit
```

期待: エラーなし。

- [ ] **Step 7: コミット**

```bash
git add components/ContactForm.jsx components/__tests__/ContactForm.test.jsx
git commit -m "ContactForm inline バリデーションエラーを追加（TDD）"
```

---

## Task 8: `/contact` ページと Turnstile script 注入

**Files:**
- Create: `pages/contact.tsx`

- [ ] **Step 1: ページを作成**

`pages/contact.tsx`:

```tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import Script from 'next/script';
import { SectionHeading } from '../components/ui';
import ContactForm from '../components/ContactForm';

const Contact: NextPage = () => (
  <div>
    <Head>
      <title>Ryo Miyata — Contact</title>
    </Head>
    <Script
      src="https://challenges.cloudflare.com/turnstile/v0/api.js"
      async
      defer
    />
    <section className="px-5 py-5 border-t border-current">
      <SectionHeading>contact</SectionHeading>
      <p className="font-jp text-[13px] leading-[1.8] mb-5">
        ご連絡ありがとうございます。お仕事のご相談、雑談、なんでもどうぞ。<br />
        通常 1〜3 営業日以内にお返事します。
      </p>
      <ContactForm />
    </section>
  </div>
);

export default Contact;
```

- [ ] **Step 2: 開発サーバーで起動確認**

```bash
npm run dev
```

ブラウザで `http://localhost:3000/contact` を開く。期待：

- ヘッダ・フッタが表示される
- "// contact" 見出し、説明文、フォーム3項目が表示される
- Turnstile widget が読み込まれ、操作可能
- 全項目入力 + Turnstile 完了で送信ボタンが押せる
- 押下 → gmail にメール到着 → 「返信」で送信者アドレス宛になる
- 送信後フォームが完了画面に置き換わり、`▸ back to home` でトップに戻る

サーバーを停止（Ctrl+C）。

- [ ] **Step 3: 型チェックとテスト**

```bash
npx tsc --noEmit && npm test
```

期待: エラーなし、全テスト緑。

- [ ] **Step 4: コミット**

```bash
git add pages/contact.tsx
git commit -m "/contact ページを追加（Turnstile script 注入 + ContactForm マウント）"
```

---

## Task 9: トップページのリンクを差し替え

**Files:**
- Modify: `pages/index.tsx:105-116`

- [ ] **Step 1: contact セクションを書き換え**

現在の `pages/index.tsx:105-116`：

```jsx
{/* Contact */}
<section className="px-5 py-5 border-t border-current">
  <SectionHeading>contact</SectionHeading>
  <a
    href="https://docs.google.com/forms/d/e/1FAIpQLSfp__zqzghA2tSgqdr7WubZP0hqpxhw-5YJRMDj0RkdEcITlw/viewform?usp=publish-editor"
    target="_blank"
    rel="noopener noreferrer"
    className="font-pixel text-[12px] underline"
  >
    ▸ open contact form (google)
  </a>
</section>
```

を以下に置換：

```jsx
{/* Contact */}
<section className="px-5 py-5 border-t border-current">
  <SectionHeading>contact</SectionHeading>
  <Link href="/contact" className="font-pixel text-[12px] underline">
    ▸ open contact form
  </Link>
</section>
```

`Link` は `pages/index.tsx:2` で既に import 済み。

- [ ] **Step 2: 開発サーバーで動作確認**

```bash
npm run dev
```

トップ → contact セクション → リンクをクリック → `/contact` へ遷移できる。サーバー停止（Ctrl+C）。

- [ ] **Step 3: コミット**

```bash
git add pages/index.tsx
git commit -m "トップページの contact リンクを Google Forms から /contact に差し替え"
```

---

## Task 10: 仕上げと最終検証

**Files:** なし（検証のみ）

- [ ] **Step 1: 全テストとビルド検証**

```bash
npm test && npx tsc --noEmit && npm run build
```

期待：

- Jest: 全テスト緑（合計 31 程度）
- TS: エラーなし
- Next ビルド: エラーなし、`.next/` 生成

- [ ] **Step 2: 本番ビルドで動作確認**

```bash
npm start
```

別ターミナルで：

```bash
curl -i http://localhost:3000/contact
```

期待: `HTTP/1.1 200 OK`。`/contact` の HTML が返る。

サーバー停止。

- [ ] **Step 3: スパム対策の負テスト（手動）**

`curl` で **Turnstile token を空** にして直接 API を叩く：

```bash
curl -i -X POST http://localhost:3000/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"Bot","email":"bot@example.com","body":"これは10文字以上の本文。","turnstileToken":""}'
```

期待: `400` で `{"ok":false,"error":"invalid_input","fields":["turnstileToken"]}`。

偽 token を渡したケース：

```bash
curl -i -X POST http://localhost:3000/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"Bot","email":"bot@example.com","body":"これは10文字以上の本文。","turnstileToken":"fake-token"}'
```

期待: `400` で `{"ok":false,"error":"captcha_failed"}`。

- [ ] **Step 4: 受け入れ条件のチェック**

`docs/superpowers/specs/2026-05-01-contact-form-design.md` の「受け入れ条件」セクションを開き、各項目を1つずつチェック。すべて緑なら完了。

- [ ] **Step 5: 最終コミット（必要なら）**

ここまでで未コミット変更がなければスキップ。何かあれば：

```bash
git add -A
git commit -m "お問い合わせフォーム: 最終調整"
```

- [ ] **Step 6: 完了報告**

実装完了をユーザーに報告。次の議論候補：

- 独自ドメインからの送信（`onboarding@resend.dev` → `contact@ryo-miyata.jp` 等）
- working tree に残っている削除待ちファイル（`docs/SPEC.md` 等）の整理
