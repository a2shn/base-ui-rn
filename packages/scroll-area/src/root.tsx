import { evaluateStyles } from '@base-ui-rn/core';
import * as React from 'react';
import { Platform, View } from 'react-native';

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
      onKeyDown,
      overflowEdgeThreshold,
      scrollbarVisibility,
      style,
      ...other
    } = props;

    const scrollArea = useScrollArea({
      overflowEdgeThreshold,
      scrollbarVisibility,
    });

    const { rawScrollX, rawScrollY, state, viewportHeight, viewportRef } =
      scrollArea;

    const resolvedStyle = evaluateStyles(style, state);

    const webProps =
      Platform.OS === 'web'
        ? {
          focusable: true,
          onKeyDown: (e: React.KeyboardEvent) => {
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
                  y: 9999999, // ScrollView handles bounds
                });
                break;
              default:
                onKeyDown?.(e);
                return;
            }
            e.preventDefault();
          },
          tabIndex: 0 as 0 | -1,
        }
        : {};

    return (
      <ScrollAreaContext.Provider value={scrollArea}>
        <View
          {...other}
          {...webProps}
          accessible={true}
          aria-describedby={ariaDescribedBy}
          aria-details={ariaDetails}
          aria-hidden={ariaHidden}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          onPointerEnter={() => scrollArea.setIsHovering(true)}
          onPointerLeave={() => scrollArea.setIsHovering(false)}
          ref={ref}
          style={resolvedStyle}
        >
          {children}
        </View>
      </ScrollAreaContext.Provider>
    );
  }),
);

Root.displayName = 'ScrollArea.Root';
