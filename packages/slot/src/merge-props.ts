import { mergeHandlers } from './merge-handlers';

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

type Simplify<T> = { [K in keyof T]: T[K] } & {};
type MergedProps<Injected, Child> = Omit<Child, keyof Injected> & Injected;

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
