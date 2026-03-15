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
}

/**
 * Calculates the next set of values based on the move and collision behavior.
 * This implementation focuses on predictability and stability, especially near bounds.
 */
export function calculateNextValues(options: CollisionOptions): number[] {
  const {
    index,
    newValue,
    currentValues,
    min,
    max,
    minDistance,
    stepBetweenValues,
    behavior,
  } = options;
  const next = [...currentValues];

  if (stepBetweenValues !== undefined) {
    next[index] = clamp(newValue, min, max);

    // Enforce fixed distance: Pull/push all other thumbs relative to the moved one
    // Spread right
    for (let i = index + 1; i < next.length; i++) {
      next[i] = next[i - 1] + stepBetweenValues;
    }
    // Spread left
    for (let i = index - 1; i >= 0; i--) {
      next[i] = next[i + 1] - stepBetweenValues;
    }

    // Handle bounds: if the whole chain is out of bounds, shift it back
    if (next[next.length - 1] > max) {
      const overflow = next[next.length - 1] - max;
      for (let i = 0; i < next.length; i++) {
        next[i] -= overflow;
      }
    }
    if (next[0] < min) {
      const underflow = min - next[0];
      for (let i = 0; i < next.length; i++) {
        next[i] += underflow;
      }
    }

    // Final bound check to ensure no thumb is outside [min, max]
    // (though the logic above should prevent it unless the chain is wider than the track)
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
    if (index < next.length - 1) {
      clampedValue = Math.min(clampedValue, next[index + 1] - minDistance);
    }
    next[index] = clampedValue;
    return next;
  }

  if (behavior === 'push') {
    next[index] = clamp(newValue, min, max);

    // Push right
    for (let i = index + 1; i < next.length; i++) {
      if (next[i] < next[i - 1] + minDistance) {
        next[i] = next[i - 1] + minDistance;
      } else {
        break; // Stop if no collision
      }
    }

    // Push left
    for (let i = index - 1; i >= 0; i--) {
      if (next[i] > next[i + 1] - minDistance) {
        next[i] = next[i + 1] - minDistance;
      } else {
        break; // Stop if no collision
      }
    }

    // If pushing forced values out of bounds, we need to push back
    // while keeping the moved thumb (at 'index') as the anchor.

    // If the rightmost thumb is out of bounds
    if (next[next.length - 1] > max) {
      next[next.length - 1] = max;
      for (let i = next.length - 2; i >= 0; i--) {
        next[i] = Math.min(next[i], next[i + 1] - minDistance);
      }
    }

    // If the leftmost thumb is out of bounds
    if (next[0] < min) {
      next[0] = min;
      for (let i = 1; i < next.length; i++) {
        next[i] = Math.max(next[i], next[i - 1] + minDistance);
      }
    }

    // After all pushes and bound corrections, we must ensure the moved thumb
    // stayed as close to the requested 'newValue' as possible within the
    // physical constraints of the other thumbs and bounds.
    // The logic above ensures this by prioritizing the push propagation.
  }

  return next;
}
