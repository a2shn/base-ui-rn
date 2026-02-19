import * as React from 'react';
import {
  extractDebugTableData,
  inspectNativeProps,
} from './inspectNativeProps';
import { POLL_INTERVAL_MS, INTERACTION_CALLBACKS } from './constants';

export function useInspector(showAllProps: boolean) {
  const [showDebug, setShowDebug] = React.useState(false);
  const [debugData, setDebugData] = React.useState<Record<
    string,
    string
  > | null>(null);
  const [extractionMethod, setExtMethod] = React.useState<string>('...');

  const spyNodeRef = React.useRef<unknown>(null);

  const spyCallbackRef = React.useCallback((node: unknown) => {
    spyNodeRef.current = node;
  }, []);

  const showAllPropsRef = React.useRef(showAllProps);
  showAllPropsRef.current = showAllProps;

  const extractRef = React.useRef<() => void>(() => {});
  extractRef.current = () => {
    const node = spyNodeRef.current;
    if (!node) return;
    const { extractionMethod: method } = inspectNativeProps(node);
    const data = extractDebugTableData(node, showAllPropsRef.current);
    setExtMethod(method);
    setDebugData(data);
  };

  const stableExtract = React.useCallback(() => {
    extractRef.current();
  }, []);

  React.useEffect(() => {
    if (!showDebug) return;
    const initial = setTimeout(() => extractRef.current(), 0);
    const poll = setInterval(() => extractRef.current(), POLL_INTERVAL_MS);
    return () => {
      clearTimeout(initial);
      clearInterval(poll);
    };
  }, [showDebug]);

  function buildCallbackOverrides(
    targetProps: Record<string, unknown>,
  ): Record<string, (...args: unknown[]) => void> {
    const overrides: Record<string, (...args: unknown[]) => void> = {};
    if (!showDebug) return overrides;

    for (const cb of INTERACTION_CALLBACKS) {
      const original = targetProps[cb];
      overrides[cb] = (...args: unknown[]) => {
        if (typeof original === 'function') original(...args);
        setTimeout(() => extractRef.current(), 0);
      };
    }
    return overrides;
  }

  return {
    showDebug,
    setShowDebug,
    debugData,
    extractionMethod,
    spyCallbackRef,
    stableExtract,
    buildCallbackOverrides,
  };
}
