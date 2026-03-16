import { useStyles } from '../styles';
import * as React from 'react';
import { Text, View } from 'react-native';

export type ActionLog<V> = {
  timestamp: string;
  from: V;
  to: V;
};

/**
 * Manages multiple state values with deep action logging.
 * Fully generic - accepts booleans, strings, numbers, objects, or any other type.
 *
 * @param initialMap
 * Map of keys to their initial values of any type.
 *
 * @example
 * ```ts
 * const { darkMode, terms } = usePlaybookToggles({
 *   darkMode: true,
 *   terms: false,
 * });
 *
 * const { theme, language } = usePlaybookToggles({
 *   theme: 'light',
 *   language: 'en',
 * });
 *
 * const { count, progress } = usePlaybookToggles({
 *   count: 0,
 *   progress: 50,
 * });
 *
 * <Toggle.Root
 *   checked={darkMode.value}
 *   onCheckedChange={darkMode.setValue}
 *   testID="toggle-dark-mode"
 * />
 * <LiveConsole title="darkMode" state={darkMode} />
 * ```
 */
export function usePlaybookToggles<T extends Record<string, unknown>>(
  initialMap: T,
) {
  const [states, setStates] = React.useState<T>(initialMap);

  const [logs, setLogs] = React.useState<
    Record<keyof T, ActionLog<T[keyof T]> | null>
  >(() => {
    const initLogs = {} as Record<keyof T, ActionLog<T[keyof T]> | null>;
    for (const key in initialMap) initLogs[key] = null;
    return initLogs;
  });

  const setters = React.useMemo(() => {
    const callbacks = {} as Record<
      keyof T,
      (next: T[keyof T] | ((prev: T[keyof T]) => T[keyof T])) => void
    >;

    for (const key in initialMap) {
      callbacks[key] = (nextValue) => {
        setStates((prev) => {
          const previousValue = prev[key];
          const resolvedNextValue =
            typeof nextValue === 'function'
              ? (nextValue as (prev: T[keyof T]) => T[keyof T])(previousValue)
              : nextValue;

          if (previousValue === resolvedNextValue) return prev;

          const time = new Date().toISOString().split('T')[1].slice(0, 8);

          setLogs((prevLogs) => ({
            ...prevLogs,
            [key]: {
              timestamp: time,
              from: previousValue,
              to: resolvedNextValue,
            },
          }));

          return { ...prev, [key]: resolvedNextValue };
        });
      };
    }

    return callbacks;
  }, []);

  return React.useMemo(() => {
    const result = {} as Record<string, unknown>;

    for (const key in states) {
      result[key] = {
        value: states[key],
        log: logs[key],
        setValue: setters[key],
      };
    }

    return result as {
      [K in keyof T]: {
        value: T[K];
        log: ActionLog<T[K]> | null;
        setValue: (v: T[K] | ((prev: T[K]) => T[K])) => void;
      };
    };
  }, [states, logs, setters]);
}

/**
 * Helper function to format values for display in LiveConsole.
 * Handles various types: primitives, objects, arrays, etc.
 */
function formatValue(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'boolean') return String(value);
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') return `"${value}"`;
  if (Array.isArray(value)) {
    if (
      value.length <= 5 &&
      value.every((i) => typeof i === 'string' || typeof i === 'number')
    ) {
      return `[${value.map((i) => (typeof i === 'string' ? `"${i}"` : i)).join(', ')}]`;
    }
    return `[${value.length} items]`;
  }
  if (typeof value === 'object') return `{${Object.keys(value).length} keys}`;
  return String(value);
}

/**
 * Helper function to determine color based on value type and content.
 */
function getValueColor(value: unknown): string {
  if (typeof value === 'boolean') {
    return value ? '#34C759' : '#FF9500';
  }
  if (typeof value === 'number') {
    return value > 0 ? '#34C759' : value < 0 ? '#FF3B30' : '#8E8E93';
  }
  if (typeof value === 'string') {
    return '#007AFF';
  }
  if (value === null || value === undefined) {
    return '#8E8E93';
  }
  // Objects, arrays, etc.
  return '#5856D6';
}

/**
 * A compact, subtle state indicator showing the current value and last change.
 * Works with any value type: booleans, strings, numbers, objects, arrays, etc.
 *
 * @param title The name of the state (e.g., 'darkMode', 'theme', 'count')
 * @param state The state object returned from usePlaybookToggles
 *
 * @example
 * ```tsx
 * <LiveConsole title="darkMode" state={darkMode} />
 * <LiveConsole title="theme" state={theme} />
 * <LiveConsole title="count" state={count} />
 * ```
 */
export const LiveConsole = <V,>({
  title,
  state,
  testID,
}: {
  title: string;
  state: { value: V; log: ActionLog<V> | null };
  testID?: string;
}) => {
  const styles = useStyles();
  const valueColor = getValueColor(state.value);
  const formattedValue = formatValue(state.value);

  return (
    <View style={styles.stateIndicator} testID={testID}>
      <Text style={styles.stateIndicatorLabel}>{title}:</Text>

      <Text
        style={[styles.stateIndicatorValue, { color: valueColor }]}
        testID={testID ? `${testID}-value` : undefined}
        numberOfLines={1}
        ellipsizeMode='tail'
      >
        {formattedValue}
      </Text>
    </View>
  );
};
