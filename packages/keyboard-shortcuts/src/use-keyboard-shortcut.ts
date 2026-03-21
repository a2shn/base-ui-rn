import * as React from 'react';

import { useShortcutRegistry } from './keyboard-shortcuts-context';
import type { ShortcutConfig, ShortcutMatchDetails } from './types';

/**
 * Hook to register a keyboard shortcut.
 *
 * @param config The shortcut configuration.
 * @param onMatch Callback fired when the shortcut is matched.
 */
export function useKeyboardShortcut(
  config: ShortcutConfig | undefined,
  onMatch: (details: ShortcutMatchDetails) => void,
) {
  const registry = useShortcutRegistry();
  const registerShortcut = registry?.registerShortcut;
  const id = React.useId();

  const onMatchRef = React.useRef(onMatch);
  onMatchRef.current = onMatch;

  React.useEffect(() => {
    if (!config || !registerShortcut) return;

    const cleanup = registerShortcut({
      id,
      ...config,
      onMatch: (details) => onMatchRef.current(details),
    });

    return cleanup;
  }, [id, config, registerShortcut]);
}
