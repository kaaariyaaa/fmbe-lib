# FMBE Render Library

FMBE (Fox Model Block Entity) レンダリングライブラリは、Minecraft Bedrock Edition の Script API を使用して、エンティティのアニメーションを利用した疑似的なブロック/アイテムレンダリングを提供します。

## 概要

このライブラリは、mcfunction で提供されている以下のレンダリング機能を TypeScript から利用できるようにします：

- **2D ブロックレンダリング** (`render.2d_blocks.mcfunction`)
- **3D ブロックレンダリング** (`render.3d_blocks.mcfunction`)
- **アイテムレンダリング** (`render.items.mcfunction`)

## インストール

```typescript
// ライブラリ全体をインポート
import * as FmbeRender from "./lib/index.js";

// または、必要なモジュールのみをインポート
import { FmbeBlock2DRenderer } from "./lib/fmbeBlock2DRender.js";
import { FmbeBlock3DRenderer } from "./lib/fmbeBlock3DRender.js";
import { FmbeItemRenderer } from "./lib/fmbeItemRender.js";
```

## 基本的な使い方

### 2D ブロックのレンダリング

```typescript
import { FmbeBlock2DRenderer } from "./lib/fmbeBlock2DRender.js";

// レンダラーのインスタンスを作成
const renderer = new FmbeBlock2DRenderer();

// エンティティにレンダリングを適用
renderer.apply(entity, {
  xpos: 0,      // X座標オフセット
  ypos: 0,      // Y座標オフセット
  zpos: 0,      // Z座標オフセット
  yrot: Math.PI / 4,  // Y軸回転（45度）
  scale: 1.5,   // スケール
});
```

### 3D ブロックのレンダリング

```typescript
import { FmbeBlock3DRenderer } from "./lib/fmbeBlock3DRender.js";

const renderer = new FmbeBlock3DRenderer();

renderer.apply(entity, {
  xpos: 0,
  ypos: 0,
  zpos: 0,
  xrot: Math.PI / 6,  // X軸回転（30度）
  scale: 2.0,
});
```

### アイテムのレンダリング

```typescript
import { FmbeItemRenderer } from "./lib/fmbeItemRender.js";

const renderer = new FmbeItemRenderer();

renderer.apply(entity, {
  xpos: 0,
  ypos: 0.5,
  zpos: 0,
  yrot: Math.PI / 2,  // Y軸回転（90度）
  scale: 0.8,
});
```

## 高度な使い方

### カスタムアニメーションの使用

デフォルトのアニメーションIDを上書きできます：

```typescript
const renderer = new FmbeBlock2DRenderer({
  animations: {
    headAnimation: "custom.animation.id",
    scaleAnimation: "custom.scale.animation",
  },
  blendOutTime: 0.5,  // アニメーションのフェードアウト時間（秒）
});
```

### プリセットの活用

デフォルトのアニメーション設定を再利用しつつ、必要な部分だけ上書きできます：

```typescript
import { FmbeBlock2DRenderer, FMBE_PRESETS } from "./lib/index.js";

const renderer = new FmbeBlock2DRenderer({
  animations: {
    ...FMBE_PRESETS.block2d.animations,
    headAnimation: "custom.animation.id",
  },
});
```

### 変数のみの更新

レンダリングチェーン全体を実行せず、変数の値だけを更新する場合：

```typescript
const renderer = new FmbeBlock2DRenderer();

// 変数のみを設定（パフォーマンス重視）
renderer.setVariables(entity, {
  xpos: 1,
  ypos: 2,
  zpos: 3,
});
```

### レンダラーの再利用

レンダラーインスタンスは再利用可能です：

```typescript
const renderer = new FmbeBlock3DRenderer();

// 複数のエンティティに同じ設定を適用
entities.forEach(entity => {
  renderer.apply(entity, {
    xpos: 0,
    ypos: 0,
    zpos: 0,
    scale: 1.0,
  });
});
```

### レンダリング状態の管理

FmbeManager を使用すると、エンティティごとのレンダリング状態を dynamicProperty で永続化できます：

```typescript
import { FmbeManager } from "./lib/fmbeManager.js";

const manager = new FmbeManager();

// レンダリング設定を適用
manager.applyRenderData(entity, {
  type: "block2d",
  variables: { xpos: 0, ypos: 0, zpos: 0, scale: 1.0 },
  enabled: true,
});

// レンダリング設定を削除
manager.clearRenderData(entity);
```

### 複数エンティティの一括処理

```typescript
const manager = new FmbeManager();

// 複数のエンティティにレンダリングを適用
const entities = world.getDimension("overworld").getEntities();
const successCount = manager.applyRenderBatch(entities);
console.log(`${successCount} entities rendered`);
```

## API リファレンス

### 共通型

#### `FmbeRenderVariables`

レンダリングに使用する変数の定義。すべてのプロパティはオプションです。

| プロパティ | 型 | 説明 |
|----------|------|------|
| `xpos` | `number` | X座標オフセット |
| `ypos` | `number` | Y座標オフセット |
| `zpos` | `number` | Z座標オフセット |
| `xrot` | `number` | X軸回転（ラジアン） |
| `yrot` | `number` | Y軸回転（ラジアン） |
| `zrot` | `number` | Z軸回転（ラジアン） |
| `scale` | `number` | 基本スケール |
| `extendScale` | `number` | 拡張スケール |
| `extendXrot` | `number` | 拡張X軸回転（ラジアン） |
| `extendYrot` | `number` | 拡張Y軸回転（ラジアン） |
| `xbasepos` | `number` | X軸ベース位置 |
| `ybasepos` | `number` | Y軸ベース位置 |
| `zbasepos` | `number` | Z軸ベース位置 |

#### `FmbeRenderOptions`

レンダリングオプションの定義。

| プロパティ | 型 | 説明 |
|----------|------|------|
| `animations` | `FmbeRenderAnimations` | カスタムアニメーション設定 |
| `blendOutTime` | `number` | アニメーションのブレンドアウト時間（秒） |

### クラス

#### `FmbeBlock2DRenderer`

2D ブロックをレンダリングするクラス。

**メソッド:**
- `apply(entity: Entity, variables: Block2DRenderVariables): void`
  - 完全なレンダリングを適用
- `setVariables(entity: Entity, variables: Block2DRenderVariables): void`
  - 変数のみを設定

#### `FmbeBlock3DRenderer`

3D ブロックをレンダリングするクラス。

**メソッド:**
- `apply(entity: Entity, variables: Block3DRenderVariables): void`
  - 完全なレンダリングを適用
- `setVariables(entity: Entity, variables: Block3DRenderVariables): void`
  - 変数のみを設定

#### `FmbeItemRenderer`

アイテムをレンダリングするクラス。

**メソッド:**
- `apply(entity: Entity, variables: ItemRenderVariables): void`
  - 完全なレンダリングを適用
- `setVariables(entity: Entity, variables: ItemRenderVariables): void`
  - 変数のみを設定

#### `FmbeManager`

エンティティごとのレンダリング状態を管理するクラス。

**メソッド:**
- `getRenderData(entity: Entity): FmbeRenderData | undefined`
  - レンダリングデータを取得
- `setRenderData(entity: Entity, data: FmbeRenderData): void`
  - レンダリングデータを設定
- `applyRenderData(entity: Entity, data: FmbeRenderData): boolean`
  - レンダリング設定を適用
- `clearRenderData(entity: Entity): void`
  - レンダリングデータを削除
- `hasRenderData(entity: Entity): boolean`
  - レンダリングデータを保持しているか判定
- `getEntitiesWithRenderData(dimensions?: MinecraftDimensionTypes[], query?: EntityQueryOptions): Entity[]`
  - レンダリングデータを持つエンティティを取得
- `applyRender(entity: Entity): boolean`
  - 保存されたレンダリングデータに基づいてレンダリングを適用
- `applyRenderBatch(entities: Entity[]): number`
  - 複数のエンティティにレンダリングを適用
- `getRenderType(entity: Entity): FmbeRenderType | undefined`
  - レンダリングタイプを取得
- `getRenderVariables(entity: Entity): FmbeRenderVariables | undefined`
  - レンダリング変数を取得

#### `FmbeRenderData`

レンダリング設定データの定義。

| プロパティ | 型 | 説明 |
|----------|------|------|
| `type` | `FmbeRenderType` | レンダリングタイプ（"block2d" \| "block3d" \| "item"） |
| `variables` | `FmbeRenderVariables` | レンダリング変数 |
| `enabled` | `boolean` | 有効/無効フラグ |

## 後方互換性

関数形式の API も提供されていますが、非推奨です。新しいコードではクラスベースの API を使用してください。

```typescript
// 非推奨（後方互換性のために残されています）
import { applyBlock2DRender } from "./lib/fmbeBlock2DRender.js";

applyBlock2DRender(entity, { xpos: 0, ypos: 0, zpos: 0 });

// 推奨
import { FmbeBlock2DRenderer } from "./lib/fmbeBlock2DRender.js";

const renderer = new FmbeBlock2DRenderer();
renderer.apply(entity, { xpos: 0, ypos: 0, zpos: 0 });
```

## パフォーマンスに関する注意

- レンダラーインスタンスは再利用可能です。毎回新しいインスタンスを作成する必要はありません。
- 変数のみを更新する場合は `setVariables()` を使用してください。
- 無効な数値（`NaN`、`Infinity` など）は自動的に無視されます。

## ライセンス

このライブラリは、MFBE (Minecraft Fake Block Entity) プロジェクトの一部です。
