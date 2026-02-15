type Handler = (event: any) => void;

/**
 * Weakly cached merged handlers keyed by primitive and consumer handlers.
 */
const handlerCache = new WeakMap<object, WeakMap<object, Handler>>();

/**
 * Returns a stable event handler that invokes both the consumer and primitive handlers.
 *
 * If either handler is undefined, the other is returned directly to preserve
 * referential stability.
 *
 * When both handlers are present, the returned function is cached so the same
 * `(primitive, consumer)` pair always yields the same reference.
 *
 * The consumer handler is invoked before the primitive handler.
 *
 * @typeParam E - Event type
 * @param primitive - Internal primitive handler
 * @param consumer - External consumer handler
 * @returns A stable merged handler or one of the inputs
 */
export function mergeHandlers<E>(
  primitive?: (event: E) => void,
  consumer?: (event: E) => void,
): ((event: E) => void) | undefined {
  if (!primitive) return consumer;
  if (!consumer) return primitive;

  let consumerCache = handlerCache.get(primitive);
  if (!consumerCache) {
    consumerCache = new WeakMap();
    handlerCache.set(primitive, consumerCache);
  }

  let merged = consumerCache.get(consumer);
  if (!merged) {
    merged = function mergedHandler(event: E) {
      consumer(event);
      primitive(event);
    };
    consumerCache.set(consumer, merged);
  }

  return merged as (event: E) => void;
}
