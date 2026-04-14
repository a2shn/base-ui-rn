/**
 * Composes external and internal event handlers into a single function.
 *
 * The external handler is called first. If it calls `event.preventDefault()`,
 * the internal handler is skipped. This respects standard event delegation behavior
 * while maintaining compatibility with React Native via graceful degradation.
 *
 * @param external - User-provided event handler.
 * @param internal - Internal event handler (library/component implementation).
 * @returns A composed function that calls both handlers respecting preventDefault,
 *   or a single handler if only one is provided, or undefined if neither exists.
 */
export function composeEventHandler(
  external: ((...args: unknown[]) => void) | undefined,
  internal: ((...args: unknown[]) => void) | undefined,
): ((...args: unknown[]) => void) | undefined {
  if (typeof external !== 'function' && typeof internal !== 'function') {
    return undefined;
  }

  if (typeof external !== 'function') return internal;
  if (typeof internal !== 'function') return external;

  return function composedHandler(...args: unknown[]) {
    external(...args);

    // Check if default was prevented on the first argument (the event object).
    // Works for React SyntheticEvents, DOM Events, and React Native (returns false
    // if preventDefault detection isn't applicable, ensuring internal handler runs).
    if (!isDefaultPrevented(args[0])) {
      internal(...args);
    }
  };
}

/**
 * Detects if `event.preventDefault()` was called.
 *
 * Handles multiple event systems:
 * - React SyntheticEvent (isDefaultPrevented() method)
 * - DOM Events (defaultPrevented property)
 * - React Native (gracefully returns false; most RN events don't use preventDefault)
 */
export function isDefaultPrevented(event: unknown): boolean {
  if (!event || typeof event !== 'object') return false;

  const e = event as {
    defaultPrevented?: boolean;
    isDefaultPrevented?: () => boolean;
  };

  if (typeof e.isDefaultPrevented === 'function') {
    return e.isDefaultPrevented();
  }

  return Boolean(e.defaultPrevented);
}
