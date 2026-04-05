import type {
  ImageStyle,
  ImageProps,
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';

/**
 * The loading state of the avatar image.
 */
export type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

/**
 * The state of the avatar root.
 */
export interface AvatarState {
  /**
   * The current loading status of the image.
   */
  loadingStatus: ImageLoadingStatus;
}

export interface AvatarRootProps extends Omit<ViewProps, 'children'> {
  /**
   * The content of the avatar.
   */
  children?: React.ReactNode;
  /**
   * Style applied to the avatar root.
   */
  style?: StyleProp<ViewStyle>;
}

export interface AvatarImageProps extends Omit<ImageProps, 'style'> {
  /**
   * Callback fired when the image loading status changes.
   */
  onLoadingStatusChange?: (status: ImageLoadingStatus) => void;

  /**
   * Style applied to the avatar image.
   */
  style?: StyleProp<ImageStyle>;
}

export interface AvatarFallbackProps extends Omit<ViewProps, 'children'> {
  /**
   * The content of the fallback (usually initials or icon).
   */
  children?: React.ReactNode;
  /**
   * Delay in milliseconds before showing the fallback.
   * @default 0
   */
  delay?: number;

  /**
   * Style applied to the fallback view.
   */
  style?: StyleProp<ViewStyle>;
}
