# お問い合わせフォーム設計書

- 作成日: 2026-05-01
- ステータス: 設計確定（実装計画作成前）
- 関連: 既存 `pages/index.tsx:108-115` の Google Forms 外部リンク廃止
- 実装方針: テスト駆動開発（TDD / Red→Green→Refactor）

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

### 新規依存（プロダクション）

- `resend`（公式 SDK）

Cloudflare Turnstile は素の `<script>` 注入で組む。`@marsidev/react-turnstile` 等のラッパー依存は採用しない（最近の未使用パッケージ削除方針と整合）。

### 新規依存（開発・テスト）

プロジェクト初のテスト基盤を導入する：

- `jest`
- `jest-environment-jsdom`
- `@testing-library/react`
- `@testing-library/jest-dom`
- `@testing-library/user-event`
- `@types/jest`

Next.js 13 公式の `next/jest` プリセットを使用し、Babel 設定を SWC ベースで自動構成する。

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

## テスト戦略（TDD）

### 基本方針

すべての新規コードは **Red → Green → Refactor** サイクルで実装する：

1. **Red**: 期待挙動を表すテストを先に書き、失敗することを確認
2. **Green**: テストが通る最小限の実装を書く
3. **Refactor**: テストが緑のまま、コードを整える

各レイヤーごとに独立したテストファイルを持ち、外部 I/O（Resend、Turnstile siteverify）は **必ずモック** する。本物の API を叩くテストは作らない（無料枠消費と再現性破壊のため）。

### フレームワーク構成

- ランナー: **Jest**
- React テスト: **`@testing-library/react`** + **`@testing-library/user-event`**
- マッチャ拡張: **`@testing-library/jest-dom`**
- 環境: **`jest-environment-jsdom`**（コンポーネントテスト用）/ **`node`**（API テスト用）
- Next.js 統合: **`next/jest`** プリセット（SWC 経由で TS/JSX を自動変換）

### 設定ファイル

新規作成：

- `jest.config.js` — `next/jest` プリセットを呼び出し、`testEnvironment: 'jsdom'` をデフォルト、API テストは `@jest-environment node` の docblock で個別指定
- `jest.setup.ts` — `@testing-library/jest-dom` を import
- `package.json` の `scripts` に `"test": "jest"`、`"test:watch": "jest --watch"` を追加

### テスト対象とテストファイルの対応

| 対象 | テストファイル | 環境 | 種別 |
|---|---|---|---|
| `validate()`（純関数） | `pages/api/__tests__/validate.test.ts` | node | unit |
| `POST /api/contact` | `pages/api/__tests__/contact.test.ts` | node | integration（モック） |
| `<ContactForm />` | `components/__tests__/ContactForm.test.tsx` | jsdom | component |

`pages/contact.tsx` 自体は ContactForm をマウントするだけの薄いラッパーなのでテスト対象外。

### `validate()` のテストケース（全16ケース想定）

| # | 入力 | 期待される errors |
|---|---|---|
| 1 | 全項目正常 | `[]` |
| 2 | name が空 | `['name']` |
| 3 | name が 51 文字 | `['name']` |
| 4 | name が前後空白のみ | `['name']` |
| 5 | email が空 | `['email']` |
| 6 | email に `@` がない | `['email']` |
| 7 | email にドメイン部の `.` がない | `['email']` |
| 8 | email が 255 文字 | `['email']` |
| 9 | body が空 | `['body']` |
| 10 | body が 9 文字 | `['body']` |
| 11 | body が 2001 文字 | `['body']` |
| 12 | body が前後空白で実質空 | `['body']` |
| 13 | turnstileToken が空文字 | `['turnstileToken']` |
| 14 | turnstileToken が undefined | `['turnstileToken']` |
| 15 | name と email が同時に不正 | `['name', 'email']`（順序保証） |
| 16 | 全項目が不正 | `['name', 'email', 'body', 'turnstileToken']` |

### `/api/contact` のテストケース

`global.fetch` を Jest の `jest.spyOn` でモックし、Resend SDK は `jest.mock('resend', () => ...)` で差し替え：

| # | シナリオ | モック設定 | 期待 |
|---|---|---|---|
| 1 | 正常系 | siteverify=success、resend.emails.send=resolve | `200 { ok: true }`、`emails.send` が正しい引数で呼ばれる |
| 2 | GET メソッド | — | `405 method_not_allowed` |
| 3 | バリデーション失敗（name 空） | — | `400 invalid_input fields=['name']`、Turnstile/Resend は呼ばれない |
| 4 | Turnstile 失敗 | siteverify=`{success:false}` | `400 captcha_failed`、Resend は呼ばれない |
| 5 | Turnstile API 自体が落ちる | siteverify=reject | `400 captcha_failed`（フェイルクローズ） |
| 6 | Resend が throw | siteverify=success、resend=reject | `502 send_failed` |
| 7 | subject へのヘッダインジェクション試行 | name に `\n` 含む | resend に渡る subject に `\n` がない |
| 8 | replyTo にユーザーメールが入る | 正常系 | `emails.send` の呼び出し引数に `replyTo: <input>` |

### `<ContactForm />` のテストケース

`fetch` をモックして API を差し替え。Turnstile widget は `data-callback` グローバル関数を直接呼び出してトークン取得をシミュレート：

| # | シナリオ | 操作 | 期待 |
|---|---|---|---|
| 1 | 初期表示 | — | フォームが表示、送信ボタンは disabled、エラーバナーなし |
| 2 | 必須項目を埋める | type into name/email/body | 送信ボタンは依然 disabled（token 未取得） |
| 3 | Turnstile token 取得 | callback 呼び出し | 送信ボタンが enabled |
| 4 | 送信中表示 | submit クリック → fetch 未解決 | ボタン文言が `▸ sending...`、フォーム disabled |
| 5 | 送信成功 | fetch=200 解決 | フォームが消え、`▸ message sent.` と back to home リンク表示 |
| 6 | 送信失敗（send_failed） | fetch=502 | フォーム残存、上部に「送信に失敗しました…」バナー、Turnstile リセット呼び出し |
| 7 | 送信失敗（captcha_failed） | fetch=`400 captcha_failed` | 上部に「ロボット判定に失敗…」バナー、Turnstile リセット |
| 8 | inline エラー（client validation） | email に `abc` 入れて submit | inline で「メールアドレスの形式が正しくありません」、API は呼ばれない |
| 9 | name の長さ超過 | 51文字の name | inline 「お名前を入力してください（50字以内）」 |
| 10 | body の最小 | 9文字の body | inline 「本文は 10〜2000 文字…」 |

### モック方針

| 対象 | モック方法 |
|---|---|
| `global.fetch` | `jest.spyOn(global, 'fetch').mockResolvedValue(...)` |
| `resend` SDK | ファイル冒頭で `jest.mock('resend', () => ({ Resend: jest.fn(() => ({ emails: { send: jest.fn() } })) }))` |
| `next/router` | コンポーネントテストでは `<Link>` のクリックを検証する程度。完了画面の back to home は `<Link href="/">` が描画されていれば OK（実際の遷移はテストしない） |
| Turnstile `<script>` | テスト環境では未読み込み。`window.turnstile` を `{ reset: jest.fn() }` で stub し、`data-callback` 用のグローバル関数を直接呼ぶ |
| 環境変数 | `process.env.RESEND_API_KEY` 等を `beforeEach` でセット、`afterEach` で復元 |

### 実装順序（TDD ループの並び）

各ステップで「テスト先 → 実装 → 緑」を1セット：

1. テスト基盤の導入（jest 関連 devDeps + 設定ファイル + 動作確認の sanity test）
2. `validate()` 関数（純関数 → 最も TDD と相性が良い）
3. `pages/api/contact.ts`（validate を再利用、Turnstile/Resend モック）
4. `<ContactForm />` の idle 状態とフィールド入力
5. `<ContactForm />` の submitting 状態
6. `<ContactForm />` の done 状態
7. `<ContactForm />` のエラーバナー / inline エラー
8. `pages/contact.tsx` の薄いラッパー（テスト不要、目視確認）
9. `pages/index.tsx` のリンク差し替え（既存テストなし、目視確認）

### CI 連携

本リポジトリは現在 CI 未設定。本 spec のスコープでは CI 追加を行わない（YAGNI）。ローカルで `npm test` がパスすれば実装完了とみなす。CI 化は別 spec で扱う。

### カバレッジ目標

数値目標は設けない。代わりに「上記テストケース表を全て満たすこと」を完了条件とする。カバレッジツールは導入しない。

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
- [ ] `npm test` がパス、テスト戦略セクションに列挙したケースが全て緑
- [ ] 各実装ステップが TDD（Red → Green → Refactor）で進められた
