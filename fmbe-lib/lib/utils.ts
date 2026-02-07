/**
 * 数値ユーティリティ関数
 * 
 * Molang 式に渡す数値の検証とフォーマットを行うヘルパー関数群
 */

/**
 * Molang に渡す値が有効な数値かどうかを確認
 * 
 * @param value - 検証する値
 * @returns 有効な数値の場合 true
 */
export function isFiniteNumber(value: number | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/**
 * 数値を Molang 式用の文字列にフォーマット
 * 
 * 整数はそのまま、浮動小数点数は小数点以下6桁に制限します。
 * これにより、Molang 式の長さを抑えつつ十分な精度を保ちます。
 * 
 * @param value - フォーマットする数値
 * @returns フォーマットされた文字列
 */
export function formatNumber(value: number): string {
  return Number.isInteger(value) ? value.toString() : value.toFixed(6);
}
