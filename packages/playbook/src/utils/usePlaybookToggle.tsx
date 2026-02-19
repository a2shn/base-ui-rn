import { useStyles } from '../styles';
import * as React from 'react';
import { Text, View } from 'react-native';
import { StatusCircleIcon, ClockIcon, ArrowRightIcon } from '../icons';

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
    const callbacks = {} as Record<keyof T, (next: T[keyof T]) => void>;

    for (const key in initialMap) {
      callbacks[key] = (nextValue: T[keyof T]) => {
        setStates((prev) => {
          const previousValue = prev[key];

          if (previousValue === nextValue) return prev;

          const time = new Date().toISOString().split('T')[1].slice(0, 8);

          setLogs((prevLogs) => ({
            ...prevLogs,
            [key]: {
              timestamp: time,
              from: previousValue,
              to: nextValue,
            },
          }));

          return { ...prev, [key]: nextValue };
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
        setValue: (v: T[K]) => void;
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
  if (Array.isArray(value)) return `[${value.length} items]`;
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
}: {
  title: string;
  state: { value: V; log: ActionLog<V> | null };
}) => {
  const styles = useStyles();
  const valueColor = getValueColor(state.value);
  const formattedValue = formatValue(state.value);

  return (
    <View style={styles.stateIndicator}>
      <Text style={styles.stateIndicatorLabel}>{title}:</Text>

      <Text style={[styles.stateIndicatorValue, { color: valueColor }]}>
        {formattedValue}
      </Text>

      <View
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      >
        <StatusCircleIcon size={8} color={valueColor} />
      </View>

      {state.log ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            marginLeft: 'auto',
          }}
        >
          <ClockIcon size={12} color='#8E8E93' />
          <Text style={styles.stateIndicatorChange}>{state.log.timestamp}</Text>
          <Text style={[styles.stateIndicatorChange, { marginHorizontal: 2 }]}>
            {formatValue(state.log.from)}
          </Text>
          <ArrowRightIcon size={12} color='#8E8E93' />
          <Text style={styles.stateIndicatorChange}>
            {formatValue(state.log.to)}
          </Text>
        </View>
      ) : (
        <Text
          style={[
            styles.stateIndicatorChange,
            { marginLeft: 'auto', fontStyle: 'italic' },
          ]}
        >
          No changes yet
        </Text>
      )}
    </View>
  );
};
