/**
 * Event handler function type.
 */
type Handler = (event: unknown) => void;

/**
 * Cache of merged handlers.
 *
 * Structure:
 * primitive handler
 *   → consumer handler
 *       → merged handler
 *
 * WeakMaps are used to avoid memory leaks when handlers are garbage-collected.
 */
const handlerCache = new WeakMap<object, WeakMap<object, Handler>>();

/**
 * Merges two event handlers into a single stable function.
 *
 * Execution order:
 * 1. The `primitive` handler is called first.
 * 2. If it does not call `event.preventDefault()`, the `consumer` handler runs.
 *
 * Behavior:
 * - If either handler is missing, the other is returned directly.
 * - Merged handlers are memoized so the same pair always produces
 *   the same function reference.
 * - WeakMaps are used to ensure cached handlers do not prevent
 *   garbage collection.
 *
 * This pattern is commonly used in component libraries where internal
 * behavior must run before user-provided handlers, while still allowing
 * consumers to opt out by preventing default behavior.
 */
export function mergeHandlers<E>(
  primitive?: (event: E) => void,
  consumer?: (event: E) => void,
) {
  if (!primitive) return consumer;
  if (!consumer) return primitive;

  let consumerCache = handlerCache.get(primitive);
  if (!consumerCache) {
    consumerCache = new WeakMap();
    handlerCache.set(primitive, consumerCache);
  }

  let merged = consumerCache.get(consumer);
  if (!merged) {
    merged = function mergedHandler(event: unknown) {
      const e = event as E & { defaultPrevented?: boolean };
      primitive(e);
      if (!e?.defaultPrevented) {
        consumer(e);
      }
    };
    consumerCache.set(consumer, merged);
  }

  return merged as unknown as (event: E) => void;
}
