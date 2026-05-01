# お問い合わせフォーム設計書

- 作成日: 2026-05-01
- ステータス: 設計確定（実装計画作成前）
- 関連: 既存 `pages/index.tsx:108-115` の Google Forms 外部リンク廃止

## 背景・目的

現状、トップページ末尾の "contact" セクションは Google Forms への外部リンク1本のみ。これを廃止し、サイト内で完結する自前のお問い合わせフォームに置き換える。

主な動機：

- サイト内完結による UX/世界観の一貫性（1-bit Mac モノクロデザイン）
- 自分の管理下にデータを置く

## スコープ

### やること

- `/contact` 専用ページ新設
- メール送信（Resend）連携
- Cloudflare Turnstile によるスパム対策
- トップページからの導線リンク変更

### やらないこと（YAGNI）

- 履歴の永続化（Hygraph 保存等）
- 自動返信メール
- 多言語化（日本語のみ）
- API 側のレート制限（Turnstile で代替）
- CSRF/Origin チェック（認証なしフォームのため）
- 独自ドメインからの送信（`onboarding@resend.dev` から開始）

## 要件サマリー

| 項目 | 決定 |
|---|---|
| 送信先 | Resend → `miyata09x0084@gmail.com` |
| 配置 | `/contact` 専用ページ。トップは導線リンクのみ |
| 入力項目 | 名前 / メール / 本文（3項目） |
| スパム対策 | Cloudflare Turnstile |
| 完了UX | 同一ページ内でフォーム→完了メッセージ差し替え |
| 言語 | ラベルは pixel 大文字英語、説明文は日本語 |

## アーキテクチャ

```
[ /contact ページ (pages/contact.tsx) ]
        │
        │  ① ユーザー入力 + Turnstile widget でトークン取得
        ▼
[ ContactForm コンポーネント (components/ContactForm.jsx) ]
        │
        │  ② POST /api/contact { name, email, body, turnstileToken }
        ▼
[ API ルート (pages/api/contact.ts) ]
        │
        │  ③ サーバー側で Turnstile 検証
        │     POST https://challenges.cloudflare.com/turnstile/v0/siteverify
        ▼
        │  ④ 通過したら Resend で送信
        │     to: miyata09x0084@gmail.com
        │     reply-to: ユーザー入力のメール
        │     from: onboarding@resend.dev
        ▼
[ Resend ] → gmail 受信
```

### 新規ファイル

| ファイル | 責務 |
|---|---|
| `pages/contact.tsx` | ページ枠 + Head + 説明文 + `<ContactForm />` の配置 |
| `pages/api/contact.ts` | API ルート（`pages/api/` 自体も新規作成） |
| `components/ContactForm.jsx` | state（idle/submitting/done/error）・送信処理・Turnstile 連携・フォーム描画 |

### 変更ファイル

- `pages/index.tsx`: contact セクションのリンクを Google Forms から `/contact` に置換、`(google)` 文言削除

### 新規依存

- `resend`（公式 SDK）

Cloudflare Turnstile は素の `<script>` 注入で組む。`@marsidev/react-turnstile` 等のラッパー依存は採用しない（最近の未使用パッケージ削除方針と整合）。

### 新規環境変数（`.env`）

```
RESEND_API_KEY=
TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
CONTACT_TO_EMAIL=miyata09x0084@gmail.com
```

`TURNSTILE_SITE_KEY` と `NEXT_PUBLIC_TURNSTILE_SITE_KEY` は同値。後者だけがクライアントに露出する。

事前準備（実装前）:

- Cloudflare アカウントで Turnstile サイトキー/シークレットキーを発行
- Resend アカウントで API キーを発行

## 画面・UI 設計

### `/contact` ページ構造

- 既存 `Layout`（720px 枠）の中に配置
- `<section className="px-5 py-5">` で他ページと同じ枠取り
- `<SectionHeading>contact</SectionHeading>` を冒頭に配置
- 説明文（日本語2行）
- `<ContactForm />` を配置

### 状態遷移

```
idle ─[submit押下]─→ submitting ─[200]─→ done
                          │
                          └─[error]──→ idle (上部にエラー表示)
```

| 状態 | 表示 |
|---|---|
| `idle` | フォーム表示。ボタン: `▸ send message` |
| `submitting` | フォーム disabled。ボタン: `▸ sending...` |
| `done` | フォーム消滅。`▸ message sent.` + 日本語サブ文 + `▸ back to home` リンク |
| `error` | `idle` 復帰。フォーム上部にエラーバナー |

### 1-bit Mac スタイル適用

| 要素 | クラス |
|---|---|
| ラベル | `font-pixel text-[10px] tracking-wider opacity-70`（NAME/EMAIL/MESSAGE） |
| input/textarea | `w-full border border-current bg-transparent px-2 py-1.5 text-[13px] font-jp focus:outline-none focus:bg-[var(--fg)] focus:text-[var(--bg)]` |
| 送信ボタン | `border border-current px-3 py-1.5 font-pixel text-[11px] hover:bg-[var(--fg)] hover:text-[var(--bg)] disabled:opacity-50` |
| 完了メッセージ見出し | `font-pixel text-[16px]` |
| 完了メッセージ本文 | `font-jp text-[12px] mt-3 leading-[1.7] opacity-80` |
| エラーバナー | `border border-current p-2 mb-3 font-pixel text-[11px]` |

### トップページの差し替え

`pages/index.tsx:108-115` を以下に置換：

```jsx
{/* Contact */}
<section className="px-5 py-5 border-t border-current">
  <SectionHeading>contact</SectionHeading>
  <Link href="/contact" className="font-pixel text-[12px] underline">
    ▸ open contact form
  </Link>
</section>
```

## API 設計

### エンドポイント

- `POST /api/contact`
- Runtime: Node.js（デフォルト）
- Content-Type: `application/json`

### リクエスト

```ts
{
  name: string;            // 1-50 文字（trim 後）
  email: string;           // 簡易形式チェック、最大 254 文字
  body: string;            // 10-2000 文字（trim 後）
  turnstileToken: string;  // Cloudflare Turnstile からの token
}
```

### レスポンス

| ケース | HTTP | body |
|---|---|---|
| 成功 | 200 | `{ ok: true }` |
| バリデーション失敗 | 400 | `{ ok: false, error: "invalid_input", fields: [...] }` |
| Turnstile 失敗 | 400 | `{ ok: false, error: "captcha_failed" }` |
| Method 違い | 405 | `{ ok: false, error: "method_not_allowed" }` |
| Resend エラー | 502 | `{ ok: false, error: "send_failed" }` |
| 想定外 | 500 | `{ ok: false, error: "internal" }` |

### 処理フロー

1. `req.method !== 'POST'` → 405
2. `req.body` から取り出し
3. `validate()` で項目検査 → 不合格項目があれば 400
4. Turnstile `siteverify` 呼び出し → `success: false` なら 400
5. Resend `emails.send()` → 失敗なら 502
6. 200 を返す

### Resend 送信内容

```ts
{
  from: 'Contact Form <onboarding@resend.dev>',
  to: process.env.CONTACT_TO_EMAIL!,
  replyTo: email,
  subject: `[ryo-miyata.jp] ${name.replace(/[\r\n]/g, ' ')} からのお問い合わせ`,
  text: `From: ${name} <${email}>\n\n${body}`,
}
```

`subject` のユーザー名は改行を空白に置換してヘッダインジェクションを防ぐ。本文は plain text のみ（HTML メールは作らない → XSS 不要）。

### ログ方針

- 成功: ログなし
- Turnstile 失敗: `console.warn('[contact] turnstile failed', { ip })`（本文は出さない）
- Resend 失敗: `console.error('[contact] resend failed', e)`（stack のみ）

## バリデーション

クライアント・サーバー双方で同じルールを適用。クライアントは UX 即時フィードバック用、サーバーが信頼の最終線。

| 項目 | ルール |
|---|---|
| `name` | 必須・trim 後 1-50 文字 |
| `email` | 必須・`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`・最大 254 文字 |
| `body` | 必須・trim 後 10-2000 文字 |
| `turnstileToken` | 必須・空文字不可 |

サーバー側 `validate()`:

```ts
function validate(input: {
  name?: unknown; email?: unknown; body?: unknown; turnstileToken?: unknown;
}): string[] {
  const errors: string[] = [];
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const email = typeof input.email === 'string' ? input.email.trim() : '';
  const body = typeof input.body === 'string' ? input.body.trim() : '';
  const token = typeof input.turnstileToken === 'string' ? input.turnstileToken : '';

  if (name.length < 1 || name.length > 50) errors.push('name');
  if (email.length === 0 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.push('email');
  if (body.length < 10 || body.length > 2000) errors.push('body');
  if (token.length === 0) errors.push('turnstileToken');

  return errors;
}
```

## エラー表示（クライアント）

| 失敗種別 | 表示 |
|---|---|
| `name` | name ラベル下に inline `▸ お名前を入力してください（50字以内）` |
| `email` | email ラベル下に inline `▸ メールアドレスの形式が正しくありません` |
| `body` | body ラベル下に inline `▸ 本文は 10〜2000 文字で入力してください` |
| `turnstileToken` 未取得 | フォーム上部バナー `▸ ロボット判定を完了してください` |
| API `captcha_failed` | フォーム上部バナー `▸ ロボット判定に失敗しました。再度お試しください` + widget リセット |
| API `send_failed` / network / `internal` | フォーム上部バナー `▸ 送信に失敗しました。少し時間をおいて再度お試しください` |

inline はフィールド単位、バナーは全体スコープのエラー、と役割を分離する。

## 送信ボタンの活性条件

| 条件 | ボタン |
|---|---|
| 必須項目に欠けがある or token なし | `disabled` |
| すべて埋まっており token あり | `enabled` |
| `submitting` 中 | `disabled` + `▸ sending...` |

## Turnstile widget ライフサイクル

1. `<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />` を `next/head` で注入
2. `<div className="cf-turnstile" data-sitekey={...} data-callback="onTurnstileSuccess" />` を ContactForm 内に配置
3. callback で token を `useState` に保存
4. 送信成功・失敗どちらでも `window.turnstile.reset()` でリセット（token 使い捨てのため）

## 完了状態の表示

```
▸ message sent.

ありがとうございます。
通常 1〜3 営業日以内にお返事します。

▸ back to home
```

- 1行目: `font-pixel text-[16px]`
- 説明文: `font-jp text-[12px] mt-3 leading-[1.7] opacity-80`
- 戻りリンク: `<Link href="/">` を `font-pixel text-[11px] underline mt-6 inline-block`

## セキュリティ

- メール本文は plain text のみ（HTML メールを作らない）
- API ログにユーザー入力の内容を出さない（リーク防止）
- `subject` のユーザー名は `\r`/`\n` を空白に置換してヘッダインジェクション防止
- `TURNSTILE_SECRET_KEY` と `RESEND_API_KEY` は サーバー側のみで参照、クライアントへ露出させない

## 受け入れ条件

- [ ] `/contact` で名前・メール・本文・Turnstile を満たして送信すると、`miyata09x0084@gmail.com` に到着する
- [ ] 受信メールの「返信」を押すと送信者のメールアドレス宛になる
- [ ] 不正な入力（空、長すぎ、メール形式不正）はフィールド単位のエラーで弾かれる
- [ ] Turnstile 未完了では送信ボタンが押せない
- [ ] Turnstile 検証 API を直接叩いて偽 token を送ると 400 が返る
- [ ] 送信成功でフォームが完了画面に置き換わる
- [ ] 送信失敗でフォームが残り、上部にエラーバナーが出る
- [ ] トップページの contact リンクが `/contact` を指している（Google Forms URL 削除）
- [ ] `(google)` 文言が削除されている
- [ ] 1-bit Mac モノクロ・pixel フォント・border invert ホバーが他ページと整合
