import * as React from 'react';
import { View } from 'react-native';
import type { SeparatorProps } from './types';

/**
 * Headless separator primitive for React Native.
 */
export const Separator = React.forwardRef<View, SeparatorProps>(
  (props, ref) => {
    const {
      orientation = 'horizontal',
      decorative = false,
      accessibilityRole,
      tabIndex,
      'aria-disabled': ariaDisabled,
      'data-orientation': dataOrientation,
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
        aria-disabled={ariaDisabled}
        accessibilityElementsHidden={decorative}
        importantForAccessibility={decorative ? 'no-hide-descendants' : 'yes'}
        aria-orientation={orientation}
        data-orientation={dataOrientation ?? orientation}
      />
    );
  },
);
