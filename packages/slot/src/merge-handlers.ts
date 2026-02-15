type Handler = (event: unknown) => void;

const handlerCache = new WeakMap<object, WeakMap<object, Handler>>();

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
