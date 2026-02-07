/**
 * FMBE レンダリングのプリセット定義
 *
 * 2D/3D ブロックおよびアイテムに対応する
 * デフォルトアニメーションと Molang 式をまとめています。
 */

import { SETUP_EXPRESSION } from "./renderBase.js";
import type {
  FmbeRenderAnimations,
  FmbeRenderExpressions,
} from "./renderBase.js";

/**
 * レンダリングプリセット
 */
export interface FmbeRenderPreset {
  /** デフォルトアニメーション設定 */
  animations: Required<FmbeRenderAnimations>;
  /** Molang 式セット */
  expressions: FmbeRenderExpressions;
}

/**
 * 2D ブロック用のプリセット
 */
export const BLOCK_2D_PRESET: FmbeRenderPreset = {
  animations: {
    setupAnimation: "animation.player.sleeping",
    setupController: "controller.animation.fox.move",
    scaleAnimation: "animation.creeper.swelling",
    scaleController: "fmbe:fmbe.2d_blocks.anim1",
    headAnimation: "animation.ender_dragon.neck_head_movement",
    headController: "fmbe:fmbe.2d_blocks.anim2",
    bodyAnimation: "animation.warden.move",
    bodyController: "fmbe:fmbe.2d_blocks.anim3",
    attackAnimation: "animation.player.attack.rotations",
    attackController: "fmbe:fmbe.2d_blocks.anim4",
    variableAnimation: "animation.player.sleeping",
  },
  expressions: {
    setup: SETUP_EXPRESSION,
    scale:
      "v.F.co=math.cos(25);v.F.si=math.sin(25);v.swelling_scale2=v.extend_scale*(v.swelling_scale1=(v.F.s=math.sqrt(17/8*v.scale)));",
    head:
      "v.F.X=(v.xpos-1)*v.F.p0+(v.ypos-1/128)*v.F.p3+v.zpos*v.F.p6+((v.xbasepos+2/9)*v.F.e0+(v.zbasepos+32/65)*v.F.e6*v.extend_scale)*v.scale;v.F.Y=(v.xpos-1)*v.F.p1+(v.ypos-1/128)*v.F.p4+v.zpos*v.F.p7+((v.xbasepos+2/9)*v.F.e1+(v.ybasepos+10/11)*v.F.e4+(v.zbasepos+32/65)*v.F.e7*v.extend_scale)*v.scale;v.head_position_y=16/v.F.s*(((v.xpos-1)*v.F.p2+(v.ypos-1/128)*v.F.p5+v.zpos*v.F.p8)/v.extend_scale+((v.xbasepos+2/9)*v.F.e2+(v.ybasepos+10/11)*v.F.e5+(v.zbasepos+32/65)*v.F.e8*v.extend_scale)*v.scale);v.head_position_x=16/v.F.s*(v.F.X*v.F.co-v.F.Y*v.F.si);v.head_position_z=16/v.F.s*(v.F.X*v.F.si+v.F.Y*v.F.co);v.head_rotation_x=v.F.e6*v.F.si+v.F.e7*v.F.co||v.F.e0*v.F.si*v.F.si+v.F.e1*v.F.si*v.F.co+v.F.e4*v.F.co*v.F.co?math.atan2(-v.F.e6*v.F.si-v.F.e7*v.F.co,v.F.e0*v.F.si*v.F.si+v.F.e1*v.F.si*v.F.co+v.F.e4*v.F.co*v.F.co):math.atan2(v.F.e2*v.F.si+v.F.e5*v.F.co,v.F.e8);v.head_rotation_y=math.asin(v.F.e4*v.F.si*v.F.co-v.F.e1*v.F.co*v.F.co-v.F.e0*v.F.co*v.F.si);v.head_rotation_z=v.F.e6*v.F.si+v.F.e7*v.F.co||v.F.e0*v.F.si*v.F.si+v.F.e1*v.F.si*v.F.co+v.F.e4*v.F.co*v.F.co?math.atan2(v.F.e5*v.F.si-v.F.e2*v.F.co,v.F.e0*v.F.co*v.F.co-v.F.e1*v.F.co*v.F.si+v.F.e4*v.F.si*v.F.si):0;",
    body:
      "v.body_x_rot=v.F.p5||v.F.p3*v.F.si+v.F.p4*v.F.co?math.atan2(v.F.p5,-v.F.p3*v.F.si-v.F.p4*v.F.co):math.atan2(-v.F.p0*v.F.si-v.F.p1*v.F.co,-v.F.p2);v.body_z_rot=v.F.p5||v.F.p3*v.F.si+v.F.p4*v.F.co?math.atan2(v.F.p0*v.F.co-v.F.p1*v.F.si,v.F.p7*v.F.si-v.F.p6*v.F.co):0;",
    attack: "v.attack_body_rot_y=math.asin(v.F.p3*v.F.co-v.F.p4*v.F.si);",
  },
};

/**
 * 3D ブロック用のプリセット
 */
export const BLOCK_3D_PRESET: FmbeRenderPreset = {
  animations: {
    setupAnimation: "animation.player.sleeping",
    setupController: "controller.animation.fox.move",
    scaleAnimation: "animation.creeper.swelling",
    scaleController: "fmbe:fmbe.3d_blocks.anim1",
    headAnimation: "animation.ender_dragon.neck_head_movement",
    headController: "fmbe:fmbe.3d_blocks.anim2",
    bodyAnimation: "animation.warden.move",
    bodyController: "fmbe:fmbe.3d_blocks.anim3",
    attackAnimation: "animation.player.attack.rotations",
    attackController: "fmbe:fmbe.3d_blocks.anim4",
    variableAnimation: "animation.player.sleeping",
  },
  expressions: {
    setup: SETUP_EXPRESSION,
    scale:
      "v.swelling_scale2=v.extend_scale*(v.swelling_scale1=(v.F.s=math.sqrt(32/7*v.scale)));",
    head:
      "v.head_position_x=-16/v.F.s*((v.xpos-1)*v.F.p1+(v.ypos-1/128)*v.F.p4+v.zpos*v.F.p7+(v.xbasepos*v.F.e1+(v.ybasepos+10/7)*v.extend_scale*v.F.e4+(v.zbasepos-16/7)*v.F.e7)*v.scale);v.head_position_y=16/v.F.s*(((v.xpos-1)*v.F.p2+(v.ypos-1/128)*v.F.p5+v.zpos*v.F.p8)/v.extend_scale+(v.xbasepos*v.F.e2+(v.ybasepos+10/7)*v.extend_scale*v.F.e5+(v.zbasepos-16/7)*v.F.e8)*v.scale);v.head_position_z=16/v.F.s*((v.xpos-1)*v.F.p0+(v.ypos-1/128)*v.F.p3+v.zpos*v.F.p6+(v.xbasepos*v.F.e0+(v.zbasepos-16/7)*v.F.e6)*v.scale);v.head_rotation_x=v.F.e6?math.atan2(0,-v.F.e6):math.atan2(-v.F.e8,v.F.e5);v.head_rotation_y=math.asin(-v.F.e0);v.head_rotation_z=v.F.e6?math.atan2(-v.F.e2,-v.F.e1):0;",
    body:
      "v.body_x_rot=v.F.p5||v.F.p3?math.atan2(v.F.p5,-v.F.p3):math.atan2(-v.F.p0,-v.F.p2);v.body_z_rot=v.F.p5||v.F.p3?math.atan2(-v.F.p1,v.F.p7):0;",
    attack: "v.attack_body_rot_y=math.asin(-v.F.p4);",
  },
};

/**
 * アイテム用のプリセット
 */
export const ITEM_PRESET: FmbeRenderPreset = {
  animations: {
    setupAnimation: "animation.player.sleeping",
    setupController: "controller.animation.fox.move",
    scaleAnimation: "animation.creeper.swelling",
    scaleController: "fmbe:fmbe.items.anim1",
    headAnimation: "animation.ender_dragon.neck_head_movement",
    headController: "fmbe:fmbe.items.anim2",
    bodyAnimation: "animation.warden.move",
    bodyController: "fmbe:fmbe.items.anim3",
    attackAnimation: "animation.player.attack.rotations",
    attackController: "fmbe:fmbe.items.anim4",
    variableAnimation: "animation.player.sleeping",
  },
  expressions: {
    setup: SETUP_EXPRESSION,
    scale:
      "v.F.co=math.cos(25);v.F.si=math.sin(25);v.swelling_scale2=v.extend_scale*(v.swelling_scale1=(v.F.s=math.sqrt(17/8*v.scale)));",
    head:
      "v.F.X=(v.xpos-1)*v.F.p0+(v.ypos-1/128)*v.F.p3+v.zpos*v.F.p6+((v.xbasepos+11/29)*v.F.e0+(v.zbasepos+8/15)*v.F.e6*v.extend_scale)*v.scale;v.F.Y=(v.xpos-1)*v.F.p1+(v.ypos-1/128)*v.F.p4+v.zpos*v.F.p7+((v.xbasepos+11/29)*v.F.e1+(v.ybasepos+31/37)*v.F.e4+(v.zbasepos+8/15)*v.F.e7*v.extend_scale)*v.scale;v.head_position_y=16/v.F.s*(((v.xpos-1)*v.F.p2+(v.ypos-1/128)*v.F.p5+v.zpos*v.F.p8)/v.extend_scale+((v.xbasepos+11/29)*v.F.e2+(v.ybasepos+31/37)*v.F.e5+(v.zbasepos+8/15)*v.F.e8*v.extend_scale)*v.scale);v.head_position_x=16/v.F.s*(v.F.X*v.F.co-v.F.Y*v.F.si);v.head_position_z=16/v.F.s*(v.F.X*v.F.si+v.F.Y*v.F.co);v.head_rotation_x=v.F.e6*v.F.si+v.F.e7*v.F.co||v.F.e0*v.F.si*v.F.si+v.F.e1*v.F.si*v.F.co+v.F.e4*v.F.co*v.F.co?math.atan2(-v.F.e6*v.F.si-v.F.e7*v.F.co,v.F.e0*v.F.si*v.F.si+v.F.e1*v.F.si*v.F.co+v.F.e4*v.F.co*v.F.co):math.atan2(v.F.e2*v.F.si+v.F.e5*v.F.co,v.F.e8);v.head_rotation_y=math.asin(v.F.e4*v.F.si*v.F.co-v.F.e1*v.F.co*v.F.co-v.F.e0*v.F.co*v.F.si);v.head_rotation_z=v.F.e6*v.F.si+v.F.e7*v.F.co||v.F.e0*v.F.si*v.F.si+v.F.e1*v.F.si*v.F.co+v.F.e4*v.F.co*v.F.co?math.atan2(v.F.e5*v.F.si-v.F.e2*v.F.co,v.F.e0*v.F.co*v.F.co-v.F.e1*v.F.co*v.F.si+v.F.e4*v.F.si*v.F.si):0;",
    body:
      "v.body_x_rot=v.F.p5||v.F.p3*v.F.si+v.F.p4*v.F.co?math.atan2(v.F.p5,-v.F.p3*v.F.si-v.F.p4*v.F.co):math.atan2(-v.F.p0*v.F.si-v.F.p1*v.F.co,-v.F.p2);v.body_z_rot=v.F.p5||v.F.p3*v.F.si+v.F.p4*v.F.co?math.atan2(v.F.p0*v.F.co-v.F.p1*v.F.si,v.F.p7*v.F.si-v.F.p6*v.F.co):0;",
    attack: "v.attack_body_rot_y=math.asin(v.F.p3*v.F.co-v.F.p4*v.F.si);",
  },
};

export type FmbePresetKey = "block2d" | "block3d" | "item";

export const FMBE_PRESETS: Record<FmbePresetKey, FmbeRenderPreset> = {
  block2d: BLOCK_2D_PRESET,
  block3d: BLOCK_3D_PRESET,
  item: ITEM_PRESET,
};
