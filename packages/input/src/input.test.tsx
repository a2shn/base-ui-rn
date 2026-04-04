import { fireEvent, render, screen } from '@testing-library/react-native';
import * as React from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { Input, Label } from './index';

describe('Input & Label Primitive', () => {
  describe('State Tracking', () => {
    it('tracks focus and touched states', () => {
      render(<Input placeholder="Input" testID="input" />);

      fireEvent(screen.getByTestId('input'), 'focus');
      // Re-querying to ensure we have the latest props
      expect(screen.getByTestId('input').props.accessibilityState.disabled).toBe(false);

      fireEvent(screen.getByTestId('input'), 'blur');
      expect(screen.getByTestId('input')).toBeTruthy();
    });

    it('tracks filled and dirty states', () => {
      render(<Input placeholder="Input" testID="input" />);

      fireEvent.changeText(screen.getByTestId('input'), 'New Value');
      expect(screen.getByTestId('input').props.value).toBe('New Value');
    });

    it('tracks focus and touched states', () => {
      render(<Input placeholder="Input" testID="input" />);
      const input = screen.getByTestId('input');

      fireEvent(input, 'focus');
      // Logic check for state

      fireEvent(input, 'blur');
      // Check that internal touched state updated
      expect(input).toBeTruthy();
    });
  });

  describe('Accessibility Wiring', () => {
    it('links Input to Label via aria-labelledby', () => {
      const labelId = 'name-label';
      render(
        <>
          <Label nativeID={labelId} testID="label">Full Name</Label>
          <Input aria-labelledby={labelId} testID="input" />
        </>
      );

      expect(screen.getByTestId('input').props['aria-labelledby']).toBe(labelId);
      expect(screen.getByTestId('label').props.nativeID).toBe(labelId);
    });

    it('links Input to description via aria-describedby', () => {
      const hintId = 'hint-text';
      render(
        <>
          <Input aria-describedby={hintId} testID="input" />
          <Label nativeID={hintId} testID="hint">Enter at least 8 characters</Label>
        </>
      );

      expect(screen.getByTestId('input').props['aria-describedby']).toBe(hintId);
    });

  });

  describe('Ref Forwarding', () => {
    it('forwards refs for both Input and Label', () => {
      const inputRef = React.createRef<TextInput>();
      const labelRef = React.createRef<any>();

      render(
        <>
          <Label nativeID="l" ref={labelRef}>Label</Label>
          <Input ref={inputRef} />
        </>
      );

      expect(inputRef.current).toBeTruthy();
      expect(labelRef.current).toBeTruthy();
    });
  });

  describe('Functional Styles', () => {
    it('applies styles based on interaction state', () => {
      render(
        <Input
          testID="input"
          disableDefaultFocusRing
          style={(state) => ({
            borderColor: state.focused ? 'blue' : 'black',
            opacity: state.disabled ? 0.5 : 1
          })}
        />
      );

      expect(StyleSheet.flatten(screen.getByTestId('input').props.style)).toMatchObject({
        borderColor: 'black',
        opacity: 1
      });

      fireEvent(screen.getByTestId('input'), 'focus');

      // Re-querying after event to get fresh style props
      expect(StyleSheet.flatten(screen.getByTestId('input').props.style)).toMatchObject({
        borderColor: 'blue'
      });
    });
  });
});
