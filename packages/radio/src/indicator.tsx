import { mergeProps, resolveValue } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import { useRadioRootContext } from './radio-root-context';
import type { RadioIndicatorProps } from './types';

/**
 * A visual indicator that shows whether the radio is selected.
 *
 * Renders conditionally based on the checked state of the parent Radio.Root.
 *
 * @example
 * ```tsx
 * <Radio.Root value="option-a">
 * <Radio.Indicator />
 * </Radio.Root>
 * ```
 */
export const RadioIndicator = React.memo(
  React.forwardRef<View, RadioIndicatorProps>((props, ref) => {
    const { children, keepMounted = false, style, ...otherProps } = props;

    const context = useRadioRootContext();

    if (!keepMounted && !context.checked) {
      return null;
    }

    const resolvedStyle = resolveValue(style, context);
    const mergedProps = mergeProps(
      { style: resolvedStyle },
      { ref },
      otherProps,
    );

    return <View {...mergedProps}>{resolveValue(children, context)}</View>;
  }),
);

RadioIndicator.displayName = 'Radio.Indicator';
