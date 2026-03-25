import { evaluateStyles } from '@base-ui-rn/core';
import * as React from 'react';
import {
  type NativeSyntheticEvent,
  Platform,
  StyleSheet,
  type TargetedEvent,
  View,
  type ViewStyle,
} from 'react-native';

import { ScrollAreaContext } from './context';
import type { ScrollAreaRootProps } from './types';
import { useScrollArea } from './use-scroll-area';

/**
 * Groups all parts of the scroll area.
 *
 * It manages the scroll state, content measurements, and visibility of scrollbars.
 *
 * @example
 * ```tsx
 * <ScrollArea.Root>
 *   <ScrollArea.Viewport>
 *     <ScrollArea.Content />
 *   </ScrollArea.Viewport>
 * </ScrollArea.Root>
 * ```
 */
export const Root = React.memo(
  React.forwardRef<View, ScrollAreaRootProps>((props, ref) => {
    const {
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-hidden': ariaHidden,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children,
      disableDefaultFocusRing,
      focusRingStyle,
      focusVisible: forceFocusVisible,
      onBlur,
      onFocus,
      onKeyDown,
      overflowEdgeThreshold,
      scrollbarVisibility,
      style,
      ...other
    } = props;

    const scrollArea = useScrollArea({
      focusVisible: forceFocusVisible,
      overflowEdgeThreshold,
      scrollbarVisibility,
    });

    const {
      onBlur: handleBlur,
      onFocus: handleFocus,
      rawScrollX,
      rawScrollY,
      state,
      viewportHeight,
      viewportWidth,
      contentWidth,
      contentHeight,
      viewportRef,
    } = scrollArea;

    const isWeb = Platform.OS === 'web';

    // The Root is responsible for rendering the focus ring visuals on all platforms.
    // On web, Root is also the focus target.
    // On native, the Viewport is the focus target but tells the Root to show the ring via context.
    // We use an absolute overlay on native to prevent layout-driven focus "jumps".
    const resolvedStyle = evaluateStyles(
      style,
      state,
      isWeb
        ? {
            disableDefaultFocusRing,
            focusRingStyle,
          }
        : { disableDefaultFocusRing: true },
    );

    const handleWebKeyDown = (e: React.KeyboardEvent) => {
      if (!viewportRef.current) return;

      const step = 40;

      switch (e.key) {
        case 'ArrowUp':
          // Scroll Y, or fallback to X if only horizontal overflow exists
          if (!state.hasOverflowY && state.hasOverflowX) {
            viewportRef.current.scrollTo({ animated: false, x: rawScrollX.current - step });
          } else {
            viewportRef.current.scrollTo({ animated: false, y: rawScrollY.current - step });
          }
          break;
        case 'ArrowDown':
          if (!state.hasOverflowY && state.hasOverflowX) {
            viewportRef.current.scrollTo({ animated: false, x: rawScrollX.current + step });
          } else {
            viewportRef.current.scrollTo({ animated: false, y: rawScrollY.current + step });
          }
          break;
        case 'ArrowLeft':
          // Scroll X, or fallback to Y if only vertical overflow exists
          if (!state.hasOverflowX && state.hasOverflowY) {
            viewportRef.current.scrollTo({ animated: false, y: rawScrollY.current - step });
          } else {
            viewportRef.current.scrollTo({ animated: false, x: rawScrollX.current - step });
          }
          break;
        case 'ArrowRight':
          if (!state.hasOverflowX && state.hasOverflowY) {
            viewportRef.current.scrollTo({ animated: false, y: rawScrollY.current + step });
          } else {
            viewportRef.current.scrollTo({ animated: false, x: rawScrollX.current + step });
          }
          break;
        case 'PageUp': {
          const stepX = (viewportWidth || 0) * 0.9;
          const stepY = (viewportHeight || 200) * 0.9;
          viewportRef.current.scrollTo({
            animated: false,
            x: state.hasOverflowX ? rawScrollX.current - stepX : undefined,
            y: state.hasOverflowY ? rawScrollY.current - stepY : undefined,
          });
          break;
        }
        case 'PageDown': {
          const stepX = (viewportWidth || 0) * 0.9;
          const stepY = (viewportHeight || 200) * 0.9;
          viewportRef.current.scrollTo({
            animated: false,
            x: state.hasOverflowX ? rawScrollX.current + stepX : undefined,
            y: state.hasOverflowY ? rawScrollY.current + stepY : undefined,
          });
          break;
        }
        case 'Home':
          viewportRef.current.scrollTo({
            animated: false,
            x: state.hasOverflowX ? 0 : undefined,
            y: state.hasOverflowY ? 0 : undefined,
          });
          break;
        case 'End':
          viewportRef.current.scrollTo({
            animated: false,
            x: state.hasOverflowX ? contentWidth : undefined,
            y: state.hasOverflowY ? contentHeight : undefined,
          });
          break;
        default:
          onKeyDown?.(e);
          return;
      }
      e.preventDefault();
    };

    const webOnlyProps = isWeb
      ? {
          focusable: true,
          onBlur: (e: NativeSyntheticEvent<TargetedEvent>) => {
            handleBlur();
            onBlur?.(e);
          },
          onFocus: (e: NativeSyntheticEvent<TargetedEvent>) => {
            handleFocus();
            onFocus?.(e);
          },
          onKeyDown: handleWebKeyDown,
          tabIndex: 0 as 0 | -1,
        }
      : {};

    const focusRingOverlayStyle = evaluateStyles(
      undefined,
      state,
      !isWeb
        ? { disableDefaultFocusRing, focusRingStyle }
        : { disableDefaultFocusRing: true },
    );

    const contextValue = React.useMemo(
      () => ({
        ...scrollArea,
        disableDefaultFocusRing,
        focusRingStyle,
      }),
      [scrollArea, disableDefaultFocusRing, focusRingStyle],
    );

    // Extract styles to match rounding and border width
    const flattened = (StyleSheet.flatten(resolvedStyle) || {}) as ViewStyle;
    const borderRadius = flattened.borderRadius || 0;
    const borderWidth = flattened.borderWidth || 0;

    return (
      <ScrollAreaContext.Provider value={contextValue}>
        <View
          {...other}
          {...webOnlyProps}
          accessible={isWeb}
          aria-describedby={ariaDescribedBy}
          aria-details={ariaDetails}
          aria-hidden={ariaHidden}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          collapsable={false}
          onPointerEnter={() => scrollArea.setIsHovering(true)}
          onPointerLeave={() => scrollArea.setIsHovering(false)}
          ref={ref}
          style={resolvedStyle}
        >
          {children}
          {!isWeb && state.focusVisible && (
            <View
              pointerEvents='none'
              style={[
                StyleSheet.absoluteFill,
                focusRingOverlayStyle,
                {
                  // Match parent border exactly to prevent "cut out" edges
                  borderRadius,
                  // Offset by parent border width if present
                  margin: -borderWidth,
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
