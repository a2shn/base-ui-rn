import type { KeyPressEventData } from '@base-ui-rn/core';
import type { NativeSyntheticEvent } from 'react-native';

/**
 * Supported modifier keys.
 */
export type ModifierKey = 'ctrl' | 'alt' | 'shift' | 'meta';

/**
 * Configuration for a keyboard shortcut.
 */
export interface ShortcutConfig {
  /**
   * The keys that trigger the shortcut (e.g., ['s'], ['Enter'], ['Backspace']).
   * Case-insensitive. Multiple keys can be provided as alternatives.
   */
  keys: string[];
  /**
   * Required modifier keys.
   * @default []
   */
  modifiers?: ModifierKey[];
  /**
   * Whether to call `preventDefault()` on the event if it matches.
   * Only applicable on Web and certain Native environments.
   * @default true
   */
  preventDefault?: boolean;
  /**
   * Human-readable description of the shortcut.
   * Useful for generating help dialogs.
   */
  description?: string;
  /**
   * Optional category for grouping shortcuts in help dialogs.
   */
  category?: string;
  /**
   * Whether the shortcut is disabled.
   * @default false
   */
  disabled?: boolean;
}

/**
 * Details passed to the shortcut match callback.
 */
export interface ShortcutMatchDetails {
  /**
   * The underlying keyboard event.
   */
  nativeEvent: NativeSyntheticEvent<KeyPressEventData> | KeyboardEvent;
}

/**
 * Internal registry entry for a shortcut.
 */
export interface RegisteredShortcut extends ShortcutConfig {
  id: string;
  onMatch: (details: ShortcutMatchDetails) => void;
}
