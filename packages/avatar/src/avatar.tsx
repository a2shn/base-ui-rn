import * as React from 'react';
import { View, Image as RNImage, type ImageProps as RNImageProps } from 'react-native';
import type { AvatarRootProps, AvatarImageProps, AvatarFallbackProps, ImageLoadingStatus } from './types';
import { AvatarContext, useAvatarContext } from './avatar-context';

/**
 * Avatar.Root
 * Displays a user's profile picture, initials, or fallback icon.
 */
export const AvatarRoot = React.forwardRef<View, AvatarRootProps>((props, ref) => {
  const { children, ...other } = props;
  const [loadingStatus, setLoadingStatus] = React.useState<ImageLoadingStatus>('idle');

  const onLoadingStatusChange = React.useCallback((status: ImageLoadingStatus) => {
    setLoadingStatus(status);
  }, []);

  const contextValue = React.useMemo(() => ({
    loadingStatus,
    onLoadingStatusChange,
  }), [loadingStatus, onLoadingStatusChange]);

  return (
    <AvatarContext.Provider value={contextValue}>
      <View {...other} ref={ref}>
        {children}
      </View>
    </AvatarContext.Provider>
  );
});

AvatarRoot.displayName = 'Avatar.Root';

/**
 * Avatar.Image
 * The image to be displayed in the avatar.
 */
export const AvatarImage = React.forwardRef<RNImage, AvatarImageProps>((props, ref) => {
  const { onLoadingStatusChange: onLoadingStatusChangeProp, source, ...other } = props;
  const { onLoadingStatusChange } = useAvatarContext();

  const handleLoadingStatusChange = React.useCallback((status: ImageLoadingStatus) => {
    onLoadingStatusChange(status);
    onLoadingStatusChangeProp?.(status);
  }, [onLoadingStatusChange, onLoadingStatusChangeProp]);

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
});

AvatarImage.displayName = 'Avatar.Image';

/**
 * Avatar.Fallback
 * Rendered when the image fails to load or when no image is provided.
 */
export const AvatarFallback = React.forwardRef<View, AvatarFallbackProps>((props, ref) => {
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
});

AvatarFallback.displayName = 'Avatar.Fallback';

export const Avatar = {
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback,
};
