import { mergeHandlers } from './merge-handlers';

/**
 * A set of props that are considered critical for accessibility and semantics.
 *
 * For these props, injected values always take precedence over child values
 * to avoid breaking accessibility guarantees.
 */
const CRITICAL = new Set<string>([
  'accessibilityRole',
  'accessibilityHint',
  'accessibilityElementsHidden',
  'accessibilityLiveRegion',
  'importantForAccessibility',
  'focusable',
  'role',
  'tabIndex',
  'aria-expanded',
  'aria-selected',
  'aria-checked',
  'aria-disabled',
  'aria-hidden',
  'aria-controls',
  'aria-labelledby',
  'aria-describedby',
]);

/**
 * Utility type that flattens intersections for better IntelliSense output.
 */
type Simplify<T> = { [K in keyof T]: T[K] } & {};

/**
 * Resulting props type when injected props override child props.
 */
type MergedProps<Injected, Child> = Omit<Child, keyof Injected> & Injected;

/**
 * Shallowly merges two objects, avoiding allocation when no changes are needed.
 *
 * - If either value is not an object, the injected value wins.
 * - If all injected keys match the child values, the child object is returned
 *   unchanged to preserve referential equality.
 */
function mergeObjectsShallow(childObj: unknown, injectedObj: unknown): unknown {
  if (!childObj || typeof childObj !== 'object') return injectedObj;
  if (!injectedObj || typeof injectedObj !== 'object') return childObj;

  let hasChanges = false;
  const childRecord = childObj as Record<string, unknown>;
  const injectedRecord = injectedObj as Record<string, unknown>;

  for (const key in injectedRecord) {
    if (childRecord[key] !== injectedRecord[key]) {
      hasChanges = true;
      break;
    }
  }

  if (!hasChanges) return childObj;

  return { ...childRecord, ...injectedRecord };
}

/**
 * Merges injected props into child props with special handling for
 * accessibility, event handlers, and styles.
 *
 * Merge rules:
 * - `undefined` injected values are ignored.
 * - Accessibility state/value objects are shallow-merged.
 * - Critical accessibility props always override child values.
 * - Event handlers (`on*`) are composed so both handlers run.
 * - Styles are combined into an array to preserve order.
 * - For all other props, injected values are only applied if the child
 *   does not already define them.
 *
 * The function avoids cloning the child props object unless a change
 * is actually required, preserving referential equality where possible.
 */
export function mergeProps<
  Injected extends Record<string, unknown>,
  Child extends Record<string, unknown>,
>(injected: Injected, child: Child): Simplify<MergedProps<Injected, Child>> {
  let result: Record<string, unknown> = child;
  let cloned = false;

  for (const key in injected) {
    const injectedValue = injected[key];
    const childValue = child[key];

    if (injectedValue === undefined) continue;

    if (key === 'accessibilityState' || key === 'accessibilityValue') {
      const mergedObject = mergeObjectsShallow(childValue, injectedValue);
      if (mergedObject !== childValue) {
        if (!cloned) {
          result = { ...child };
          cloned = true;
        }
        result[key] = mergedObject;
      }
      continue;
    }

    if (CRITICAL.has(key)) {
      if (childValue !== injectedValue) {
        if (!cloned) {
          result = { ...child };
          cloned = true;
        }
        result[key] = injectedValue;
      }
      continue;
    }

    if (key.startsWith('on') && typeof injectedValue === 'function') {
      const mergedFn = mergeHandlers(
        injectedValue as (e: unknown) => void,
        childValue as ((e: unknown) => void) | undefined,
      );

      if (mergedFn !== childValue) {
        if (!cloned) {
          result = { ...child };
          cloned = true;
        }
        result[key] = mergedFn;
      }
      continue;
    }

    if (key === 'style') {
      if (!cloned) {
        result = { ...child };
        cloned = true;
      }

      if (!childValue) {
        result[key] = injectedValue;
      } else {
        result[key] = Array.isArray(childValue)
          ? [injectedValue, ...childValue]
          : [injectedValue, childValue];
      }
      continue;
    }

    if (childValue === undefined && injectedValue !== undefined) {
      if (!cloned) {
        result = { ...child };
        cloned = true;
      }
      result[key] = injectedValue;
    }
  }

  return result as Simplify<MergedProps<Injected, Child>>;
}
