import * as React from 'react';
import type { ImageLoadingStatus } from './types';

export interface AvatarContextValue {
  loadingStatus: ImageLoadingStatus;
  onLoadingStatusChange: (status: ImageLoadingStatus) => void;
}

export const AvatarContext = React.createContext<AvatarContextValue | null>(null);

export function useAvatarContext() {
  const context = React.useContext(AvatarContext);
  if (!context) {
    throw new Error('Avatar components must be used within an Avatar.Root');
  }
  return context;
}
