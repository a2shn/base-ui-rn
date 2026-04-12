import { mergeProps, PressableWithKeyDown, resolveValue } from '@base-ui-rn/core';
import * as React from 'react';
import { Platform, StyleSheet, View, type NativeSyntheticEvent, type TargetedEvent, type ViewStyle } from 'react-native';

import { ScrollAreaContext } from './context';
import type { ScrollAreaRootProps } from './types';
import { useScrollArea } from './use-scroll-area';

export const Root = React.memo(
  React.forwardRef<View, ScrollAreaRootProps>((props, ref) => {
    const {
      children,
      disableDefaultFocusRing,
      focusableWhenDisabled,
      keyboardPageStep,
      keyboardStep,
      overflowEdgeThreshold,
      scrollbarVisibility,
      style,
      onBlur,
      onFocus,
      onKeyDown,
      tabIndex,
      ...otherProps
    } = props;

    const {
      contextValue,
      state,
      focusRingStyle,
      isFocusable,
      tabIndex: resolvedTabIndex,
      handleBlur,
      handleFocus,
      handleKeyDown,
      setIsHovering,
    } = useScrollArea(props);

    const isWeb = Platform.OS === 'web';
    const resolvedStyle = resolveValue(style, state);

    const mergedProps = mergeProps(
      {
        onBlur: handleBlur,
        onFocus: handleFocus,
        onKeyDown: handleKeyDown,
        onPointerEnter: () => setIsHovering(true),
        onPointerLeave: () => setIsHovering(false),
        style: resolvedStyle,
      },
      { ref },
      otherProps,
      { accessible: true, collapsable: false }
    );

    const flattened = (StyleSheet.flatten(resolvedStyle) || {}) as ViewStyle;
    const renderFocusOverlay = !isWeb && state.focused && focusRingStyle;

    return (
      <ScrollAreaContext.Provider value={contextValue}>
        <View {...mergedProps}
          onTouchStart={(e) => e.stopPropagation?.()}
          pointerEvents="box-none"
          focusable={isFocusable}
          tabIndex={resolvedTabIndex}>
          {resolveValue(children, state)}
          {renderFocusOverlay && (
            <View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFill,
                focusRingStyle,
                { borderRadius: flattened.borderRadius || 0, margin: -(flattened.borderWidth || 0) }
              ]}
            />
          )}
        </View>

      </ScrollAreaContext.Provider>
    );
  }),
);

Root.displayName = 'ScrollArea.Root';