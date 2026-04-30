# ポートフォリオ全面リデザイン 設計書

作成日: 2026-04-30
対象: サイト全体（ホーム／投稿一覧／投稿詳細／作品ページ／グローバルレイアウト）

## 背景・目的

現状のポートフォリオは「ベージュ × ターコイズ × パープル」の多色構成、Chakra UI と Tailwind の併用、TypingAnimation・CatLogo・グラデーションボタン等の装飾要素が並ぶ「自己紹介ホームページ型」。直近のコミット履歴（Contact 追加→削除→復活、monochrome 化→復旧、Interests 内容の往復など）が示す通り、**コンセプトが定まらず細部の編集が往復している** 状態にある。

今回のリデザインの目的は、デザインの方向性を一度で固める「**コンセプトの確定**」である。具体的には:

1. **目的の明確化**: 個人ブランディング（主）+ 発信ハブ（副）。採用・案件獲得は明示的に主目的から外す。
2. **世界観の確定**: 「ギーク × ビット感（ピクセル／ローレゾの粒）」の中の **1-bit Mac × ダーク × 純2色** に振り切る。
3. **構造の整理**: 縦スクロールを維持しつつ、Mac OS のメタファをヘッダ／フッタに集中。本文セクションは読みやすさを優先。
4. **発信ハブとしての強化**: 投稿一覧にカテゴリフィルタを内蔵、`/category/[slug]` ページを廃止。

## スコープ

### やること

- 全ページのデザインシステムを 1-bit Mac × ダーク × 純2色 へ刷新
- ホームページ (`pages/index.tsx`) の構成変更（Bio 削除、装飾要素の整理）
- 投稿一覧 (`pages/post/index`) の刷新（カテゴリフィルタ内蔵）
- 投稿詳細 (`pages/post/[slug].js`) の刷新（コメント欄削除、本文タイポ階層導入）
- 作品ページ (`pages/work/index.js`) の刷新（カードを 1-bit ボーダー化）
- グローバル: ヘッダ／フッタ／カラーモード／フォント体系の刷新
- `pages/category/[slug].js` の **廃止**
- 不要コンポーネント／API の削除（Comments, CommentsForm, TypingAnimation, CatLogo, ColorTheme, ToggleSwitch, Loader, FeaturedPostCard 等）
- 不要パッケージの削除（framer-motion, anime.js, react-spring, react-multi-carousel, FontAwesome 一式）
- 不要画像アセットの削除（typing-image.png, self-image.jpg, dev-image1.png）

### やらないこと（スコープ外）

- Hygraph (GraphCMS) スキーマ側の変更（Comment 型は残置。戻したくなった時のため）
- Chakra UI の完全撤去（最小限のみ使用、撤去は別タスク）
- Tailwind の置き換え
- Next.js のバージョン更新・App Router 移行
- TypeScript への完全移行（既存の `.jsx`/`.tsx` 混在は維持）
- アバター画像の新規制作（必要なら別タスクで 8x8〜16x16 のドット絵を制作）
- 英語以外の追加言語対応
- パフォーマンス最適化（フォント読込戦略を含む追加チューニングは別タスク）
- 自動テスト・Lint の導入

## コンセプト

### 一行で

**「Susan Kare 期の 1-bit Macintosh の温度感を、純2色のダークモードで再構築した個人サイト」**

### 設計の3軸

| 軸 | 値 | 意味 |
|----|----|----|
| 美学 | 1-bit Mac × ピクセル | ビットマップフォント・ディザリング・OSメタファ |
| カラー | 純2色（ダーク基調） | アクセント色なし。状態表現はタイポと反転で行う |
| 構造 | 縦スクロール（Linear） | OSメタファはヘッダ／フッタに集中、本文は普通の縦積み |

## ビジュアルシステム

### カラーパレット

純2色のみ。アクセント色は持たない。

| トークン | ダーク（規定） | ライト（反転） |
|----------|--------------|--------------|
| `--bg`   | `#0A0A0A`    | `#E8E8E8`    |
| `--fg`   | `#E8E8E8`    | `#0A0A0A`    |
| `--border` | `currentColor` | `currentColor` |
| `--hover-bg` | `#E8E8E8`（反転） | `#0A0A0A`（反転） |
| `--hover-fg` | `#0A0A0A`（反転） | `#E8E8E8`（反転） |

ライト/ダークの切替は単純な反転。すべての要素は `currentColor` または `var(--fg)`/`var(--bg)` を使用し、要素ごとの色分岐コードを書かない。

### タイポグラフィ階層

5種を用途で完全分離する。すべて Google Fonts。

| フォント | 用途 | 例 |
|---------|------|----|
| **Silkscreen** | 巨大見出し・ナビ・ラベル・スタンプ・カード見出し | `RYO MIYATA`, `// posts`, `WEB3` |
| **DotGothic16** | ホーム短文・記事タイトル・サブメタ短文（和文 OK） | `フルスタック開発者 / 日本`, 記事の H1 |
| **IBM Plex Sans JP** | 記事本文（5行以上の長文） | 投稿詳細の段落 |
| **IBM Plex Mono** | コードブロック・インラインコード | `pre`, `code` |
| **VT323** | ステータスバー・サブメタ（CRT 風アクセント） | `uptime: 36y · v0.42` |

**ルール**: 記事本文（5行以上）はピクセルから降りる。「ホーム＝ピクセル世界、記事＝ピクセル枠の中の通常世界」という分業。

### レイアウトコンポーネント（システム）

各ページは以下の共通要素から組まれる。

| 要素 | 仕様 |
|------|------|
| **ページ幅** | デスクトップ `max-width: 720px` センタリング、モバイルは全幅＋左右 16px パディング |
| **ページ枠** | `border: 1px solid var(--fg)`、角丸なし |
| **タイトルバー** | 高さ 18px、下線 1px、背景は `repeating-linear-gradient(0deg, rgba(232,232,232,0.32) 0 1px, transparent 1px 3px)`（**32% コントラスト**＝目への負担を低減）、左にクローズボックス（10x10px ボーダーのみ）、中央に Silkscreen でパス表示 |
| **メニューバー** | 高さ 22px、下線 dashed、左に `▸ RYO`、右に `posts / creations / github / ☾(or ☀)` |
| **ヒーロー** | 上下パディング 30px、Silkscreen 42px の名前、`_` 点滅カーソル、role と tagline |
| **ディザブロック** | 高さ 22px、`radial-gradient` で 3px 周期の点描パターン |
| **セクション** | 上罫線 1px solid、見出しは Silkscreen + `// section-name` 形式 |
| **リスト行** | 下罫線 dashed、グリッド `[date 56px] [title 1fr] [tag auto]` |
| **カード** | `border: 1px solid var(--fg)`、角丸なし、パディング 10px |
| **CTA** | 通常リンク（下線付き）。スタイル付きボタンは使わない。例外: コメントフォームに名残あったが今回廃止 |
| **ステータスバー** | 上罫線 1px、VT323 13px、左中右の3カラム（uptime / version / last updated） |

### インタラクション

| 状態 | 表現 |
|------|------|
| ホバー | 即時反転（背景＝fg、文字＝bg）、トランジションなし |
| 選択 | 反転 + 余白 4px |
| 入力フォーカス | ボーダー1px → 2px |
| ページ遷移 | 即時（フェードなし） |

### アニメーション規律

**唯一許可**: ヒーローの `_` 点滅カーソル（1.1s steps(2) infinite）

**廃止対象**:
- TypingAnimation の連続タイピング
- フェードイン (`fade-in` クラス)
- カード hover の transform/box-shadow トランジション
- ColorTheme の切替アニメーション

理由: 1-bit 美学は「静止」が基本。動きはカーソル1点に集中させることで、CRT端末の文字入力待ち状態の温度感を出す。

## ページ構造

### グローバル: ヘッダ／フッタ

**ヘッダ**（全ページ共通）
1. タイトルバー（パス表示。例 `ryo.miyata — /`, `ryo.miyata — /post/[slug]`）
2. メニューバー（左 `▸ RYO`、右 `posts / creations / github / ☾`）

**フッタ**（全ページ共通）
- ステータスバー: `uptime: 36y` / `v0.42` / `last updated: YYYY-MM-DD`

### ページ A: ホーム (`/`)

```
[titlebar: ryo.miyata — /]
[menubar]
[hero: RYO\nMIYATA_ + role + tagline(JP/EN)]
[dither]
[// about        — 1段落（2020開発開始・2023独立を文中に織り込む）]
[// interests    — ▸ THINKING ▸ FOOD-TOURING ▸ CAMPING ▸ TRAVELING]
[// posts        — 直近2-3件 + view all ▸]
[// creations    — カード2件 + view all ▸]
[// contact      — Google Form への単一リンク]
[statusbar]
```

About 文（叩き台、確定後上書き可能）:
> 双子の弟として生まれ、頭の中に湧きつづける半端なアイデアをかたちにすることに最も生を感じる。プログラミングはそれを引き出して、人が使えるアプリへと立ち上げるための職人芸。2020年から開発、2023年からフリーランス。

**現状からの差分**:
- 削除: Hero キーボード画像 / 顔写真 / TypingAnimation / `/Bio` セクション / 3色グラデーションボタン（Posts/Creations/Contact）
- 統合: 「Posts ボタン」「Creations ボタン」を `view all ▸` リンクに統一
- 維持: About / Interests / Posts / Creations / Contact のセクション順
- 移行: グレースケール化、Silkscreen + DotGothic16 のタイポ階層適用

### ページ B: 投稿一覧 (`/post`)

```
[titlebar: ryo.miyata — /post]
[menubar]
[pagehead: // posts + meta(sort, count)]
[dither]
[filterbar: filter: [all] [web3] [rails] [llm] [essay]]
[listrow × N: date | title(link) | tag]
[statusbar: page X / Y · ▸ next]
```

**仕様**:
- 一覧は日付降順
- カテゴリフィルタは Hygraph の `categories` を集約してチップ化（クライアントフィルタで OK、件数少のため）
- 1ページあたり N 件（既存実装を踏襲。デフォルト 10〜20）
- ページネーションはステータスバー内に組み込み

### ページ C: 投稿詳細 (`/post/[slug]`)

```
[titlebar: ryo.miyata — /post/[slug]]
[menubar]
[article-header: stamp(categories) → H1(DotGothic16 28px) → submeta(date · author · readtime)]
[dither]
[article-body: IBM Plex Sans JP 15px / 1.85]
  ├─ p
  ├─ h2 (Silkscreen 14px, ## prefix)
  ├─ a (underline)
  ├─ code (inline, IBM Plex Mono, ボーダー)
  ├─ pre (IBM Plex Mono, ボーダー)
  └─ blockquote (left border 2px)
[article-foot: ◂ back to posts | ↗ share]
[statusbar]
```

**仕様**:
- コメント欄（および投稿フォーム）は **削除**
- 本文は Hygraph のリッチテキストを `html-react-parser` でレンダリング（既存ロジック維持、スタイルだけ更新）
- 関連記事カルーセル（react-multi-carousel）は廃止

### ページ D: 作品 (`/work`)

```
[titlebar: ryo.miyata — /work]
[menubar]
[pagehead: // creations + meta]
[dither]
[card-grid: 2 cols desktop / 1 col mobile]
  各カード: bordered box
    ├─ title (Silkscreen)
    ├─ desc (1-2行)
    └─ tag pill
[statusbar]
```

**仕様**:
- ホームページの creations カードと同じスタイルを縦に並べる
- 各カードは 1px solid border、角丸なし、ホバーで反転

### ページ E: 廃止 (`/category/[slug]`)

廃止。カテゴリフィルタは `/post` の filterbar で代替。既存リンクは 301 でなく Next.js の `redirects` 設定で `/post?category=xxx` へ転送（クライアント側でフィルタ初期値として読み取り）。

## モバイル対応

- ブレークポイント: `< 768px`（Tailwind `md:` 基準）
- ページ幅: 全幅、左右 16px パディング
- メニューバー: 右側ナビをハンバーガーアイコン（⋮ または `[≡]`）に集約、タップで右からドロワー（Chakra `Drawer` を 1-bit ボーダーで再スタイル）
- ヒーロー名前: 42px → 32px に縮小
- カードグリッド: 2列 → 1列
- リスト行（投稿一覧）: 日付列を非表示にせず維持（モバイルでも情報密度を保つ）

## 不要コンポーネント・パッケージの削除

### 削除コンポーネント

- `components/TypingAnimation.jsx`
- `components/CatLogo.jsx`
- `components/Comments.jsx`
- `components/CommentsForm.jsx`
- `components/ColorTheme/` （ディレクトリ丸ごと）
- `components/ToggleSwitch/` （ディレクトリ丸ごと。☾/☀ は menubar 内のテキストで代替）
- `components/Loader.jsx`（必要なら最小限に書き直し or 完全廃止）
- `components/FeaturedPostCard.jsx`
- `components/PostCard.jsx`（PostsList の listrow に統合）
- `components/PostWidget.jsx`
- `components/Categories.jsx`（filterbar に統合）
- `components/Author.jsx`（記事ヘッダの submeta に統合）

### 削除 API ルート

- `pages/api/comments.js`（および `comments/` 配下）

### 削除 services メソッド

- `submitComment` / `getComments`（`services/index.jsx` 内）

### 削除パッケージ（`package.json`）

- `framer-motion`
- `animejs`
- `react-spring`（および `@react-spring/*`）
- `react-multi-carousel`
- `@fortawesome/*`（一式）
- `react-textarea-autosize`（コメントフォームのみで使用していた場合）

### 削除アセット

- `public/assets/images/typing-image.png`
- `public/assets/images/self-image.jpg`
- `public/assets/images/dev-image1.png`

## 追加要素

### 追加パッケージ

なし。Google Fonts は `_document.js` の `<link>` で読込。

### Google Fonts 読込

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&family=DotGothic16&family=IBM+Plex+Sans+JP:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500;700&family=VT323&display=swap" rel="stylesheet">
```

### 新規 CSS（`styles/global.css` を全面置換 or `styles/colors.css` を新トークン化）

- 旧 CSS 変数（`--accent`, `--secondary-button` など）を全廃
- 新 CSS 変数 `--bg` `--fg` のみ（ダーク／ライトの class で切替）
- ディザパターンを `.dither` ユーティリティクラスに切り出し
- タイトルバー縞を `.titlebar-stripes` に切り出し（32% コントラスト固定）

## ダーク／ライトモード

- 既定: ダーク
- トグル: メニューバー右端の `☾` / `☀` テキストアイコン（クリックで切替）
- 実装: Chakra の `useColorMode` を継続利用、または `<html>` の `data-theme` 属性で CSS 変数を切り替え
- どちらモードも純2色のため、要素ごとの色分岐コードは不要

## 受け入れ基準（チェックリスト）

実装完了の判定は以下すべての達成。

- [ ] 全ページがダーク既定で `#0A0A0A` 背景・`#E8E8E8` 前景
- [ ] ライトモードで反転表示される
- [ ] タイトルバー縞が 32% コントラストでちらつかない
- [ ] Silkscreen / DotGothic16 / IBM Plex Sans JP / IBM Plex Mono / VT323 が全ページで規定通りの用途に使われている
- [ ] ホームに Hero 画像・顔写真・TypingAnimation・Bio セクションが存在しない
- [ ] 投稿詳細にコメント欄が存在しない
- [ ] 投稿一覧にカテゴリフィルタが存在し動作する
- [ ] `/category/[slug]` が `/post?category=xxx` にリダイレクトされる
- [ ] モバイル（<768px）でメニューがハンバーガー化し、Drawer が 1-bit ボーダーで表示される
- [ ] アニメーションがヒーローの `_` 点滅のみ（他のフェード・トランジション全廃）
- [ ] `package.json` から framer-motion / animejs / react-spring / react-multi-carousel / FontAwesome が削除されている
- [ ] `npm run build` がエラーなく完了する
- [ ] 削除対象コンポーネント／API／アセット／パッケージがリポジトリから消えている

## オープン項目（実装着手時に決める）

1. **アバター画像**: 8x8 または 16x16 のドット絵を新規制作するか。今回スコープ外。当面はメニューバー左の `▸ RYO` テキストワードマークで運用。
2. **About 文の最終確定**: 叩き台で OK か、再執筆するか。
3. **Loader の扱い**: 廃止か、極小サイズで残すか。
4. **`/work` の作品データソース**: 現状ハードコード or Hygraph 化。今回はハードコード継続を想定。
5. **uptime の計算**: 「36y」は静的か、誕生日からの動的計算か。

## 参考: ブレストの履歴

設計に至るまでの判断ログ（モックアップは `.superpowers/brainstorm/` 配下に保存）:

| Q | 決定 |
|---|------|
| 目的 | B(ブランディング) 主 + C(発信ハブ) 副 |
| ムード | ギーク |
| ギークの種別 | アナログ＝ピクセル感（紙ではない） |
| ビット感の中の方向 | 1-bit Mac |
| ダーク化の色 | 純2色（アクセントなし） |
| 構造 | Linear（縦スクロール） |
| ホームの構成 | Bio 削除、他は維持 |
| Posts ページ | コメント欄削除 |
| タイトルバー縞 | 32% コントラスト（A 案） |
