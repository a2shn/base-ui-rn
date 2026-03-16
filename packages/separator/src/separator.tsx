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
      orientation = 'horizontal',
      decorative = false,
      accessibilityRole,
      tabIndex,
      'aria-label': ariaLabel,
      'aria-keyshortcuts': ariaKeyshortcuts,
      'aria-disabled': ariaDisabled,
      'data-orientation': dataOrientation,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      'aria-orientation': ariaOrientationProp,
      ...otherProps
    } = props;

    return (
      <View
        {...otherProps}
        ref={ref}
        role={
          decorative
            ? 'presentation'
            : ((accessibilityRole ?? 'separator') as 'separator')
        }
        tabIndex={tabIndex}
        aria-label={ariaLabel}
        aria-keyshortcuts={ariaKeyshortcuts}
        aria-disabled={ariaDisabled}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-expanded={ariaExpanded}
        aria-busy={ariaBusy}
        aria-hidden={ariaHidden ?? (decorative ? true : undefined)}
        accessibilityElementsHidden={decorative}
        importantForAccessibility={decorative ? 'no-hide-descendants' : 'yes'}
        aria-orientation={ariaOrientationProp ?? orientation}
        data-orientation={dataOrientation ?? orientation}
      />
    );
  },
);
