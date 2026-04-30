# ポートフォリオ全面リデザイン 実装プラン

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ポートフォリオサイト全体を 1-bit Mac × ダーク × 純2色 × 縦スクロールのデザインに刷新する。設計書: [docs/superpowers/specs/2026-04-30-portfolio-redesign-design.md](../specs/2026-04-30-portfolio-redesign-design.md)。

**Architecture:** CSS変数とユーティリティクラスを基盤に、`components/ui/` に小さな再利用可能シェル部品（TitleBar/MenuBar/StatusBar/DitherBlock/SectionHeading）を作成。Header/Footer/Layout を新シェル部品で組み直し、各ページ（home/posts/post detail/work）を段階的に新スタイルへ移行。最後に不要コンポーネント・パッケージ・アセットを一括削除。

**Tech Stack:** Next.js 13.2 (Pages Router) / React 18 / TypeScript 5.3 + JavaScript 混在 / Chakra UI（Drawer + useColorMode のみ） / Tailwind CSS / Hygraph (GraphCMS) / Google Fonts (Silkscreen, DotGothic16, IBM Plex Sans JP, IBM Plex Mono, VT323)

---

## 検証方針（重要）

このリポジトリには **自動テストフレームワークが存在しない**（CLAUDE.md 明記）。各タスクの検証は次の3点で行う:

1. **ビルド成功**: `npm run build` がエラーなく完了
2. **目視確認**: `npm run dev` で対象URLを開き、変更が想定通り見えるか確認（ホームは `/`、投稿一覧は `/post`、投稿詳細は `/post/[任意のslug]`、作品は `/work`）
3. **参照消失**: 削除タスクでは `grep -rn "<削除対象>" .` で残存参照ゼロを確認

各タスクの最終ステップでこれらを実行。

---

## ファイル構造（タスク完了後の状態）

### 新規作成

- `components/ui/TitleBar.jsx` — Mac風タイトルバー（縞コントラスト 32%）
- `components/ui/MenuBar.jsx` — メニューバー（ナビ + カラーモードトグル）
- `components/ui/StatusBar.jsx` — フッター下部のステータスバー
- `components/ui/DitherBlock.jsx` — ヒーロー後のディザ罫線
- `components/ui/SectionHeading.jsx` — `// section-name` 見出し
- `components/ui/SocialRow.jsx` — フッター上部のソーシャルリンク行
- `components/ui/index.js` — UI部品 barrel export

### 全面書き換え

- `styles/colors.css` — 純2色トークンへ
- `styles/global.css` — 1-bit ユーティリティクラス + リセット
- `pages/_document.js` — Google Fonts へ差替え
- `components/Header.jsx` — TitleBar + MenuBar + Drawer
- `components/Footer.jsx` — SocialRow + StatusBar
- `components/Layout.jsx` — 新トークン参照、デッドコード除去
- `pages/index.tsx` — ホーム再構築（Bio削除、画像削除、新セクション）
- `pages/post/index.js` — 一覧再構築（カテゴリフィルタ + listrow）
- `pages/post/[slug].js` — Loader 依存除去
- `components/PostDetail.jsx` — 記事ヘッダ + 本文タイポ階層
- `pages/work/index.js` — 1-bit ボーダーカードグリッド

### 設定変更

- `next.config.js` — `/category/[slug]` → `/post?category=...` リダイレクト追加
- `package.json` — 未使用パッケージ削除

### 削除

- `components/TypingAnimation.jsx`
- `components/CatLogo.jsx`
- `components/ColorTheme/` (ディレクトリ丸ごと)
- `components/ToggleSwitch/` (ディレクトリ丸ごと)
- `components/Loader.jsx`
- `components/PostCard.jsx`
- `components/Categories.jsx`
- `pages/category/[slug].js`
- `services/index.jsx::getCategoryPost`
- `public/assets/images/typing-image.png`
- `public/assets/images/self-image.jpg`
- `public/assets/images/dev-image1.png`
- `components/index.js` から削除分のexport

---

## Task 1: CSS トークンの刷新

**Files:**
- Modify: `styles/colors.css`（全面書き換え）

旧変数（`--accent`, `--secondary-button`, `--dark-text-secondary` など）を全廃し、純2色トークンへ。

- [ ] **Step 1: `styles/colors.css` を全面書き換え**

```css
:root {
  /* 1-bit pure two-color tokens */
  --bg: #0A0A0A;
  --fg: #E8E8E8;
  --border: var(--fg);
}

/* Light mode = inverted */
[data-theme="light"]:root,
.chakra-ui-light:root {
  --bg: #E8E8E8;
  --fg: #0A0A0A;
}
```

- [ ] **Step 2: 旧変数の参照が消えるかコンパイルだけ確認（この時点では既存ページが壊れる予定。OK）**

Run: `grep -rn "var(--accent)\|var(--text-secondary)\|var(--dark-bg)\|var(--primary-button)\|var(--secondary-button)" --include='*.jsx' --include='*.tsx' --include='*.js' --include='*.css' .`

Expected: 既存ページ・コンポーネントから多数ヒット（後続タスクで全部書き換えるので OK）。リスト化してメモする。

- [ ] **Step 3: コミット**

```bash
git add styles/colors.css
git commit -m "1-bit Macリデザイン: カラートークンを純2色に刷新"
```

---

## Task 2: Google Fonts の読み込み

**Files:**
- Modify: `pages/_document.js`

旧 Noto Sans JP のリンクを削除し、Silkscreen / DotGothic16 / IBM Plex Sans JP / IBM Plex Mono / VT323 を 1 行で読み込む。

- [ ] **Step 1: `pages/_document.js` の `<Head>` 内 `<link href="...Noto+Sans+JP...">` を以下に置換**

```jsx
<link
  href="https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&family=DotGothic16&family=IBM+Plex+Sans+JP:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500;700&family=VT323&display=swap"
  rel="stylesheet"
/>
```

- [ ] **Step 2: `<body style={{ backgroundColor: '#EDDFD6' }}>` のインラインスタイルを削除**

```jsx
<body>
```

理由: 旧ベージュ色をやめ、CSS変数 `--bg` で統一。

- [ ] **Step 3: ビルド確認**

Run: `npm run build`
Expected: エラーなく完了。

- [ ] **Step 4: コミット**

```bash
git add pages/_document.js
git commit -m "1-bit Macリデザイン: Google Fontsをビットマップ系5種に差替え"
```

---

## Task 3: グローバルスタイルとユーティリティクラスの刷新

**Files:**
- Modify: `styles/global.css`（全面書き換え）

Tailwindベースを保ちつつ、1-bit用のユーティリティ（`.dither` `.titlebar-stripes` `.font-pixel` 等）を追加。旧アニメーション (`fade-in`, keyframes) は削除。

- [ ] **Step 1: 現在の `styles/global.css` を読んで保存対象だけ把握**

Run: `cat styles/global.css`

- [ ] **Step 2: `styles/global.css` を以下に全面置換**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ===== Reset ===== */
html, body {
  background-color: var(--bg);
  color: var(--fg);
  font-family: "DotGothic16", "IBM Plex Sans JP", system-ui, monospace;
  font-size: 14px;
  line-height: 1.7;
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: none;
  image-rendering: pixelated;
}

a {
  color: inherit;
  text-decoration: underline;
}

a:hover {
  background: var(--fg);
  color: var(--bg);
}

/* ===== Font helpers ===== */
.font-pixel { font-family: "Silkscreen", monospace; }
.font-jp    { font-family: "DotGothic16", monospace; }
.font-body  { font-family: "IBM Plex Sans JP", "DotGothic16", system-ui, sans-serif; }
.font-mono  { font-family: "IBM Plex Mono", monospace; }
.font-vt    { font-family: "VT323", monospace; }

/* ===== 1-bit dither block ===== */
.dither {
  height: 22px;
  background:
    radial-gradient(var(--fg) 1px, transparent 1.4px) 0 0/3px 3px,
    radial-gradient(var(--fg) 1px, transparent 1.4px) 1.5px 1.5px/3px 3px;
}

/* ===== Title bar stripes (32% contrast for low eye strain) ===== */
.titlebar-stripes {
  background: repeating-linear-gradient(
    0deg,
    rgba(232, 232, 232, 0.32) 0 1px,
    transparent 1px 3px
  );
}

[data-theme="light"] .titlebar-stripes,
.chakra-ui-light .titlebar-stripes {
  background: repeating-linear-gradient(
    0deg,
    rgba(10, 10, 10, 0.32) 0 1px,
    transparent 1px 3px
  );
}

/* ===== Cursor blink (only animation in the system) ===== */
@keyframes blink {
  50% { opacity: 0; }
}
.cursor-blink {
  display: inline-block;
  background: var(--fg);
  animation: blink 1.1s steps(2) infinite;
}
```

- [ ] **Step 3: ビルド確認**

Run: `npm run build`
Expected: エラーなく完了。

- [ ] **Step 4: 開発サーバで起動して背景が黒になるか目視**

Run: `npm run dev` → ブラウザで `http://localhost:3000`
Expected: ページ全体が `#0A0A0A` の暗い背景に。既存ページの中身は崩れているが、それは後続タスクで直す。

- [ ] **Step 5: コミット**

```bash
git add styles/global.css
git commit -m "1-bit Macリデザイン: グローバルCSSを1-bitユーティリティに刷新"
```

---

## Task 4: UI シェル部品の作成（5部品 + barrel）

**Files:**
- Create: `components/ui/TitleBar.jsx`
- Create: `components/ui/MenuBar.jsx`
- Create: `components/ui/StatusBar.jsx`
- Create: `components/ui/DitherBlock.jsx`
- Create: `components/ui/SectionHeading.jsx`
- Create: `components/ui/SocialRow.jsx`
- Create: `components/ui/index.js`

各部品は単機能・スタイルは Tailwind + CSSユーティリティクラスで完結。

- [ ] **Step 1: ディレクトリ作成**

Run: `mkdir -p components/ui`

- [ ] **Step 2: `components/ui/TitleBar.jsx` を作成**

```jsx
import React from 'react';

const TitleBar = ({ path = '/' }) => {
  return (
    <div className="relative h-[18px] border-b border-current titlebar-stripes">
      <div className="absolute left-[5px] top-[3px] w-[10px] h-[10px] border border-current bg-[color:var(--bg)]" />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-2 font-pixel text-[9px]"
        style={{ background: 'var(--bg)' }}
      >
        ryo.miyata — {path}
      </div>
    </div>
  );
};

export default TitleBar;
```

- [ ] **Step 3: `components/ui/MenuBar.jsx` を作成**

```jsx
import React from 'react';
import NextLink from 'next/link';
import { useColorMode, useDisclosure, IconButton, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerBody } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

const MenuItems = ({ onClick }) => (
  <>
    <NextLink href="/post" onClick={onClick} className="font-pixel text-[9px] underline">posts</NextLink>
    <NextLink href="/work" onClick={onClick} className="font-pixel text-[9px] underline">creations</NextLink>
    <a href="https://github.com/miyata09x0084" target="_blank" rel="noopener noreferrer" onClick={onClick} className="font-pixel text-[9px] underline">github</a>
  </>
);

const MenuBar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className="h-[22px] border-b border-current border-dashed flex items-center gap-[14px] px-3 font-pixel text-[9px]">
      <NextLink href="/" className="font-pixel">▸ RYO</NextLink>
      <div className="ml-auto hidden md:flex items-center gap-[14px]">
        <MenuItems />
        <button
          onClick={toggleColorMode}
          aria-label="Toggle color mode"
          className="font-pixel text-[12px] leading-none"
        >
          {colorMode === 'light' ? '☾' : '☀'}
        </button>
      </div>
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        className="ml-auto"
        aria-label="Open menu"
        size="xs"
        variant="unstyled"
        icon={<HamburgerIcon boxSize={3} />}
        onClick={onOpen}
      />
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay bg="blackAlpha.700" />
        <DrawerContent bg="var(--bg)" color="var(--fg)" border="1px solid" borderColor="var(--fg)">
          <DrawerCloseButton />
          <DrawerBody className="font-pixel text-[12px] flex flex-col gap-4 pt-12">
            <MenuItems onClick={onClose} />
            <button
              onClick={() => { toggleColorMode(); onClose(); }}
              className="text-left underline"
            >
              {colorMode === 'light' ? '☾ dark mode' : '☀ light mode'}
            </button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default MenuBar;
```

- [ ] **Step 4: `components/ui/StatusBar.jsx` を作成**

```jsx
import React from 'react';

const StatusBar = ({ left, center, right }) => {
  return (
    <div className="border-t border-current px-3 py-[6px] font-vt text-[13px] flex gap-[14px] opacity-65">
      {left && <span>{left}</span>}
      {center && <span>{center}</span>}
      {right && <span className="ml-auto">{right}</span>}
    </div>
  );
};

export default StatusBar;
```

- [ ] **Step 5: `components/ui/DitherBlock.jsx` を作成**

```jsx
import React from 'react';

const DitherBlock = () => <div className="dither" />;

export default DitherBlock;
```

- [ ] **Step 6: `components/ui/SectionHeading.jsx` を作成**

```jsx
import React from 'react';

const SectionHeading = ({ children }) => (
  <h2 className="font-pixel text-[13px] tracking-[0.08em] mb-3">
    <span className="opacity-55">// </span>{children}
  </h2>
);

export default SectionHeading;
```

- [ ] **Step 7: `components/ui/SocialRow.jsx` を作成（既存Footerのソーシャル維持用）**

```jsx
import React from 'react';

const SocialRow = () => (
  <div className="px-3 py-3 border-t border-current border-dashed flex gap-[18px] font-pixel text-[10px]">
    <a href="https://github.com/miyata09x0084" target="_blank" rel="noopener noreferrer" className="underline">github</a>
    <a href="https://x.com/WebDev_Ryo" target="_blank" rel="noopener noreferrer" className="underline">x</a>
    <a href="https://etherscan.io/address/0x906b1f02B8BBCA762896d368e40C77c857Db6A0B" target="_blank" rel="noopener noreferrer" className="underline">etherscan</a>
  </div>
);

export default SocialRow;
```

- [ ] **Step 8: `components/ui/index.js` を作成**

```js
export { default as TitleBar } from './TitleBar';
export { default as MenuBar } from './MenuBar';
export { default as StatusBar } from './StatusBar';
export { default as DitherBlock } from './DitherBlock';
export { default as SectionHeading } from './SectionHeading';
export { default as SocialRow } from './SocialRow';
```

- [ ] **Step 9: ビルド確認**

Run: `npm run build`
Expected: エラーなく完了（部品は未使用なので警告は出るかもしれない）。

- [ ] **Step 10: コミット**

```bash
git add components/ui
git commit -m "1-bit Macリデザイン: UIシェル部品6種を追加"
```

---

## Task 5: Header の刷新

**Files:**
- Modify: `components/Header.jsx`（全面書き換え）

旧 CatLogo + Chakra HStack ナビを、TitleBar + MenuBar の組み合わせに置換。

- [ ] **Step 1: `components/Header.jsx` を以下に全面置換**

```jsx
import React from 'react';
import { useRouter } from 'next/router';
import { TitleBar, MenuBar } from './ui';

const Header = () => {
  const router = useRouter();
  const path = router.asPath || '/';

  return (
    <header>
      <TitleBar path={path} />
      <MenuBar />
    </header>
  );
};

export default Header;
```

- [ ] **Step 2: ビルド確認**

Run: `npm run build`
Expected: エラーなく完了。

- [ ] **Step 3: 目視確認**

Run: `npm run dev` → `http://localhost:3000`
Expected: ページ最上部にタイトルバー（縞・クローズボックス・パス表示）+ メニューバー（▸ RYO + nav）が表示される。

- [ ] **Step 4: コミット**

```bash
git add components/Header.jsx
git commit -m "1-bit Macリデザイン: HeaderをTitleBar+MenuBar構成に刷新"
```

---

## Task 6: Footer の刷新

**Files:**
- Modify: `components/Footer.jsx`（全面書き換え）

FontAwesome 依存の Github/X/Etherscan アイコン群を、テキストベースの SocialRow + StatusBar に置換。

- [ ] **Step 1: `components/Footer.jsx` を以下に全面置換**

```jsx
import React from 'react';
import { SocialRow, StatusBar } from './ui';

const Footer = () => {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <footer className="mt-auto">
      <SocialRow />
      <StatusBar
        left="uptime: 36y"
        center="v0.42"
        right={`last updated: ${today}`}
      />
    </footer>
  );
};

export default Footer;
```

- [ ] **Step 2: ビルド確認**

Run: `npm run build`
Expected: エラーなく完了。

- [ ] **Step 3: 目視確認**

Run: `npm run dev` → `http://localhost:3000` を最下部までスクロール
Expected: ソーシャル行（github / x / etherscan の下線リンク）+ ステータスバー（uptime / version / last updated）

- [ ] **Step 4: コミット**

```bash
git add components/Footer.jsx
git commit -m "1-bit Macリデザイン: FooterをSocialRow+StatusBar構成に刷新"
```

---

## Task 7: Layout の整理

**Files:**
- Modify: `components/Layout.jsx`

旧 CSS変数参照 (`--bg`/`--dark-bg`/`--text`/`--dark-text`) と動かない `getServerSideProps` を除去。`max-width: 720px` の枠線付きページコンテナで統一。

- [ ] **Step 1: `components/Layout.jsx` を以下に全面置換**

```jsx
import React from 'react';
import { Header, Footer } from './';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-full max-w-[720px] min-h-screen flex flex-col border-x border-current md:border-t md:border-b">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
```

- [ ] **Step 2: ビルド確認**

Run: `npm run build`
Expected: エラーなく完了。

- [ ] **Step 3: 目視確認**

Run: `npm run dev` → `http://localhost:3000`
Expected: 中央 720px の枠が背景の中に立っている。デスクトップでは左右に余白、モバイルでは全幅。

- [ ] **Step 4: コミット**

```bash
git add components/Layout.jsx
git commit -m "1-bit Macリデザイン: Layoutを720px枠+デッドコード除去で整理"
```

---

## Task 8: ホームページの刷新

**Files:**
- Modify: `pages/index.tsx`（全面書き換え）

Hero画像 / 顔写真 / TypingAnimation / Bio セクション / FontAwesome ボタンを削除。新セクション構成: hero → about → interests → posts → creations → contact。

- [ ] **Step 1: `pages/index.tsx` を以下に全面置換**

```tsx
import type { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import { getPosts } from "../services";
import { SectionHeading, DitherBlock } from "../components/ui";

interface PostNode {
  node: {
    title: string;
    slug: string;
    createdAt: string;
    categories?: { name: string; slug: string }[];
  };
}

interface Props {
  posts: PostNode[];
}

const Home: NextPage<Props> = ({ posts }) => {
  const recent = posts.slice(0, 3);

  return (
    <div>
      <Head>
        <title>Ryo Miyata — Home</title>
      </Head>

      {/* Hero */}
      <section className="px-5 pt-8 pb-6">
        <h1 className="font-pixel text-[42px] leading-none tracking-[-0.02em]">
          RYO<br />MIYATA
          <span className="cursor-blink ml-1 w-[14px] h-[36px] align-[-4px]" />
        </h1>
        <div className="font-pixel text-[11px] mt-3 opacity-85 tracking-wider">
          FULL-STACK DEVELOPER · BASED IN JAPAN
        </div>
        <div className="font-jp text-[13px] mt-4 leading-[1.7]">
          ものを作っては考え、考えてはまた作る。<br />
          <span className="opacity-60">Building software, slowly.</span>
        </div>
      </section>

      <DitherBlock />

      {/* About */}
      <section className="px-5 py-5 border-t border-current">
        <SectionHeading>about</SectionHeading>
        <p className="font-jp text-[13px] leading-[1.8]">
          双子の弟として生まれ、頭の中に湧きつづける半端なアイデアをかたちにすることに最も生を感じる。プログラミングはそれを引き出して、人が使えるアプリへと立ち上げるための職人芸。2020年から開発、2023年からフリーランス。
        </p>
      </section>

      {/* Interests */}
      <section className="px-5 py-5 border-t border-current">
        <SectionHeading>interests</SectionHeading>
        <div className="font-pixel text-[11px] tracking-wider">
          ▸ THINKING &nbsp;▸ FOOD-TOURING &nbsp;▸ CAMPING &nbsp;▸ TRAVELING
        </div>
      </section>

      {/* Posts */}
      <section className="px-5 py-5 border-t border-current">
        <SectionHeading>posts</SectionHeading>
        <div>
          {recent.map((p) => (
            <Link
              key={p.node.slug}
              href={`/post/${p.node.slug}`}
              className="grid grid-cols-[12px_1fr_auto] gap-3 py-1.5 border-b border-current border-dashed text-[12px] no-underline hover:bg-[var(--fg)] hover:text-[var(--bg)]"
            >
              <span className="font-pixel">▸</span>
              <span>{p.node.title}</span>
              <span className="font-pixel text-[10px] opacity-60">
                {new Date(p.node.createdAt).toISOString().slice(0, 7).replace('-', '.')}
              </span>
            </Link>
          ))}
        </div>
        <Link href="/post" className="inline-block mt-3 font-pixel text-[11px] underline">
          view all posts ▸
        </Link>
      </section>

      {/* Creations */}
      <section className="px-5 py-5 border-t border-current">
        <SectionHeading>creations</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <a href="https://slide-pilot-474305.web.app/" target="_blank" rel="noopener noreferrer" className="border border-current p-2.5 no-underline hover:bg-[var(--fg)] hover:text-[var(--bg)]">
            <div className="font-pixel text-[11px]">SLIDE PILOT</div>
            <div className="text-[11px] mt-1 opacity-85">Multimodal LLM で PDF を動画に変換</div>
            <span className="inline-block mt-2 font-pixel text-[9px] opacity-60 border border-current px-1.5 py-px">LLM · WEB</span>
          </a>
          <a href="https://kangeki-dapps.web.app/" target="_blank" rel="noopener noreferrer" className="border border-current p-2.5 no-underline hover:bg-[var(--fg)] hover:text-[var(--bg)]">
            <div className="font-pixel text-[11px]">KANGEKI DAPP</div>
            <div className="text-[11px] mt-1 opacity-85">SoulBound Token を発行する分散アプリ</div>
            <span className="inline-block mt-2 font-pixel text-[9px] opacity-60 border border-current px-1.5 py-px">WEB3 · DAPP</span>
          </a>
        </div>
        <Link href="/work" className="inline-block mt-3.5 font-pixel text-[11px] underline">
          view all creations ▸
        </Link>
      </section>

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
    </div>
  );
};

export async function getStaticProps() {
  const posts = (await getPosts()) || [];
  return { props: { posts } };
}

export default Home;
```

- [ ] **Step 2: ビルド確認**

Run: `npm run build`
Expected: エラーなく完了。

- [ ] **Step 3: 目視確認**

Run: `npm run dev` → `http://localhost:3000`
Expected:
- 大きな `RYO MIYATA_` ヒーロー（カーソル点滅）
- ロール「FULL-STACK DEVELOPER · BASED IN JAPAN」
- タグライン2行
- ディザ罫線
- about / interests / posts / creations / contact の5セクション
- Hero画像・顔写真・TypingAnimationが**ない**
- グラデボタンが**ない**

- [ ] **Step 4: コミット**

```bash
git add pages/index.tsx
git commit -m "1-bit Macリデザイン: ホームページを新セクション構成に刷新"
```

---

## Task 9: 投稿一覧ページの刷新

**Files:**
- Modify: `pages/post/index.js`（全面書き換え）

旧 `Categories` + `PostCard` 利用を、インラインのカテゴリフィルタ + listrow に置換。クライアント側でフィルタ状態を持つ。`?category=xxx` クエリで初期値を読み取る（カテゴリ廃止リダイレクト用）。

- [ ] **Step 1: `pages/post/index.js` を以下に全面置換**

```jsx
import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { getPosts, getCategories } from "../../services";
import { DitherBlock, StatusBar } from "../../components/ui";

const PostIndex = ({ posts, categories }) => {
  const router = useRouter();
  const [active, setActive] = useState("all");

  useEffect(() => {
    const q = router.query.category;
    if (typeof q === "string" && q.length > 0) setActive(q);
  }, [router.query.category]);

  const filtered = useMemo(() => {
    if (active === "all") return posts;
    return posts.filter((p) =>
      (p.node.categories || []).some((c) => c.slug === active)
    );
  }, [posts, active]);

  return (
    <div>
      <Head>
        <title>Ryo Miyata — Posts</title>
      </Head>

      <div className="px-5 pt-7 pb-3">
        <div className="font-pixel text-[26px] leading-none">
          <span className="opacity-50">// </span>posts
        </div>
        <div className="font-vt text-[14px] opacity-65 mt-1.5">
          all entries · sorted by date desc · {filtered.length} items
        </div>
      </div>
      <DitherBlock />

      {/* Filter */}
      <div className="flex gap-2 px-5 py-2.5 border-b border-current font-pixel text-[10px] flex-wrap">
        <span className="opacity-55">filter:</span>
        <button
          onClick={() => setActive("all")}
          className={`border border-current px-1.5 ${active === "all" ? "bg-[var(--fg)] text-[var(--bg)]" : ""}`}
        >
          all
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => setActive(c.slug)}
            className={`border border-current px-1.5 ${active === c.slug ? "bg-[var(--fg)] text-[var(--bg)]" : ""}`}
          >
            {c.slug}
          </button>
        ))}
      </div>

      {/* List */}
      <div>
        {filtered.map((p) => (
          <Link
            key={p.node.slug}
            href={`/post/${p.node.slug}`}
            className="grid grid-cols-[56px_1fr_auto] gap-4 items-baseline px-5 py-3.5 border-b border-current border-dashed text-[14px] no-underline hover:bg-[var(--fg)] hover:text-[var(--bg)]"
          >
            <span className="font-pixel text-[11px] opacity-65">
              {new Date(p.node.createdAt).toISOString().slice(0, 7).replace("-", ".")}
            </span>
            <span>{p.node.title}</span>
            <span className="font-pixel text-[9px] border border-current px-1.5 opacity-85 whitespace-nowrap">
              {p.node.categories?.[0]?.slug?.toUpperCase() || "—"}
            </span>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="px-5 py-8 text-center font-vt text-[14px] opacity-65">
            no entries for this filter.
          </div>
        )}
      </div>

      {/* External legacy links (preserve old hardcoded entries) */}
      <div className="px-5 py-4 border-t border-current">
        <div className="font-pixel text-[10px] opacity-55 mb-2">// external</div>
        <a
          href="https://note.com/miyata_ryo3/n/n3e17e24dd31c"
          target="_blank"
          rel="noopener noreferrer"
          className="grid grid-cols-[56px_1fr_auto] gap-4 items-baseline py-2 border-b border-current border-dashed text-[13px] no-underline hover:bg-[var(--fg)] hover:text-[var(--bg)]"
        >
          <span className="font-pixel text-[11px] opacity-65">2023.01</span>
          <span>人を表すソウルバンドトークンとよばれるNFT</span>
          <span className="font-pixel text-[9px] opacity-60 whitespace-nowrap">↗ note</span>
        </a>
        <a
          href="https://qiita.com/MiyataRyo/items/6a5f6aa510afddae0701"
          target="_blank"
          rel="noopener noreferrer"
          className="grid grid-cols-[56px_1fr_auto] gap-4 items-baseline py-2 border-b border-current border-dashed text-[13px] no-underline hover:bg-[var(--fg)] hover:text-[var(--bg)]"
        >
          <span className="font-pixel text-[11px] opacity-65">2020.03</span>
          <span>Heroku への Rails+MySQL デプロイ</span>
          <span className="font-pixel text-[9px] opacity-60 whitespace-nowrap">↗ qiita</span>
        </a>
      </div>

      <StatusBar left={`showing: ${active}`} right={`${filtered.length} items`} />
    </div>
  );
};

export async function getStaticProps() {
  const posts = (await getPosts()) || [];
  const categories = (await getCategories()) || [];
  return { props: { posts, categories } };
}

export default PostIndex;
```

- [ ] **Step 2: ビルド確認**

Run: `npm run build`
Expected: エラーなく完了。

- [ ] **Step 3: 目視確認**

Run: `npm run dev` → `http://localhost:3000/post`
Expected:
- 上部に `// posts` 大見出し
- カテゴリフィルタチップ（all + Hygraph 取得分）
- 各記事が「日付 / タイトル / カテゴリタグ」3列リストで並ぶ
- 末尾に外部リンク2件（note / qiita）
- ステータスバー: `showing: all · N items`

- [ ] **Step 4: フィルタ動作確認**

ブラウザで適当なカテゴリチップをクリック → リストが絞り込まれることを確認。`?category=web3` のような URL も試す（後の Task 13 でリダイレクトが活きる前段階）。

- [ ] **Step 5: コミット**

```bash
git add pages/post/index.js
git commit -m "1-bit Macリデザイン: 投稿一覧をフィルタ付きlistrow構成に刷新"
```

---

## Task 10: PostDetail コンポーネントの刷新

**Files:**
- Modify: `components/PostDetail.jsx`（全面書き換え）

旧 Tailwind `text-xl mb-2 pb-2 border-b` ベースのスタイリングを、設計書のタイポ階層（見出し: Silkscreen, 本文: IBM Plex Sans JP, code: IBM Plex Mono, 日付: VT323）に刷新。`moment` 依存を `Date` の `toISOString()` に置換。

- [ ] **Step 1: `components/PostDetail.jsx` を以下に全面置換**

```jsx
import React from 'react';
import Link from 'next/link';
import { DitherBlock } from './ui';

const PostDetail = ({ post }) => {
  const date = post?.createdAt
    ? new Date(post.createdAt).toISOString().slice(0, 10).replace(/-/g, '.')
    : '';
  const cats = (post?.categories || []).map((c) => c.name?.toUpperCase()).join(' · ');

  const getContentFragment = (index, text, obj, type) => {
    let modifiedText = text;

    if (obj) {
      if (obj.bold)      modifiedText = <b key={index}>{text}</b>;
      if (obj.italic)    modifiedText = <em key={index}>{text}</em>;
      if (obj.underline) modifiedText = <u key={index}>{text}</u>;
    }

    switch (type) {
      case 'heading-three':
        return (
          <h3 key={index} className="font-pixel text-[14px] tracking-wider mt-7 mb-2">
            <span className="opacity-50">## </span>
            {modifiedText.map((item, i) => <React.Fragment key={i}>{item}</React.Fragment>)}
          </h3>
        );
      case 'heading-four':
        return (
          <h4 key={index} className="font-pixel text-[12px] tracking-wider mt-5 mb-2">
            <span className="opacity-50">### </span>
            {modifiedText.map((item, i) => <React.Fragment key={i}>{item}</React.Fragment>)}
          </h4>
        );
      case 'paragraph':
        return (
          <p key={index} className="mb-5 leading-[1.85]">
            {modifiedText.map((item, i) => <React.Fragment key={i}>{item}</React.Fragment>)}
          </p>
        );
      case 'image':
        return (
          <div key={index} className="my-6 border border-current p-1">
            <img alt={obj.title} height={obj.height} width={obj.width} src={obj.src} className="block" />
          </div>
        );
      case 'code-block':
        return (
          <pre
            key={index}
            className="font-mono text-[13px] leading-[1.6] border border-current p-3 my-5 overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: modifiedText }}
          />
        );
      default:
        return modifiedText;
    }
  };

  return (
    <article>
      <header className="px-6 pt-7 pb-5">
        {cats && (
          <span className="inline-block font-pixel text-[9px] border border-current px-1.5 py-0.5 opacity-85">
            {cats}
          </span>
        )}
        <h1 className="font-jp text-[28px] leading-[1.35] font-bold mt-3 mb-3">
          {post.title}
        </h1>
        <div className="font-vt text-[14px] opacity-65">
          {date} · ryo miyata
        </div>
      </header>

      <DitherBlock />

      <div className="font-body px-6 py-6 text-[15px] leading-[1.85]">
        {post.content?.raw?.children?.map((typeObj, index) => {
          const children = typeObj.children.map((item, itemIndex) =>
            getContentFragment(itemIndex, item.text, item)
          );
          return getContentFragment(index, children, typeObj, typeObj.type);
        })}
      </div>

      <div className="px-6 py-4 border-t border-current border-dashed flex gap-4 font-pixel text-[10px]">
        <Link href="/post" className="underline">◂ back to posts</Link>
      </div>
    </article>
  );
};

export default PostDetail;
```

- [ ] **Step 2: ビルド確認**

Run: `npm run build`
Expected: エラーなく完了。

- [ ] **Step 3: 目視確認**

Run: `npm run dev` → `http://localhost:3000/post/[任意のslug]`
Expected:
- 記事ヘッダ: カテゴリスタンプ → 大見出し（DotGothic16） → 日付サブメタ
- ディザ罫線
- 本文: IBM Plex Sans JP の読みやすい長文
- コードブロックがあれば IBM Plex Mono のボーダー付き箱
- 末尾に `◂ back to posts`（コメント欄なし）

- [ ] **Step 4: コミット**

```bash
git add components/PostDetail.jsx
git commit -m "1-bit Macリデザイン: PostDetailを新タイポ階層で刷新"
```

---

## Task 11: 投稿詳細ページの Loader 依存除去

**Files:**
- Modify: `pages/post/[slug].js`

`getStaticPaths` で `fallback: false` のため `router.isFallback` は常に `false`。Loader への依存を除去。

- [ ] **Step 1: `pages/post/[slug].js` を以下に全面置換**

```jsx
import React from 'react';
import Head from 'next/head';
import { getPosts, getPostDetails } from '../../services';
import { PostDetail } from '../../components';

const PostDetails = ({ post }) => {
  return (
    <>
      <Head>
        <title>{post.title} — Ryo Miyata</title>
      </Head>
      <PostDetail post={post} />
    </>
  );
};

export default PostDetails;

export async function getStaticProps({ params }) {
  const data = await getPostDetails(params.slug);
  return { props: { post: data } };
}

export async function getStaticPaths() {
  const posts = await getPosts();
  return {
    paths: posts.map(({ node: { slug } }) => ({ params: { slug } })),
    fallback: false,
  };
}
```

- [ ] **Step 2: ビルド確認**

Run: `npm run build`
Expected: エラーなく完了。

- [ ] **Step 3: 目視確認**

Run: `npm run dev` → 任意の投稿詳細URL
Expected: 記事が表示される（Loader への参照が消えても問題なし）。

- [ ] **Step 4: コミット**

```bash
git add pages/post/\[slug\].js
git commit -m "1-bit Macリデザイン: 投稿詳細ページからLoader依存を除去"
```

---

## Task 12: 作品ページの刷新

**Files:**
- Modify: `pages/work/index.js`（全面書き換え）

グラデーション + 角丸画像のカードを、1-bit ボーダーカードに置換。`dev-image1.png` 依存を除去（後で削除する画像）。

- [ ] **Step 1: `pages/work/index.js` を以下に全面置換**

```jsx
import React from 'react';
import Head from 'next/head';
import { DitherBlock, StatusBar } from '../../components/ui';

const works = [
  {
    title: 'SLIDE PILOT',
    href: 'https://slide-pilot-474305.web.app/',
    desc: 'Multimodal LLM で PDF をスライド・ナレーション付き動画へ自動変換するエージェント。LangGraph で構築。',
    tags: 'LLM · WEB',
  },
  {
    title: 'KANGEKI DAPP',
    href: 'https://kangeki-dapps.web.app/',
    desc: 'Ethereum 上で SoulBound Token を発行・管理する分散アプリケーション。',
    tags: 'WEB3 · DAPP',
  },
];

const WorkIndex = () => {
  return (
    <div>
      <Head>
        <title>Ryo Miyata — Creations</title>
      </Head>

      <div className="px-5 pt-7 pb-3">
        <div className="font-pixel text-[26px] leading-none">
          <span className="opacity-50">// </span>creations
        </div>
        <div className="font-vt text-[14px] opacity-65 mt-1.5">
          things i made · {works.length} items
        </div>
      </div>
      <DitherBlock />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-5">
        {works.map((w) => (
          <a
            key={w.title}
            href={w.href}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-current p-4 no-underline hover:bg-[var(--fg)] hover:text-[var(--bg)]"
          >
            <div className="font-pixel text-[13px]">{w.title}</div>
            <div className="text-[12px] mt-2 opacity-85 leading-[1.65]">{w.desc}</div>
            <span className="inline-block mt-3 font-pixel text-[9px] opacity-60 border border-current px-1.5 py-px">
              {w.tags}
            </span>
          </a>
        ))}
      </div>

      <StatusBar left={`creations: ${works.length}`} right="updated occasionally" />
    </div>
  );
};

export default WorkIndex;
```

- [ ] **Step 2: ビルド確認**

Run: `npm run build`
Expected: エラーなく完了。

- [ ] **Step 3: 目視確認**

Run: `npm run dev` → `http://localhost:3000/work`
Expected:
- `// creations` 大見出し
- 1-bit ボーダーカード2枚（モバイルは1列、デスクトップは2列）
- ホバーで反転
- グラデーション・画像が消えている

- [ ] **Step 4: コミット**

```bash
git add pages/work/index.js
git commit -m "1-bit Macリデザイン: 作品ページを1-bitボーダーカードに刷新"
```

---

## Task 13: カテゴリページのリダイレクト + 廃止

**Files:**
- Modify: `next.config.js`
- Delete: `pages/category/[slug].js`

旧 `/category/[slug]` URL を `/post?category=xxx` に Next.js のリダイレクトで転送。ページファイル自体は削除。

- [ ] **Step 1: `next.config.js` を以下に置換**

```js
/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  optimizeFonts: true,
  async redirects() {
    return [
      {
        source: '/category/:slug',
        destination: '/post?category=:slug',
        permanent: true,
      },
    ];
  },
};
```

- [ ] **Step 2: `pages/category/[slug].js` を削除**

Run: `rm pages/category/\[slug\].js && rmdir pages/category 2>/dev/null || true`

- [ ] **Step 3: ビルド確認**

Run: `npm run build`
Expected: エラーなく完了。`pages/category` への警告なし。

- [ ] **Step 4: 目視確認**

Run: `npm run dev` → `http://localhost:3000/category/web3` （Hygraph に存在するslugで）
Expected: 自動的に `/post?category=web3` に飛び、フィルタが web3 で初期化された一覧が表示される。

- [ ] **Step 5: コミット**

```bash
git add next.config.js pages/category
git commit -m "1-bit Macリデザイン: /categoryページを廃止し/post?category=xxxへリダイレクト"
```

---

## Task 14: 旧コンポーネントの削除（バルク）

**Files:**
- Delete: `components/TypingAnimation.jsx`
- Delete: `components/CatLogo.jsx`
- Delete: `components/ColorTheme/` (再帰)
- Delete: `components/ToggleSwitch/` (再帰)
- Delete: `components/Loader.jsx`
- Delete: `components/PostCard.jsx`
- Delete: `components/Categories.jsx`
- Modify: `components/index.js`

新しい構成では一切使われない旧UIコンポーネントを削除し、barrel export を整理。

- [ ] **Step 1: 削除前に参照ゼロを確認**

Run:
```bash
grep -rn "TypingAnimation\|CatLogo\|ColorTheme\|ToggleSwitch\|from ['\"].*Loader['\"]\|from ['\"].*PostCard['\"]\|from ['\"].*Categories['\"]" --include='*.jsx' --include='*.tsx' --include='*.js' . | grep -v node_modules | grep -v components/Loader.jsx | grep -v components/PostCard.jsx | grep -v components/Categories.jsx | grep -v components/TypingAnimation.jsx | grep -v components/CatLogo.jsx | grep -v components/ColorTheme | grep -v components/ToggleSwitch | grep -v components/index.js | grep -v docs/superpowers
```

Expected: 空（残存参照なし）。何かヒットしたら、そのファイルから先に修正する。

- [ ] **Step 2: ファイル削除**

Run:
```bash
rm components/TypingAnimation.jsx
rm components/CatLogo.jsx
rm components/Loader.jsx
rm components/PostCard.jsx
rm components/Categories.jsx
rm -r components/ColorTheme
rm -r components/ToggleSwitch
```

- [ ] **Step 3: `components/index.js` を以下に置換**

```js
export { default as Layout } from './Layout';
export { default as Header } from './Header';
export { default as Footer } from './Footer';
export { default as PostDetail } from './PostDetail';
```

- [ ] **Step 4: ビルド確認**

Run: `npm run build`
Expected: エラーなく完了。

- [ ] **Step 5: 全ページ目視確認**

Run: `npm run dev`、各URL確認:
- `/` — ホーム表示OK
- `/post` — 一覧表示OK
- `/post/[任意slug]` — 詳細表示OK
- `/work` — 作品表示OK

- [ ] **Step 6: コミット**

```bash
git add components
git commit -m "1-bit Macリデザイン: 旧UIコンポーネント7点を削除"
```

---

## Task 15: services の `getCategoryPost` 削除

**Files:**
- Modify: `services/index.jsx`

`/category/[slug]` 廃止に伴い、`getCategoryPost` 関数を削除。

- [ ] **Step 1: 参照ゼロを確認**

Run: `grep -rn "getCategoryPost" --include='*.jsx' --include='*.tsx' --include='*.js' . | grep -v node_modules | grep -v services/index.jsx`

Expected: 空。

- [ ] **Step 2: `services/index.jsx` の末尾の `getCategoryPost` 関数定義（90行目以降の `export const getCategoryPost = async (slug) => { ... };`）をブロック丸ごと削除**

- [ ] **Step 3: ビルド確認**

Run: `npm run build`
Expected: エラーなく完了。

- [ ] **Step 4: コミット**

```bash
git add services/index.jsx
git commit -m "1-bit Macリデザイン: 未使用のgetCategoryPostを削除"
```

---

## Task 16: 不要画像アセットの削除

**Files:**
- Delete: `public/assets/images/typing-image.png`
- Delete: `public/assets/images/self-image.jpg`
- Delete: `public/assets/images/dev-image1.png`

ヒーロー画像・顔写真・作品サムネ画像はリデザイン後使われない。

- [ ] **Step 1: 参照ゼロを確認**

Run:
```bash
grep -rn "typing-image\|self-image\|dev-image1" --include='*.jsx' --include='*.tsx' --include='*.js' --include='*.css' . | grep -v node_modules | grep -v docs/superpowers | grep -v .superpowers
```

Expected: 空。

- [ ] **Step 2: 削除**

Run:
```bash
rm public/assets/images/typing-image.png
rm public/assets/images/self-image.jpg
rm public/assets/images/dev-image1.png
```

- [ ] **Step 3: ビルド確認**

Run: `npm run build`
Expected: エラーなく完了。

- [ ] **Step 4: コミット**

```bash
git add public/assets/images
git commit -m "1-bit Macリデザイン: 未使用画像3点を削除"
```

---

## Task 17: 不要パッケージの削除

**Files:**
- Modify: `package.json`

未使用と確認できたパッケージを削除。`framer-motion` `@fortawesome/*` `react-icons` `react-hook-form` `moment` を削除。`axios` `email-validator` `@sendgrid/mail` `nodemailer` `@next/font` は使用箇所が見つからなければ同時に削除。

- [ ] **Step 1: 各パッケージの使用箇所を確認**

Run（一つずつ）:
```bash
grep -rn "framer-motion\|@fortawesome\|react-icons\|react-hook-form\|moment\b" --include='*.jsx' --include='*.tsx' --include='*.js' . | grep -v node_modules | grep -v package
grep -rn "axios\|email-validator\|@sendgrid\|nodemailer\|@next/font" --include='*.jsx' --include='*.tsx' --include='*.js' . | grep -v node_modules | grep -v package
```

Expected: いずれも空（使用箇所なし）。残ったらそのパッケージは削除リストから外し、判断を Step 2 のコメントに残す。

- [ ] **Step 2: `package.json` の `dependencies` から以下を削除**

```diff
-    "@fortawesome/fontawesome-svg-core": "^6.3.0",
-    "@fortawesome/free-brands-svg-icons": "^6.4.0",
-    "@fortawesome/free-solid-svg-icons": "^6.0.0",
-    "@fortawesome/react-fontawesome": "^0.2.0",
-    "@next/font": "^13.2.4",
-    "@sendgrid/mail": "^7.7.0",
-    "axios": "^1.5.0",
-    "email-validator": "^2.0.4",
-    "framer-motion": "^10.8.5",
-    "moment": "^2.29.4",
-    "nodemailer": "^6.9.5",
-    "react-hook-form": "^7.46.1",
-    "react-icons": "^4.8.0",
```

注意: Step 1 で参照が残った行は削除しない。

- [ ] **Step 3: 依存再インストール**

Run: `rm -rf node_modules && npm install`
Expected: エラーなく完了、`package-lock.json` が更新される。

- [ ] **Step 4: ビルド確認**

Run: `npm run build`
Expected: エラーなく完了（モジュール解決エラーなし）。

- [ ] **Step 5: 全ページ目視確認**

Run: `npm run dev`、`/`、`/post`、`/post/[slug]`、`/work`、`/category/[slug]`（リダイレクト）を順に開いて崩れなし。

- [ ] **Step 6: コミット**

```bash
git add package.json package-lock.json
git commit -m "1-bit Macリデザイン: 未使用パッケージを削除"
```

---

## Task 18: 受け入れ基準チェックと最終確認

**Files:**
- なし（確認のみ。問題があれば該当タスクに戻る）

設計書の「受け入れ基準」を全項目チェック。

- [ ] **Step 1: 受け入れ基準チェック**

設計書 [docs/superpowers/specs/2026-04-30-portfolio-redesign-design.md](../specs/2026-04-30-portfolio-redesign-design.md) の「受け入れ基準（チェックリスト）」セクションを開き、各項目を一つずつ目視確認:

```
[ ] 全ページがダーク既定で #0A0A0A 背景・#E8E8E8 前景
[ ] ライトモードで反転表示される（メニューバー右の ☀ クリック）
[ ] タイトルバー縞が 32% コントラストでちらつかない
[ ] Silkscreen / DotGothic16 / IBM Plex Sans JP / IBM Plex Mono / VT323 が用途通り
[ ] ホームに Hero 画像・顔写真・TypingAnimation・Bio セクションが存在しない
[ ] 投稿詳細にコメント欄が存在しない
[ ] 投稿一覧にカテゴリフィルタが存在し動作する
[ ] /category/[slug] が /post?category=xxx にリダイレクトされる
[ ] モバイル(<768px)でメニューがハンバーガー化、Drawer が 1-bit ボーダー
[ ] アニメーションがヒーローの _ 点滅のみ
[ ] package.json から framer-motion / @fortawesome / 等が削除済み
[ ] npm run build がエラーなく完了
[ ] 削除対象コンポーネント／API／アセット／パッケージがリポジトリから消えている
```

- [ ] **Step 2: モバイル目視確認**

Run: `npm run dev` → DevTools のモバイルエミュレーション（375px幅 等）で `/`、`/post`、`/post/[slug]`、`/work` を確認。
Expected:
- ヘッダ右がハンバーガーアイコンに
- ハンバーガークリックで右からドロワーが出る
- ドロワー内に `posts / creations / github / ☾(or ☀) light/dark` 表示
- カードグリッドが1列に折り返す

- [ ] **Step 3: ライト/ダーク切替確認**

メニューバー右の ☾/☀ をクリック → 全ページの背景・前景が反転、タイトルバー縞も反転、文字色が破綻しないこと。

- [ ] **Step 4: ビルド最終確認**

Run: `npm run build && npm run start`
ブラウザで `http://localhost:3000` にアクセス → 静的ビルド成果物が問題なく動作。

- [ ] **Step 5: 最終コミット（必要なら）**

最終確認で発見した小さな調整があればまとめてコミット:

```bash
git add -A
git commit -m "1-bit Macリデザイン: 受け入れ基準を満たすよう微調整"
```

それ以外なら、コミットなしで完了。

---

## オープン項目（実装中に判断）

設計書から引き継ぎ:

1. **アバター画像**: 8x8/16x16 のドット絵を新規制作するか — 今回スコープ外。将来のタスク。
2. **About 文の最終確定**: 叩き台を採用済み。後日上書きしたい場合は `pages/index.tsx` を直接編集。
3. **uptime の計算**: 「36y」を静的にハードコード（誕生年からの動的計算は将来課題）。
4. **`/work` の作品データソース**: 当面はハードコード（Hygraph 化は将来課題）。

---

## ロールバック方針

1タスク = 1コミットなので、問題があれば `git revert <commit-sha>` で個別に戻せる。最悪、`main` ブランチへのマージ前に worktree を破棄すれば全変更が消える。

