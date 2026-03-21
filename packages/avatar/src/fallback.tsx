import * as React from 'react';
import { View } from 'react-native';

import { useAvatarContext } from './avatar-context';
import type { AvatarFallbackProps } from './types';

/**
 * A fallback component rendered when the avatar image is loading or fails to load.
 *
 * Supports an optional delay to prevent flicker for fast-loading images.
 * Must be used within an `Avatar.Root`.
 *
 * @example
 * ```tsx
 * <Avatar.Fallback delay={600}>
 *   <Text>JD</Text>
 * </Avatar.Fallback>
 * ```
 */
export const AvatarFallback = React.forwardRef<View, AvatarFallbackProps>(
  (props, ref) => {
    const {
      accessibilityHint,
      accessibilityLabel,
      accessibilityRole,
      accessible = true,
      children,
      delay,
      ...other
    } = props;
    const { loadingStatus } = useAvatarContext();
    const [canRender, setCanRender] = React.useState(delay === undefined);

    React.useEffect(() => {
      if (delay !== undefined) {
        const timer = setTimeout(() => setCanRender(true), delay);
        return () => clearTimeout(timer);
      }
      return undefined;
    }, [delay]);

    if (canRender && loadingStatus !== 'loaded') {
      return (
        <View
          {...other}
          accessibilityHint={accessibilityHint}
          accessibilityLabel={accessibilityLabel}
          accessibilityRole={accessibilityRole}
          accessible={accessible}
          importantForAccessibility='yes'
          ref={ref}
        >
          {children}
        </View>
      );
    }

    return null;
  },
);

AvatarFallback.displayName = 'Avatar.Fallback';
