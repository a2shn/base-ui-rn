import * as React from 'react';
import { Pressable, View } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { useFocus } from '../use-focus';

describe('useFocus: Focusing', () => {
  it('tracks focused state', () => {
    function TestComponent() {
      const {
        focused,
        focusVisible,
        onFocus: handleFocus,
        onBlur: handleBlur,
      } = useFocus({ focusVisible: false });

      return (
        <View>
          <Pressable
            accessibilityRole='button'
            testID='focusable'
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            Focusable
          </Pressable>
          <View testID='state'>
            {JSON.stringify({ focused, focusVisible })}
          </View>
        </View>
      );
    }

    const { getByTestId } = render(<TestComponent />);

    expect(getByTestId('state').children).toContain(
      JSON.stringify({ focused: false, focusVisible: false }),
    );

    fireEvent(getByTestId('focusable'), 'focus');

    expect(getByTestId('state').children).toContain(
      JSON.stringify({ focused: true, focusVisible: true }),
    );

    fireEvent(getByTestId('focusable'), 'blur');

    expect(getByTestId('state').children).toContain(
      JSON.stringify({ focused: false, focusVisible: false }),
    );
  });

  it('respects forceFocusVisible prop', () => {
    function TestComponent() {
      const { focused, focusVisible } = useFocus({ focusVisible: true });

      return (
        <View testID='state'>{JSON.stringify({ focused, focusVisible })}</View>
      );
    }

    const { getByTestId } = render(<TestComponent />);

    expect(getByTestId('state').children).toContain(
      JSON.stringify({ focused: false, focusVisible: true }),
    );
  });

  it('merges forceFocusVisible with actual focusVisible', () => {
    function TestComponent() {
      const {
        focused,
        focusVisible,
        onFocus: handleFocus,
        onBlur: handleBlur,
      } = useFocus({ focusVisible: true });

      return (
        <View>
          <Pressable
            accessibilityRole='button'
            testID='focusable'
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            Focusable
          </Pressable>
          <View testID='state'>
            {JSON.stringify({ focused, focusVisible })}
          </View>
        </View>
      );
    }

    const { getByTestId } = render(<TestComponent />);

    expect(getByTestId('state').children).toContain(
      JSON.stringify({ focused: false, focusVisible: true }),
    );

    fireEvent(getByTestId('focusable'), 'focus');

    expect(getByTestId('state').children).toContain(
      JSON.stringify({ focused: true, focusVisible: true }),
    );

    fireEvent(getByTestId('focusable'), 'blur');

    expect(getByTestId('state').children).toContain(
      JSON.stringify({ focused: false, focusVisible: true }),
    );
  });
});

describe('useFocus: Return Value', () => {
  it('returns correct types', () => {
    function TestComponent() {
      const { focused, focusVisible, onFocus, onBlur } = useFocus({
        focusVisible: false,
      });

      expect(typeof focused).toBe('boolean');
      expect(typeof focusVisible).toBe('boolean');
      expect(typeof onFocus).toBe('function');
      expect(typeof onBlur).toBe('function');

      return null;
    }

    render(<TestComponent />);
  });
});
