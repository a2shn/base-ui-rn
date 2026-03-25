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

    const resolvedStyle = evaluateStyles(style, state);

    if (!state.hasOverflowX || !state.hasOverflowY) {
      return null;
    }

    return (
      <View
        {...other}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-hidden={ariaHidden}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        ref={ref}
        style={[{ backgroundColor: 'transparent' }, resolvedStyle]}
      />
    );
  }),
);

Corner.displayName = 'ScrollArea.Corner';
