import * as React from 'react';
import { View } from 'react-native';
import type { AvatarFallbackProps } from './types';
import { useAvatarContext } from './avatar-context';

/**
 * A fallback component rendered when the image is loading or fails to load.
 */
export const AvatarFallback = React.forwardRef<View, AvatarFallbackProps>(
  (props, ref) => {
    const {
      delay,
      children,
      accessible = true,
      accessibilityRole,
      accessibilityLabel,
      accessibilityHint,
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
          ref={ref}
          accessible={accessible}
          accessibilityRole={accessibilityRole}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
          importantForAccessibility='yes'
        >
          {children}
        </View>
      );
    }

    return null;
  },
);

AvatarFallback.displayName = 'Avatar.Fallback';
