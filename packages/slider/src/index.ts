import { SliderRoot } from './slider';
import { SliderControl } from './control';
import { SliderTrack } from './track';
import { SliderIndicator } from './indicator';
import { SliderThumb } from './thumb';
import { SliderLabel } from './label';
import { SliderValue } from './value';

export const Slider = {
  Root: SliderRoot,
  Control: SliderControl,
  Track: SliderTrack,
  Indicator: SliderIndicator,
  Thumb: SliderThumb,
  Label: SliderLabel,
  Value: SliderValue,
};

export {
  SliderRoot,
  SliderControl,
  SliderTrack,
  SliderIndicator,
  SliderThumb,
  SliderLabel,
  SliderValue,
};

export type {
  SliderRootProps,
  SliderPartProps,
  SliderThumbProps,
  SliderLabelProps,
  SliderValueProps,
  SliderState,
  SliderThumbState,
} from './types';
