import { ProgressRoot } from './progress';
import { ProgressLabel } from './label';
import { ProgressTrack } from './track';
import { ProgressIndicator } from './indicator';
import { ProgressValue } from './value';

export const Progress = {
  Root: ProgressRoot,
  Label: ProgressLabel,
  Track: ProgressTrack,
  Indicator: ProgressIndicator,
  Value: ProgressValue,
};

export {
  ProgressRoot,
  ProgressLabel,
  ProgressTrack,
  ProgressIndicator,
  ProgressValue,
};
export * from './types';
export * from './use-progress';
