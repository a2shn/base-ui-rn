import { evaluateStyles, mergeProps, useStyle } from '@base-ui-rn/core';
import * as React from 'react';
import { Text } from 'react-native';

import type { LabelProps } from './types';

/**
 * A primitive text component used to label or describe UI elements.
 * * Can be used as a primary label (aria-labelledby), a description (aria-describedby),
 * or an error message (aria-errormessage).
 *
 * @example
 * ```tsx
 * <Label nativeID="hint-1">Enter your full name</Label>
 * <Input aria-describedby="hint-1" />
 * ```
 */
export const Label = React.memo(
  React.forwardRef<Text, LabelProps>((props, ref) => {
    const { children, style, nativeID } = props;

    const resolvedStyle = useStyle({
      style,
      state: {}, // Can be extended if context is added later
    });

    const mergedProps = mergeProps(props, {
      handlers: {},
      disabled: false,
      focusable: false,
      ref,
      style: resolvedStyle,
    });

    return (
      <Text
        {...mergedProps}
        nativeID={nativeID}
      >
        {evaluateStyles(children, {})}
      </Text>
    );
  }),
);

Label.displayName = 'Label';
