import { mergeHandlers } from './merge-handlers';

/**
 * Set of prop names that must always be injected to preserve
 * accessibility, semantics, and interaction behavior.
 */
const CRITICAL = new Set<string>([
  'accessible',
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
  'onStartShouldSetResponder',
  'onMoveShouldSetResponder',
  'onResponderGrant',
  'onResponderMove',
  'onResponderRelease',
  'onResponderTerminate',
  'onResponderTerminationRequest',
]);

/**
 * Flattens an inferred type for cleaner public signatures.
 */
type Simplify<T> = { [K in keyof T]: T[K] } & {};

/**
 * Resulting prop type after injected props override child props.
 */
type MergedProps<Injected, Child> = Omit<Child, keyof Injected> & Injected;

/**
 * Shallowly merges two objects while preserving reference identity
 * if no injected values differ from the child values.
 *
 * @param childObj - Original object from the child
 * @param injectedObj - Injected object values
 * @returns The merged object or the original reference if unchanged
 */
function mergeObjectsShallow(childObj: unknown, injectedObj: unknown): unknown {
  if (!childObj || typeof childObj !== 'object') return injectedObj;
  if (!injectedObj || typeof injectedObj !== 'object') return childObj;

  const childRecord = childObj as Record<string, unknown>;
  const injectedRecord = injectedObj as Record<string, unknown>;

  let hasChanges = false;
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
 * Merges injected props into child props with predictable precedence.
 *
 * Injected props always win. Event handlers are merged into stable
 * composite handlers. Accessibility-related objects are shallow-merged
 * to preserve referential stability when possible.
 *
 * @typeParam Injected - Props provided by the primitive
 * @typeParam Child - Props provided by the consumer
 * @param injected - Props injected by the primitive
 * @param child - Props provided by the child element
 * @returns A merged props object with stable references
 */
export function mergeProps<
  Injected extends Record<string, unknown>,
  Child extends Record<string, unknown>,
>(injected: Injected, child: Child): Simplify<MergedProps<Injected, Child>> {
  const result: Record<string, unknown> = { ...child };

  for (const key in injected) {
    const injectedValue = injected[key];
    const childValue = child[key];

    if (injectedValue === undefined) continue;

    if (key === 'accessibilityState' || key === 'accessibilityValue') {
      result[key] = mergeObjectsShallow(childValue, injectedValue);
      continue;
    }

    if (
      typeof injectedValue === 'function' &&
      (key.startsWith('on') || CRITICAL.has(key))
    ) {
      result[key] = mergeHandlers(
        injectedValue as (e: unknown) => void,
        typeof childValue === 'function'
          ? (childValue as (e: unknown) => void)
          : undefined,
      );
      continue;
    }

    if (key === 'style') {
      result[key] = childValue
        ? Array.isArray(childValue)
          ? [injectedValue, ...childValue]
          : [injectedValue, childValue]
        : injectedValue;
      continue;
    }

    result[key] = injectedValue;
  }

  return result as Simplify<MergedProps<Injected, Child>>;
}
