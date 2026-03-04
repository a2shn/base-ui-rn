import * as React from 'react';
import { View } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { FocusRing } from '../focus-ring';

describe('FocusRing', () => {
  it('renders children correctly', () => {
    const { getByTestId } = render(
      <FocusRing>
        <View testID="child" />
      </FocusRing>
    );
    expect(getByTestId('child')).toBeDefined();
  });

  it('provides initial focus state to render function', () => {
    const { getByTestId } = render(
      <FocusRing>
        {({ focused, focusVisible }) => (
          <View testID="child" accessibilityLabel={`focused: ${focused}, visible: ${focusVisible}`} />
        )}
      </FocusRing>
    );
    const child = getByTestId('child');
    expect(child.props.accessibilityLabel).toBe('focused: false, visible: false');
  });

  it('updates focus state on focus and blur', () => {
    const { getByTestId } = render(
      <FocusRing>
        {({ focused }) => (
          <View testID="child" accessibilityLabel={`focused: ${focused}`} />
        )}
      </FocusRing>
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
        <View testID="child" onFocus={onFocus} onBlur={onBlur} />
      </FocusRing>
    );
    const child = getByTestId('child');
    
    fireEvent(child, 'focus');
    expect(onFocus).toHaveBeenCalled();
    
    fireEvent(child, 'blur');
    expect(onBlur).toHaveBeenCalled();
  });

  it('forces focusVisible when the prop is true', () => {
    const { getByTestId } = render(
      <FocusRing focusVisible>
        {({ focusVisible }) => (
          <View testID="child" accessibilityLabel={`visible: ${focusVisible}`} />
        )}
      </FocusRing>
    );
    const child = getByTestId('child');
    expect(child.props.accessibilityLabel).toBe('visible: true');
  });
});
