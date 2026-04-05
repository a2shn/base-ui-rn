import { mergeProps, useStyle } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import { useAvatarContext } from './avatar-context';
import type { AvatarFallbackProps } from './types';

/**
 * A fallback component rendered when the avatar image is loading or fails to load.
 *
 * Supports an optional delay to prevent flicker for fast-loading images.
 */
export const AvatarFallback = React.forwardRef<View, AvatarFallbackProps>(
  (props, ref) => {
    const { children, delay, style } = props;
    const { loadingStatus } = useAvatarContext();
    const [canRender, setCanRender] = React.useState(delay === undefined);

    const isLoading = loadingStatus === 'loading';

    React.useEffect(() => {
      if (delay !== undefined) {
        const timer = setTimeout(() => setCanRender(true), delay);
        return () => clearTimeout(timer);
      }
      return undefined;
    }, [delay]);

    const resolvedStyle = useStyle({
      state: { loadingStatus },
      style,
    });

    const mergedProps = mergeProps(props, {
      disabled: false,
      focusable: false,
      ref,
      style: resolvedStyle,
    });

    if (canRender && loadingStatus !== 'loaded') {
      return (
        <View
          accessibilityElementsHidden={isLoading}
          accessible={props.accessible ?? true}
          importantForAccessibility={isLoading ? 'no-hide-descendants' : 'yes'}
          {...mergedProps}
        >
          {children}
        </View>
      );
    }

    return null;
  },
);

AvatarFallback.displayName = 'Avatar.Fallback';
