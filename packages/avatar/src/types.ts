import type {
  ViewProps,
  ImageProps as RNImageProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import type {
  ARIABaseProps,
  ARIAFocusProps,
  ARIALiveProps,
  ARIATraitDisabled,
} from '@base-ui-rn/core';

export type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

/**
 * Web-specific accessibility props for Avatar Root.
 */
export type WebAvatarRootAccessibilityProps = ARIABaseProps &
  ARIAFocusProps &
  ARIALiveProps &
  ARIATraitDisabled;

/**
 * Web-specific accessibility props for Avatar Image.
 */
export type WebAvatarImageAccessibilityProps = ARIABaseProps;

/**
 * Web-specific accessibility props for Avatar Fallback.
 */
export type WebAvatarFallbackAccessibilityProps = ARIABaseProps;

/**
 * The state of the avatar.
 */
export interface AvatarState {
  /**
   * The current loading status of the image.
   */
  loadingStatus: ImageLoadingStatus;
}

export interface AvatarRootProps
  extends Omit<ViewProps, 'children'>, WebAvatarRootAccessibilityProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export interface AvatarImageProps
  extends Omit<RNImageProps, 'style'>, WebAvatarImageAccessibilityProps {
  /**
   * Callback fired when the image loading status changes.
   */
  onLoadingStatusChange?: (status: ImageLoadingStatus) => void;
  /**
   * Whether the image is an accessibility element.
   * @default false
   */
  accessible?: boolean;
  /**
   * Style applied to the avatar image.
   */
  style?: StyleProp<ViewStyle>;
}

export interface AvatarFallbackProps
  extends Omit<ViewProps, 'children'>, WebAvatarFallbackAccessibilityProps {
  children?: React.ReactNode;
  delay?: number;
  accessible?: boolean;
  style?: StyleProp<ViewStyle>;
}
