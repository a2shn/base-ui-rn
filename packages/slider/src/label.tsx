import * as React from 'react';
import { Text } from 'react-native';
import type { SliderLabelProps } from './types';
import { useSliderContext } from './context';

/**
 * An accessible label for the Slider.
 *
 * @example
 * ```tsx
 * <Slider.Label>Volume</Slider.Label>
 * ```
 */
export const SliderLabel = React.forwardRef<Text, SliderLabelProps>(
  (props, ref) => {
    const {
      children,
      style,
      nativeID,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      ...otherViewProps
    } = props;
    const context = useSliderContext();

    const resolvedChildren =
      typeof children === 'function' ? children(context) : children;

    return (
      <Text
        {...otherViewProps}
        ref={ref}
        style={style}
        nativeID={nativeID ?? context.labelId}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-expanded={ariaExpanded}
        aria-busy={ariaBusy}
        aria-hidden={ariaHidden}
      >
        {resolvedChildren}
      </Text>
    );
  },
);

SliderLabel.displayName = 'Slider.Label';
