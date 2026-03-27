import { fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';

import { useFocusRing } from '../use-focus';

describe('useFocusRing: Focusing', () => {
  it('tracks focused state', () => {
    function TestComponent() {
      const {
        focused,
        onBlur: handleBlur,
        onFocus: handleFocus,
      } = useFocusRing({
        disabled: false,
        disableDefaultFocusRing: false,
        focusableWhenDisabled: false,
      });

      return (
        <View>
          <Pressable
            accessibilityRole='button'
            onBlur={handleBlur}
            onFocus={handleFocus}
            testID='focusable'
          >
            Focusable
          </Pressable>
          <View testID='state'>{JSON.stringify({ focused })}</View>
        </View>
      );
    }

    const { getByTestId } = render(<TestComponent />);

    expect(getByTestId('state').children).toContain(
      JSON.stringify({ focused: false }),
    );

    fireEvent(getByTestId('focusable'), 'focus');

    expect(getByTestId('state').children).toContain(
      JSON.stringify({ focused: true }),
    );

    fireEvent(getByTestId('focusable'), 'blur');

    expect(getByTestId('state').children).toContain(
      JSON.stringify({ focused: false }),
    );
  });

  it('respects disableDefaultFocusRing prop', () => {
    function TestComponent() {
      const { focusRingStyle, onFocus } = useFocusRing({
        disabled: false,
        disableDefaultFocusRing: true,
        focusableWhenDisabled: false,
      });

      React.useEffect(() => {
        onFocus();
      }, [onFocus]);

      return <View testID='ring'>{JSON.stringify({ focusRingStyle })}</View>;
    }

    const { getByTestId } = render(<TestComponent />);

    expect(getByTestId('ring').children).toContain(
      JSON.stringify({ focusRingStyle: null }),
    );
  });
});

describe('useFocusRing: Return Value', () => {
  it('returns correct types', () => {
    function TestComponent() {
      const { focused, focusRingStyle, onBlur, onFocus } = useFocusRing({
        disabled: false,
        disableDefaultFocusRing: false,
        focusableWhenDisabled: false,
      });

      expect(typeof focused).toBe('boolean');
      expect(typeof onFocus).toBe('function');
      expect(typeof onBlur).toBe('function');
      // focusRingStyle is null until focused
      expect(focusRingStyle).toBeNull();

      return null;
    }

    render(<TestComponent />);
  });
});
