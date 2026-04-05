import { mergeProps, useStyle } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import { AvatarContext } from './avatar-context';
import type { AvatarRootProps, ImageLoadingStatus } from './types';

/**
 * Headless avatar root primitive for React Native.
 *
 * Manages the image loading lifecycle and provides state to its Image and
 * Fallback sub-components. Supports accessibility attributes and ARIA busy states.
 *
 * @example
 * ```tsx
 * <Avatar.Root accessibilityLabel="User Profile">
 * <Avatar.Image source={{ uri: '...' }} />
 * <Avatar.Fallback>JD</Avatar.Fallback>
 * </Avatar.Root>
 * ```
 */
export const AvatarRoot = React.forwardRef<View, AvatarRootProps>(
  (props, ref) => {
    const { children, style } = props;

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
    const resolvedStyle = useStyle({
      state: { loadingStatus },
      style
    });

    const mergedProps = mergeProps(props, {
      disabled: false,
      focusable: false,
      ref,
      style: resolvedStyle,
      accessibilityState: {
        busy: isLoading,
      },
    });

    return (
      <AvatarContext.Provider value={contextValue}>
        <View
          accessible={true}
          importantForAccessibility="yes"
          role="img"
          {...mergedProps}
        >
          {children}
        </View>
      </AvatarContext.Provider>
    );
  },
);

AvatarRoot.displayName = 'Avatar.Root';
