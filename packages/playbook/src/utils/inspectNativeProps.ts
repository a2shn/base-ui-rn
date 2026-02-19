/**
 * inspectNativeProps.ts
 *
 * Extracts the deeply resolved native props from a React Native host component
 * ref at runtime, in DEV mode, across both the Old (Paper) and New (Fabric)
 * architectures.
 *
 * Strategy:
 *   1. Find the React Fiber attached to the native node — the attachment key
 *      differs between Paper and Fabric, so we scan for it.
 *   2. Walk the fiber tree to find the *host* fiber (the one whose stateNode
 *      IS the native instance), because that fiber's `memoizedProps` are the
 *      fully-resolved props that actually reach the native layer.
 *   3. Optionally walk UP the fiber tree to also expose the nearest composite
 *      (JS-land) parent's memoizedProps, which gives you the "intent" props
 *      your Toggle.Root received from outside.
 *
 * Architecture notes:
 *   Paper  — host instances are ReactNativeComponent JS objects. The fiber is
 *            stored under a key matching /^__reactFiber\$/.
 *   Fabric — host instances are ReadonlyReactNativeElement (C++ backed). On
 *            RN 0.73+ the fiber key still exists on the JS shadow-wrapper but
 *            it can be absent on internal release builds. We fall back to
 *            __internalInstanceHandle (the Fabric-specific path) and then to
 *            _reactInternals (classic class-component path).
 */

// ─── Types ───────────────────────────────────────────────────────────────────

/** The subset of a React Fiber we actually access. */
interface Fiber {
  memoizedProps: Record<string, unknown> | null;
  type: unknown; // string ('View', 'Pressable') | function | class
  tag: number; // HostComponent = 5, HostText = 6, etc.
  stateNode: unknown;
  return: Fiber | null; // parent
  child: Fiber | null;
  sibling: Fiber | null;
  pendingProps: Record<string, unknown> | null;
  memoizedState: unknown;
}

/** React fiber WorkTag constants (stable across React 17-19). */
const WorkTag = {
  FunctionComponent: 0,
  ClassComponent: 1,
  HostRoot: 3,
  HostComponent: 5, // ← Native <View>, <Pressable> etc. land here
  HostText: 6,
} as const;

export interface InspectedProps {
  /** Props as resolved at the native host fiber — what actually hits the layer. */
  hostProps: Record<string, unknown>;
  /** Props on the nearest non-host ancestor fiber (your headless component's output). */
  compositeProps: Record<string, unknown> | null;
  /** Human-readable component name at host level. */
  hostComponentType: string;
  /** Which technique successfully found the fiber. */
  extractionMethod:
    | 'reactFiberKey'
    | 'internalInstanceHandle'
    | 'reactInternals'
    | 'unknown';
  /** Warnings collected during extraction. */
  warnings: string[];
}

// ─── Fiber Discovery ─────────────────────────────────────────────────────────

/**
 * Scans own-keys of a native ref for the fiber attachment.
 *
 * Paper attaches under  __reactFiber$<random>
 * Fabric sometimes uses __reactFiber$<random> on the JS wrapper too,
 * but also exposes __internalInstanceHandle as a more stable path.
 */
function getFiberFromRef(ref: unknown): {
  fiber: Fiber | null;
  method: InspectedProps['extractionMethod'];
} {
  if (ref == null || typeof ref !== 'object') {
    return { fiber: null, method: 'unknown' };
  }

  const node = ref as Record<string, unknown>;

  // ── Path 1: Scan for __reactFiber$... (Paper + Fabric JS-wrapper) ──────────
  // We scan rather than hard-code the suffix because React randomises it at
  // build time to prevent accidental reliance on internals.
  try {
    const keys = Object.keys(node);
    const fiberKey = keys.find((k) => k.startsWith('__reactFiber$'));
    if (fiberKey && node[fiberKey] != null) {
      return { fiber: node[fiberKey] as Fiber, method: 'reactFiberKey' };
    }
  } catch {
    // Object.keys can throw on host objects in Hermes strict mode sometimes.
  }

  // ── Path 2: __internalInstanceHandle (Fabric-specific public seam) ─────────
  // React Native's Fabric renderer sets this on the C++ element's JS wrapper.
  // It points directly to the fiber.
  if (
    '__internalInstanceHandle' in node &&
    node.__internalInstanceHandle != null
  ) {
    return {
      fiber: node.__internalInstanceHandle as Fiber,
      method: 'internalInstanceHandle',
    };
  }

  // ── Path 3: _reactInternals (class component instances, legacy) ────────────
  if ('_reactInternals' in node && node._reactInternals != null) {
    return { fiber: node._reactInternals as Fiber, method: 'reactInternals' };
  }

  // ── Path 4: _internalFiberInstanceHandleDEV (RN DEV builds, Paper only) ───
  if (
    '_internalFiberInstanceHandleDEV' in node &&
    node._internalFiberInstanceHandleDEV != null
  ) {
    return {
      fiber: node._internalFiberInstanceHandleDEV as Fiber,
      method: 'reactFiberKey',
    };
  }

  return { fiber: null, method: 'unknown' };
}

// ─── Fiber Tree Walking ───────────────────────────────────────────────────────

/**
 * Starting from any fiber, walk DOWN (child-first) then across siblings
 * to find the nearest HostComponent fiber.
 *
 * Why walk down? When your ref lands on Toggle.Root (a composite), the fiber
 * the ref is attached to is the composite fiber. Its `child` is the host fiber.
 */
function findHostFiber(fiber: Fiber): Fiber | null {
  if (fiber.tag === WorkTag.HostComponent) return fiber;

  // DFS: child first
  if (fiber.child) {
    const found = findHostFiber(fiber.child);
    if (found) return found;
  }

  // Then siblings (when we're already inside a subtree search)
  if (fiber.sibling) {
    const found = findHostFiber(fiber.sibling);
    if (found) return found;
  }

  return null;
}

/**
 * Walk UP the fiber's return chain to find the nearest composite (non-host,
 * non-root) ancestor — that's your Toggle.Root or equivalent headless component.
 */
function findNearestCompositeFiber(fiber: Fiber): Fiber | null {
  let current: Fiber | null = fiber.return;
  while (current != null) {
    if (
      current.tag === WorkTag.FunctionComponent ||
      current.tag === WorkTag.ClassComponent
    ) {
      return current;
    }
    // Stop at root
    if (current.tag === WorkTag.HostRoot) break;
    current = current.return;
  }
  return null;
}

// ─── Props Filtering ─────────────────────────────────────────────────────────

/**
 * A11y and gesture props you specifically care about for headless UI testing.
 * Everything else is included too — this set is just highlighted in the
 * returned object so Maestro tests can assert on them directly.
 */
const HEADLESS_UI_PROP_KEYS = new Set([
  'accessibilityRole',
  'accessibilityState',
  'accessibilityLabel',
  'accessibilityHint',
  'accessibilityValue',
  'accessibilityActions',
  'accessibilityLiveRegion',
  'importantForAccessibility',
  'accessible',
  'onPress',
  'onLongPress',
  'onPressIn',
  'onPressOut',
  'disabled',
  'testID',
  'nativeID',
  // Gesture Handler injected props (RNGH v2)
  'onGestureHandlerEvent',
  'onGestureHandlerStateChange',
  // Reanimated worklet props
  'animatedProps',
]);

/**
 * Serialises a prop value into something JSON-safe and displayable.
 * Handles functions, Reanimated shared values, circular refs.
 */
export function serialisePropValue(val: unknown): string {
  if (val === undefined) return 'undefined';
  if (val === null) return 'null';
  if (typeof val === 'function') {
    const name = (val as { name?: string }).name;
    return name ? `ƒ ${name}()` : 'ƒ ()';
  }
  if (typeof val === 'boolean') return String(val);
  if (typeof val === 'number') return String(val);
  if (typeof val === 'string') return `"${val}"`;
  if (typeof val === 'object') {
    // Reanimated SharedValue
    if ('_isReanimatedSharedValue' in (val as object)) {
      return `SharedValue(${String((val as { value?: unknown }).value)})`;
    }
    try {
      return JSON.stringify(val, null, 0);
    } catch {
      return '[Circular/Complex Object]';
    }
  }
  return String(val);
}

// ─── Main Export ─────────────────────────────────────────────────────────────

/**
 * The primary extraction function.
 *
 * @param ref  The value stored in your `spyRef.current` — whatever React
 *             placed there after mounting the host component.
 *
 * Usage in your Section/Playbook:
 *
 *   const spyRef = React.useRef<unknown>(null);
 *   const injected = React.cloneElement(target, { ref: spyRef });
 *   // After mount:
 *   const result = inspectNativeProps(spyRef.current);
 */
export function inspectNativeProps(ref: unknown): InspectedProps {
  const warnings: string[] = [];

  // ── Step 1: Find the fiber ─────────────────────────────────────────────────
  const { fiber: attachedFiber, method } = getFiberFromRef(ref);

  if (!attachedFiber) {
    warnings.push(
      'Could not locate fiber on ref. ' +
        'Ensure you are running in DEV mode and the component has mounted. ' +
        'On Fabric release builds, fiber internals are stripped.',
    );
    return {
      hostProps: {},
      compositeProps: null,
      hostComponentType: 'unknown',
      extractionMethod: 'unknown',
      warnings,
    };
  }

  // ── Step 2: Navigate to the HostComponent fiber ────────────────────────────
  //
  // The fiber we found might itself BE the host fiber (if the ref was forwarded
  // all the way to the native <Pressable>/<View>), OR it might be the composite
  // fiber for Toggle.Root. We handle both.

  let hostFiber: Fiber | null = null;

  if (attachedFiber.tag === WorkTag.HostComponent) {
    // Ref landed directly on the host — ideal case.
    hostFiber = attachedFiber;
  } else {
    // Ref landed on a composite. Walk down to find the host.
    hostFiber = findHostFiber(attachedFiber);
    if (!hostFiber) {
      warnings.push(
        'Fiber found but no HostComponent child located. ' +
          'The component tree may be async/lazy or the ref is on a non-rendering wrapper.',
      );
    }
  }

  const hostProps = (hostFiber?.memoizedProps ?? {}) as Record<string, unknown>;
  const hostComponentType =
    typeof hostFiber?.type === 'string'
      ? hostFiber.type
      : ((hostFiber?.type as { displayName?: string; name?: string })
          ?.displayName ??
        (hostFiber?.type as { name?: string })?.name ??
        'Unknown');

  // ── Step 3: Walk UP to find the nearest composite (Toggle.Root) props ──────
  const baseFiber = hostFiber ?? attachedFiber;
  const compositeFiber = findNearestCompositeFiber(baseFiber);
  const compositeProps = compositeFiber
    ? ((compositeFiber.memoizedProps ?? null) as Record<string, unknown> | null)
    : null;

  // ── Step 4: Warn about known Fabric limitations ────────────────────────────
  if (method === 'internalInstanceHandle') {
    warnings.push(
      'Running on Fabric. `__internalInstanceHandle` is a semi-public seam ' +
        'but not officially supported. Props are accurate in DEV builds.',
    );
  }

  if (Object.keys(hostProps).length === 0 && hostFiber != null) {
    warnings.push(
      'Host fiber found but memoizedProps is empty. ' +
        'This can happen in Fabric release builds where props are held in C++. ' +
        'Consider using `pendingProps` as a fallback.',
    );
    // Fallback: pendingProps is set during render and sometimes survives longer
    const fallback = hostFiber.pendingProps;
    if (fallback && Object.keys(fallback).length > 0) {
      return {
        hostProps: fallback,
        compositeProps,
        hostComponentType,
        extractionMethod: method,
        warnings: [...warnings, 'Used pendingProps as fallback.'],
      };
    }
  }

  return {
    hostProps,
    compositeProps,
    hostComponentType,
    extractionMethod: method,
    warnings,
  };
}

/**
 * Convenience: returns ONLY the accessibility + gesture props, pre-serialised,
 * ready to drop straight into your DebugTable's `data` prop.
 *
 * @param ref spyRef.current
 * @param includeAll set true to include every host prop, not just the headless-UI set
 */
export function extractDebugTableData(
  ref: unknown,
  includeAll = false,
): Record<string, string> {
  const { hostProps, warnings } = inspectNativeProps(ref);
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(hostProps)) {
    if (includeAll || HEADLESS_UI_PROP_KEYS.has(key)) {
      result[key] = serialisePropValue(value);
    }
  }

  if (warnings.length > 0) {
    result['⚠ inspector_warnings'] = warnings.join(' | ');
  }

  return result;
}
