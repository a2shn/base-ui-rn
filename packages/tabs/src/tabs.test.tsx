import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleSheet, Text } from 'react-native';

import { Tabs } from './index';

describe('Tabs Primitive', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering & Uncontrolled State', () => {
    it('renders the default active panel and hides others', () => {
      render(
        <Tabs.Root defaultValue="tab-1">
          <Tabs.List testID="list">
            <Tabs.Tab value="tab-1" testID="tab-1"><Text>Tab 1</Text></Tabs.Tab>
            <Tabs.Tab value="tab-2" testID="tab-2"><Text>Tab 2</Text></Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="tab-1" testID="panel-1"><Text>Content 1</Text></Tabs.Panel>
          <Tabs.Panel value="tab-2" testID="panel-2"><Text>Content 2</Text></Tabs.Panel>
        </Tabs.Root>,
      );

      // Check tab states
      expect(screen.getByTestId('tab-1').props.accessibilityState.selected).toBe(true);
      expect(screen.getByTestId('tab-2').props.accessibilityState.selected).toBe(false);

      // Check panel visibility
      expect(screen.getByText('Content 1')).toBeTruthy();
      expect(screen.queryByText('Content 2')).toBeNull();
    });

    it('changes the active tab on press', () => {
      const onValueChange = jest.fn();
      render(
        <Tabs.Root defaultValue="tab-1" onValueChange={onValueChange}>
          <Tabs.List>
            <Tabs.Tab value="tab-1"><Text>Tab 1</Text></Tabs.Tab>
            <Tabs.Tab value="tab-2" testID="tab-2"><Text>Tab 2</Text></Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="tab-1"><Text>Content 1</Text></Tabs.Panel>
          <Tabs.Panel value="tab-2"><Text>Content 2</Text></Tabs.Panel>
        </Tabs.Root>,
      );

      fireEvent.press(screen.getByTestId('tab-2'));

      expect(screen.getByText('Content 2')).toBeTruthy();
      expect(screen.queryByText('Content 1')).toBeNull();
      expect(onValueChange).toHaveBeenCalledWith('tab-2');
    });
  });

  describe('Controlled State', () => {
    it('respects controlled value and prevents autonomous internal updates', () => {
      const onValueChange = jest.fn();
      const { rerender } = render(
        <Tabs.Root value="tab-1" onValueChange={onValueChange}>
          <Tabs.List>
            <Tabs.Tab value="tab-1"><Text>Tab 1</Text></Tabs.Tab>
            <Tabs.Tab value="tab-2" testID="tab-2"><Text>Tab 2</Text></Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="tab-1"><Text>Content 1</Text></Tabs.Panel>
          <Tabs.Panel value="tab-2"><Text>Content 2</Text></Tabs.Panel>
        </Tabs.Root>,
      );

      // Press the second tab
      fireEvent.press(screen.getByTestId('tab-2'));

      // Callback fires, but UI does not change yet
      expect(onValueChange).toHaveBeenCalledWith('tab-2');
      expect(screen.getByText('Content 1')).toBeTruthy();
      expect(screen.queryByText('Content 2')).toBeNull();

      // Parent component updates the prop
      rerender(
        <Tabs.Root value="tab-2" onValueChange={onValueChange}>
          <Tabs.List>
            <Tabs.Tab value="tab-1"><Text>Tab 1</Text></Tabs.Tab>
            <Tabs.Tab value="tab-2" testID="tab-2"><Text>Tab 2</Text></Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="tab-1"><Text>Content 1</Text></Tabs.Panel>
          <Tabs.Panel value="tab-2"><Text>Content 2</Text></Tabs.Panel>
        </Tabs.Root>,
      );

      expect(screen.queryByText('Content 1')).toBeNull();
      expect(screen.getByText('Content 2')).toBeTruthy();
    });
  });

  describe('Disabled State', () => {
    it('prevents interaction on disabled tabs', () => {
      const onValueChange = jest.fn();
      render(
        <Tabs.Root defaultValue="tab-1" onValueChange={onValueChange}>
          <Tabs.List>
            <Tabs.Tab value="tab-1"><Text>Tab 1</Text></Tabs.Tab>
            <Tabs.Tab value="tab-2" disabled testID="tab-2"><Text>Tab 2</Text></Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="tab-1"><Text>Content 1</Text></Tabs.Panel>
          <Tabs.Panel value="tab-2"><Text>Content 2</Text></Tabs.Panel>
        </Tabs.Root>,
      );

      const disabledTab = screen.getByTestId('tab-2');
      expect(disabledTab.props.accessibilityState.disabled).toBe(true);

      fireEvent.press(disabledTab);
      expect(onValueChange).not.toHaveBeenCalled();
      expect(screen.getByText('Content 1')).toBeTruthy(); // Still on tab 1
    });
  });

  describe('Keyboard Navigation', () => {


    it('navigates with arrow keys (Horizontal by default)', () => {
      const onFocusChange = jest.fn();
      render(
        <Tabs.Root defaultValue="tab-1" onFocusChange={onFocusChange}>
          <Tabs.List>
            <Tabs.Tab value="tab-1" testID="tab-1"><Text>Tab 1</Text></Tabs.Tab>
            <Tabs.Tab value="tab-2" testID="tab-2"><Text>Tab 2</Text></Tabs.Tab>
          </Tabs.List>
        </Tabs.Root>,
      );

      fireEvent(screen.getByTestId('tab-1'), 'keyDown', { nativeEvent: { key: 'ArrowRight' } });
      expect(onFocusChange).toHaveBeenCalledWith('tab-2');
    });

    it('navigates with arrow keys (Vertical)', () => {
      const onFocusChange = jest.fn();
      render(
        <Tabs.Root defaultValue="tab-1" orientation="vertical" onFocusChange={onFocusChange}>
          <Tabs.List>
            <Tabs.Tab value="tab-1" testID="tab-1"><Text>Tab 1</Text></Tabs.Tab>
            <Tabs.Tab value="tab-2" testID="tab-2"><Text>Tab 2</Text></Tabs.Tab>
          </Tabs.List>
        </Tabs.Root>,
      );

      fireEvent(screen.getByTestId('tab-1'), 'keyDown', { nativeEvent: { key: 'ArrowDown' } });
      expect(onFocusChange).toHaveBeenCalledWith('tab-2');
    });

    it('auto-activates tabs when activateOnFocus is true', () => {
      const onValueChange = jest.fn();
      render(
        <Tabs.Root defaultValue="tab-1" activateOnFocus onValueChange={onValueChange}>
          <Tabs.List>
            <Tabs.Tab value="tab-1" testID="tab-1"><Text>Tab 1</Text></Tabs.Tab>
            <Tabs.Tab value="tab-2" testID="tab-2"><Text>Tab 2</Text></Tabs.Tab>
          </Tabs.List>
        </Tabs.Root>,
      );

      fireEvent(screen.getByTestId('tab-1'), 'keyDown', { nativeEvent: { key: 'ArrowRight' } });

      // Because activateOnFocus is true, the arrow key directly triggers a value change
      expect(onValueChange).toHaveBeenCalledWith('tab-2');
    });
  });

  describe('Accessibility & Keep Mounted', () => {
    it('applies correct ARIA roles', () => {
      render(
        <Tabs.Root defaultValue="tab-1">
          <Tabs.List testID="list">
            <Tabs.Tab value="tab-1" testID="tab-1"><Text>Tab 1</Text></Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="tab-1" testID="panel-1"><Text>Content 1</Text></Tabs.Panel>
        </Tabs.Root>,
      );

      expect(screen.getByTestId('list').props.role).toBe('tablist');
      expect(screen.getByTestId('tab-1').props.role).toBe('tab');
      expect(screen.getByTestId('panel-1').props.role).toBe('tabpanel');
    });

    it('hides inactive panels from screen readers if keepMounted is true', () => {
      render(
        <Tabs.Root defaultValue="tab-1">
          <Tabs.List>
            <Tabs.Tab value="tab-1"><Text>Tab 1</Text></Tabs.Tab>
            <Tabs.Tab value="tab-2"><Text>Tab 2</Text></Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="tab-1"><Text>Content 1</Text></Tabs.Panel>
          <Tabs.Panel value="tab-2" keepMounted testID="panel-2">
            <Text>Hidden Content 2</Text>
          </Tabs.Panel>
        </Tabs.Root>,
      );

      // Now we can query the host element directly because mergeProps isn't clobbering it
      const panelView = screen.getByTestId('panel-2', { includeHiddenElements: true });

      expect(panelView.props.accessibilityElementsHidden).toBe(true);
      expect(panelView.props.importantForAccessibility).toBe('no-hide-descendants');
    });
  });

  describe('Context & Style Resolution (Render Props)', () => {
    it('evaluates style functions on Tabs based on state', () => {
      render(
        <Tabs.Root defaultValue="tab-1">
          <Tabs.List>
            <Tabs.Tab
              value="tab-1"
              testID="tab-1"
              style={({ active }) => ({
                borderBottomWidth: active ? 2 : 0,
              })}
            >
              <Text>Tab 1</Text>
            </Tabs.Tab>
            <Tabs.Tab
              value="tab-2"
              testID="tab-2"
              style={({ active }) => ({
                borderBottomWidth: active ? 2 : 0,
              })}
            >
              <Text>Tab 2</Text>
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.Root>,
      );

      const tab1 = screen.getByTestId('tab-1');
      const tab2 = screen.getByTestId('tab-2');

      expect(StyleSheet.flatten(tab1.props.style)).toMatchObject({ borderBottomWidth: 2 });
      expect(StyleSheet.flatten(tab2.props.style)).toMatchObject({ borderBottomWidth: 0 });

      // Toggle to Tab 2
      fireEvent.press(tab2);

      expect(StyleSheet.flatten(tab1.props.style)).toMatchObject({ borderBottomWidth: 0 });
      expect(StyleSheet.flatten(tab2.props.style)).toMatchObject({ borderBottomWidth: 2 });
    });

    it('exposes state to children as a function', () => {
      render(
        <Tabs.Root defaultValue="tab-1">
          <Tabs.List>
            <Tabs.Tab value="tab-1" testID="tab-1">
              {({ active }) => <Text>{active ? 'ACTIVE_TEXT' : 'INACTIVE_TEXT'}</Text>}
            </Tabs.Tab>
            <Tabs.Tab value="tab-2" testID="tab-2">
              <Text>Tab 2</Text>
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.Root>,
      );

      expect(screen.getByText('ACTIVE_TEXT')).toBeTruthy();

      fireEvent.press(screen.getByTestId('tab-2'));

      expect(screen.getByText('INACTIVE_TEXT')).toBeTruthy();
      expect(screen.queryByText('ACTIVE_TEXT')).toBeNull();
    });
  });
});
