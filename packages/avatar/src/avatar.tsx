import * as React from 'react';
import { View } from 'react-native';
import type { AvatarRootProps, ImageLoadingStatus } from './types';
import { AvatarContext } from './avatar-context';

/**
 * Headless avatar root primitive for React Native.
 *
 * @example
 * ```tsx
 * <Avatar.Root>
 *   <Avatar.Image source={{ uri: 'https://github.com/shadcn.png' }} />
 *   <Avatar.Fallback delay={600}>
 *     <Text>JD</Text>
 *   </Avatar.Fallback>
 * </Avatar.Root>
 * ```
 */
export const AvatarRoot = React.forwardRef<View, AvatarRootProps>(
  (props, ref) => {
    const {
      children,
      accessible,
      accessibilityRole,
      accessibilityLabel,
      accessibilityHint,
      importantForAccessibility,
      'aria-busy': ariaBusy,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-hidden': ariaHidden,
      ...other
    } = props;
    const [loadingStatus, setLoadingStatus] =
      React.useState<ImageLoadingStatus>('idle');

    const onLoadingStatusChange = React.useCallback(
      (status: ImageLoadingStatus) => {
        setLoadingStatus(status);
      },
      [],
    );

    const contextValue = React.useMemo(
      () => ({
        loadingStatus,
        onLoadingStatusChange,
      }),
      [loadingStatus, onLoadingStatusChange],
    );

    const isLoading = loadingStatus === 'loading';

    return (
      <AvatarContext.Provider value={contextValue}>
        <View
          {...other}
          ref={ref}
          accessible={accessible !== false}
          accessibilityRole={accessibilityRole ?? 'image'}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
          importantForAccessibility={importantForAccessibility}
          aria-busy={ariaBusy ?? isLoading}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-details={ariaDetails}
          aria-expanded={ariaExpanded}
          aria-hidden={ariaHidden}
        >
          {children}
        </View>
      </AvatarContext.Provider>
    );
  },
);

AvatarRoot.displayName = 'Avatar.Root';
