/**
 * FMBE (Fake Model Block Entity) Render Library
 * 
 * このライブラリは、Minecraft Bedrock Edition の Script API を使用して、
 * エンティティのアニメーションを利用した疑似的なブロック/アイテムレンダリングを提供します。
 * 
 * @module fmbe-render
 */

import { startAutoRenderLoop as _startAutoRenderLoop } from "./manager.js";

// ========================================
// 基本型定義
// ========================================
export type {
  FmbeRenderVariables,
  FmbeRenderAnimations,
  FmbeRenderOptions,
} from "./renderBase.js";

export {
  BLOCK_2D_PRESET,
  BLOCK_3D_PRESET,
  ITEM_PRESET,
  FMBE_PRESETS,
} from "./renderPresets.js";

export type {
  FmbeRenderPreset,
  FmbePresetKey,
} from "./renderPresets.js";

// ========================================
// 2D ブロックレンダリング
// ========================================
export {
  FmbeBlock2DRenderer,
  setBlock2DRenderVariables,
  applyBlock2DRender,
} from "./block2DRender.js";

export type {
  Block2DRenderVariables,
  Block2DRenderAnimations,
  Block2DRenderOptions,
} from "./block2DRender.js";

// ========================================
// 3D ブロックレンダリング
// ========================================
export {
  FmbeBlock3DRenderer,
  setBlock3DRenderVariables,
  applyBlock3DRender,
} from "./block3DRender.js";

export type {
  Block3DRenderVariables,
  Block3DRenderAnimations,
  Block3DRenderOptions,
} from "./block3DRender.js";

// ========================================
// アイテムレンダリング
// ========================================
export {
  FmbeItemRenderer,
  setItemRenderVariables,
  applyItemRender,
} from "./itemRender.js";

export type {
  ItemRenderVariables,
  ItemRenderAnimations,
  ItemRenderOptions,
} from "./itemRender.js";

// ========================================
// レンダリングマネージャー
// ========================================
export {
  FmbeManager,
  defaultFmbeManager,
  startAutoRenderLoop,
  stopAutoRenderLoop,
} from "./manager.js";

export type {
  FmbeRenderType,
  FmbeRenderData,
  FmbeAutoRenderLoopOptions,
} from "./manager.js";

export {
  FmbeRenderTypes,
} from "./manager.js";

_startAutoRenderLoop();
