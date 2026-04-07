import { resolveValue } from '@base-ui-rn/core';
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
      'aria-busy': ariaBusy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-hidden': ariaHidden,
      'aria-keyshortcuts': ariaKeyshortcuts,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      style,
      ...otherProps
    } = props;
    const { state } = useScrollAreaContext();

    const resolvedStyle = resolveValue(style, state);

    if (!state.hasOverflowX || !state.hasOverflowY) {
      return null;
    }

    const cornerDataAttrs = {
      'data-has-overflow-x': state.hasOverflowX ? 'true' : undefined,
      'data-has-overflow-y': state.hasOverflowY ? 'true' : undefined,
      'data-overflow-x-end': state.overflowXEnd ? 'true' : undefined,
      'data-overflow-x-start': state.overflowXStart ? 'true' : undefined,
      'data-overflow-y-end': state.overflowYEnd ? 'true' : undefined,
      'data-overflow-y-start': state.overflowYStart ? 'true' : undefined,
      'data-scrolling': state.isScrolling ? 'true' : undefined,
    };

    return (
      <View
        {...otherProps}
        {...cornerDataAttrs}
        aria-busy={ariaBusy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-hidden={ariaHidden}
        aria-keyshortcuts={ariaKeyshortcuts}
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
