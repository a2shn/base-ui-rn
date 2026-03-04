import * as React from 'react';

/**
 * A hook that manages focus state and focus-visible logic.
 *
 * @param options
 * Options for the focus hook.
 *
 * @returns An object containing the current focus state and focus event handlers.
 */
export function useFocus(options: { focusVisible?: boolean } = {}) {
  const { focusVisible: forceFocusVisible = false } = options;
  const [focused, setFocused] = React.useState(false);
  const [isFocusVisible, setFocusVisible] = React.useState(forceFocusVisible);

  const onFocus = React.useCallback(() => {
    setFocused(true);
    // Heuristic: default to true for now. Can be enhanced with global interaction tracking.
    setFocusVisible(true);
  }, []);

  const onBlur = React.useCallback(() => {
    setFocused(false);
    setFocusVisible(false);
  }, []);

  return React.useMemo(
    () => ({
      focused,
      focusVisible: isFocusVisible || forceFocusVisible,
      onFocus,
      onBlur,
    }),
    [focused, isFocusVisible, forceFocusVisible, onFocus, onBlur],
  );
}
