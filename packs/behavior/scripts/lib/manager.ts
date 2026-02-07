/**
 * FMBE Manager
 * 
 * このモジュールは、エンティティごとのFMBEレンダリング状態を管理します。
 * dynamicPropertyを使用して、レンダリング設定を永続化します。
 */

import { system, world } from "@minecraft/server";
import type { EntityQueryOptions, EntityComponentTypes } from "@minecraft/server";
import { MinecraftDimensionTypes, MinecraftEffectTypes } from "@minecraft/vanilla-data";
import type { Entity } from "@minecraft/server";
import { FmbeBlock2DRenderer } from "./block2DRender.ts";
import { FmbeBlock3DRenderer } from "./block3DRender.ts";
import { FmbeItemRenderer } from "./itemRender.ts";
import type { FmbeRenderVariables } from "./renderBase.ts";
import type { FmbeRendererBase } from "./renderBase.ts";

/**
 * レンダリングタイプ（enum 形式）
 */
export enum FmbeRenderTypes {
  Block2D = "block2d",
  Block3D = "block3d",
  Item = "item",
}

/**
 * レンダリングタイプ
 */
export type FmbeRenderType = "block2d" | "block3d" | "item" | FmbeRenderTypes;

/**
 * レンダリング設定データ
 */
export interface FmbeRenderData {
  /** レンダリングタイプ */
  type: FmbeRenderType;
  /** レンダリング変数 */
  variables: FmbeRenderVariables;
  /** 有効/無効フラグ */
  enabled: boolean;
}

/**
 * DynamicProperty のキー
 */
const PROPERTY_KEY = "fmbe:render_data";

const DEFAULT_DIMENSIONS = [
  MinecraftDimensionTypes.Overworld,
  MinecraftDimensionTypes.Nether,
  MinecraftDimensionTypes.TheEnd,
];

/**
 * FMBE レンダリングマネージャー
 * 
 * エンティティごとのレンダリング状態を管理し、dynamicPropertyで永続化します。
 * 
 * @example
 * ```typescript
 * const manager = new FmbeManager();
 * 
 * // レンダリング設定を保存
 * manager.setRenderData(entity, {
 *   type: "block2d", // または FmbeRenderTypes.Block2D
 *   variables: { xpos: 0, ypos: 0, zpos: 0, scale: 1.0 },
 *   enabled: true,
 * });
 * 
 * // レンダリングを適用
 * manager.applyRender(entity);
 * 
 * // レンダリングを無効化
 * manager.disable(entity);
 * 
 * // レンダリング設定を削除
 * manager.clearRenderData(entity);
 * ```
 */
export class FmbeManager {
  private readonly block2DRenderer: FmbeBlock2DRenderer;
  private readonly block3DRenderer: FmbeBlock3DRenderer;
  private readonly itemRenderer: FmbeItemRenderer;

  constructor() {
    this.block2DRenderer = new FmbeBlock2DRenderer();
    this.block3DRenderer = new FmbeBlock3DRenderer();
    this.itemRenderer = new FmbeItemRenderer();
  }

  /**
   * レンダリングデータを取得
   * 
   * @param entity - 対象エンティティ
   * @returns レンダリングデータ、または undefined（設定されていない場合）
   */
  getRenderData(entity: Entity): FmbeRenderData | undefined {
    try {
      const data = entity.getDynamicProperty(PROPERTY_KEY);
      if (typeof data !== "string") return undefined;
      return JSON.parse(data) as FmbeRenderData;
    } catch {
      return undefined;
    }
  }

  /**
   * レンダリングデータを設定
   * 
   * @param entity - 対象エンティティ
   * @param data - レンダリングデータ
   */
  setRenderData(entity: Entity, data: FmbeRenderData): void {
    entity.setDynamicProperty(PROPERTY_KEY, JSON.stringify(data));
  }

  /**
   * レンダリングデータを削除
   * 
   * @param entity - 対象エンティティ
   */
  clearRenderData(entity: Entity): void {
    entity.setDynamicProperty(PROPERTY_KEY, undefined);
  }

  /**
   * レンダリングが有効かどうかを確認
   * 
   * @param entity - 対象エンティティ
   * @returns 有効な場合 true
   */
  isEnabled(entity: Entity): boolean {
    const data = this.getRenderData(entity);
    return data?.enabled ?? false;
  }

  /**
   * レンダリングを有効化
   * 
   * @param entity - 対象エンティティ
   * @returns 成功した場合 true（レンダリングデータが存在しない場合は false）
   */
  enable(entity: Entity): boolean {
    return this.setEnable(entity, true);
  }

  /**
   * レンダリングを無効化
   *
   * @param entity - 対象エンティティ
   * @returns 成功した場合 true（レンダリングデータが存在しない場合は false）
   */
  disable(entity: Entity): boolean {
    return this.setEnable(entity, false);
  }

  /**
   * レンダリングの有効/無効を切り替え
   *
   * @param entity - 対象エンティティ
   * @param enable - 有効化するか
   * @returns 成功した場合 true（レンダリングデータが存在しない場合は false）
   */
  setEnable(entity: Entity, enable: boolean): boolean {
    const data = this.getRenderData(entity);
    if (!data) return false;
    
    data.enabled = enable;
    this.setRenderData(entity, data);
    return true;
  }

  /**
   * レンダリング変数を更新
   * 
   * 既存のレンダリングデータの変数のみを更新します。
   * レンダリングタイプや有効/無効フラグは変更されません。
   * 
   * @param entity - 対象エンティティ
   * @param variables - 更新する変数（部分的な更新が可能）
   * @returns 成功した場合 true（レンダリングデータが存在しない場合は false）
   */
  updateVariables(entity: Entity, variables: Partial<FmbeRenderVariables>): boolean {
    const data = this.getRenderData(entity);
    if (!data) return false;
    
    data.variables = { ...data.variables, ...variables };
    this.setRenderData(entity, data);
    return true;
  }

  /**
   * レンダリングを適用
   * 
   * 保存されているレンダリングデータに基づいて、エンティティにレンダリングを適用します。
   * enabled が false の場合は何もしません。
   * 
   * @param entity - 対象エンティティ
   * @returns 成功した場合 true（レンダリングデータが存在しないか無効な場合は false）
   */
  applyRender(entity: Entity): boolean {
    const data = this.getRenderData(entity);
    if (!data || !data.enabled) return false;

    try {
      const renderer = this.getRenderer(data.type);
      if (!renderer) return false;
      renderer.apply(entity, data.variables);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * レンダリング変数のみを設定
   * 
   * 保存されているレンダリングデータに基づいて、変数のみを更新します。
   * enabled が false の場合は何もしません。
   * 
   * @param entity - 対象エンティティ
   * @returns 成功した場合 true（レンダリングデータが存在しないか無効な場合は false）
   */
  setVariables(entity: Entity): boolean {
    const data = this.getRenderData(entity);
    if (!data || !data.enabled) return false;

    try {
      const renderer = this.getRenderer(data.type);
      if (!renderer) return false;
      renderer.setVariables(entity, data.variables);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 複数のエンティティにレンダリングを適用
   * 
   * @param entities - 対象エンティティの配列
   * @returns 成功したエンティティの数
   */
  applyRenderBatch(entities: Entity[]): number {
    let successCount = 0;
    for (const entity of entities) {
      if (this.applyRender(entity)) {
        successCount++;
      }
    }
    return successCount;
  }

  /**
   * エンティティのレンダリングタイプを取得
   * 
   * @param entity - 対象エンティティ
   * @returns レンダリングタイプ、または undefined（設定されていない場合）
   */
  getRenderType(entity: Entity): FmbeRenderType | undefined {
    return this.getRenderData(entity)?.type;
  }

  /**
   * エンティティのレンダリング変数を取得
   * 
   * @param entity - 対象エンティティ
   * @returns レンダリング変数、または undefined（設定されていない場合）
   */
  getRenderVariables(entity: Entity): FmbeRenderVariables | undefined {
    return this.getRenderData(entity)?.variables;
  }

  private getRenderer(type: FmbeRenderType): FmbeRendererBase | undefined {
    switch (type) {
      case "block2d":
        return this.block2DRenderer;
      case "block3d":
        return this.block3DRenderer;
      case "item":
        return this.itemRenderer;
      default:
        return undefined;
    }
  }
}

export interface FmbeAutoRenderLoopOptions {
  dimensions?: MinecraftDimensionTypes[];
  intervalTicks?: number;
  manager?: FmbeManager;
  query?: EntityQueryOptions;
}

export const defaultFmbeManager = new FmbeManager();

let autoLoopId: number | undefined;

export function startAutoRenderLoop(options: FmbeAutoRenderLoopOptions = {}): number {
  if (autoLoopId !== undefined) return autoLoopId;

  const manager = options.manager ?? defaultFmbeManager;
  const intervalTicks = options.intervalTicks ?? 0;
  const dimensions = options.dimensions ?? DEFAULT_DIMENSIONS;
  const query = options.query ?? {};

  autoLoopId = system.runInterval(() => {
    for (const dimensionId of dimensions) {
      const dimension = world.getDimension(dimensionId);
      const entities = dimension.getEntities(query);
      for (const entity of entities) {
        if (!hasRenderData(entity)) continue;
        entity.addEffect(MinecraftEffectTypes.Invisibility, 1, { showParticles: false });
        entity.addEffect(MinecraftEffectTypes.HealthBoost, 1, { showParticles: false });
        entity.clearVelocity();
        entity.teleport(entity.location);
        manager.applyRender(entity);
      }
    }
  }, intervalTicks);

  return autoLoopId;
}

export function stopAutoRenderLoop(): void {
  if (autoLoopId === undefined) return;
  system.clearRun(autoLoopId);
  autoLoopId = undefined;
}

function hasRenderData(entity: Entity): boolean {
  const data = entity.getDynamicProperty(PROPERTY_KEY);
  return typeof data === "string" && data.length > 0;
}
