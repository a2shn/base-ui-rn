import {
  AccessibilityActionInfo,
  AccessibilityState,
} from 'react-native';

export function mergeAccessibilityActions(
  internalActions?: readonly AccessibilityActionInfo[],
  externalActions?: readonly AccessibilityActionInfo[],
): AccessibilityActionInfo[] {
  if (!internalActions) return externalActions ? [...externalActions] : [];
  if (!externalActions) return [...internalActions];

  const externalNames = new Set(externalActions.map((a) => a.name));
  const filteredInternal = internalActions.filter(
    (a) => !externalNames.has(a.name),
  );

  return [...filteredInternal, ...externalActions];
}

export function mergeAccessibilityState(
  internalState?: AccessibilityState,
  externalState?: AccessibilityState,
) {
  return { ...internalState, ...externalState };
}


