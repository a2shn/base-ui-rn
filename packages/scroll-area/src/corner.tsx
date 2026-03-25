import { evaluateStyles } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import { useScrollAreaContext } from './context';
import type { ScrollAreaCornerProps } from './types';

/**
 * A small rectangular area that appears at the intersection of horizontal and vertical scrollbars.
 *
 * It is only visible when both scrollbars are present.
 *
 * @example
 * ```tsx
 * <ScrollArea.Root>
 *   <ScrollArea.Viewport />
 *   <ScrollArea.Scrollbar orientation="vertical" />
 *   <ScrollArea.Scrollbar orientation="horizontal" />
 *   <ScrollArea.Corner />
 * </ScrollArea.Root>
 * ```
 */
export const Corner = React.memo(
  React.forwardRef<View, ScrollAreaCornerProps>((props, ref) => {
    const {
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-hidden': ariaHidden,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      style,
      ...other
    } = props;
    const { state } = useScrollAreaContext();

    const resolvedStyle = evaluateStyles(style, state, {
      disableDefaultFocusRing: true,
    });

    if (!state.hasOverflowX || !state.hasOverflowY) {
      return null;
    }

    const cornerDataAttrs = {
      'data-has-overflow-x': state.hasOverflowX || undefined,
      'data-has-overflow-y': state.hasOverflowY || undefined,
      'data-overflow-x-end': state.overflowXEnd || undefined,
      'data-overflow-x-start': state.overflowXStart || undefined,
      'data-overflow-y-end': state.overflowYEnd || undefined,
      'data-overflow-y-start': state.overflowYStart || undefined,
      'data-scrolling': state.isScrolling || undefined,
    };

    return (
      <View
        {...other}
        {...cornerDataAttrs}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-hidden={ariaHidden}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        focusable={false}
        ref={ref}
        style={[{ backgroundColor: 'transparent' }, resolvedStyle]}
      />
    );
  }),
);

Corner.displayName = 'ScrollArea.Corner';
