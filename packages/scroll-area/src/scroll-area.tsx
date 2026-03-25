import { evaluateStyles, useKeyboardRange } from '@base-ui-rn/core';
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

    const handleWebRangeKeyDown = useKeyboardRange({
      // ArrowDown/ArrowLeft trigger onDecrement in core
      onDecrement: () => {
        if (!viewportRef.current) return;
        let nextX = rawScrollX.current;
        let nextY = rawScrollY.current;
        if (!state.hasOverflowY && state.hasOverflowX) {
          nextX -= currentStep; // ArrowLeft
        } else {
          nextY += currentStep; // ArrowDown
        }
        viewportRef.current.scrollTo({ animated: false, x: nextX, y: nextY });
      },
      onEnd: () => {
        if (!viewportRef.current) return;
        let nextX = rawScrollX.current;
        let nextY = rawScrollY.current;
        if (state.hasOverflowX) nextX = contentWidth;
        if (state.hasOverflowY) nextY = contentHeight;
        viewportRef.current.scrollTo({ animated: false, x: nextX, y: nextY });
      },
      onHome: () => {
        if (!viewportRef.current) return;
        let nextX = rawScrollX.current;
        let nextY = rawScrollY.current;
        if (state.hasOverflowX) nextX = 0;
        if (state.hasOverflowY) nextY = 0;
        viewportRef.current.scrollTo({ animated: false, x: nextX, y: nextY });
      },
      // ArrowUp/ArrowRight trigger onIncrement in core
      onIncrement: () => {
        if (!viewportRef.current) return;
        let nextX = rawScrollX.current;
        let nextY = rawScrollY.current;
        if (!state.hasOverflowY && state.hasOverflowX) {
          nextX += currentStep; // ArrowRight
        } else {
          nextY -= currentStep; // ArrowUp
        }
        viewportRef.current.scrollTo({ animated: false, x: nextX, y: nextY });
      },
      onPageDown: () => {
        if (!viewportRef.current) return;
        const stepX = (viewportWidth || 0) * currentPageStep;
        const stepY = (viewportHeight || 200) * currentPageStep;
        let nextX = rawScrollX.current;
        let nextY = rawScrollY.current;
        if (state.hasOverflowX) nextX += stepX;
        if (state.hasOverflowY) nextY += stepY;
        viewportRef.current.scrollTo({ animated: false, x: nextX, y: nextY });
      },
      onPageUp: () => {
        if (!viewportRef.current) return;
        const stepX = (viewportWidth || 0) * currentPageStep;
        const stepY = (viewportHeight || 200) * currentPageStep;
        let nextX = rawScrollX.current;
        let nextY = rawScrollY.current;
        if (state.hasOverflowX) nextX -= stepX;
        if (state.hasOverflowY) nextY -= stepY;
        viewportRef.current.scrollTo({ animated: false, x: nextX, y: nextY });
      },
    });

    const handleWebKeyDown = (e: React.KeyboardEvent) => {
      if (!viewportRef.current) return;

      // Handle dual-axis arrows manually because useKeyboardRange is one-dimensional
      const step = currentStep;
      let nextX = rawScrollX.current;
      let nextY = rawScrollY.current;
      let handled = false;

      if (e.key === 'ArrowUp') {
        nextY -= step;
        handled = true;
      } else if (e.key === 'ArrowDown') {
        nextY += step;
        handled = true;
      } else if (e.key === 'ArrowLeft') {
        nextX -= step;
        handled = true;
      } else if (e.key === 'ArrowRight') {
        nextX += step;
        handled = true;
      }

      if (handled) {
        e.preventDefault();
        viewportRef.current.scrollTo({ animated: false, x: nextX, y: nextY });
        return;
      }

      handleWebRangeKeyDown(
        e as unknown as NativeSyntheticEvent<{ key: string }> | KeyboardEvent,
      );
      onKeyDown?.(e);
    };

    let evaluateStylesOptions: Omit<ScrollAreaRootProps, 'children' | 'style'> =
      {
        disableDefaultFocusRing: true,
      };
    if (isWeb) {
      evaluateStylesOptions = {
        disableDefaultFocusRing,
        focusRingStyle,
      };
    }

    const resolvedStyle = evaluateStyles(style, state, evaluateStylesOptions);

    let webOnlyProps = {};
    if (isWeb) {
      webOnlyProps = {
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
      };
    }

    const contextValue = React.useMemo(
      () => ({
        ...scrollArea,
        disableDefaultFocusRing,
        focusRingStyle,
      }),
      [scrollArea, disableDefaultFocusRing, focusRingStyle],
    );

    let focusRingOverlayOptions: Omit<
      ScrollAreaRootProps,
      'children' | 'style'
    > = {
      disableDefaultFocusRing: true,
    };
    if (!isWeb) {
      focusRingOverlayOptions = { disableDefaultFocusRing, focusRingStyle };
    }

    const focusRingOverlayStyle = evaluateStyles(
      undefined,
      state,
      focusRingOverlayOptions,
    );

    // Extract styles to match rounding and border width
    const flattened = (StyleSheet.flatten(resolvedStyle) || {}) as ViewStyle;
    const borderRadius = flattened.borderRadius || 0;
    const borderWidth = flattened.borderWidth || 0;

    const rootDataAttrs = {
      'data-has-overflow-x':
        dataHasOverflowX ?? (state.hasOverflowX || undefined),
      'data-has-overflow-y':
        dataHasOverflowY ?? (state.hasOverflowY || undefined),
      'data-overflow-x-end':
        dataOverflowXEnd ?? (state.overflowXEnd || undefined),
      'data-overflow-x-start':
        dataOverflowXStart ?? (state.overflowXStart || undefined),
      'data-overflow-y-end':
        dataOverflowYEnd ?? (state.overflowYEnd || undefined),
      'data-overflow-y-start':
        dataOverflowYStart ?? (state.overflowYStart || undefined),
      'data-scrolling': dataScrolling ?? (state.isScrolling || undefined),
    };

    return (
      <ScrollAreaContext.Provider value={contextValue}>
        <View
          {...other}
          {...webOnlyProps}
          {...rootDataAttrs}
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
