/**
 * FMBE レンダリングの基底クラスと共通型定義
 * 
 * このモジュールは、2D/3D ブロックおよびアイテムのレンダリングに共通する
 * 基本機能を提供します。
 */

import type { Entity } from "@minecraft/server";
import { formatNumber, isFiniteNumber } from "./utils.ts";

/**
 * レンダリングに使用する Molang 変数の定義
 * 
 * これらの変数は、エンティティの位置、回転、スケールなどを制御します。
 * すべてのプロパティはオプションで、未指定の場合はデフォルト値が使用されます。
 */
export interface FmbeRenderVariables {
  /** X座標オフセット */
  xpos?: number;
  /** Y座標オフセット */
  ypos?: number;
  /** Z座標オフセット */
  zpos?: number;
  /** X軸回転（ラジアン） */
  xrot?: number;
  /** Y軸回転（ラジアン） */
  yrot?: number;
  /** Z軸回転（ラジアン） */
  zrot?: number;
  /** 基本スケール */
  scale?: number;
  /** 拡張スケール */
  extendScale?: number;
  /** 拡張X軸回転（ラジアン） */
  extendXrot?: number;
  /** 拡張Y軸回転（ラジアン） */
  extendYrot?: number;
  /** X軸ベース位置 */
  xbasepos?: number;
  /** Y軸ベース位置 */
  ybasepos?: number;
  /** Z軸ベース位置 */
  zbasepos?: number;
}

/**
 * レンダリングに使用するアニメーションとコントローラーのID定義
 * 
 * 各レンダリングタイプ（2D/3D ブロック、アイテム）で異なる
 * アニメーションIDを使用できます。
 */
export interface FmbeRenderAnimations {
  /** セットアップアニメーションID */
  setupAnimation?: string;
  /** セットアップコントローラーID */
  setupController?: string;
  /** スケールアニメーションID */
  scaleAnimation?: string;
  /** スケールコントローラーID */
  scaleController?: string;
  /** ヘッドアニメーションID */
  headAnimation?: string;
  /** ヘッドコントローラーID */
  headController?: string;
  /** ボディアニメーションID */
  bodyAnimation?: string;
  /** ボディコントローラーID */
  bodyController?: string;
  /** アタックアニメーションID */
  attackAnimation?: string;
  /** アタックコントローラーID */
  attackController?: string;
  /** 変数設定用アニメーションID */
  variableAnimation?: string;
}

/**
 * レンダリングオプション
 */
export interface FmbeRenderOptions {
  /** カスタムアニメーション設定 */
  animations?: FmbeRenderAnimations;
  /** アニメーションのブレンドアウト時間（秒） */
  blendOutTime?: number;
}


/**
 * レンダリングに使用する Molang 式の定義
 * 
 * @internal
 */
export interface FmbeRenderExpressions {
  /** セットアップ式（変換行列の計算） */
  setup: string;
  /** スケール式 */
  scale: string;
  /** ヘッド位置・回転の計算式 */
  head: string;
  /** ボディ回転の計算式 */
  body: string;
  /** アタック回転の計算式 */
  attack: string;
}

/**
 * セットアップ用 Molang 式
 * 
 * この式は、レンダリングに必要な変換行列を計算します。
 * 変数のデフォルト値設定と、回転行列の計算を行います。
 * 
 * @internal
 */
export const SETUP_EXPRESSION =
  "v.xpos=v.xpos??0;v.ypos=v.ypos??0;v.zpos=v.zpos??0;v.xrot=v.xrot??0;v.yrot=v.yrot??0;v.zrot=v.zrot??0;v.scale=v.scale??1;v.extend_scale=v.extend_scale??1;v.extend_xrot=v.extend_xrot??-90;v.extend_yrot=v.extend_yrot??0;v.xbasepos=v.xbasepos??0;v.ybasepos=v.ybasepos??0;v.zbasepos=v.zbasepos??0;v.F.r5=-math.sin(v.xrot);v.F.r2=-math.sin(v.yrot);v.F.r3=-math.sin(v.zrot);v.F.r4=math.cos(v.zrot);v.F.r8=math.cos(v.yrot);v.F.r0=-v.F.r5*v.F.r2*v.F.r3+v.F.r8*v.F.r4;v.F.r1=-v.F.r5*v.F.r2*v.F.r4-v.F.r8*v.F.r3;v.F.r6=-v.F.r5*v.F.r8*v.F.r3-v.F.r2*v.F.r4;v.F.r7=-v.F.r5*v.F.r8*v.F.r4+v.F.r2*v.F.r3;v.F.r2=v.F.r2*math.cos(v.xrot);v.F.r3=v.F.r3*math.cos(v.xrot);v.F.r4=v.F.r4*math.cos(v.xrot);v.F.r8=v.F.r8*math.cos(v.xrot);v.F.e0=math.cos(v.extend_yrot);v.F.e4=math.cos(v.extend_xrot);v.F.e5=-math.sin(v.extend_xrot);v.F.e6=math.sin(v.extend_yrot);v.F.e1=v.F.e5*v.F.e6;v.F.e2=-v.F.e4*v.F.e6;v.F.e7=-v.F.e5*v.F.e0;v.F.e8=v.F.e4*v.F.e0;v.F.p0=v.F.r0*v.F.e0+v.F.r2*v.F.e6;v.F.p1=v.F.r0*v.F.e1+v.F.r1*v.F.e4+v.F.r2*v.F.e7;v.F.p2=v.F.r0*v.F.e2+v.F.r1*v.F.e5+v.F.r2*v.F.e8;v.F.p3=v.F.r3*v.F.e0+v.F.r5*v.F.e6;v.F.p4=v.F.r3*v.F.e1+v.F.r4*v.F.e4+v.F.r5*v.F.e7;v.F.p5=v.F.r3*v.F.e2+v.F.r4*v.F.e5+v.F.r5*v.F.e8;v.F.p6=v.F.r6*v.F.e0+v.F.r8*v.F.e6;v.F.p7=v.F.r6*v.F.e1+v.F.r7*v.F.e4+v.F.r8*v.F.e7;v.F.p8=v.F.r6*v.F.e2+v.F.r7*v.F.e5+v.F.r8*v.F.e8;";

/**
 * TypeScript プロパティ名から Molang 変数名へのマッピング
 * 
 * @internal
 */
const VARIABLE_NAME_MAP: Record<keyof FmbeRenderVariables, string> = {
  xpos: "xpos",
  ypos: "ypos",
  zpos: "zpos",
  xrot: "xrot",
  yrot: "yrot",
  zrot: "zrot",
  scale: "scale",
  extendScale: "extend_scale",
  extendXrot: "extend_xrot",
  extendYrot: "extend_yrot",
  xbasepos: "xbasepos",
  ybasepos: "ybasepos",
  zbasepos: "zbasepos",
};

/** デフォルトのブレンドアウト時間 */
const DEFAULT_BLEND_OUT_TIME = 0;

/**
 * FMBE レンダリングの基底クラス
 * 
 * このクラスは、エンティティのアニメーションを使用したレンダリングの
 * 共通ロジックを提供します。継承先のクラスで具体的な式を定義します。
 */
export class FmbeRendererBase {
  private readonly animations: Required<FmbeRenderAnimations>;
  private readonly expressions: FmbeRenderExpressions;
  private readonly blendOutTime: number;

  /**
   * @param animations - 使用するアニメーションとコントローラーのID
   * @param expressions - レンダリングに使用する Molang 式
   * @param blendOutTime - アニメーションのブレンドアウト時間（秒）
   */
  constructor(
    animations: Required<FmbeRenderAnimations>,
    expressions: FmbeRenderExpressions,
    blendOutTime?: number,
  ) {
    this.animations = animations;
    this.expressions = expressions;
    this.blendOutTime = blendOutTime ?? DEFAULT_BLEND_OUT_TIME;
  }

  /**
   * Molang 変数のみを設定
   * 
   * レンダリングチェーン全体を実行せず、変数の値だけを更新します。
   * パフォーマンスが重要な場合や、変数のみを更新したい場合に使用します。
   * 
   * @param entity - 対象エンティティ
   * @param variables - 設定する変数
   */
  setVariables(entity: Entity, variables: FmbeRenderVariables): void {
    const expression = buildVariableAssignmentExpression(variables);
    if (!expression) return;

    entity.playAnimation(this.animations.variableAnimation, {
      blendOutTime: this.blendOutTime,
      stopExpression: expression,
    });
  }

  /**
   * 完全なレンダリングを適用
   * 
   * 変数を設定し、mcfunction と同じアニメーションチェーンを実行します。
   * これにより、エンティティが指定された位置・回転・スケールで表示されます。
   * 
   * @param entity - 対象エンティティ
   * @param variables - レンダリングパラメータ
   */
  apply(entity: Entity, variables: FmbeRenderVariables): void {
    this.setVariables(entity, variables);

    entity.playAnimation(this.animations.setupAnimation, {
      blendOutTime: this.blendOutTime,
      controller: this.animations.setupController,
      stopExpression: this.expressions.setup,
    });

    entity.playAnimation(this.animations.scaleAnimation, {
      blendOutTime: this.blendOutTime,
      controller: this.animations.scaleController,
      stopExpression: this.expressions.scale,
    });

    entity.playAnimation(this.animations.headAnimation, {
      blendOutTime: this.blendOutTime,
      controller: this.animations.headController,
      stopExpression: this.expressions.head,
    });

    entity.playAnimation(this.animations.bodyAnimation, {
      blendOutTime: this.blendOutTime,
      controller: this.animations.bodyController,
      stopExpression: this.expressions.body,
    });

    entity.playAnimation(this.animations.attackAnimation, {
      blendOutTime: this.blendOutTime,
      controller: this.animations.attackController,
      stopExpression: this.expressions.attack,
    });
  }
}

/**
 * アニメーション設定をマージ
 * 
 * デフォルト設定とカスタム設定を結合します。
 * カスタム設定で指定されたプロパティのみが上書きされます。
 * 
 * @param defaults - デフォルト設定
 * @param overrides - カスタム設定
 * @returns マージされた設定
 * 
 * @internal
 */
export function mergeAnimations(
  defaults: Required<FmbeRenderAnimations>,
  overrides: FmbeRenderAnimations | undefined,
): Required<FmbeRenderAnimations> {
  return {
    ...defaults,
    ...overrides,
  };
}

/**
 * プリセットとオプションからレンダラー設定を解決
 *
 * @param preset - レンダリングプリセット
 * @param options - レンダリングオプション
 */
export function resolveRenderConfig(
  preset: {
    animations: Required<FmbeRenderAnimations>;
    expressions: FmbeRenderExpressions;
  },
  options: FmbeRenderOptions = {},
): {
  animations: Required<FmbeRenderAnimations>;
  expressions: FmbeRenderExpressions;
  blendOutTime: number | undefined;
} {
  return {
    animations: mergeAnimations(preset.animations, options.animations),
    expressions: preset.expressions,
    blendOutTime: options.blendOutTime,
  };
}

/**
 * 変数を Molang 代入式に変換
 * 
 * FmbeRenderVariables オブジェクトを、Molang の代入文字列に変換します。
 * 有効な数値のみが含まれ、未定義や無限大の値は無視されます。
 * 
 * @param variables - 変換する変数
 * @returns Molang 代入式（例: "v.xpos=1.5;v.ypos=2.0;"）
 * 
 * @internal
 */
function buildVariableAssignmentExpression(
  variables: FmbeRenderVariables,
): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(variables) as Array<[
    keyof FmbeRenderVariables,
    number | undefined,
  ]>) {
    if (!isFiniteNumber(value)) continue;
    const molangName = VARIABLE_NAME_MAP[key];
    parts.push(`v.${molangName}=${formatNumber(value)};`);
  }

  return parts.join("");
}
