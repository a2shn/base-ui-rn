import * as React from 'react';
import {
  View,
  Image as RNImage,
  type ImageProps as RNImageProps,
  type NativeSyntheticEvent,
  type ImageLoadEventData,
  type ImageErrorEventData,
} from 'react-native';
import type {
  AvatarRootProps,
  AvatarImageProps,
  AvatarFallbackProps,
  ImageLoadingStatus,
} from './types';
import { AvatarContext, useAvatarContext } from './avatar-context';
import { useAvatarImageLoading } from './avatar-image-loading';

/**
 * Headless avatar primitive for React Native.
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

export const Avatar = {
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback,
};
