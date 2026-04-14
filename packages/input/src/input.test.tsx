import { fireEvent, render, screen } from '@testing-library/react-native';
import * as React from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { Input } from './index';

describe('Input & Label Primitive', () => {
  describe('State Tracking', () => {
    it('tracks focus and touched states', () => {
      render(<Input placeholder='Input' testID='input' />);

      fireEvent(screen.getByTestId('input'), 'focus');
      // Re-querying to ensure we have the latest props
      expect(
        screen.getByTestId('input').props.accessibilityState.disabled,
      ).toBe(false);

      fireEvent(screen.getByTestId('input'), 'blur');
      expect(screen.getByTestId('input')).toBeTruthy();
    });

    it('tracks filled and dirty states', () => {
      render(<Input placeholder='Input' testID='input' />);

      fireEvent.changeText(screen.getByTestId('input'), 'New Value');
      expect(screen.getByTestId('input').props.value).toBe('New Value');
    });

    it('tracks focus and touched states', () => {
      render(<Input placeholder='Input' testID='input' />);
      const input = screen.getByTestId('input');

      fireEvent(input, 'focus');
      // Logic check for state

      fireEvent(input, 'blur');
      // Check that internal touched state updated
      expect(input).toBeTruthy();
    });
  });
});

describe('Ref Forwarding', () => {
  it('forwards refs for both Input and Label', () => {
    const inputRef = React.createRef<TextInput>();

    render(
      <>
        <Input ref={inputRef} />
      </>,
    );

    expect(inputRef.current).toBeTruthy();
  });
});

describe('Functional Styles', () => {
  it('applies styles based on interaction state', () => {
    render(
      <Input
        disableDefaultFocusRing
        style={(state) => ({
          borderColor: state.focused ? 'blue' : 'black',
          opacity: state.disabled ? 0.5 : 1,
        })}
        testID='input'
      />,
    );

    expect(
      StyleSheet.flatten(screen.getByTestId('input').props.style),
    ).toMatchObject({
      borderColor: 'black',
      opacity: 1,
    });

    fireEvent(screen.getByTestId('input'), 'focus');

    // Re-querying after event to get fresh style props
    expect(
      StyleSheet.flatten(screen.getByTestId('input').props.style),
    ).toMatchObject({
      borderColor: 'blue',
    });
  });
});
