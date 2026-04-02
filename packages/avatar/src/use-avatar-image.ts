import * as React from 'react';
import type { ImageProps as RNImageProps } from 'react-native';

import { useAvatarContext } from './avatar-context';
import type { AvatarImageProps, ImageLoadingStatus } from './types';

type OnLoadEvent = Parameters<NonNullable<RNImageProps['onLoad']>>[0];
type OnErrorEvent = Parameters<NonNullable<RNImageProps['onError']>>[0];

const getSourceKey = (source: AvatarImageProps['source']): string => {
  if (typeof source === 'number') {
    return `asset:${source}`;
  }

  if (Array.isArray(source)) {
    return source.map((item) => item?.uri ?? '').join('|');
  }

  if (source && typeof source === 'object' && 'uri' in source) {
    return source.uri ?? '';
  }

  return '';
};


export const useAvatarImage = (props: AvatarImageProps) => {
  const { onError, onLoad, onLoadingStatusChange: onLoadingStatusChangeProp, onLoadStart, source } = props;
  const { onLoadingStatusChange } = useAvatarContext();

  const sourceKey = React.useMemo(() => getSourceKey(source), [source]);

  const onLoadingStatusChangeRef = React.useRef(onLoadingStatusChange);
  const onLoadingStatusChangePropRef = React.useRef(onLoadingStatusChangeProp);

  React.useLayoutEffect(() => {
    onLoadingStatusChangeRef.current = onLoadingStatusChange;
    onLoadingStatusChangePropRef.current = onLoadingStatusChangeProp;
  });

  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLoadTimeout = React.useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleLoadingStatusChange = React.useCallback(
    (status: ImageLoadingStatus) => {
      onLoadingStatusChangeRef.current(status);
      onLoadingStatusChangePropRef.current?.(status);
    },
    [],
  );

  React.useEffect(() => {
    if (!sourceKey) {
      handleLoadingStatusChange('error');
    } else {
      handleLoadingStatusChange('loading');
    }
    return () => clearLoadTimeout();
  }, [sourceKey, handleLoadingStatusChange, clearLoadTimeout]);

  const handleLoadStart = React.useCallback(() => {
    handleLoadingStatusChange('loading');
    clearLoadTimeout();
    timeoutRef.current = setTimeout(() => {
      handleLoadingStatusChange('error');
    }, 10000);
    onLoadStart?.();
  }, [clearLoadTimeout, handleLoadingStatusChange, onLoadStart]);

  const handleLoad = React.useCallback(
    (e: OnLoadEvent) => {
      clearLoadTimeout();
      handleLoadingStatusChange('loaded');
      onLoad?.(e);
    },
    [clearLoadTimeout, handleLoadingStatusChange, onLoad],
  );

  const handleError = React.useCallback(
    (e: OnErrorEvent) => {
      clearLoadTimeout();
      handleLoadingStatusChange('error');
      onError?.(e);
    },
    [clearLoadTimeout, handleLoadingStatusChange, onError],
  );

  return { handleError, handleLoad, handleLoadStart };
};
