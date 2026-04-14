import { mergeProps, resolveValue } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import { useAvatarContext } from './avatar-context';
import type { AvatarFallbackProps } from './types';

/**
 * A fallback component rendered when the avatar image is loading or fails to load.
 *
 * Supports an optional delay to prevent flicker for fast-loading images.
 *
 * @example
 * ```tsx
 * <Avatar.Fallback>JD</Avatar.Fallback>
 * ```
 */
export const AvatarFallback = React.forwardRef<View, AvatarFallbackProps>(
  (props, ref) => {
    const { children, delay, style, ...otherProps } = props;
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

    const resolvedStyle = resolveValue(style, { loadingStatus });

    const mergedProps = mergeProps(
      { style: resolvedStyle },
      { ref },
      otherProps,
      {
        accessible: true,
        disabled: false,
        focusable: false,
      },
    );

    if (canRender && loadingStatus !== 'loaded') {
      return (
        <View
          {...mergedProps}
          accessibilityElementsHidden={isLoading}
          importantForAccessibility={isLoading ? 'no-hide-descendants' : 'yes'}
        >
          {children}
        </View>
      );
    }

    return null;
  },
);

AvatarFallback.displayName = 'Avatar.Fallback';
