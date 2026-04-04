import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleSheet, Text } from 'react-native';

import { Collapsible } from './index';

describe('Collapsible', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering & Uncontrolled State', () => {
    it('renders closed by default', () => {
      render(
        <Collapsible.Root testID="root">
          <Collapsible.Trigger testID="trigger">
            <Text>Toggle</Text>
          </Collapsible.Trigger>
          <Collapsible.Panel testID="panel">
            <Text>Content</Text>
          </Collapsible.Panel>
        </Collapsible.Root>,
      );

      const trigger = screen.getByTestId('trigger');
      expect(trigger.props.accessibilityState).toMatchObject({
        expanded: false,
        disabled: false,
      });

      // Panel should not be rendered when closed by default
      expect(screen.queryByTestId('panel')).toBeNull();
    });

    it('renders open when defaultOpen is true', () => {
      render(
        <Collapsible.Root defaultOpen testID="root">
          <Collapsible.Trigger testID="trigger">
            <Text>Toggle</Text>
          </Collapsible.Trigger>
          <Collapsible.Panel testID="panel">
            <Text>Content</Text>
          </Collapsible.Panel>
        </Collapsible.Root>,
      );

      const trigger = screen.getByTestId('trigger');
      expect(trigger.props.accessibilityState.expanded).toBe(true);
      expect(screen.getByTestId('panel')).toBeTruthy();
    });

    it('toggles state on press when uncontrolled', () => {
      const onOpenChange = jest.fn();
      render(
        <Collapsible.Root onOpenChange={onOpenChange} testID="root">
          <Collapsible.Trigger testID="trigger">
            <Text>Toggle</Text>
          </Collapsible.Trigger>
          <Collapsible.Panel testID="panel">
            <Text>Content</Text>
          </Collapsible.Panel>
        </Collapsible.Root>,
      );

      const trigger = screen.getByTestId('trigger');

      // Press to open
      fireEvent.press(trigger);
      expect(trigger.props.accessibilityState.expanded).toBe(true);
      expect(screen.getByTestId('panel')).toBeTruthy();
      expect(onOpenChange).toHaveBeenCalledWith(true, expect.any(Object));

      // Press to close
      fireEvent.press(trigger);
      expect(trigger.props.accessibilityState.expanded).toBe(false);
      expect(screen.queryByTestId('panel')).toBeNull();
      expect(onOpenChange).toHaveBeenCalledWith(false, expect.any(Object));
    });
  });

  describe('Controlled State', () => {
    it('respects the open prop and does not update internal state autonomously', () => {
      const onOpenChange = jest.fn();
      const { rerender } = render(
        <Collapsible.Root open={true} onOpenChange={onOpenChange} testID="root">
          <Collapsible.Trigger testID="trigger">
            <Text>Toggle</Text>
          </Collapsible.Trigger>
          <Collapsible.Panel testID="panel">
            <Text>Content</Text>
          </Collapsible.Panel>
        </Collapsible.Root>,
      );

      const trigger = screen.getByTestId('trigger');
      expect(trigger.props.accessibilityState.expanded).toBe(true);
      expect(screen.getByTestId('panel')).toBeTruthy();

      // Pressing should trigger callback but NOT change UI
      fireEvent.press(trigger);
      expect(onOpenChange).toHaveBeenCalledWith(false, expect.any(Object));
      expect(trigger.props.accessibilityState.expanded).toBe(true);
      expect(screen.getByTestId('panel')).toBeTruthy();

      // Rerender with new prop to simulate parent component updating it
      rerender(
        <Collapsible.Root open={false} onOpenChange={onOpenChange} testID="root">
          <Collapsible.Trigger testID="trigger">
            <Text>Toggle</Text>
          </Collapsible.Trigger>
          <Collapsible.Panel testID="panel">
            <Text>Content</Text>
          </Collapsible.Panel>
        </Collapsible.Root>,
      );

      expect(trigger.props.accessibilityState.expanded).toBe(false);
      expect(screen.queryByTestId('panel')).toBeNull();
    });
  });

  describe('Disabled State', () => {
    it('prevents toggling and applies accessibility state when root is disabled', () => {
      const onOpenChange = jest.fn();
      render(
        <Collapsible.Root disabled onOpenChange={onOpenChange} testID="root">
          <Collapsible.Trigger testID="trigger">
            <Text>Toggle</Text>
          </Collapsible.Trigger>
          <Collapsible.Panel testID="panel">
            <Text>Content</Text>
          </Collapsible.Panel>
        </Collapsible.Root>,
      );

      const trigger = screen.getByTestId('trigger');
      expect(trigger.props.accessibilityState.disabled).toBe(true);

      fireEvent.press(trigger);
      expect(onOpenChange).not.toHaveBeenCalled();
      expect(trigger.props.accessibilityState.expanded).toBe(false);
    });

    it('prevents toggling when trigger specifically is disabled', () => {
      const onOpenChange = jest.fn();
      render(
        <Collapsible.Root onOpenChange={onOpenChange} testID="root">
          <Collapsible.Trigger disabled testID="trigger">
            <Text>Toggle</Text>
          </Collapsible.Trigger>
        </Collapsible.Root>,
      );

      const trigger = screen.getByTestId('trigger');
      expect(trigger.props.accessibilityState.disabled).toBe(true);

      fireEvent.press(trigger);
      expect(onOpenChange).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Interaction', () => {
    it('toggles state using Enter and Space keys', () => {
      const onOpenChange = jest.fn();
      render(
        <Collapsible.Root onOpenChange={onOpenChange}>
          <Collapsible.Trigger testID="trigger">
            <Text>Toggle</Text>
          </Collapsible.Trigger>
        </Collapsible.Root>,
      );

      const trigger = screen.getByTestId('trigger');

      // Simulate Enter key
      fireEvent(trigger, 'keyDown', { nativeEvent: { key: 'Enter' } });
      expect(onOpenChange).toHaveBeenCalledWith(true, expect.any(Object));

      // Simulate Space key (since it's now open, space should close it)
      fireEvent(trigger, 'keyDown', { nativeEvent: { key: ' ' } });
      expect(onOpenChange).toHaveBeenCalledWith(false, expect.any(Object));
    });

    it('ignores keyboard events if disabled', () => {
      const onOpenChange = jest.fn();
      render(
        <Collapsible.Root disabled onOpenChange={onOpenChange}>
          <Collapsible.Trigger testID="trigger">
            <Text>Toggle</Text>
          </Collapsible.Trigger>
        </Collapsible.Root>,
      );

      const trigger = screen.getByTestId('trigger');
      fireEvent(trigger, 'keyDown', { nativeEvent: { key: 'Enter' } });
      expect(onOpenChange).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility & Keep Mounted', () => {
    it('hides closed panels from screen readers if keepMounted is true', () => {

      render(
        <Collapsible.Root>
          <Collapsible.Trigger><Text>Toggle</Text></Collapsible.Trigger>
          <Collapsible.Panel keepMounted testID="panel">
            <Text>Content</Text>
          </Collapsible.Panel>
        </Collapsible.Root>,
      );

      // Bypass standard query to find the actual host component in the fiber tree
      const panel = screen.getByTestId('panel', { includeHiddenElements: true })
      expect(panel.props.accessibilityElementsHidden).toBe(true);
      expect(panel.props.importantForAccessibility).toBe('no-hide-descendants');
    });
  });

  describe('Context & Style Resolution (Render Props)', () => {
    it('evaluates style functions on the Root based on state', () => {
      render(
        <Collapsible.Root
          testID="root"
          style={({ open }) => ({
            backgroundColor: open ? 'green' : 'red',
          })}
        >
          <Collapsible.Trigger testID="trigger"><Text>Toggle</Text></Collapsible.Trigger>
        </Collapsible.Root>,
      );

      const root = screen.getByTestId('root');
      const trigger = screen.getByTestId('trigger');

      // Initially closed (red)
      let flattenedStyle = StyleSheet.flatten(root.props.style);
      expect(flattenedStyle).toMatchObject({ backgroundColor: 'red' });

      // Toggle to open (green)
      fireEvent.press(trigger);

      flattenedStyle = StyleSheet.flatten(root.props.style);
      expect(flattenedStyle).toMatchObject({ backgroundColor: 'green' });
    });

    it('exposes state to children as a function', () => {
      render(
        <Collapsible.Root>
          <Collapsible.Trigger testID="trigger">
            {({ open }) => <Text>{open ? 'CLOSE_ME' : 'OPEN_ME'}</Text>}
          </Collapsible.Trigger>
        </Collapsible.Root>,
      );

      expect(screen.getByText('OPEN_ME')).toBeTruthy();

      fireEvent.press(screen.getByTestId('trigger'));

      expect(screen.getByText('CLOSE_ME')).toBeTruthy();
      expect(screen.queryByText('OPEN_ME')).toBeNull();
    });
  });
});
