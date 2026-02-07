/**
 * アイテムレンダリング
 * 
 * このモジュールは、アイテムを
 * エンティティのアニメーションを使用してレンダリングする機能を提供します。
 * 
 * @example
 * ```typescript
 * import { FmbeItemRenderer } from "./lib/itemRender.ts";
 * 
 * const renderer = new FmbeItemRenderer();
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
} from "./renderBase.ts";
import { ITEM_PRESET } from "./renderPresets.ts";

/**
 * アイテムレンダリング用の変数定義
 * 
 * render.items.mcfunction で使用される Molang 変数に対応します。
 */
export type ItemRenderVariables = FmbeRenderVariables;

/**
 * アイテムレンダリング用のアニメーション定義
 * 
 * render.items.mcfunction と同じ順序でアニメーションを実行します。
 */
export type ItemRenderAnimations = FmbeRenderAnimations;

/**
 * アイテムレンダリングのオプション
 */
export type ItemRenderOptions = FmbeRenderOptions;

/**
 * アイテムレンダラー
 * 
 * アイテムをエンティティのアニメーションでレンダリングします。
 * mcfunction の render.items.mcfunction と同等の機能を提供します。
 * 
 * @example
 * ```typescript
 * // 基本的な使用方法
 * const renderer = new FmbeItemRenderer();
 * renderer.apply(entity, {
 *   xpos: 0,
 *   ypos: 0.5,
 *   zpos: 0,
 *   yrot: Math.PI / 2, // 90度回転
 *   scale: 0.8,
 * });
 * 
 * // カスタムアニメーションを使用
 * const customRenderer = new FmbeItemRenderer({
 *   animations: {
 *     bodyAnimation: "custom.body.animation",
 *   },
 *   blendOutTime: 0.2,
 * });
 * ```
 */
export class FmbeItemRenderer extends FmbeRendererBase {
  /**
   * @param options - レンダリングオプション
   */
  constructor(options: ItemRenderOptions = {}) {
    const config = resolveRenderConfig(ITEM_PRESET, options);
    super(config.animations, config.expressions, config.blendOutTime);
  }
}

/**
 * アイテムの変数のみを設定（関数形式API）
 * 
 * レンダリングチェーン全体を実行せず、変数の値だけを更新します。
 * 後方互換性のために提供されています。新しいコードでは FmbeItemRenderer クラスの使用を推奨します。
 * 
 * @param entity - 対象エンティティ
 * @param variables - 設定する変数
 * @param options - レンダリングオプション
 * 
 * @deprecated クラスベースの API を使用してください
 */
export function setItemRenderVariables(
  entity: Entity,
  variables: ItemRenderVariables,
  options: ItemRenderOptions = {},
): void {
  new FmbeItemRenderer(options).setVariables(entity, variables);
}

/**
 * アイテムの完全なレンダリングを適用（関数形式API）
 * 
 * 変数を設定し、mcfunction と同じアニメーションチェーンを実行します。
 * 後方互換性のために提供されています。新しいコードでは FmbeItemRenderer クラスの使用を推奨します。
 * 
 * @param entity - 対象エンティティ
 * @param variables - レンダリングパラメータ
 * @param options - レンダリングオプション
 * 
 * @deprecated クラスベースの API を使用してください
 */
export function applyItemRender(
  entity: Entity,
  variables: ItemRenderVariables,
  options: ItemRenderOptions = {},
): void {
  new FmbeItemRenderer(options).apply(entity, variables);
}
