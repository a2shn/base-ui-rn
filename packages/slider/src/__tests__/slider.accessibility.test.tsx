import * as React from 'react';
import { render } from '@testing-library/react-native';
import { testAccessibility } from '@base-ui-rn/test-utils';
import { Slider } from '../index';

describe('Slider accessibility', () => {
  it('applies adjustable semantics and disabled state', () => {
    const { getByLabelText } = render(
      <Slider.Root disabled>
        <Slider.Thumb aria-label='Volume thumb' />
      </Slider.Root>,
    );

    const root = getByLabelText('Volume thumb');
    testAccessibility(root, {
      disabled: true,
    });
  });
});
