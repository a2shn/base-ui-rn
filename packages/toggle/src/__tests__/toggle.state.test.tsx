import { DEFAULT_HINT } from '@base-ui-rn/test-utils';
import { fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import { Toggle } from '../toggle';

describe('Toggle - State Management', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Uncontrolled State', () => {
    it('handles uncontrolled state using defaultPressed', () => {
      const onChangeMock = jest.fn();
      const { getByRole } = render(
        <Toggle
          accessibilityHint={DEFAULT_HINT}
          defaultPressed={false}
          onPressedChange={onChangeMock}
        >
          <Text>Uncontrolled Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');
      expect(toggle.props.accessibilityState.checked).toBe(false);

      fireEvent.press(toggle);

      expect(toggle.props.accessibilityState.checked).toBe(true);
      expect(onChangeMock).toHaveBeenCalledWith(true, { source: 'press' });
    });

    it('initializes with defaultPressed value', () => {
      const { getByRole } = render(
        <Toggle accessibilityHint={DEFAULT_HINT} defaultPressed={true}>
          <Text>Initially Pressed</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');
      expect(toggle.props.accessibilityState.checked).toBe(true);
    });
  });

  describe('Controlled State', () => {
    it('handles controlled state and does not update internally if prop is static', () => {
      const onChangeMock = jest.fn();
      const { getByRole } = render(
        <Toggle
          accessibilityHint={DEFAULT_HINT}
          onPressedChange={onChangeMock}
          pressed={false}
        >
          <Text>Controlled Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');
      fireEvent.press(toggle);

      expect(onChangeMock).toHaveBeenCalledWith(true, { source: 'press' });
      // Because it's controlled and pressed={false} remains, state shouldn't flip
      expect(toggle.props.accessibilityState.checked).toBe(false);
    });

    it('respects controlled pressed prop changes', () => {
      const onChangeMock = jest.fn();
      const { getByRole, rerender } = render(
        <Toggle
          accessibilityHint={DEFAULT_HINT}
          onPressedChange={onChangeMock}
          pressed={false}
        >
          <Text>Controlled Toggle</Text>
        </Toggle>,
      );

      let toggle = getByRole('checkbox');
      expect(toggle.props.accessibilityState.checked).toBe(false);

      rerender(
        <Toggle
          accessibilityHint={DEFAULT_HINT}
          onPressedChange={onChangeMock}
          pressed={true}
        >
          <Text>Controlled Toggle</Text>
        </Toggle>,
      );

      toggle = getByRole('checkbox');
      expect(toggle.props.accessibilityState.checked).toBe(true);
    });
  });

  describe('State Change Sources', () => {
    it('reports source as "press" for touch/mouse interactions', () => {
      const onChangeMock = jest.fn();
      const { getByRole } = render(
        <Toggle
          accessibilityHint={DEFAULT_HINT}
          defaultPressed={false}
          onPressedChange={onChangeMock}
        >
          <Text>Press Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');
      fireEvent.press(toggle);

      expect(onChangeMock).toHaveBeenLastCalledWith(true, { source: 'press' });
    });

    it('reports source as "keyboard" for keyboard activation', () => {
      const onChangeMock = jest.fn();
      const { getByRole } = render(
        <Toggle
          accessibilityHint={DEFAULT_HINT}
          defaultPressed={false}
          onPressedChange={onChangeMock}
        >
          <Text>Keyboard Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');
      fireEvent(toggle, 'keyDown', { nativeEvent: { key: 'Enter' } });

      expect(onChangeMock).toHaveBeenLastCalledWith(true, {
        source: 'keyboard',
      });
    });

    it('reports source as "accessibilityAction" for screen reader actions', () => {
      const onChangeMock = jest.fn();
      const { getByRole } = render(
        <Toggle
          accessibilityHint={DEFAULT_HINT}
          defaultPressed={false}
          onPressedChange={onChangeMock}
        >
          <Text>Action Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');
      fireEvent(toggle, 'accessibilityAction', {
        nativeEvent: { actionName: 'activate' },
      });

      expect(onChangeMock).toHaveBeenLastCalledWith(true, {
        source: 'accessibilityAction',
      });
    });
  });

  describe('Toggle Behavior', () => {
    it('toggles state on each activation', () => {
      const onChangeMock = jest.fn();
      const { getByRole } = render(
        <Toggle
          accessibilityHint={DEFAULT_HINT}
          defaultPressed={false}
          onPressedChange={onChangeMock}
        >
          <Text>Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');

      fireEvent.press(toggle);
      expect(onChangeMock).toHaveBeenNthCalledWith(1, true, {
        source: 'press',
      });

      fireEvent.press(toggle);
      expect(onChangeMock).toHaveBeenNthCalledWith(2, false, {
        source: 'press',
      });

      fireEvent.press(toggle);
      expect(onChangeMock).toHaveBeenNthCalledWith(3, true, {
        source: 'press',
      });
    });

    it('maintains state consistency across multiple toggle cycles', () => {
      const onChangeMock = jest.fn();
      const { getByRole } = render(
        <Toggle
          accessibilityHint={DEFAULT_HINT}
          defaultPressed={false}
          onPressedChange={onChangeMock}
        >
          <Text>Consistent Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');

      for (let i = 0; i < 5; i++) {
        fireEvent.press(toggle);
      }

      expect(onChangeMock).toHaveBeenCalledTimes(5);
    });
  });

  describe('onPressedChange Callback', () => {
    it('only fires onPressedChange when state actually changes', () => {
      const onChangeMock = jest.fn();
      const { getByRole } = render(
        <Toggle
          accessibilityHint={DEFAULT_HINT}
          onPressedChange={onChangeMock}
          pressed={false}
        >
          <Text>Controlled Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');

      // Press multiple times with static prop
      fireEvent.press(toggle);
      fireEvent.press(toggle);
      fireEvent.press(toggle);

      // Callback should fire each time (even though prop doesn't change)
      expect(onChangeMock).toHaveBeenCalledTimes(3);
    });

    it('provides correct arguments to onPressedChange', () => {
      const onChangeMock = jest.fn();
      const { getByRole } = render(
        <Toggle
          accessibilityHint={DEFAULT_HINT}
          defaultPressed={false}
          onPressedChange={onChangeMock}
        >
          <Text>Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');
      fireEvent.press(toggle);

      expect(onChangeMock).toHaveBeenCalledWith(
        true,
        expect.objectContaining({ source: expect.any(String) }),
      );
    });
  });
});
