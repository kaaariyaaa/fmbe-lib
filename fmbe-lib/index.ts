/**
 * FMBE (Fox Model Block Entity) Render Library
 * 
 * このライブラリは、Minecraft Bedrock Edition の Script API を使用して、
 * エンティティのアニメーションを利用した疑似的なブロック/アイテムレンダリングを提供します。
 * 
 * @module fmbe-render
 */

import { startAutoRenderLoop as _startAutoRenderLoop } from "./lib/manager.ts";

// ========================================
// 基本型定義
// ========================================
export type {
  FmbeRenderVariables,
  FmbeRenderAnimations,
  FmbeRenderOptions,
} from "./lib/renderBase.ts";

export {
  BLOCK_2D_PRESET,
  BLOCK_3D_PRESET,
  ITEM_PRESET,
  FMBE_PRESETS,
} from "./lib/renderPresets.ts";

export type {
  FmbeRenderPreset,
  FmbePresetKey,
} from "./lib/renderPresets.ts";

// ========================================
// 2D ブロックレンダリング
// ========================================
export {
  FmbeBlock2DRenderer,
  setBlock2DRenderVariables,
  applyBlock2DRender,
} from "./lib/block2DRender.ts";

export type {
  Block2DRenderVariables,
  Block2DRenderAnimations,
  Block2DRenderOptions,
} from "./lib/block2DRender.ts";

// ========================================
// 3D ブロックレンダリング
// ========================================
export {
  FmbeBlock3DRenderer,
  setBlock3DRenderVariables,
  applyBlock3DRender,
} from "./lib/block3DRender.ts";

export type {
  Block3DRenderVariables,
  Block3DRenderAnimations,
  Block3DRenderOptions,
} from "./lib/block3DRender.ts";

// ========================================
// アイテムレンダリング
// ========================================
export {
  FmbeItemRenderer,
  setItemRenderVariables,
  applyItemRender,
} from "./lib/itemRender.ts";

export type {
  ItemRenderVariables,
  ItemRenderAnimations,
  ItemRenderOptions,
} from "./lib/itemRender.ts";

// ========================================
// レンダリングマネージャー
// ========================================
export {
  FmbeManager,
  defaultFmbeManager,
  startAutoRenderLoop,
  stopAutoRenderLoop,
} from "./lib/manager.ts";

export type {
  FmbeRenderType,
  FmbeRenderData,
  FmbeAutoRenderLoopOptions,
} from "./lib/manager.ts";

export {
  FmbeRenderTypes,
} from "./lib/manager.ts";

_startAutoRenderLoop();
