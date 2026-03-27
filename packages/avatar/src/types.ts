import type {
  ARIABaseProps,
  ARIALiveProps,
  ARIATraitDisabled,
} from '@base-ui-rn/core';
import type {
  ImageProps as RNImageProps,
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';

/**
 * The loading status of the avatar image.
 */
export type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

/**
 * Web-specific accessibility props for Avatar Root.
 */
export type WebAvatarRootAccessibilityProps = ARIABaseProps &
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

/**
 * Props for the Avatar root component.
 */
export interface AvatarRootProps
  extends Omit<ViewProps, 'children'>, WebAvatarRootAccessibilityProps {
  /**
   * The content of the avatar.
   */
  children?: React.ReactNode;
  /**
   * Style applied to the avatar root.
   */
  style?: StyleProp<ViewStyle>;
}

/**
 * Props for the Avatar image component.
 */
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

/**
 * Props for the Avatar fallback component.
 */
export interface AvatarFallbackProps
  extends Omit<ViewProps, 'children'>, WebAvatarFallbackAccessibilityProps {
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
   * Whether the fallback is an accessibility element.
   * @default true
   */
  accessible?: boolean;
  /**
   * Style applied to the fallback view.
   */
  style?: StyleProp<ViewStyle>;
}
