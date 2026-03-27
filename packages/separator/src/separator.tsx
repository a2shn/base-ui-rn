import * as React from 'react';
import { View } from 'react-native';

import type { SeparatorProps } from './types';

/**
 * Headless separator primitive for React Native.
 *
 * Visually or semantically separates content. Supports horizontal and vertical
 * orientations and decorative mode.
 *
 * @example
 * ```tsx
 * <Separator orientation="horizontal" />
 * ```
 */
export const Separator = React.forwardRef<View, SeparatorProps>(
  (props, ref) => {
    const {
      accessibilityRole,
      'aria-busy': ariaBusy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-disabled': ariaDisabled,
      'aria-hidden': ariaHidden,
      'aria-keyshortcuts': ariaKeyshortcuts,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-orientation': ariaOrientationProp,
      'data-orientation': dataOrientation,
      decorative = false,
      orientation = 'horizontal',
      ...otherProps
    } = props;

    return (
      <View
        {...otherProps}
        accessibilityElementsHidden={decorative}
        aria-busy={ariaBusy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-disabled={ariaDisabled}
        aria-hidden={ariaHidden ?? (decorative ? true : undefined)}
        aria-keyshortcuts={ariaKeyshortcuts}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-orientation={ariaOrientationProp ?? orientation}
        data-orientation={dataOrientation ?? orientation}
        importantForAccessibility={decorative ? 'no-hide-descendants' : 'yes'}
        ref={ref}
        role={
          decorative
            ? 'presentation'
            : ((accessibilityRole ?? 'separator') as 'separator')
        }
      />
    );
  },
);
