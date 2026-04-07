import { clamp } from '@base-ui-rn/core';

export type CollisionBehavior = 'none' | 'push' | 'swap';

export interface CollisionOptions {
  index: number;
  newValue: number;
  currentValues: number[];
  min: number;
  max: number;
  minDistance: number;
  stepBetweenValues?: number;
  behavior: CollisionBehavior;
  maxDistance?: number;
}

export function calculateNextValues(options: CollisionOptions): number[] {
  const {
    behavior,
    currentValues,
    index,
    max,
    maxDistance,
    min,
    minDistance,
    newValue,
    stepBetweenValues,
  } = options;

  const next = [...currentValues];
  const len = next.length;

  if (stepBetweenValues !== undefined) {
    next[index] = clamp(newValue, min, max);

    for (let i = index + 1; i < len; i++) {
      next[i] = next[i - 1] + stepBetweenValues;
    }
    for (let i = index - 1; i >= 0; i--) {
      next[i] = next[i + 1] - stepBetweenValues;
    }

    const overflow = next[len - 1] > max ? next[len - 1] - max : 0;
    if (overflow > 0) {
      for (let i = 0; i < len; i++) next[i] -= overflow;
    }

    const underflow = next[0] < min ? min - next[0] : 0;
    if (underflow > 0) {
      for (let i = 0; i < len; i++) next[i] += underflow;
    }

    return next.map((v) => clamp(v, min, max));
  }

  if (behavior === 'swap') {
    next[index] = clamp(newValue, min, max);
    return next.sort((a, b) => a - b);
  }

  if (behavior === 'none') {
    let clampedValue = clamp(newValue, min, max);
    if (index > 0) {
      clampedValue = Math.max(clampedValue, next[index - 1] + minDistance);
    }
    if (index < len - 1) {
      clampedValue = Math.min(clampedValue, next[index + 1] - minDistance);
    }
    next[index] = clampedValue;
    return next;
  }

  if (behavior === 'push') {
    next[index] = clamp(newValue, min, max);

    for (let i = index + 1; i < len; i++) {
      if (next[i] < next[i - 1] + minDistance) {
        next[i] = next[i - 1] + minDistance;
      } else break;
    }

    for (let i = index - 1; i >= 0; i--) {
      if (next[i] > next[i + 1] - minDistance) {
        next[i] = next[i + 1] - minDistance;
      } else break;
    }

    if (maxDistance !== undefined && maxDistance > 0) {
      for (let i = index + 1; i < len; i++) {
        if (next[i] > next[i - 1] + maxDistance) {
          next[i] = next[i - 1] + maxDistance;
        } else break;
      }

      for (let i = index - 1; i >= 0; i--) {
        if (next[i] < next[i + 1] - maxDistance) {
          next[i] = next[i + 1] - maxDistance;
        } else break;
      }
    }

    if (next[len - 1] > max) {
      next[len - 1] = max;
      for (let i = len - 2; i >= 0; i--) {
        next[i] = Math.min(next[i], next[i + 1] - minDistance);
      }
    }

    if (next[0] < min) {
      next[0] = min;
      for (let i = 1; i < len; i++) {
        next[i] = Math.max(next[i], next[i - 1] + minDistance);
      }
    }
  }

  return next;
}
