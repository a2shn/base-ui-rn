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
      'data-has-overflow-x': dataHasOverflowX,
      'data-has-overflow-y': dataHasOverflowY,
      'data-overflow-x-end': dataOverflowXEnd,
      'data-overflow-x-start': dataOverflowXStart,
      'data-overflow-y-end': dataOverflowYEnd,
      'data-overflow-y-start': dataOverflowYStart,
      'data-scrolling': dataScrolling,
      disableDefaultFocusRing,
      focusRingStyle,
      focusVisible: forceFocusVisible,
      keyboardPageStep,
      keyboardStep,
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
      keyboardPageStep,
      keyboardStep,
      overflowEdgeThreshold,
      scrollbarVisibility,
    });

    const {
      contentHeight,
      contentWidth,
      keyboardPageStep: currentPageStep,
      keyboardStep: currentStep,
      onBlur: handleBlur,
      onFocus: handleFocus,
      rawScrollX,
      rawScrollY,
      state,
      viewportHeight,
      viewportRef,
      viewportWidth,
    } = scrollArea;

    const isWeb = Platform.OS === 'web';

    // The Root is responsible for rendering the focus ring visuals on all platforms.
    // On web, Root is also the focus target.
    // On native, the Viewport is the focus target but tells the Root to show the ring via context.
    // We use an absolute overlay on native to prevent layout-driven focus "jumps".
    const resolvedStyle = evaluateStyles(style, state, {
      disableDefaultFocusRing,
      focusRingStyle,
    });

    const handleWebKeyDown = (e: React.KeyboardEvent) => {
      if (!viewportRef.current) return;

      const step = currentStep;
      let nextX = rawScrollX.current;
      let nextY = rawScrollY.current;
      let handled = true;

      switch (e.key) {
        case 'ArrowUp':
          if (!state.hasOverflowY && state.hasOverflowX) {
            nextX -= step;
          } else {
            nextY -= step;
          }
          break;
        case 'ArrowDown':
          if (!state.hasOverflowY && state.hasOverflowX) {
            nextX += step;
          } else {
            nextY += step;
          }
          break;
        case 'ArrowLeft':
          if (!state.hasOverflowX && state.hasOverflowY) {
            nextY -= step;
          } else {
            nextX -= step;
          }
          break;
        case 'ArrowRight':
          if (!state.hasOverflowX && state.hasOverflowY) {
            nextY += step;
          } else {
            nextX += step;
          }
          break;
        case 'PageUp': {
          const stepX = (viewportWidth || 0) * currentPageStep;
          const stepY = (viewportHeight || 200) * currentPageStep;
          if (state.hasOverflowX) nextX -= stepX;
          if (state.hasOverflowY) nextY -= stepY;
          break;
        }
        case 'PageDown': {
          const stepX = (viewportWidth || 0) * currentPageStep;
          const stepY = (viewportHeight || 200) * currentPageStep;
          if (state.hasOverflowX) nextX += stepX;
          if (state.hasOverflowY) nextY += stepY;
          break;
        }
        case 'Home':
          if (state.hasOverflowX) nextX = 0;
          if (state.hasOverflowY) nextY = 0;
          break;
        case 'End':
          if (state.hasOverflowX) nextX = contentWidth;
          if (state.hasOverflowY) nextY = contentHeight;
          break;
        default:
          handled = false;
          onKeyDown?.(e);
          break;
      }

      if (handled) {
        e.preventDefault();
        viewportRef.current.scrollTo({
          animated: false,
          x: nextX,
          y: nextY,
        });
      }
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
          data-has-overflow-x={
            dataHasOverflowX ?? (state.hasOverflowX || undefined)
          }
          data-has-overflow-y={
            dataHasOverflowY ?? (state.hasOverflowY || undefined)
          }
          data-overflow-x-end={
            dataOverflowXEnd ?? (state.overflowXEnd || undefined)
          }
          data-overflow-x-start={
            dataOverflowXStart ?? (state.overflowXStart || undefined)
          }
          data-overflow-y-end={
            dataOverflowYEnd ?? (state.overflowYEnd || undefined)
          }
          data-overflow-y-start={
            dataOverflowYStart ?? (state.overflowYStart || undefined)
          }
          data-scrolling={dataScrolling ?? (state.isScrolling || undefined)}
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
