import type { ViewProps, ImageProps as RNImageProps } from 'react-native';

export type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

export interface AvatarRootProps extends ViewProps {
  children?: React.ReactNode;
}

export interface AvatarImageProps extends Omit<
  RNImageProps,
  'onLoad' | 'onError'
> {
  /**
   * Callback fired when the loading status changes.
   */
  onLoadingStatusChange?: (status: ImageLoadingStatus) => void;
}

export interface AvatarFallbackProps extends ViewProps {
  /**
   * How long to wait before showing the fallback. Specified in milliseconds.
   * @default 0
   */
  delay?: number;
}
