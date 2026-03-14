import { SliderRoot } from './root';
import { SliderLabel } from './label';
import { SliderValue } from './value';
import { SliderControl } from './control';
import { SliderTrack } from './track';
import { SliderIndicator } from './indicator';
import { SliderThumb } from './thumb';

export const Slider = {
  Root: SliderRoot,
  Label: SliderLabel,
  Value: SliderValue,
  Control: SliderControl,
  Track: SliderTrack,
  Indicator: SliderIndicator,
  Thumb: SliderThumb,
};

export {
  SliderRoot,
  SliderLabel,
  SliderValue,
  SliderControl,
  SliderTrack,
  SliderIndicator,
  SliderThumb,
};

export * from './types';
