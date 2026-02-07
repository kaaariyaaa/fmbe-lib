/**
 * 2D ブロックレンダリング
 * 
 * このモジュールは、2次元的なブロック（看板、額縁など）を
 * エンティティのアニメーションを使用してレンダリングする機能を提供します。
 * 
 * @example
 * ```typescript
 * import { FmbeBlock2DRenderer } from "./lib/block2DRender.js";
 * 
 * const renderer = new FmbeBlock2DRenderer();
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
import { BLOCK_2D_PRESET } from "./renderPresets.js";

/**
 * 2D ブロックレンダリング用の変数定義
 * 
 * render.2d_blocks.mcfunction で使用される Molang 変数に対応します。
 */
export type Block2DRenderVariables = FmbeRenderVariables;

/**
 * 2D ブロックレンダリング用のアニメーション定義
 * 
 * render.2d_blocks.mcfunction と同じ順序でアニメーションを実行します。
 */
export type Block2DRenderAnimations = FmbeRenderAnimations;

/**
 * 2D ブロックレンダリングのオプション
 */
export type Block2DRenderOptions = FmbeRenderOptions;

/**
 * 2D ブロックレンダラー
 * 
 * 2次元的なブロックをエンティティのアニメーションでレンダリングします。
 * mcfunction の render.2d_blocks.mcfunction と同等の機能を提供します。
 * 
 * @example
 * ```typescript
 * // 基本的な使用方法
 * const renderer = new FmbeBlock2DRenderer();
 * renderer.apply(entity, {
 *   xpos: 0,
 *   ypos: 0,
 *   zpos: 0,
 *   yrot: Math.PI / 4, // 45度回転
 *   scale: 1.5,
 * });
 * 
 * // カスタムアニメーションを使用
 * const customRenderer = new FmbeBlock2DRenderer({
 *   animations: {
 *     headAnimation: "custom.animation.id",
 *   },
 *   blendOutTime: 0.5,
 * });
 * ```
 */
export class FmbeBlock2DRenderer extends FmbeRendererBase {
  /**
   * @param options - レンダリングオプション
   */
  constructor(options: Block2DRenderOptions = {}) {
    const config = resolveRenderConfig(BLOCK_2D_PRESET, options);
    super(config.animations, config.expressions, config.blendOutTime);
  }
}

/**
 * 2D ブロックの変数のみを設定（関数形式API）
 * 
 * レンダリングチェーン全体を実行せず、変数の値だけを更新します。
 * 後方互換性のために提供されています。新しいコードでは FmbeBlock2DRenderer クラスの使用を推奨します。
 * 
 * @param entity - 対象エンティティ
 * @param variables - 設定する変数
 * @param options - レンダリングオプション
 * 
 * @deprecated クラスベースの API を使用してください
 */
export function setBlock2DRenderVariables(
  entity: Entity,
  variables: Block2DRenderVariables,
  options: Block2DRenderOptions = {},
): void {
  new FmbeBlock2DRenderer(options).setVariables(entity, variables);
}

/**
 * 2D ブロックの完全なレンダリングを適用（関数形式API）
 * 
 * 変数を設定し、mcfunction と同じアニメーションチェーンを実行します。
 * 後方互換性のために提供されています。新しいコードでは FmbeBlock2DRenderer クラスの使用を推奨します。
 * 
 * @param entity - 対象エンティティ
 * @param variables - レンダリングパラメータ
 * @param options - レンダリングオプション
 * 
 * @deprecated クラスベースの API を使用してください
 */
export function applyBlock2DRender(
  entity: Entity,
  variables: Block2DRenderVariables,
  options: Block2DRenderOptions = {},
): void {
  new FmbeBlock2DRenderer(options).apply(entity, variables);
}
