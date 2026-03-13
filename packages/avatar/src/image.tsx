import * as React from 'react';
import {
  Image as RNImage,
  type ImageProps as RNImageProps,
  type NativeSyntheticEvent,
  type ImageLoadEventData,
  type ImageErrorEventData,
} from 'react-native';
import type { AvatarImageProps } from './types';
import { useAvatarContext } from './avatar-context';
import { useAvatarImageLoading } from './avatar-image-loading';

/**
 * The image component for the avatar.
 *
 * Automatically manages loading status within the Avatar.Root context.
 */
export const AvatarImage = React.forwardRef<RNImage, AvatarImageProps>(
  (props, ref) => {
    const {
      onLoadingStatusChange: onLoadingStatusChangeProp,
      source,
      accessible = false,
      onLoadStart,
      onLoad,
      onError,
      ...other
    } = props;
    const { onLoadingStatusChange } = useAvatarContext();

    const {
      clearLoadTimeout,
      handleLoadingStatusChange,
      sourceKey,
      timeoutRef,
    } = useAvatarImageLoading({
      source,
      onLoadingStatusChange,
      onLoadingStatusChangeProp,
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
        {...(other as RNImageProps)}
        ref={ref}
        source={source}
        accessible={accessible}
        onLoadStart={handleLoadStart}
        onLoad={handleLoad}
        onError={handleError}
      />
    );
  },
);

AvatarImage.displayName = 'Avatar.Image';
