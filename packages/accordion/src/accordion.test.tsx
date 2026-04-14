import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { Text } from 'react-native';

import { Accordion } from './index';

describe('Accordion', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering & Uncontrolled State', () => {
    it('renders closed by default', () => {
      render(
        <Accordion.Root>
          <Accordion.Item value='item-1'>
            <Accordion.Trigger>
              <Text>Trigger 1</Text>
            </Accordion.Trigger>
            <Accordion.Panel>
              <Text>Content 1</Text>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>,
      );

      expect(screen.getByText('Trigger 1')).toBeTruthy();
      expect(screen.queryByText('Content 1')).toBeNull();
    });

    it('renders with defaultValue open', () => {
      render(
        <Accordion.Root defaultValue='item-1'>
          <Accordion.Item value='item-1'>
            <Accordion.Trigger>
              <Text>Trigger 1</Text>
            </Accordion.Trigger>
            <Accordion.Panel>
              <Text>Content 1</Text>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>,
      );

      expect(screen.getByText('Content 1')).toBeTruthy();
    });

    it('toggles item on press', () => {
      const onValueChange = jest.fn();
      render(
        <Accordion.Root onValueChange={onValueChange}>
          <Accordion.Item value='item-1'>
            <Accordion.Trigger>
              <Text>Trigger 1</Text>
            </Accordion.Trigger>
            <Accordion.Panel>
              <Text>Content 1</Text>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>,
      );

      const trigger = screen.getByText('Trigger 1');

      fireEvent.press(trigger);
      expect(screen.getByText('Content 1')).toBeTruthy();
      expect(onValueChange).toHaveBeenCalledWith('item-1', expect.any(Object));

      fireEvent.press(trigger);
      expect(screen.queryByText('Content 1')).toBeNull();
      expect(onValueChange).toHaveBeenCalledWith('', expect.any(Object));
    });
  });

  describe('Controlled State', () => {
    it('respects controlled value and does not update internally', () => {
      const onValueChange = jest.fn();
      const { rerender } = render(
        <Accordion.Root onValueChange={onValueChange} value='item-1'>
          <Accordion.Item value='item-1'>
            <Accordion.Trigger>
              <Text>Trigger 1</Text>
            </Accordion.Trigger>
            <Accordion.Panel>
              <Text>Content 1</Text>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value='item-2'>
            <Accordion.Trigger>
              <Text>Trigger 2</Text>
            </Accordion.Trigger>
            <Accordion.Panel>
              <Text>Content 2</Text>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>,
      );

      expect(screen.getByText('Content 1')).toBeTruthy();
      expect(screen.queryByText('Content 2')).toBeNull();

      fireEvent.press(screen.getByText('Trigger 2'));

      expect(onValueChange).toHaveBeenCalledWith('item-2', expect.any(Object));
      // Content 1 remains because the prop 'value' hasn't changed
      expect(screen.getByText('Content 1')).toBeTruthy();

      rerender(
        <Accordion.Root onValueChange={onValueChange} value='item-2'>
          <Accordion.Item value='item-1'>
            <Accordion.Trigger>
              <Text>Trigger 1</Text>
            </Accordion.Trigger>
            <Accordion.Panel>
              <Text>Content 1</Text>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value='item-2'>
            <Accordion.Trigger>
              <Text>Trigger 2</Text>
            </Accordion.Trigger>
            <Accordion.Panel>
              <Text>Content 2</Text>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>,
      );

      expect(screen.queryByText('Content 1')).toBeNull();
      expect(screen.getByText('Content 2')).toBeTruthy();
    });
  });

  describe('Multiple Mode', () => {
    it('allows multiple items to be open', () => {
      const onValueChange = jest.fn();
      render(
        <Accordion.Root multiple onValueChange={onValueChange}>
          <Accordion.Item value='item-1'>
            <Accordion.Trigger>
              <Text>Trigger 1</Text>
            </Accordion.Trigger>
          </Accordion.Item>
          <Accordion.Item value='item-2'>
            <Accordion.Trigger>
              <Text>Trigger 2</Text>
            </Accordion.Trigger>
          </Accordion.Item>
        </Accordion.Root>,
      );

      fireEvent.press(screen.getByText('Trigger 1'));
      fireEvent.press(screen.getByText('Trigger 2'));

      expect(onValueChange).toHaveBeenLastCalledWith(
        ['item-1', 'item-2'],
        expect.any(Object),
      );
    });
  });

  describe('Disabled States', () => {
    it('prevents interaction when disabled is true', () => {
      const onValueChange = jest.fn();
      render(
        <Accordion.Root onValueChange={onValueChange}>
          <Accordion.Item disabled value='item-1'>
            <Accordion.Trigger>
              <Text>Trigger 1</Text>
            </Accordion.Trigger>
            <Accordion.Panel>
              <Text>Content 1</Text>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>,
      );

      fireEvent.press(screen.getByText('Trigger 1'));
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('passes disabled to render props', () => {
      render(
        <Accordion.Root disabled>
          <Accordion.Item value='item-1'>
            <Accordion.Trigger>
              {({ disabled }) => (
                <Text>{disabled ? 'IS_DISABLED' : 'IS_ENABLED'}</Text>
              )}
            </Accordion.Trigger>
          </Accordion.Item>
        </Accordion.Root>,
      );

      expect(screen.getByText('IS_DISABLED')).toBeTruthy();
    });
  });

  describe('Keyboard Interaction', () => {
    it('navigates with arrow keys', () => {
      const onFocusChange = jest.fn();
      render(
        <Accordion.Root onFocusChange={onFocusChange}>
          <Accordion.Item value='item-1'>
            <Accordion.Trigger testID='t1'>
              <Text>T1</Text>
            </Accordion.Trigger>
          </Accordion.Item>
          <Accordion.Item value='item-2'>
            <Accordion.Trigger testID='t2'>
              <Text>T2</Text>
            </Accordion.Trigger>
          </Accordion.Item>
        </Accordion.Root>,
      );

      fireEvent(screen.getByTestId('t1'), 'keyDown', {
        nativeEvent: { key: 'ArrowDown' },
      });
      expect(onFocusChange).toHaveBeenCalledWith('item-2');
    });
  });
  describe('Accessibility', () => {
    it('sets expanded state on trigger correctly', () => {
      render(
        <Accordion.Root defaultValue='item-1'>
          <Accordion.Item value='item-1'>
            <Accordion.Trigger testID='trigger'>
              <Text>Trigger</Text>
            </Accordion.Trigger>
          </Accordion.Item>
        </Accordion.Root>,
      );

      const trigger = screen.getByTestId('trigger');
      expect(trigger.props.accessibilityState).toMatchObject({
        disabled: false,
        expanded: true,
      });
    });

    it('hides closed panels from screen readers if keepMounted is true', () => {
      render(
        <Accordion.Root>
          <Accordion.Item value='item-1'>
            <Accordion.Trigger>
              <Text>Trigger</Text>
            </Accordion.Trigger>
            <Accordion.Panel keepMounted testID='panel'>
              <Text>Hidden Panel Content</Text>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>,
      );

      const panel = screen.getByTestId('panel', {
        includeHiddenElements: true,
      });

      expect(panel.props.accessibilityElementsHidden).toBe(true);
      expect(panel.props.importantForAccessibility).toBe('no-hide-descendants');
    });
  });

  describe('Panel Measurement', () => {
    it('exposes height and width in panel state after layout', async () => {
      render(
        <Accordion.Root defaultValue='item-1'>
          <Accordion.Item value='item-1'>
            <Accordion.Panel testID='panel'>
              {({ panel }) => (
                <Text>{`H:${panel.height} W:${panel.width}`}</Text>
              )}
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>,
      );

      // Since the panel is OPEN, it is visible to standard queries.
      // getByTestId returns the host <View>, so we have access to the merged props.
      const panelView = screen.getByTestId('panel');

      // Directly invoke the onLayout prop on the host View to guarantee it fires
      await waitFor(() => {
        panelView.props.onLayout({
          nativeEvent: { layout: { height: 100, width: 200 } },
        });
      });

      // Verify the component re-rendered with the new dimensions
      await waitFor(() => {
        expect(screen.getByText('H:100 W:200')).toBeTruthy();
      });
    });
  });
});
