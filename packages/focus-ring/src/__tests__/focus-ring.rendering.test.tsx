import * as React from 'react';
import { View } from 'react-native';
import { render } from '@testing-library/react-native';
import { FocusRing } from '../focus-ring';

describe('FocusRing - Rendering', () => {
  it('renders children correctly', () => {
    const { getByTestId } = render(
      <FocusRing>
        <View testID='child' />
      </FocusRing>,
    );
    expect(getByTestId('child')).toBeDefined();
  });

  it('provides initial focus state to render function', () => {
    const { getByTestId } = render(
      <FocusRing>
        {({ focused, focusVisible }) => (
          <View
            testID='child'
            accessibilityLabel={`focused: ${focused}, visible: ${focusVisible}`}
            accessibilityHint='Focus state display'
          />
        )}
      </FocusRing>,
    );
    const child = getByTestId('child');
    expect(child.props.accessibilityLabel).toBe(
      'focused: false, visible: false',
    );
  });

  it('forces focusVisible when the prop is true', () => {
    const { getByTestId } = render(
      <FocusRing focusVisible>
        {({ focusVisible }) => (
          <View
            testID='child'
            accessibilityLabel={`visible: ${focusVisible}`}
            accessibilityHint='Focus state display'
          />
        )}
      </FocusRing>,
    );
    const child = getByTestId('child');
    expect(child.props.accessibilityLabel).toBe('visible: true');
  });
});
