import { ProgressIndicator } from './indicator';
import { ProgressLabel } from './label';
import { ProgressRoot } from './progress';
import { ProgressTrack } from './track';
import { ProgressValue } from './value';

export const Progress = {
  Indicator: ProgressIndicator,
  Label: ProgressLabel,
  Root: ProgressRoot,
  Track: ProgressTrack,
  Value: ProgressValue,
};

export {
  ProgressIndicator,
  ProgressLabel,
  ProgressRoot,
  ProgressTrack,
  ProgressValue,
};
export * from './types';
export * from './use-progress';
