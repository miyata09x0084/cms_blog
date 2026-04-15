# About Me セクション改称・順序再編 実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** トップページ (`pages/index.tsx`) のセクション順を再編し、`/About` を `/About Me` に改称して人物紹介に特化させる。

**Architecture:** JSX の並び替え + 見出し改称 + About 本文書き換えのみ。`getStaticProps` や型定義には手を入れない。

**Tech Stack:** Next.js 13 (Pages Router), React 18, TypeScript, Chakra UI

**Spec:** `docs/superpowers/specs/2026-04-15-about-me-section-reorg-design.md`

**前提:**
- このリポジトリには test フレームワーク / lint 設定が無い（CLAUDE.md 記載）。変更は純粋な表示レイヤなので、検証は `npm run dev` によるブラウザ目視確認で行う
- About Me 本文はユーザー確認を挟む（Task 3 のステップで明示）

---

## File Structure

**変更ファイル:** `pages/index.tsx` のみ

**責務:**
- トップページ全体のレイアウトとセクション配列
- 現状は 1 ファイルに全セクションが直書きされているパターンを踏襲（分割はスコープ外）

---

## Task 1: セクション順序の並び替え

**Files:**
- Modify: `pages/index.tsx:110-265`

**変更内容:** Posts / Creations / Bio / Interests の 4 ブロックの並びを入れ替える。

変更前の並び（JSX ブロック単位）:
```
{/* Posts */}      → pages/index.tsx:110-148
{/* Creations */}  → pages/index.tsx:150-218
{/* Bio */}        → pages/index.tsx:220-244
{/* Interests */}  → pages/index.tsx:246-265
```

変更後の並び:
```
{/* Bio */}
{/* Interests */}
{/* Posts */}
{/* Creations */}
```

- [ ] **Step 1: 現在のファイル内容を確認**

Read `pages/index.tsx` 全文を確認し、4 ブロックの範囲を特定する。

- [ ] **Step 2: Bio ブロックを Posts の直前へ移動**

Edit で、`{/* Bio */}` から `{/* Interests */}` 手前までのブロックを切り出し、`{/* Posts */}` の直前に挿入する。同時に元の場所からは削除する。

実際の順序入れ替えは以下の最終形になるように行う（About 直下の 4 ブロック順のみ変更、他は触らない）:

```tsx
{/* About (※次タスクで About Me に改称) */}
<VStack align="start" spacing={4} mb={16}>
  ... (現状のまま)
</VStack>

{/* Bio */}
<Box mb={16}>
  <Heading ...>/Bio</Heading>
  ...
</Box>

{/* Interests */}
<Box mb={16}>
  <Heading ...>/Interests</Heading>
  ...
</Box>

{/* Posts */}
<Box mb={16}>
  <Heading ...>/Posts</Heading>
  ...
</Box>

{/* Creations */}
<Box mb={16}>
  <Heading ...>/Creations</Heading>
  ...
</Box>
```

- [ ] **Step 3: dev サーバーで目視確認**

Run:
```bash
npm run dev
```

ブラウザで http://localhost:3000 を開き、以下を確認:
- セクションが「Hero → About → Bio → Interests → Posts → Creations」の順で表示される
- 各セクションの中身（見出し / リンク / カード / 年表 / タグ）が欠落・崩れなく表示される
- ライト/ダーク両方とモバイル幅で崩れが無い

- [ ] **Step 4: Commit**

```bash
git add pages/index.tsx
git commit -m "$(cat <<'EOF'
トップページのセクション順を「人→経歴→関心→書いたもの→作ったもの」に再編

Bio / Interests を Posts / Creations の上に移動し、訪問者が人物情報を
先に理解できる並びに変更。
EOF
)"
```

---

## Task 2: `/About` 見出しを `/About Me` に改称

**Files:**
- Modify: `pages/index.tsx`（About セクションの Heading 要素）

**前提:** 現状の About セクションには Heading 要素が存在しない（`pages/index.tsx:82-108` は `VStack` 直下に `<Text>` が並んでいるだけ）。他セクションと揃えるため `/About Me` 見出しを新規追加する。

- [ ] **Step 1: About ブロックに Heading を追加**

Edit で、現状の About ブロック:

```tsx
{/* About */}
<VStack align="start" spacing={4} mb={16}>
  <Text fontSize="15px" lineHeight="1.8" color={textSecondary}>
    I&apos;m a full-stack engineer ...
  </Text>
  ...
</VStack>
```

を、他セクション（Posts / Bio 等）と同じ構造に揃えて以下に変更:

```tsx
{/* About Me */}
<Box mb={16}>
  <Heading as="h2" fontSize="sm" fontWeight="600" textTransform="uppercase" letterSpacing="0.1em" color={textSecondary} mb={6}>
    /About Me
  </Heading>
  <VStack align="start" spacing={4}>
    <Text fontSize="15px" lineHeight="1.8" color={textSecondary}>
      I&apos;m a full-stack engineer ...
    </Text>
    ...
  </VStack>
</Box>
```

注意点:
- JSX コメントも `{/* About */}` → `{/* About Me */}` に変更
- 外側を `Box mb={16}` で包み、内側に `Heading` と `VStack` を並べる（他セクションと同じパターン）
- 既存の `VStack` の `mb={16}` は外側 `Box` に移ったので削除する
- Heading のスタイル（fontSize / fontWeight / textTransform / letterSpacing / color / mb）は他セクションと完全に同一にする

- [ ] **Step 2: dev サーバーで目視確認**

ブラウザで以下を確認:
- About セクション上部に `/About Me` 見出しが表示される
- 見出しのフォントサイズ・色・余白が他セクション（/Bio, /Interests 等）と揃っている
- 本文 3 段落は現状のまま表示されている

- [ ] **Step 3: Commit**

```bash
git add pages/index.tsx
git commit -m "$(cat <<'EOF'
/About を /About Me に改称し見出しを追加

他セクションと同じスタイル（prefix 付き大文字見出し）で統一。
EOF
)"
```

---

## Task 3: About Me 本文を 2 段落に書き換え

**Files:**
- Modify: `pages/index.tsx`（About Me セクション内の `<Text>` 要素群）

**現状の 3 段落:**
1. フルスタックエンジニアとしての仕事観（モジュール境界 / UI / 保守性）
2. home-buying simulation platform の実績詳細
3. 温泉 / カフェ / サイドプロジェクトなどプライベート

**変更後の 2 段落:**
1. **段落①: 自分自身の核** — younger twin brother としての出自 + アイデアをコードで形にすることへの情熱
2. **段落②: 日常の自分** — 朝コーヒー / サイドプロジェクト / 温泉・カフェなどの生活ディテール

**削除:** 現 2 段落目（home-buying platform の実績一式）

- [ ] **Step 1: 段落①②の英語コピー案をユーザーに提示**

ユーザーに対して、以下の条件を満たす段落①②のドラフトを提示する:
- 言語: 英語
- 段落①: "younger twin brother" / "ideas → real-world apps" のモチーフを含む、初期版の温度感
- 段落②: 現行 3 段落目（hot springs / cafés / side projects）を土台に、"いま熱中していること" を 1 行足す
- 分量: 各段落 2〜4 文、全体で 80〜120 words 程度

ユーザーの承認を得るまで次のステップに進まない。修正指示があれば反映して再提示する。

- [ ] **Step 2: 承認済みコピーで Text 要素を書き換え**

Task 2 完了後の About Me ブロック内の `VStack` 配下を書き換える:

```tsx
<VStack align="start" spacing={4}>
  <Text fontSize="15px" lineHeight="1.8" color={textSecondary}>
    {/* 承認済み段落① */}
  </Text>
  <Text fontSize="15px" lineHeight="1.8" color={textSecondary}>
    {/* 承認済み段落② */}
  </Text>
</VStack>
```

注意点:
- 既存の `<Text>` の props（fontSize / lineHeight / color）は完全に踏襲する
- 段落は 3 → 2 に減る。3 つ目の `<Text>` 要素は削除
- 英文中のアポストロフィは `I&apos;m` など HTML エンティティ形式にする（既存コード踏襲）

- [ ] **Step 3: dev サーバーで目視確認**

ブラウザで以下を確認:
- About Me セクションに段落が 2 つだけ表示される
- home-buying platform の記述が消えている
- 段落間の余白（VStack の `spacing={4}`）が他セクションと揃って自然
- フォント・色・行間がこれまでと同一

- [ ] **Step 4: Commit**

```bash
git add pages/index.tsx
git commit -m "$(cat <<'EOF'
About Me 本文を人物紹介に特化した2段落構成に書き換え

実績詳細（home-buying platform）を削除し、出自・情熱・日常の
パーソナルな記述に集約。
EOF
)"
```

---

## Final Verification

- [ ] **ブラウザで全体の最終確認**

Run `npm run dev` して http://localhost:3000 を開き、以下を通しで確認:

1. セクションの表示順: Hero Image → Typing → Hero → /About Me → /Bio → /Interests → /Posts → /Creations
2. `/About Me` 見出しと 2 段落の本文が表示される
3. 各セクション内リンク（All posts / All creations / note 記事リンク / Creations カードリンク）が機能する
4. ライト / ダークモード両方で崩れが無い
5. モバイル幅（〜767px）とデスクトップ幅（768px〜）両方で崩れが無い

- [ ] **最終コミットが 3 つ積まれていることを確認**

```bash
git log --oneline -5
```

期待: Task 1 / Task 2 / Task 3 の 3 コミット + design doc コミット + 直前の main HEAD が並ぶ。

---

## スコープ外（今回やらない）

- home-buying プロジェクトを Creations カードとして追加
- TypingAnimation / Hero / 各セクション内部の内容変更
- デザイントークン・色・レイアウトの変更
- 多言語対応
