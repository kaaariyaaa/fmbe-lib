/**
 * 3D ブロックレンダリング
 * 
 * このモジュールは、3次元的なブロック（通常のブロック）を
 * エンティティのアニメーションを使用してレンダリングする機能を提供します。
 * 
 * @example
 * ```typescript
 * import { FmbeBlock3DRenderer } from "./lib/block3DRender.js";
 * 
 * const renderer = new FmbeBlock3DRenderer();
 * renderer.apply(entity, {
 *   xpos: 0,
 *   ypos: 0,
 *   zpos: 0,
 *   scale: 1.0,
 * });
 * ```
 */

import type { Entity } from "@minecraft/server";
import {
  FmbeRendererBase,
  resolveRenderConfig,
  type FmbeRenderAnimations,
  type FmbeRenderOptions,
  type FmbeRenderVariables,
} from "./renderBase.js";
import { BLOCK_3D_PRESET } from "./renderPresets.js";

/**
 * 3D ブロックレンダリング用の変数定義
 * 
 * render.3d_blocks.mcfunction で使用される Molang 変数に対応します。
 */
export type Block3DRenderVariables = FmbeRenderVariables;

/**
 * 3D ブロックレンダリング用のアニメーション定義
 * 
 * render.3d_blocks.mcfunction と同じ順序でアニメーションを実行します。
 */
export type Block3DRenderAnimations = FmbeRenderAnimations;

/**
 * 3D ブロックレンダリングのオプション
 */
export type Block3DRenderOptions = FmbeRenderOptions;

/**
 * 3D ブロックレンダラー
 * 
 * 3次元的なブロックをエンティティのアニメーションでレンダリングします。
 * mcfunction の render.3d_blocks.mcfunction と同等の機能を提供します。
 * 
 * @example
 * ```typescript
 * // 基本的な使用方法
 * const renderer = new FmbeBlock3DRenderer();
 * renderer.apply(entity, {
 *   xpos: 0,
 *   ypos: 0,
 *   zpos: 0,
 *   xrot: Math.PI / 6, // 30度回転
 *   scale: 2.0,
 * });
 * 
 * // カスタムアニメーションを使用
 * const customRenderer = new FmbeBlock3DRenderer({
 *   animations: {
 *     scaleAnimation: "custom.scale.animation",
 *   },
 *   blendOutTime: 0.3,
 * });
 * ```
 */
export class FmbeBlock3DRenderer extends FmbeRendererBase {
  /**
   * @param options - レンダリングオプション
   */
  constructor(options: Block3DRenderOptions = {}) {
    const config = resolveRenderConfig(BLOCK_3D_PRESET, options);
    super(config.animations, config.expressions, config.blendOutTime);
  }
}

/**
 * 3D ブロックの変数のみを設定（関数形式API）
 * 
 * レンダリングチェーン全体を実行せず、変数の値だけを更新します。
 * 後方互換性のために提供されています。新しいコードでは FmbeBlock3DRenderer クラスの使用を推奨します。
 * 
 * @param entity - 対象エンティティ
 * @param variables - 設定する変数
 * @param options - レンダリングオプション
 * 
 * @deprecated クラスベースの API を使用してください
 */
export function setBlock3DRenderVariables(
  entity: Entity,
  variables: Block3DRenderVariables,
  options: Block3DRenderOptions = {},
): void {
  new FmbeBlock3DRenderer(options).setVariables(entity, variables);
}

/**
 * 3D ブロックの完全なレンダリングを適用（関数形式API）
 * 
 * 変数を設定し、mcfunction と同じアニメーションチェーンを実行します。
 * 後方互換性のために提供されています。新しいコードでは FmbeBlock3DRenderer クラスの使用を推奨します。
 * 
 * @param entity - 対象エンティティ
 * @param variables - レンダリングパラメータ
 * @param options - レンダリングオプション
 * 
 * @deprecated クラスベースの API を使用してください
 */
export function applyBlock3DRender(
  entity: Entity,
  variables: Block3DRenderVariables,
  options: Block3DRenderOptions = {},
): void {
  new FmbeBlock3DRenderer(options).apply(entity, variables);
}
