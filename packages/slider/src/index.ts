import { SliderControl } from './control';
import { SliderIndicator } from './indicator';
import { SliderLabel } from './label';
import { SliderRoot } from './slider';
import { SliderThumb } from './thumb';
import { SliderTrack } from './track';
import { SliderValue } from './value';

export const Slider = {
  Control: SliderControl,
  Indicator: SliderIndicator,
  Label: SliderLabel,
  Root: SliderRoot,
  Thumb: SliderThumb,
  Track: SliderTrack,
  Value: SliderValue,
};

export {
  SliderControl,
  SliderIndicator,
  SliderLabel,
  SliderRoot,
  SliderThumb,
  SliderTrack,
  SliderValue,
};

export type {
  SliderLabelProps,
  SliderPartProps,
  SliderRootProps,
  SliderState,
  SliderThumbProps,
  SliderThumbState,
  SliderValueProps,
} from './types';
