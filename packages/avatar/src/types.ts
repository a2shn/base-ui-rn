import type { ImageProps, ViewProps } from 'react-native';

export type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

export interface AvatarState {
  loadingStatus: ImageLoadingStatus;
}

export interface AvatarRootProps extends ViewProps {}

export interface AvatarImageProps extends ImageProps {
  /**
   * Fired when the image loading status changes.
   */
  onLoadingStatusChange?: (status: ImageLoadingStatus) => void;
}

export interface AvatarFallbackProps extends ViewProps {
  /**
   * Delay in milliseconds before showing the fallback.
   * @default 0
   */
  delay?: number;
}
