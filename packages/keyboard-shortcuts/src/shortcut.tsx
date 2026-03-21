import * as React from 'react';

import type { ShortcutConfig, ShortcutMatchDetails } from './types';
import { useKeyboardShortcut } from './use-keyboard-shortcut';

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
