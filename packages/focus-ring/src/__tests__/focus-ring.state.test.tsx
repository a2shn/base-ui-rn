import * as React from 'react';
import { View } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { FocusRing } from '../focus-ring';

describe('FocusRing - State', () => {
  it('updates focus state on focus and blur', () => {
    const { getByTestId } = render(
      <FocusRing>
        {({ focused }) => (
          <View
            testID='child'
            accessibilityLabel={`focused: ${focused}`}
            accessibilityHint='Focus state display'
          />
        )}
      </FocusRing>,
    );
    const child = getByTestId('child');

    fireEvent(child, 'focus');
    expect(child.props.accessibilityLabel).toBe('focused: true');

    fireEvent(child, 'blur');
    expect(child.props.accessibilityLabel).toBe('focused: false');
  });

  it('merges existing onFocus and onBlur handlers', () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    const { getByTestId } = render(
      <FocusRing>
        <View testID='child' onFocus={onFocus} onBlur={onBlur} />
      </FocusRing>,
    );
    const child = getByTestId('child');

    fireEvent(child, 'focus');
    expect(onFocus).toHaveBeenCalled();

    fireEvent(child, 'blur');
    expect(onBlur).toHaveBeenCalled();
  });
});
