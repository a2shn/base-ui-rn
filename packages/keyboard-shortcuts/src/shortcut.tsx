import * as React from 'react';
import { useKeyboardShortcut } from './use-keyboard-shortcut';
import type { ShortcutConfig, ShortcutMatchDetails } from './types';

export interface ShortcutProps extends ShortcutConfig {
  /**
   * Callback fired when the shortcut is matched.
   */
  onMatch: (details: ShortcutMatchDetails) => void;
}

/**
 * Declarative component for registering a keyboard shortcut.
 * Does not render anything to the DOM.
 */
export const Shortcut: React.FC<ShortcutProps> = ({ onMatch, ...config }) => {
  useKeyboardShortcut(config, onMatch);
  return null;
};
