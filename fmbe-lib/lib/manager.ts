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
 * // レンダリング設定を適用
 * manager.applyRenderData(entity, {
 *   type: "block2d", // または FmbeRenderTypes.Block2D
 *   variables: { xpos: 0, ypos: 0, zpos: 0, scale: 1.0 },
 *   enabled: true,
 * });
 * 
 * // レンダリング変数を適用
 * manager.setRenderVariables(entity);
 * 
 * // レンダリング設定を解除
 * manager.removeRenderData(entity);
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
   * レンダリング設定を適用
   * 
   * @param entity - 対象エンティティ
   * @param data - レンダリングデータ
   * @returns 成功した場合 true
   */
  applyRenderData(entity: Entity, data: FmbeRenderData): boolean {
    entity.setDynamicProperty(PROPERTY_KEY, JSON.stringify(data));
    return this.applyRender(entity);
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
   * レンダリングデータを保持しているか
   * 
   * @param entity - 対象エンティティ
   * @returns レンダリングデータを保持している場合 true
   */
  hasRenderData(entity: Entity): boolean {
    const data = entity.getDynamicProperty(PROPERTY_KEY);
    return typeof data === "string" && data.length > 0;
  }

  /**
   * レンダリングデータを持つエンティティを取得
   * 
   * @param dimensions - 対象ディメンション（省略時は全ディメンション）
   * @param query - エンティティ取得クエリ
   * @returns レンダリングデータを持つエンティティ配列
   */
  getEntitiesWithRenderData(
    dimensions: MinecraftDimensionTypes[] = DEFAULT_DIMENSIONS,
    query: EntityQueryOptions = {}
  ): Entity[] {
    const result: Entity[] = [];
    for (const dimensionId of dimensions) {
      const dimension = world.getDimension(dimensionId);
      const entities = dimension.getEntities(query);
      for (const entity of entities) {
        if (this.hasRenderData(entity)) result.push(entity);
      }
    }
    return result;
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
    if (!data) return false;

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
        if (!manager.hasRenderData(entity)) continue;
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

