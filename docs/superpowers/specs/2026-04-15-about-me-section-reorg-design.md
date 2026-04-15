# About Me セクション改称・順序再編 設計書

作成日: 2026-04-15
対象ファイル: `pages/index.tsx`

## 背景・目的

トップページをより「パーソナルなサイト」に寄せる。現状は作品ポートフォリオ寄りの構成（About → Posts → Creations → Bio → Interests）で、人となりを示す情報がページ下部に埋もれている。

方針:
1. 旧 `/About` を `/About Me` に改称し、中身を "人物紹介" に書き換える
2. Bio / Interests をページ上部へ繰り上げ、訪問者が「誰か」を先に理解できる構成にする

## スコープ

### やること

- `pages/index.tsx` のセクション順序の並び替え
- セクション見出し `/About` → `/About Me` の改称
- About Me の本文書き換え（3段落 → 2段落）

### やらないこと（スコープ外）

- home-buying platform の話を Creations セクションに移設（別タスク）
- TypingAnimation / Hero（名前・顔写真） / Bio / Interests / Posts / Creations の中身変更
- デザイントークン・色・レイアウトの変更
- 英語以外の言語対応

## 変更内容

### 1. セクション順序

**変更前**
```
1. Hero Image（キーボード画像）
2. Typing
3. Hero（名前・Software Engineer・顔写真）
4. /About        ← 3段落
5. /Posts
6. /Creations
7. /Bio
8. /Interests
```

**変更後**
```
1. Hero Image（キーボード画像）      ※変更なし
2. Typing                             ※変更なし
3. Hero（名前・Software Engineer・顔写真） ※変更なし
4. /About Me                          ← 改称 + 内容書き換え（2段落）
5. /Bio                               ← 元7から移動
6. /Interests                         ← 元8から移動
7. /Posts                             ← 元5から移動
8. /Creations                         ← 元6から移動
```

狙い: 「人（About Me）→ 経歴（Bio）→ 関心（Interests）→ 書いたもの（Posts）→ 作ったもの（Creations）」という、内側から外側へ広がる流れにする。

### 2. 見出し改称

- `/About` → `/About Me`
- 他セクション（`/Posts`, `/Creations`, `/Bio`, `/Interests`）の prefix スタイル（`/` 始まり）は踏襲
- "About Me" はスペース有り（例: `<Heading>/About Me</Heading>`）

### 3. About Me 本文（2段落構成）

既存3段落を2段落に再構成する。言語は英語（現状踏襲）。

**段落①: 自分自身の核**
- "younger twin brother" として生まれた出自に触れる
- 頭の中の多様なアイデアを、プログラミングで現実のアプリに落とし込むことへの情熱
- 過去コミット eda7d42 / 初期版の以下の温度感を参考にする:
  > "I am the younger twin brother. I love using programming to manifest my diverse ideas into real-world applications. It's my passion to express these concepts through the creation of apps."

**段落②: 日常の自分**
- 現状3段落目（温泉・カフェ・副業）を踏襲し、もう少し "いま熱中していること" を足す
- 朝コーヒー / サイドプロジェクト / 温泉・カフェなどの生活ディテール

**削除する内容**
- 現 About 2段落目の home-buying platform 実績詳細一式

### 4. データ・Propsへの影響

- `getStaticProps` は変更なし
- `posts` prop の受け取りも変更なし
- 型定義（`Props` interface）も変更なし
- 純粋に JSX の並び替え + 文言変更のみ

## 影響範囲

### 変更ファイル
- `pages/index.tsx`

### 影響を受けないもの
- `components/` 配下のコンポーネント
- `services/` のデータ層
- `styles/` のスタイル定義
- 他ページ（`pages/post/`, `pages/work/`, `pages/category/`）

## 検証項目

実装後に確認すること:

1. トップページが 8 セクション全てレンダリングされる
2. セクションの表示順が仕様通り（Hero → About Me → Bio → Interests → Posts → Creations）
3. `/About Me` 見出しが表示される
4. About Me が2段落で、home-buying の記述が消えている
5. 各セクション内のリンク（All posts → / All creations → / 既存の note 記事リンク）が機能する
6. ライト/ダークモード両方で崩れがない
7. モバイル幅（`base`）とデスクトップ幅（`md` 以上）の両方で崩れがない

## リスク・注意事項

- About Me の本文は人称・トーンの影響が大きいため、実装時にユーザーが最終文案を確認するプロセスを挟む
- セクション順序の入れ替えは JSX ブロックの移動のみで、既存の Box / VStack / Heading 等の構造は保持する
