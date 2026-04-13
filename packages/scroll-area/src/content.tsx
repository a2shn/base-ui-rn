import { mergeProps } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import type { ScrollAreaContentProps } from './types';
import { useScrollAreaContent } from './use-scroll-area-content';

export const Content = React.memo(
  React.forwardRef<View, ScrollAreaContentProps>((props, ref) => {
    const { children, ...otherProps } = props;
    const { handleLayout } = useScrollAreaContent(props);

    const mergedProps = mergeProps(
      { onLayout: handleLayout },
      { ref },
      otherProps,
    );

    return <View {...mergedProps}>{children}</View>;
  }),
);

Content.displayName = 'ScrollArea.Content';
