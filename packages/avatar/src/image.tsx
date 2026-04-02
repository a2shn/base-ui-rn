import { mergeProps, useStyle } from '@base-ui-rn/core';
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
 */
export const AvatarImage = React.forwardRef<Image, AvatarImageProps>(
  (props, ref) => {
    const { style, source } = props;
    const { loadingStatus } = useAvatarContext();
    const { handleError, handleLoad, handleLoadStart } = useAvatarImage(props);

    const resolvedStyle = useStyle({
      state: { loadingStatus },
      style,
    });

    const mergedProps = mergeProps(props, {
      handlers: {
        onError: handleError,
        onLoad: handleLoad,
        onLoadStart: handleLoadStart,
      },
      disabled: false,
      focusable: false,
      ref,
      style: resolvedStyle,
    });

    return (
      <Image
        accessible={props.accessible ?? false}
        {...mergedProps}
        source={source}
      />
    );
  },
);

AvatarImage.displayName = 'Avatar.Image';
