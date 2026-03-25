import { evaluateStyles } from '@base-ui-rn/core';
import * as React from 'react';
import {
  type NativeSyntheticEvent,
  Platform,
  StyleSheet,
  type TargetedEvent,
  View,
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
      const pageStep = (viewportHeight || 200) * 0.9;

      switch (e.key) {
        case 'ArrowUp':
          viewportRef.current.scrollTo({
            animated: false,
            y: rawScrollY.current - step,
          });
          break;
        case 'ArrowDown':
          viewportRef.current.scrollTo({
            animated: false,
            y: rawScrollY.current + step,
          });
          break;
        case 'ArrowLeft':
          viewportRef.current.scrollTo({
            animated: false,
            x: rawScrollX.current - step,
          });
          break;
        case 'ArrowRight':
          viewportRef.current.scrollTo({
            animated: false,
            x: rawScrollX.current + step,
          });
          break;
        case 'PageUp':
          viewportRef.current.scrollTo({
            animated: false,
            y: rawScrollY.current - pageStep,
          });
          break;
        case 'PageDown':
          viewportRef.current.scrollTo({
            animated: false,
            y: rawScrollY.current + pageStep,
          });
          break;
        case 'Home':
          viewportRef.current.scrollTo({ animated: false, x: 0, y: 0 });
          break;
        case 'End':
          viewportRef.current.scrollTo({
            animated: false,
            y: 9999999,
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
      !isWeb ? { disableDefaultFocusRing, focusRingStyle } : { disableDefaultFocusRing: true }
    );

    return (
      <ScrollAreaContext.Provider value={scrollArea}>
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
          {!isWeb && (
            <View
              pointerEvents="none"
              style={[StyleSheet.absoluteFill, focusRingOverlayStyle]}
            />
          )}
        </View>
      </ScrollAreaContext.Provider>
    );
  }),
);

Root.displayName = 'ScrollArea.Root';
