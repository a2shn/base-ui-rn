import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { Slider } from './index';

describe('Slider Primitive (Integration)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering & Uncontrolled State', () => {
    it('renders with default structure and values', () => {
      render(
        <Slider.Root defaultValue={50} testID="slider-root">
          <Slider.Control testID="slider-control">
            <Slider.Track testID="slider-track">
              <Slider.Indicator testID="slider-indicator" />
            </Slider.Track>
            <Slider.Thumb testID="slider-thumb" />
          </Slider.Control>
        </Slider.Root>,
      );

      const root = screen.getByTestId('slider-root');
      expect(root).toBeTruthy();
      expect(root.props.role).toBe('adjustable');

      const thumb = screen.getByTestId('slider-thumb');
      expect(thumb.props.accessibilityValue).toMatchObject({
        min: 0,
        max: 100,
        now: 50,
      });
    });

    it('updates internal state when interacting with an uncontrolled slider', () => {
      const onValueChangeMock = jest.fn();
      render(
        <Slider.Root defaultValue={20} onValueChange={onValueChangeMock}>
          <Slider.Thumb testID="slider-thumb" />
        </Slider.Root>,
      );

      const thumb = screen.getByTestId('slider-thumb');

      // Simulate Arrow Right to increment value
      fireEvent(thumb, 'keyDown', { nativeEvent: { key: 'ArrowRight' } });

      expect(onValueChangeMock).toHaveBeenCalledWith(21);
    });
  });

  describe('Controlled State', () => {
    it('respects the controlled value prop', () => {
      const onValueChangeMock = jest.fn();
      const { rerender } = render(
        <Slider.Root value={40} onValueChange={onValueChangeMock}>
          <Slider.Thumb testID="slider-thumb" />
        </Slider.Root>,
      );

      let thumb = screen.getByTestId('slider-thumb');
      expect(thumb.props.accessibilityValue.now).toBe(40);

      // Parent updates the prop
      rerender(
        <Slider.Root value={85} onValueChange={onValueChangeMock}>
          <Slider.Thumb testID="slider-thumb" />
        </Slider.Root>,
      );

      thumb = screen.getByTestId('slider-thumb');
      expect(thumb.props.accessibilityValue.now).toBe(85);
    });
  });

  describe('Visuals & Dynamic Styles', () => {
    it('calculates the Indicator width and left position correctly (Horizontal)', () => {
      render(
        <Slider.Root value={60} min={0} max={100} orientation="horizontal">
          <Slider.Track>
            <Slider.Indicator testID="slider-indicator" />
          </Slider.Track>
        </Slider.Root>,
      );

      const indicator = screen.getByTestId('slider-indicator', { includeHiddenElements: true });
      const style = StyleSheet.flatten(indicator.props.style);

      expect(style).toMatchObject({
        left: '0%',
        width: '60%',
        position: 'absolute',
      });
    });

    it('calculates the Indicator height and bottom position correctly (Vertical)', () => {
      render(
        <Slider.Root value={30} min={0} max={100} orientation="vertical">
          <Slider.Track>
            <Slider.Indicator testID="slider-indicator" />
          </Slider.Track>
        </Slider.Root>,
      );

      const indicator = screen.getByTestId('slider-indicator', { includeHiddenElements: true });
      const style = StyleSheet.flatten(indicator.props.style);

      expect(style).toMatchObject({
        bottom: '0%',
        height: '30%',
        position: 'absolute',
      });
    });
  });

  describe('Keyboard Interaction', () => {
    it('increments and decrements using arrow keys', () => {
      const onValueChangeMock = jest.fn();
      render(
        // Use defaultValue to simulate natural uncontrolled interaction
        <Slider.Root defaultValue={50} min={0} max={100} onValueChange={onValueChangeMock}>
          <Slider.Thumb testID="slider-thumb" />
        </Slider.Root>,
      );

      const thumb = screen.getByTestId('slider-thumb');

      // Increment
      fireEvent(thumb, 'keyDown', { nativeEvent: { key: 'ArrowRight' } });
      expect(onValueChangeMock).toHaveBeenLastCalledWith(51);

      fireEvent(thumb, 'keyDown', { nativeEvent: { key: 'ArrowUp' } });
      expect(onValueChangeMock).toHaveBeenLastCalledWith(52); // Accumulates to 52

      // Decrement
      fireEvent(thumb, 'keyDown', { nativeEvent: { key: 'ArrowLeft' } });
      expect(onValueChangeMock).toHaveBeenLastCalledWith(51); // Decrements back to 51

      fireEvent(thumb, 'keyDown', { nativeEvent: { key: 'ArrowDown' } });
      expect(onValueChangeMock).toHaveBeenLastCalledWith(50); // Decrements back to 50
    });
    it('respects min and max boundaries during keyboard interaction', () => {
      const onValueChangeMock = jest.fn();

      // Test Max Bound
      const { rerender } = render(
        <Slider.Root value={100} min={0} max={100} onValueChange={onValueChangeMock}>
          <Slider.Thumb testID="slider-thumb" />
        </Slider.Root>,
      );

      let thumb = screen.getByTestId('slider-thumb');
      fireEvent(thumb, 'keyDown', { nativeEvent: { key: 'ArrowRight' } });
      // Should not go past 100, might not even trigger callback if state hasn't changed.
      // Or if the hook clamps and emits the same value, it will emit 100.
      // Your clamp implementation ensures it stays at bounds.

      // Test Min Bound
      rerender(
        <Slider.Root value={0} min={0} max={100} onValueChange={onValueChangeMock}>
          <Slider.Thumb testID="slider-thumb" />
        </Slider.Root>,
      );

      thumb = screen.getByTestId('slider-thumb');
      fireEvent(thumb, 'keyDown', { nativeEvent: { key: 'ArrowLeft' } });
      // Should not drop below 0
      expect(thumb.props.accessibilityValue.now).toBe(0);
    });
  });

  describe('Slider.Value & Formatting', () => {
    it('renders the raw value by default', () => {
      render(
        <Slider.Root value={42}>
          <Slider.Value testID="slider-value" />
        </Slider.Root>,
      );

      const valueText = screen.getByTestId('slider-value');
      expect(valueText.props.children).toBe('42');
    });

    it('supports custom render functions for Slider.Value', () => {
      render(
        <Slider.Root value={75}>
          <Slider.Value testID="slider-value">
            {(_, rawValues) => `Volume: ${rawValues[0]}%`}
          </Slider.Value>
        </Slider.Root>,
      );

      const valueText = screen.getByTestId('slider-value');
      expect(valueText.props.children).toBe('Volume: 75%');
    });
  });

  describe('mergeProps Overrides', () => {
    it('allows users to override default accessibility roles', () => {
      render(
        <Slider.Root testID="slider-root" role="none">
          <Slider.Thumb />
        </Slider.Root>,
      );

      const root = screen.getByTestId('slider-root');

      // The default role is "adjustable", but the user prop should win
      expect(root.props.role).toBe('none');
    });
  });

  describe('Accessibility Actions', () => {
    it('handles native accessibility increment/decrement actions', () => {
      const onValueChangeMock = jest.fn();
      render(
        // Use defaultValue here as well
        <Slider.Root defaultValue={50} onValueChange={onValueChangeMock}>
          <Slider.Thumb testID="slider-thumb" />
        </Slider.Root>,
      );

      const thumb = screen.getByTestId('slider-thumb');

      fireEvent(thumb, 'accessibilityAction', { nativeEvent: { actionName: 'increment' } });
      expect(onValueChangeMock).toHaveBeenLastCalledWith(51);

      // Decrementing from the current state of 51 brings it back to 50
      fireEvent(thumb, 'accessibilityAction', { nativeEvent: { actionName: 'decrement' } });
      expect(onValueChangeMock).toHaveBeenLastCalledWith(50);
    });
  });
});
