import type { ViewProps, ImageProps as RNImageProps } from 'react-native';
import type { WebAccessibilityProps } from '@base-ui-rn/core';

export type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

export interface AvatarRootProps extends ViewProps, WebAccessibilityProps {
  /**
   * The content of the avatar root.
   */
  children?: React.ReactNode;
}

export interface AvatarImageProps extends RNImageProps, WebAccessibilityProps {
  /**
   * Callback fired when the image loading status changes.
   */
  onLoadingStatusChange?: (status: ImageLoadingStatus) => void;
  /**
   * Whether the image is an accessibility element.
   * @default false
   */
  accessible?: boolean;
}

export interface AvatarFallbackProps extends ViewProps, WebAccessibilityProps {
  /**
   * The content of the fallback.
   */
  children?: React.ReactNode;
  /**
   * Delay in milliseconds before showing the fallback.
   * @default 0
   */
  delay?: number;
  /**
   * Whether the fallback is an accessibility element.
   * @default true
   */
  accessible?: boolean;
}
