import * as React from 'react';
import type { AvatarImageProps, ImageLoadingStatus } from './types';

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

export const useAvatarImageLoading = ({
  source,
  onLoadingStatusChange,
  onLoadingStatusChangeProp,
}: {
  source: AvatarImageProps['source'];
  onLoadingStatusChange: (status: ImageLoadingStatus) => void;
  onLoadingStatusChangeProp?: (status: ImageLoadingStatus) => void;
}) => {
  const sourceKey = React.useMemo(() => getSourceKey(source), [source]);
  const sourceKeyRef = React.useRef(sourceKey);
  const lastStableStatusRef = React.useRef<ImageLoadingStatus>('idle');

  if (sourceKeyRef.current !== sourceKey) {
    sourceKeyRef.current = sourceKey;
    lastStableStatusRef.current = 'idle';
  }

  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLoadTimeout = React.useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current as ReturnType<typeof setTimeout>);
      timeoutRef.current = null;
    }
  }, []);

  const handleLoadingStatusChange = React.useCallback(
    (status: ImageLoadingStatus, eventSourceKey: string) => {
      const isForCurrentSource = sourceKeyRef.current === eventSourceKey;

      if (!isForCurrentSource) {
        return false;
      }

      if (
        status === 'loading' &&
        (lastStableStatusRef.current === 'loaded' ||
          lastStableStatusRef.current === 'error')
      ) {
        return false;
      }

      lastStableStatusRef.current = status;
      onLoadingStatusChange(status);
      onLoadingStatusChangeProp?.(status);
      return true;
    },
    [onLoadingStatusChange, onLoadingStatusChangeProp],
  );

  React.useEffect(() => {
    if (!source) {
      handleLoadingStatusChange('error', sourceKey);
    }

    return () => {
      clearLoadTimeout();
    };
  }, [source, sourceKey, handleLoadingStatusChange, clearLoadTimeout]);

  return {
    clearLoadTimeout,
    handleLoadingStatusChange,
    sourceKey,
    timeoutRef,
  };
};
