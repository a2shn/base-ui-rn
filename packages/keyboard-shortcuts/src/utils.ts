import { Platform, type NativeSyntheticEvent } from 'react-native';
import type { KeyPressEventData } from '@base-ui-rn/core';
import type { ShortcutConfig, ModifierKey } from './types';

/**
 * Checks if the current environment's modifier state matches the required modifiers.
 */
export function isModifierMatch(
  event: NativeSyntheticEvent<KeyPressEventData> | KeyboardEvent,
  requiredModifiers: ModifierKey[] = [],
): boolean {
  if (Platform.OS !== 'web') {
    // React Native's standard onKeyPress (iOS/Android) does not reliably provide modifier flags.
    // If a shortcut requires modifiers, it cannot be reliably matched without a custom native module.
    return requiredModifiers.length === 0;
  }

  const keyboardEvent = event as KeyboardEvent;

  const ctrl = keyboardEvent.ctrlKey || false;
  const alt = keyboardEvent.altKey || false;
  const shift = keyboardEvent.shiftKey || false;
  const meta = keyboardEvent.metaKey || false;

  const hasCtrl = requiredModifiers.includes('ctrl');
  const hasMeta = requiredModifiers.includes('meta');
  const hasAlt = requiredModifiers.includes('alt');
  const hasShift = requiredModifiers.includes('shift');

  return (
    ctrl === hasCtrl && meta === hasMeta && alt === hasAlt && shift === hasShift
  );
}

/**
 * Checks if a shortcut matches the given event.
 */
export function isShortcutMatch(
  event: NativeSyntheticEvent<KeyPressEventData> | KeyboardEvent,
  config: ShortcutConfig,
): boolean {
  if (config.disabled) return false;

  const nativeEvent = (event as NativeSyntheticEvent<KeyPressEventData>)
    .nativeEvent;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const key = (nativeEvent?.key || (event as any).key || '').toLowerCase();

  if (!key) return false;

  const matchesKey = config.keys.some((k) => k.toLowerCase() === key);
  if (!matchesKey) return false;

  return isModifierMatch(event, config.modifiers);
}

/**
 * Converts a shortcut config into a W3C-standard aria-keyshortcuts string.
 *
 * Examples:
 * - { keys: ['k'], modifiers: ['ctrl'] } -> "Control+k"
 * - { keys: ['k'], modifiers: ['meta', 'shift'] } -> "Meta+Shift+k"
 * - { keys: ['k', 'l'], modifiers: ['alt'] } -> "Alt+k Alt+l"
 *
 * Note: Key names like 'Enter', 'Escape', 'ArrowLeft' are used directly.
 */
export function getAriaKeyshortcuts(config?: ShortcutConfig): string | undefined {
  if (!config || !config.keys.length) return undefined;

  const modifierMap: Record<ModifierKey, string> = {
    ctrl: 'Control',
    alt: 'Alt',
    shift: 'Shift',
    meta: 'Meta',
  };

  const mods = (config.modifiers || [])
    .map((m) => modifierMap[m])
    .join('+');

  return config.keys
    .map((key) => {
      return mods ? `${mods}+${key}` : key;
    })
    .join(' ');
}
