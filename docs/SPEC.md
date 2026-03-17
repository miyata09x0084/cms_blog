# TypingAnimation ヒーロー主役化 仕様書

## Context

現在のTypingAnimationは、ヒーローセクションの名前・肩書きの**下**に小さなボーダー付きボックスとして配置されている補助的要素。これを「ユーザーファーストで最初に目に入る」ヒーローの主役に昇格させる。同時に、AI グリーティング機能を廃止し、時間帯ベースの静的歓迎メッセージに切り替える。

---

## 変更概要

### 1. AI グリーティング完全削除

**削除ファイル:**
- `pages/api/greeting.ts` — AI greeting API エンドポイント
- `lib/ai-config.ts` — OpenAI設定

**削除する依存関係 (package.json):**
- `"@ai-sdk/openai": "^3.0.41"`
- `"ai": "^6.0.116"`

**index.tsx クリーンアップ:**
- `AI_ENABLED` 定数削除 (L18)
- `greetingMessages` state + `useEffect` fetch ブロック削除 (L29-56)
- `useState`, `useEffect` import 削除
- `<TypingAnimation messages={greetingMessages} />` → `<TypingAnimation />`（props なし）

**.env クリーンアップ:**
- `OPENAI_API_KEY` 削除
- `NEXT_PUBLIC_AI_ENABLED` 削除

---

### 2. TypingAnimation コンポーネント リファクタ

**ファイル:** `components/TypingAnimation.jsx`

#### 2a. 時間帯ベースメッセージ（内部管理）

`messages` prop を廃止。コンポーネント内部で `getTimeBasedMessages()` を呼び、`useRef` で保持。

```javascript
function getTimeBasedMessages() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) {
    return [
      "Good morning! Great to see you here.",
      "Hope your day is off to a good start.",
      "Welcome — grab a coffee and explore.",
    ];
  } else if (hour >= 12 && hour < 18) {
    return [
      "Good afternoon! Thanks for visiting.",
      "Hope you're having a great day so far.",
      "Take your time — there's lots to see.",
    ];
  } else {
    return [
      "Good evening! Thanks for stopping by.",
      "Winding down? Take your time here.",
      "Welcome — enjoy the quiet browse.",
    ];
  }
}
```

- 全メッセージ英語のみ、45文字以内
- 歓迎トーン、自己PR なし
- `useRef(getTimeBasedMessages())` でマウント時に1回だけ評価（SSR 安全：refの値はレンダー出力に直接使われず、client-side の timeout 内でのみ参照されるため hydration mismatch なし）

#### 2b. 2巡停止ロジック

- `totalMessagesShown` を `useRef(0)` で追跡（再レンダー不要）
- `stopped` を `useState(false)` で管理（JSXに影響するため）
- メッセージ遷移完了時に `totalMessagesShown.current += 1`
- 停止条件: `totalMessagesShown.current >= texts.length * 2`（3メッセージ × 2巡 = 6回）
- `paused` フェーズで停止判定。条件成立時 `setStopped(true)` して以降の遷移を中止
- 停止後: 最後のメッセージが静的に表示、カーソル非表示

**タイピング速度の進行:**
- メッセージ 1-2: 110ms/文字（ゆっくり、第一印象）
- メッセージ 3-4: 85ms/文字（快適なリズム）
- メッセージ 5-6: 65ms/文字（やや速く、締めくくり）

`getTypingSpeed` を `totalMessagesShown` ベースに変更:
```javascript
const tier = Math.floor(totalMessagesShown.current / 2);
const idx = Math.min(tier, TYPING_SPEEDS.length - 1);
```

#### 2c. 不要コード削除

- `messages` prop、`pendingMessages` ref、`prevMessagesRef`、`applyPendingMessages`、`currentTexts` ref → 全削除
- `cycleCount` state → `totalMessagesShown` ref に置換して削除
- `DEFAULT_TEXTS` 定数 → `getTimeBasedMessages()` に置換して削除

#### 2d. アクセシビリティ（prefers-reduced-motion）

- reduced motion 時: タイピングの代わりにフェードイン・フェードアウトでメッセージ切替（現行と同等の挙動を維持）
- 同じ2巡停止ロジックを適用
- 停止後: 最後のメッセージが静的に残る

---

### 3. ビジュアル拡大（ヒーロー主役化）

**ファイル:** `components/TypingAnimation.jsx`

| プロパティ | Before (base/md) | After (base/md) |
|---|---|---|
| `display` | `inline-block` | `block` |
| `px` | `3 / 4` | `5 / 8` |
| `py` | `2` | `4 / 5` |
| `mt` | `3` | `5 / 6` |
| `fontSize` | `xs(12px) / sm(14px)` | `md(16px) / lg(18px)` |
| `borderRadius` | `17` | `20` |
| `w` | auto | `100%` |
| `minH` | なし | `60px / 72px` |
| カーソル `w` | `1px` | `2px` |

- `minH` + `display="flex"` + `alignItems="center"` でフェード遷移中のレイアウトシフト防止
- 枠付きデザインは維持（既存のデザイン言語を踏襲）

---

### 4. ヒーローレイアウト再構成

**ファイル:** `pages/index.tsx`

#### 4a. プロフィール画像をヒーローから削除

現在:
```
┌─────────────────────────────────┐
│ [Name + Title + Typing]  [Icon]│
└─────────────────────────────────┘
```

変更後:
```
┌─────────────────────────────────┐
│ Name                            │
│ Title                           │
│ ┌─────────────────────────────┐ │
│ │ Typing Animation (full-w)  │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

- `<Flex alignItems="center">` → `<Box>` に変更
- `<Image>` (self-image.jpg) をヒーローから削除

#### 4b. プロフィール画像を About セクションに移動

```tsx
<Flex
  direction={{ base: "column", md: "row" }}
  alignItems={{ base: "center", md: "flex-start" }}
  gap={6}
>
  <Box flexShrink={0}>
    <Image
      src="/assets/images/self-image.jpg"
      width={80}
      height={80}
      className="round-image"
      alt="Ryo Miyata"
    />
  </Box>
  <VStack align="start" spacing={4}>
    {/* 既存の About テキスト */}
  </VStack>
</Flex>
```

- サイズ: 72→80px（About セクションで少し大きめに）
- `priority={false}`, `loading="lazy"`（below the fold のため）
- モバイル: 画像が上、テキストが下（column）
- デスクトップ: 画像が左、テキストが右（row）

---

### 5. モバイル最適化（バランス調整）

- モバイルではタイピングボックスの `fontSize="md"(16px)`, `px={5}`, `py={4}`
- 推定ファーストビュー高さ: ~198px（名前30px + タイトル24px + マージン + ボックス60px + ページパディング64px）
- iPhone SE (667px) でもコンテンツの一部が見える余裕あり

---

### 6. エッジケース

| ケース | 対応 |
|---|---|
| SSR hydration mismatch | refの値はレンダー出力に直接使われないため問題なし |
| Component unmount中のアニメーション | 既存の `clearTimeout` クリーンアップで対処済み |
| React 18 StrictMode 二重マウント | refリセット→アニメーション再開。期待通りの挙動 |
| 長文メッセージのモバイル折り返し | 全メッセージ45文字以内 + `minH` で対応 |
| 日付変更をまたぐ | マウント時にメッセージ確定。再評価不要 |
| ページ内ナビゲーション後の再訪問 | 再マウント→アニメーション再開。BGM的挙動として適切 |

---

## 修正ファイル一覧

| ファイル | 操作 |
|---|---|
| `components/TypingAnimation.jsx` | 大幅リファクタ |
| `pages/index.tsx` | レイアウト再構成 + AI コード削除 |
| `package.json` | AI依存関係削除 |
| `pages/api/greeting.ts` | **削除** |
| `lib/ai-config.ts` | **削除** |
| `.env` | AI関連変数削除 |

## 実装順序

1. AI コード完全削除（greeting.ts, ai-config.ts, 依存関係, index.tsx のfetch）
2. TypingAnimation リファクタ（時間帯メッセージ、2巡停止、不要コード削除）
3. ビジュアル拡大（サイズ・スタイル変更）
4. ヒーローレイアウト再構成（画像移動）
5. `npm install` で lock ファイル再生成
6. 動作検証

## 検証方法

1. `npm run build` — ビルドエラーなし
2. `npm run dev` — 各時間帯のメッセージ確認（`getTimeBasedMessages()` の hour を一時的に変更して検証）
3. ブラウザでアクセシビリティ検証: prefers-reduced-motion 有効時のフェード動作確認
4. モバイルビューポート (375px) でファーストビューのバランス確認
5. 2巡（6メッセージ）後にアニメーションが停止し、最後のメッセージが静的に残ることを確認
6. カーソルが停止後に消えることを確認
