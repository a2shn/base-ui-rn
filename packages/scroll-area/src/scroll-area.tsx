import { mergeProps, resolveValue } from '@base-ui-rn/core';
import * as React from 'react';
import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';

import { ScrollAreaContext } from './context';
import type { ScrollAreaRootProps } from './types';
import { useScrollArea } from './use-scroll-area';

/**
 * The main container for the scroll area component.
 *
 * Manages focus, pointer interactions, and renders focus overlays.
 * Provides context to Viewport and Scrollbar sub-components.
 *
 * @example
 * ```tsx
 * <ScrollArea.Root>
 * <ScrollArea.Viewport>...</ScrollArea.Viewport>
 * </ScrollArea.Root>
 * ```
 */
export const Root = React.memo(
  React.forwardRef<View, ScrollAreaRootProps>((props, ref) => {
    const {
      children,
      style,
      ...otherProps
    } = props;

    const {
      contextValue,
      focusRingStyle,
      handleBlur,
      handleFocus,
      setIsHovering,
      state,
    } = useScrollArea(props);

    const isWeb = Platform.OS === 'web';
    const resolvedStyle = resolveValue(style, state);

    const mergedProps = mergeProps(
      {
        // Root captures bubbled focus/blur from the Viewport inside.
        // This drives state.focused so the native overlay renders correctly.
        onBlur: handleBlur,
        onFocus: handleFocus,
        onPointerEnter: () => setIsHovering(true),
        onPointerLeave: () => setIsHovering(false),
        style: resolvedStyle,
      },
      { ref },
      otherProps,
      // Root is not a tab stop — Viewport owns tabIndex/focusable
      { accessible: false, collapsable: false },
    );

    const flattened = (StyleSheet.flatten(resolvedStyle) || {}) as ViewStyle;
    // Overlay is shown when Viewport reports focus (state.focused is set via context onFocus/onBlur)
    const renderFocusOverlay = !isWeb && state.focused && focusRingStyle;


    return (
      <ScrollAreaContext.Provider value={contextValue}>
        <View
          {...mergedProps}
          pointerEvents='box-none'
        >
          {resolveValue(children, state)}
          {renderFocusOverlay && (
            <View
              pointerEvents='none'
              style={[
                StyleSheet.absoluteFill,
                focusRingStyle,
                {
                  borderRadius: flattened.borderRadius || 0,
                  margin: -(flattened.borderWidth || 0),
                },
              ]}
            />
          )}
        </View>
      </ScrollAreaContext.Provider>
    );
  }),
);

Root.displayName = 'ScrollArea.Root';