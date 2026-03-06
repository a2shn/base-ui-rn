import type { ViewProps, ImageProps as RNImageProps } from 'react-native';

export type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

export interface AvatarRootProps extends ViewProps {
  children?: React.ReactNode;
}

export interface AvatarImageProps extends RNImageProps {
  /**
   * Callback fired when the loading status changes.
   */
  onLoadingStatusChange?: (status: ImageLoadingStatus) => void;
  /**
   * When true, the image is marked as an accessibility element. Defaults to false
   * since the root handles accessibility.
   */
  accessible?: boolean;
}

export interface AvatarFallbackProps extends ViewProps {
  /**
   * How long to wait before showing the fallback. Specified in milliseconds.
   * Useful for preventing "flicker" when an image loads quickly.
   * @default 0
   */
  delay?: number;
  /**
   * When true, the fallback is marked as an accessibility element.
   */
  accessible?: boolean;
}
