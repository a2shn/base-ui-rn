import * as React from 'react';
import {
  type ImageErrorEventData,
  type ImageLoadEventData,
  type NativeSyntheticEvent,
  Image as RNImage,
  type ImageProps as RNImageProps,
} from 'react-native';

import { useAvatarContext } from './avatar-context';
import { useAvatarImageLoading } from './avatar-image-loading';
import type { AvatarImageProps } from './types';

/**
 * The image component for the avatar.
 *
 * Automatically manages loading status within the Avatar.Root context and
 * communicates status changes to the root.
 *
 * @example
 * ```tsx
 * <Avatar.Image source={{ uri: 'https://github.com/shadcn.png' }} />
 * ```
 */
export const AvatarImage = React.forwardRef<RNImage, AvatarImageProps>(
  (props, ref) => {
    const {
      accessible = false,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-hidden': ariaHidden,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      onError,
      onLoad,
      onLoadingStatusChange: onLoadingStatusChangeProp,
      onLoadStart,
      source,
      ...otherProps
    } = props;
    const { onLoadingStatusChange } = useAvatarContext();

    const {
      clearLoadTimeout,
      handleLoadingStatusChange,
      sourceKey,
      timeoutRef,
    } = useAvatarImageLoading({
      onLoadingStatusChange,
      onLoadingStatusChangeProp,
      source,
    });

    const handleLoadStart = React.useCallback(() => {
      const eventSourceKey = sourceKey;
      const didApplyLoading = handleLoadingStatusChange(
        'loading',
        eventSourceKey,
      );
      clearLoadTimeout();

      if (didApplyLoading) {
        timeoutRef.current = setTimeout(() => {
          handleLoadingStatusChange('error', eventSourceKey);
        }, 10000);
      }

      onLoadStart?.();
    }, [
      clearLoadTimeout,
      handleLoadingStatusChange,
      onLoadStart,
      sourceKey,
      timeoutRef,
    ]);

    const handleLoad = React.useCallback(
      (e: NativeSyntheticEvent<ImageLoadEventData>) => {
        clearLoadTimeout();
        handleLoadingStatusChange('loaded', sourceKey);
        onLoad?.(e);
      },
      [clearLoadTimeout, handleLoadingStatusChange, onLoad, sourceKey],
    );

    const handleError = React.useCallback(
      (e: NativeSyntheticEvent<ImageErrorEventData>) => {
        clearLoadTimeout();
        handleLoadingStatusChange('error', sourceKey);
        onError?.(e);
      },
      [clearLoadTimeout, handleLoadingStatusChange, onError, sourceKey],
    );

    return (
      <RNImage
        {...(otherProps as RNImageProps)}
        accessible={accessible}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-hidden={ariaHidden}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        onError={handleError}
        onLoad={handleLoad}
        onLoadStart={handleLoadStart}
        ref={ref}
        source={source}
      />
    );
  },
);

AvatarImage.displayName = 'Avatar.Image';
