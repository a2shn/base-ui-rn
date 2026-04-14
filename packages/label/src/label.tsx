import { mergeProps } from '@base-ui-rn/core';
import * as React from 'react';
import { Text, TextProps } from 'react-native';

/**
 * A primitive text component used to label or describe UI elements.
 *
 * Can be used as a primary label (aria-labelledby), a description (aria-describedby),
 * or an error message (aria-errormessage).
 *
 * @example
 * ```tsx
 * <Label nativeID="hint-1">Enter your full name</Label>
 * <Input aria-describedby="hint-1" />
 * ```
 */
export const Label = React.memo(
  React.forwardRef<Text, TextProps>((props, ref) => {
    const { children, id, nativeID, ...otherProps } = props;

    const reactId = React.useId();
    const resolvedNativeID = nativeID || id || reactId;

    const mergedProps = mergeProps({}, { ref }, otherProps, {
      disabled: false,
      focusable: false,
    });

    return (
      <Text {...mergedProps} nativeID={resolvedNativeID}>
        {children}
      </Text>
    );
  }),
);

Label.displayName = 'Label';
