import { mergeProps, resolveValue } from '@base-ui-rn/core';
import * as React from 'react';
import { Image } from 'react-native';

import { useAvatarContext } from './avatar-context';
import type { AvatarImageProps } from './types';
import { useAvatarImage } from './use-avatar-image';

/**
 * The image component for the avatar.
 *
 * Automatically manages loading status within the Avatar.Root context and
 * communicates status changes to the root.
 *
 * @example
 * ```tsx
 * <Avatar.Image source={{ uri: 'https://example.com/avatar.jpg' }} />
 * ```
 */
export const AvatarImage = React.forwardRef<Image, AvatarImageProps>(
  (props, ref) => {
    const { style, source, ...otherProps } = props;
    const { loadingStatus } = useAvatarContext();
    const { handleError, handleLoad, handleLoadStart } = useAvatarImage(props);

    const resolvedStyle = resolveValue(
      style,
      { loadingStatus },

    );

    const mergedProps = mergeProps(otherProps, {
      onError: handleError,
      onLoad: handleLoad,
      onLoadStart: handleLoadStart,
      disabled: false,
      focusable: false,
      ref,
      style: resolvedStyle,
      accessible: true
    });

    return (
      <Image
        {...mergedProps}
        source={source}
      />
    );
  },
);

AvatarImage.displayName = 'Avatar.Image';
