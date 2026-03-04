import * as React from 'react';
import {
  View,
  Image as RNImage,
  type ImageProps as RNImageProps,
} from 'react-native';
import type {
  AvatarRootProps,
  AvatarImageProps,
  AvatarFallbackProps,
  ImageLoadingStatus,
} from './types';
import { AvatarContext, useAvatarContext } from './avatar-context';

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
    const { children, ...other } = props;
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

    return (
      <AvatarContext.Provider value={contextValue}>
        <View {...other} ref={ref}>
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
 *
 * @param onLoadingStatusChange
 * Callback fired when the image loading status changes ('loading' | 'loaded' | 'error').
 */
export const AvatarImage = React.forwardRef<RNImage, AvatarImageProps>(
  (props, ref) => {
    const {
      onLoadingStatusChange: onLoadingStatusChangeProp,
      source,
      ...other
    } = props;
    const { onLoadingStatusChange } = useAvatarContext();

    const handleLoadingStatusChange = React.useCallback(
      (status: ImageLoadingStatus) => {
        onLoadingStatusChange(status);
        onLoadingStatusChangeProp?.(status);
      },
      [onLoadingStatusChange, onLoadingStatusChangeProp],
    );

    React.useLayoutEffect(() => {
      if (!source) {
        handleLoadingStatusChange('error');
      } else {
        handleLoadingStatusChange('loading');
      }
    }, [source, handleLoadingStatusChange]);

    return (
      <RNImage
        {...(other as RNImageProps)}
        ref={ref}
        source={source}
        onLoad={() => handleLoadingStatusChange('loaded')}
        onError={() => handleLoadingStatusChange('error')}
      />
    );
  },
);

AvatarImage.displayName = 'Avatar.Image';

/**
 * A fallback component rendered when the image is loading or fails to load.
 *
 * @param delay
 * The duration (inms) to wait before rendering the fallback.
 * Useful for preventing "flicker" when an image loads quickly.
 */
export const AvatarFallback = React.forwardRef<View, AvatarFallbackProps>(
  (props, ref) => {
    const { delay, children, ...other } = props;
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
        <View {...other} ref={ref}>
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
