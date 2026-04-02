import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventHandler<E = any> = (event: E) => void;

/**
 * Extracts event type from a handler function
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HandlerMap = Record<string, EventHandler<any> | null | undefined>;

type ComposedHandlers<T extends HandlerMap> = {
  [K in keyof T]: T[K] extends (event: infer E) => void
  ? (event: E) => void
  : (event: unknown) => void;
};

/**
 * Composes external and internal event handlers into a single handler per event.
 *
 * External handlers are called first. Internal handlers are only called if
 * preventDefault() was not invoked on the event.
 *
 * @param externalHandlers - User-provided event handlers from props.
 * @param internalHandlers - Internal event handlers to compose with external ones.
 * @returns An object of composed event handlers.
 *
 * @example
 * ```tsx
 * const handlers = composeEventHandlers(props, {
 *   onKeyDown: handleKeyDown,
 * });
 *
 * return <View {...handlers} />;
 * ```
 */
export function composeEventHandlers<
  External extends HandlerMap,
  Internal extends Partial<External>,
>(
  externalHandlers: External,
  internalHandlers: Internal,
): ComposedHandlers<External> {
  const externalRef = React.useRef(externalHandlers);
  externalRef.current = externalHandlers;

  const internalRef = React.useRef(internalHandlers);
  internalRef.current = internalHandlers;

  return React.useMemo(() => {
    const composed = {} as ComposedHandlers<External>;

    const allKeys = Array.from(
      new Set([
        ...Object.keys(externalRef.current || {}),
        ...Object.keys(internalRef.current || {}),
      ])
    ) as Array<keyof External>;
    for (const key of allKeys) {
      const externalHandler = externalRef.current[key];
      const internalHandler = internalRef.current[key];

      composed[key] = ((event: unknown) => {
        if (typeof externalHandler === 'function') {
          externalHandler(event);
        }

        if (
          typeof internalHandler === 'function' &&
          !isDefaultPrevented(event)
        ) {
          internalHandler(event);
        }
      }) as ComposedHandlers<External>[typeof key];
    }

    return composed;
  }, []);
}

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
