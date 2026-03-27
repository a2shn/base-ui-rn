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
 * <Avatar.Root>
 *   <Avatar.Image source={{ uri: '...' }} />
 *   <Avatar.Fallback>JD</Avatar.Fallback>
 * </Avatar.Root>
 * ```
 */
export const AvatarRoot = React.forwardRef<View, AvatarRootProps>(
  (props, ref) => {
    const {
      'aria-busy': ariaBusy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-hidden': ariaHidden,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children,
      ...otherProps
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
          {...otherProps}
          aria-busy={ariaBusy ?? isLoading}
          aria-describedby={ariaDescribedBy}
          aria-details={ariaDetails}
          aria-expanded={ariaExpanded}
          aria-hidden={ariaHidden}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          data-status={loadingStatus}
          ref={ref}
          role='img'
        >
          {children}
        </View>
      </AvatarContext.Provider>
    );
  },
);

AvatarRoot.displayName = 'Avatar.Root';
