# Next.js アップグレード & App Router 移行 設計書

- 作成日: 2026-05-03
- ステータス: 設計確定（実装計画作成前 / コード未着手）
- 対象ブランチ: `claude/plan-nextjs-upgrade-rbzjo`
- 関連: 全 `pages/*` と `_app.tsx`, `_document.js`, `next.config.js`, `package.json`, `tsconfig.json`

---

## 背景・目的

### 背景

現在のリポジトリは Next.js **13.2.4**（Pages Router）で停止している。13 系は 2 メジャー古く、以下のモダン標準を享受できていない:

- App Router（Server Components, Streaming, Nested Layouts, Parallel/Intercepting Routes）
- Server Actions / Route Handlers の標準化
- `next/font` による Google Fonts のセルフホスト
- 改善された Image / Script コンポーネント
- Turbopack による高速 dev / build
- React 18 → 19（Next 15 で標準）の Suspense / use() / Action API
- Metadata API（`<Head>` 不要）
- `@next/third-parties/google` による GA の標準化
- async dynamic APIs (`cookies()` / `headers()` / `params`) と新キャッシュ戦略

### 目的

1. **追従可能な状態へ復帰** — 最新の安定 Next.js（本書執筆時点では 15 系を到達点とする。実装着手時に最新安定を再確認）に揃え、今後の継続アップグレードコストを最小化する
2. **Pages Router → App Router 全面移行** — 今後追加される標準機能（Server Components / Streaming / Server Actions 等）を素直に使えるようにする
3. **無停止移行** — Pages Router と App Router の共存を活かし、ルート単位で段階的に切り替える（リスクの局所化）
4. **副作用を伴う他要素の刷新は分離** — Chakra UI v2→v3、Tailwind v3→v4、TS strict 強化、jest→vitest などは本タスクのスコープ外（YAGNI）

---

## スコープ

### やること

- Next.js **13.2.4 → 14.x → 15.x** の段階アップグレード
- React **18.2 → 19.x**（Next 15 同梱版に追従）
- すべての `pages/*` ルートを `app/*` に移行
- `_app.tsx` / `_document.js` を `app/layout.tsx` に統合
- `<Head>` を **Metadata API** に置換
- `pages/api/contact.ts` を **Route Handler** (`app/api/contact/route.ts`) に置換
- `getStaticProps` / `getStaticPaths` を **Server Component の `fetch` + `generateStaticParams`** に置換
- GA 実装を `@next/third-parties/google` に置換
- Google Fonts を `_document.js` の `<link>` から **`next/font/google`** へ移行
- Chakra UI v2 を App Router で動作させる（`@chakra-ui/next-js` の `CacheProvider` 導入）
- `next/router` 利用箇所を `next/navigation` に置換
- TypeScript 設定の App Router 対応（`moduleResolution: "bundler"`, `target: "ES2022"` 程度に更新）
- 既存テスト（Jest）が引き続き通ることの確認

### やらないこと（YAGNI / Out of Scope）

- Chakra UI v2 → v3 の API 移行（破壊的変更が大きいため別タスク）
- Tailwind v3 → v4 移行
- jest → vitest 移行
- Server Actions の積極導入（contact フォームは Route Handler のままで良い。Action 化は次フェーズで判断）
- Edge Runtime 化
- ISR / Streaming / Suspense の積極活用（受け皿だけ作り、現状の SSG 相当を維持）
- CMS 接続層（`graphql-request`）の刷新
- 静的エクスポート (`output: 'export'`) 化

---

## 現状の棚卸し

### ルート一覧と移行マッピング

| 現状 (Pages Router) | 移行先 (App Router) | 種別 | 主な検討点 |
|---|---|---|---|
| `pages/_app.tsx` | `app/layout.tsx` + `app/providers.tsx` | レイアウト | Chakra Provider / GA / Layout 共通枠 |
| `pages/_document.js` | `app/layout.tsx`（`<html>` `<body>` 直書き） | HTML 骨格 | Google Fonts は `next/font/google`、`ColorModeScript` は body 直下 |
| `pages/index.tsx` (`getStaticProps`) | `app/page.tsx` (server component) | SSG | `getPosts()` を直接 `await` |
| `pages/post/index.js` (`getStaticProps`) | `app/post/page.tsx` + `app/post/PostList.client.tsx` | SSG + CSR フィルタ | `useRouter`/`useState` 部分のみ Client |
| `pages/post/[slug].js` (`getStaticProps`+`getStaticPaths`) | `app/post/[slug]/page.tsx` | SSG 動的 | `generateStaticParams` + `generateMetadata` |
| `pages/work/index.js` | `app/work/page.tsx` | 静的 | データ取得なし、そのまま Server Component |
| `pages/contact.tsx` | `app/contact/page.tsx` + `ContactForm` (既存 `'use client'`) | 静的 + Client Form | `<Script>` (Turnstile) は `next/script` を Client Layout 内で読込 |
| `pages/api/contact.ts` | `app/api/contact/route.ts` | API | `NextRequest` / `NextResponse` の Route Handler |

### `getServerSideProps` の使用状況

**なし**。全ページ `getStaticProps`（または静的）のみ。
→ App Router 移行時はデフォルトで Server Component として静的化され、`generateStaticParams` でビルド時パスを列挙するだけで現状の SSG 等価を維持できる。

### 'use client' が必要になる既存コンポーネント

`useState` / `useEffect` / Chakra フック / `next/router` を使う以下は移行時に `'use client'` 宣言が必須:

- `components/Chakra.jsx`（ChakraProvider）
- `components/Header.jsx` → 内部で `useRouter` を使用
- `components/ui/MenuBar.jsx` → `useColorMode`, `useDisclosure`, Drawer など
- `components/ContactForm.jsx`
- `pages/post/index.js` 由来の **フィルタ UI 部分**（クライアント分割）

Server Component のままで良いもの:

- `components/Layout.jsx`（ただし Header/Footer は client 境界を内包）
- `components/Footer.jsx`（純粋表示）
- `components/PostDetail.jsx`（純粋表示・rich text レンダ）
- `components/ui/TitleBar.jsx`, `DitherBlock.jsx`, `SectionHeading.jsx`, `SocialRow.jsx`, `StatusBar.jsx`

---

## 設計方針

### 1. アップグレード戦略：段階的メジャー昇格

**13 → 15 の一気飛ばしを禁止**。各メジャーごとに codemod 適用 → ビルド成功 → コミットを繰り返す。

```
[Phase A] 13.2.4 → 14.2.x   （Pages Router のまま動く状態を担保）
[Phase B] 14.2.x → 15.x     （Pages Router のまま動く状態を担保）
[Phase C] App Router 移行    （pages/ と app/ の共存で 1 ルートずつ）
[Phase D] pages/ 完全撤去
```

各 Phase で `npm run build` と `npm test` がグリーンであることを終了条件とする。

#### codemod の活用

- `npx @next/codemod@latest upgrade latest` で依存更新の自動化
- `npx @next/codemod@latest next-async-request-api .` で Next 15 の async dynamic APIs 対応
- `npx @next/codemod@latest app-dir-runtime-config-experimental .` 等は適用後に diff レビュー必須

### 2. App Router の最小骨格

#### 2a. `app/layout.tsx`（Root Layout）

役割:
- `<html>` / `<body>` の出力（`_document.js` の置換）
- グローバル CSS の読み込み（`styles/global.css`）
- `next/font/google` で Google Fonts をセルフホスト（DotGothic16 / IBM Plex / Silkscreen / VT323）
- `<Providers>` で Chakra をラップ（client 境界）
- GA を `@next/third-parties/google` の `<GoogleAnalytics />` で挿入
- `<Layout>`（共通枠）で children をラップ

擬似構成:

```
RootLayout (server)
├─ <html>
│  └─ <body>
│     ├─ <ColorModeScript />            ← Chakra v2 推奨配置
│     ├─ <Providers>                    ← 'use client' / ChakraProvider + CacheProvider
│     │  └─ <Layout>                    ← 共通枠（border, max-w-720 など）
│     │     └─ {children}
│     ├─ <GoogleAnalytics gaId={...} /> ← @next/third-parties/google
│     └─ <Script src="turnstile" ... /> ← contact ページのみで読み込みたい場合は contact レイアウトに移す
```

#### 2b. `app/providers.tsx`（Client Boundary）

```
'use client';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../theme';

export function Providers({ children }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </CacheProvider>
  );
}
```

`@chakra-ui/next-js` を新規依存として追加（Chakra v2 + App Router の正式アダプタ）。

#### 2c. Metadata の取り扱い

各ページで:

```
export const metadata = { title: 'Ryo Miyata — Posts' };
```

動的ページ（`/post/[slug]`）は:

```
export async function generateMetadata({ params }) {
  const { slug } = await params;            // Next 15: params は Promise
  const post = await getPostDetails(slug);
  return { title: `${post.title} — Ryo Miyata` };
}
```

ルートメタデータは `app/layout.tsx` に `metadata` で宣言（OG 画像なども将来ここに集約）。

### 3. データ取得の置換ルール

| 旧 | 新 |
|---|---|
| `getStaticProps` | Server Component 内で直接 `await getPosts()` |
| `getStaticPaths` (`fallback: false`) | `export async function generateStaticParams()` |
| `getServerSideProps` | （未使用 / 採用しない） |
| `revalidate: N` | ページに `export const revalidate = N;` |

**Next 15 のキャッシュ仕様変更に注意**:
- `fetch` のデフォルトはノーキャッシュ。`getPosts` は Hygraph への GraphQL リクエストなので、明示的に `next: { revalidate: 3600 }` などを `request()` 呼び出しに乗せられない場合は **ページ側で `export const revalidate = 3600`** を設定して SSG/ISR 化する
- `graphql-request` は `fetch` ベースなので、`request(endpoint, query, vars, headers, { next: { revalidate } })` の第 5 引数で渡す（ライブラリの該当バージョンの API を実装時に確認）
- どうしても制御が困難な場合は `services/` 内で `cache: 'force-cache'` を明示した薄い `fetch` ラッパーに退避する選択肢を残す

### 4. ルーター API の置換

| 旧 (`next/router`) | 新 (`next/navigation`) |
|---|---|
| `useRouter().asPath` | `usePathname()` + `useSearchParams()` を結合 |
| `router.query.category` | `useSearchParams().get('category')` |
| `router.events.on('routeChangeComplete', ...)` | `usePathname` / `useSearchParams` を `useEffect` で監視するカスタムフック |
| `router.push()` | `useRouter()` from `next/navigation` の `push()`（API 非互換） |

GA のページビュー送信は `@next/third-parties/google` が自動で route 変更を拾うため、現行の `useEffect`+`router.events` ロジックは **削除可能**。

### 5. API ルートの Route Handler 化

`pages/api/contact.ts` → `app/api/contact/route.ts`:

```
export async function POST(req: NextRequest) {
  // 既存の handler 内ロジックをほぼそのまま流用
  // - req.json() で body 取得
  // - NextResponse.json({...}, { status: 400 }) で応答
  // - method 判定は不要（POST 関数のみ export すれば 405 は自動）
}
```

検討事項:
- レスポンス型 `ApiResponse` は `lib/contactApi.ts` 等に切り出して型を共有
- `validate` (`lib/validateContact.ts`) はそのまま流用
- IP 取得は `req.headers.get('x-forwarded-for')`
- Resend 呼び出しはサーバー側のまま（Route Handler はサーバー実行）

### 6. フォントの取り扱い

`_document.js` の `<link>` プリロードを廃止し、`next/font/google` で各フォントを宣言:

```
import { Silkscreen, DotGothic16, IBM_Plex_Sans_JP, IBM_Plex_Mono, VT323 } from 'next/font/google';
```

`<html>` の `className` に CSS 変数を渡し、Tailwind の `font-pixel` などのクラス定義を CSS 変数経由に切り替える。

**注意**: `IBM Plex Sans JP` は `next/font/google` 対応外の場合あり。実装着手時にカタログを確認し、未対応なら従来どおり `<link>` を `app/layout.tsx` 内に残す（Metadata の `<head>` 自動マージで動作）。

### 7. Chakra UI v2 の延命方針

- Chakra v2 は React 19 / Next 15 と公式互換性が限定的（peer warning が出る可能性）。動作には支障ない見込みだが、`--legacy-peer-deps` か `npm overrides` で peer 競合を吸収する用意をする
- `ColorModeScript` は `app/layout.tsx` の `<body>` 直下に配置（hydration 前にカラーモードを確定するため）
- 将来的な Chakra v3 移行は別 PR

### 8. `next.config.js` の更新

- `optimizeFonts` は Next 14 で除去された（自動化）→ 削除
- `redirects` はそのまま（`/category/:slug` → `/post?category=:slug`）
- 必要なら `experimental.typedRoutes: true` を導入してルート文字列の型安全性を上げる（任意・コスト低）
- `images.remotePatterns` は Hygraph 配信画像を将来 `next/image` 化する場合に追加（本タスクでは見送り）

### 9. テスト・ビルド検証

- 既存テスト: `__tests__/api/contact.test.ts` は API ハンドラを直接 import して呼ぶ形式 → Route Handler 化後は `POST` 関数を直接 import してテストする形に書き換える（**コードは書かないが、書き換え方針は明記**）
- `components/__tests__/ContactForm.test.jsx` は Client Component なのでそのまま動作見込み
- `jest.config.js` / `jest.setup.ts` の確認: `next/jest` 利用なら最新版に追従。Server Component の単体テストは jest では実用的でないため、E2E/手動検証で代替

---

## 実装フェーズ

### Phase A: Next 13 → 14（Pages Router 維持）

1. `package.json` の `next` を 14.2.x に更新
2. `npx @next/codemod@latest upgrade latest`（14 用 codemod 一式適用）
3. `optimizeFonts` を `next.config.js` から削除
4. `npm run build` グリーン
5. `npm test` グリーン
6. ローカルで全ページ目視確認 → コミット

### Phase B: Next 14 → 15

1. `package.json` の `next` を 15.x、`react` `react-dom` を 19.x、`@types/react` を対応版に更新
2. `npx @next/codemod@latest next-async-request-api .` を Pages Router 配下にも一応適用（API ルート向けの async API 化）
3. Chakra v2 の peer warning を確認 → 必要なら `npm overrides` で `react` を 19 系に固定
4. `npm run build` / `npm test` グリーン
5. ローカル確認 → コミット

### Phase C: App Router 共存セットアップ

1. `app/layout.tsx` 作成（`<Providers>` + `<GoogleAnalytics>` + `<Layout>` をラップ）
2. `app/providers.tsx` を Client Component として作成
3. `@chakra-ui/next-js` を依存追加
4. `@next/third-parties` を依存追加
5. グローバル CSS の import を `_app.tsx` から `app/layout.tsx` に移管
6. **この時点では `pages/` 配下も生きている**（Next.js は両者を共存させるが、同一 URL の衝突は禁止）
7. `pages/_app.tsx` `_document.js` の役割が `app/layout.tsx` に移ったことを確認
8. ビルド・動作確認

### Phase D: ルート単位の移行（小→大の順）

優先順は **依存が少ない静的ページから**:

1. `/work` → `app/work/page.tsx`（純静的、依存最小）
2. `/contact` → `app/contact/page.tsx` + `app/api/contact/route.ts` 同時移行
3. `/post` → `app/post/page.tsx`（フィルタ部分を `'use client'` 子コンポーネントに分離）
4. `/post/[slug]` → `app/post/[slug]/page.tsx`（`generateStaticParams` + `generateMetadata`）
5. `/` → `app/page.tsx`（最後。失敗時の影響が最大のため最後に倒す）

各ステップで:
- 旧 `pages/xxx` を削除（同 URL の衝突回避）
- `npm run build` / `npm test` グリーン
- 該当ページをローカル目視確認
- コミット

### Phase E: 旧資産の撤去

1. `pages/_app.tsx`, `pages/_document.js`, 残った `pages/` 全削除
2. `next/router` への依存が残っていないか grep
3. `<Head>` 利用が残っていないか grep
4. `tsconfig.json` を App Router 推奨に更新（`moduleResolution: "bundler"`, `target: "ES2022"`, `plugins: [{ name: "next" }]` 確認）
5. README / CLAUDE.md の "pages/" 記述を "app/" に更新
6. 最終ビルド・テスト・E2E 手動確認 → 仕上げコミット

---

## 修正・新設ファイル一覧（予定）

### 新設

| ファイル | 役割 |
|---|---|
| `app/layout.tsx` | Root Layout（旧 `_document` + 旧 `_app` の共通枠） |
| `app/providers.tsx` | `'use client'` Chakra/CacheProvider |
| `app/page.tsx` | `/` |
| `app/post/page.tsx` | `/post`（Server Component） |
| `app/post/PostListClient.tsx` | `/post` のフィルタ UI（Client） |
| `app/post/[slug]/page.tsx` | `/post/[slug]` |
| `app/work/page.tsx` | `/work` |
| `app/contact/page.tsx` | `/contact` |
| `app/api/contact/route.ts` | Route Handler |
| `lib/useGtagPageview.ts` | （任意）独自実装を残す場合のフック。`@next/third-parties/google` 採用なら不要 |

### 修正

| ファイル | 変更点 |
|---|---|
| `package.json` | `next` 15.x / `react` 19.x / `@chakra-ui/next-js` 追加 / `@next/third-parties` 追加 |
| `next.config.js` | `optimizeFonts` 削除、必要なら `experimental.typedRoutes` |
| `tsconfig.json` | `target: "ES2022"`, `moduleResolution: "bundler"`, `plugins: [{ name: "next" }]` |
| `components/Chakra.jsx` | `app/providers.tsx` に統合し削除 |
| `components/Header.jsx` | `'use client'` 付与（または `useRouter` を `usePathname` に置換） |
| `components/ui/MenuBar.jsx` | `'use client'` 付与 |
| `services/index.jsx` | キャッシュ設定（`next: { revalidate }`）の引き渡し |
| `lib/gtag.js` | `@next/third-parties/google` 採用なら削除 |
| `__tests__/api/contact.test.ts` | Route Handler の `POST` 関数を直接呼ぶ形に書き換え |
| `CLAUDE.md` | `pages/` 記述を `app/` に更新、Next バージョン更新 |

### 削除

| ファイル | 理由 |
|---|---|
| `pages/_app.tsx` | `app/layout.tsx` に統合 |
| `pages/_document.js` | `app/layout.tsx` に統合 |
| `pages/index.tsx` | `app/page.tsx` に移行 |
| `pages/post/index.js` | `app/post/page.tsx` に移行 |
| `pages/post/[slug].js` | `app/post/[slug]/page.tsx` に移行 |
| `pages/work/index.js` | `app/work/page.tsx` に移行 |
| `pages/contact.tsx` | `app/contact/page.tsx` に移行 |
| `pages/api/contact.ts` | `app/api/contact/route.ts` に移行 |
| `components/Chakra.jsx` | `app/providers.tsx` に統合 |

---

## リスクと対策

| リスク | 影響 | 対策 |
|---|---|---|
| Chakra v2 の React 19 / Next 15 非互換 | hydration エラー、SSR 崩壊 | `@chakra-ui/next-js` の `CacheProvider` を導入。peer warning は `overrides` で吸収。最悪 v2 のまま React 18 ピン留めも検討（次フェーズで v3 移行） |
| `next/font/google` での `IBM Plex Sans JP` 非対応 | フォント崩れ | `app/layout.tsx` 内で従来の `<link>` を残す（`<head>` への直接記述で動作） |
| Hygraph レスポンスのキャッシュが効かず ビルド時間増 / 実行時呼び出し過多 | パフォーマンス劣化 | ページ単位で `export const revalidate = N` を必ず設定。`graphql-request` のキャッシュオプションが渡せない場合は `fetch` 直書きラッパーへ退避 |
| Tailwind と Chakra の併存崩れ（CSS 読込順） | スタイル崩れ | グローバル CSS を `app/layout.tsx` の最上位 import に固定。Chakra の `Global` リセットと Tailwind の `preflight` の競合は現状と同条件のため新規破綻は想定なし |
| GA の二重計測 / 計測漏れ | 解析データ汚染 | `@next/third-parties/google` 採用後は旧 `lib/gtag.js` と `_app.tsx` の `Script` ブロックを完全削除。本番反映前に GA Realtime で 1 PV のみ計上されることを確認 |
| ルート移行中の URL 衝突 | ビルドエラー | 1 ルートずつ「`pages/` 削除 → `app/` 追加」を 1 コミットで行う。両者同時存在を作らない |
| codemod の暴走（意図しない書き換え） | 隠れバグ混入 | `git diff --stat` で影響範囲確認 → 大きなファイルは個別レビュー → 1 codemod = 1 コミット |
| `getStaticPaths` の `fallback: false` 仕様差 | 404 挙動変化 | `generateStaticParams` の戻り値外パスは Next 15 デフォルトで 404。`export const dynamicParams = false` を明示して挙動固定 |
| Resend / Turnstile env 変数未設定での dev 起動 | 動作確認不能 | 既存の `.env.local` 運用を踏襲。Phase D の contact 移行時に `.env.local` の検証を行う |

---

## 完了条件（Definition of Done）

1. `package.json` の `next` が 15.x、`react` が 19.x
2. `pages/` ディレクトリが**完全に存在しない**
3. `app/` 配下に全ルートが揃い、すべての URL が旧と同等にレンダリングされる
4. `npm run build` が警告なしでグリーン（peer warning は許容、deprecation warning はゼロを目指す）
5. `npm test` グリーン（既存 2 テストが新形式で動作）
6. 以下を手動確認:
   - `/`, `/post`, `/post/[slug]`, `/work`, `/contact` の表示
   - `/post` のフィルタ UI（`?category=xxx` パラメータ含む）
   - `/contact` フォーム送信（Turnstile 含む）
   - ダーク/ライトモード切替
   - GA Realtime に PV が記録される
   - `/category/:slug` → `/post?category=:slug` のリダイレクトが生きている
7. CLAUDE.md の "Project Architecture" セクションが App Router 構成を反映

---

## 検証方法

### 自動

```bash
npm run build       # 各 Phase 完了時
npm test            # 各 Phase 完了時
```

### 手動チェックリスト（Phase D / E 完了時）

- [ ] `/` のヒーロー、posts 一覧、creations、contact リンクが表示される
- [ ] `/post` のフィルタが動く（all / 各カテゴリ）
- [ ] `/post?category=xxx` で URL 直アクセス時にフィルタが効いている
- [ ] `/post/[slug]` 全件のリッチテキストが表示される
- [ ] `/work` のカードが表示される
- [ ] `/contact` のフォームが送信成功し、メールが届く
- [ ] Turnstile widget がレンダリングされる
- [ ] ヘッダーのカラーモード切替が動く（リロード後の保持含む）
- [ ] モバイル（375px）でメニュー Drawer が開く
- [ ] `/category/foo` が `/post?category=foo` に 308 でリダイレクトされる
- [ ] GA に 1 セッション = 1 PV で記録される（複数計上されない）
- [ ] DevTools の Console / Network にエラーなし

---

## 参考: コミット粒度の指針

| Phase | コミット数の目安 |
|---|---|
| A | 1 〜 2（依存更新 + codemod 適用 / 設定整理） |
| B | 1 〜 2 |
| C | 2 〜 3（layout / providers / GA・font 移行） |
| D | 5（ルート 5 種をそれぞれ独立コミット） + 1（API ルート） |
| E | 1 〜 2（撤去 + ドキュメント更新） |

合計でおおよそ **10〜15 コミット** を想定。各コミットで `npm run build` グリーンを維持する。
