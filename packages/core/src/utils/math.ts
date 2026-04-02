/**
 * Clamps a value between a minimum and maximum bound.
 */
export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);
