import * as React from 'react';
import { Platform } from 'react-native';
import type { RegisteredShortcut } from './types';
import { isShortcutMatch } from './utils';

interface ShortcutContextValue {
  registerShortcut: (shortcut: RegisteredShortcut) => () => void;
}

const ShortcutContext = React.createContext<ShortcutContextValue | null>(null);

export const ShortcutProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const shortcutsRef = React.useRef<Map<string, RegisteredShortcut>>(new Map());

  const registerShortcut = React.useCallback((shortcut: RegisteredShortcut) => {
    shortcutsRef.current.set(shortcut.id, shortcut);
    return () => {
      shortcutsRef.current.delete(shortcut.id);
    };
  }, []);

  const handleGlobalKeyDown = React.useCallback((event: KeyboardEvent) => {
    // Find matching shortcuts. We go from newest to oldest.
    const reversedShortcuts = Array.from(
      shortcutsRef.current.values(),
    ).reverse();

    for (const shortcut of reversedShortcuts) {
      if (isShortcutMatch(event, shortcut)) {
        if (shortcut.preventDefault !== false) {
          event.preventDefault();
        }

        shortcut.onMatch({ nativeEvent: event });
        // Stop after first match to prevent multiple actions for the same key
        break;
      }
    }
  }, []);

  React.useEffect(() => {
    if (Platform.OS === 'web') {
      window.addEventListener('keydown', handleGlobalKeyDown);
      return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }
    return undefined;
  }, [handleGlobalKeyDown]);

  const value = React.useMemo(
    () => ({
      registerShortcut,
    }),
    [registerShortcut],
  );

  return (
    <ShortcutContext.Provider value={value}>
      {children}
    </ShortcutContext.Provider>
  );
};

export function useShortcutRegistry() {
  return React.useContext(ShortcutContext);
}
