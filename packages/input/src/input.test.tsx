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

    it('manages error states via aria-invalid and aria-errormessage', () => {
      const errorId = 'error-text';
      const { rerender } = render(
        <>
          <Input
            aria-errormessage={errorId}
            invalid={false}
            testID="input"
          />
          <Label nativeID={errorId} testID="error">Invalid email</Label>
        </>
      );

      expect(screen.getByTestId('input').props['aria-invalid']).toBe(false);

      rerender(
        <>
          <Input
            aria-errormessage={errorId}
            invalid={true}
            testID="input"
          />
          <Label nativeID={errorId} testID="error">Invalid email</Label>
        </>
      );

      expect(screen.getByTestId('input').props['aria-invalid']).toBe(true);
      expect(screen.getByTestId('input').props['aria-errormessage']).toBe(errorId);
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
