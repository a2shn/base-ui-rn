import * as React from 'react';
import { View } from 'react-native';
import { ToggleGroupProps } from './types';

export const ToggleGroup = React.forwardRef<View, ToggleGroupProps>(
  ({ children, ...props }, ref) => {
    return (
      <View {...props} ref={ref}>
        {children}
      </View>
    );
  },
);
