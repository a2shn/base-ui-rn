import * as React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { Tabs } from '../index';

describe('Tabs - Accessibility', () => {
  it('has correct ARIA roles and attributes', () => {
    const { getByRole, getByTestId } = render(
      <Tabs.Root defaultValue='tab-1'>
        <Tabs.List testID='list'>
          <Tabs.Tab value='tab-1' testID='tab-1'>
            <Text>Tab 1</Text>
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='tab-1' testID='panel-1'>
          <Text>Content 1</Text>
        </Tabs.Panel>
      </Tabs.Root>,
    );

    const list = getByTestId('list');
    expect(list.props.role).toBe('tablist');

    const tab = getByRole('tab');
    expect(
      tab.props['aria-selected'] ?? tab.props.accessibilityState?.selected,
    ).toBe(true);

    const panel = getByTestId('panel-1');
    expect(panel.props.role).toBe('tabpanel');
  });

  it('passes generic web accessibility props', () => {
    const { getByRole } = render(
      <Tabs.Root defaultValue='tab-1'>
        <Tabs.List>
          <Tabs.Tab value='tab-1' aria-label='Home Tab'>
            <Text>Home</Text>
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.Root>,
    );

    const tab = getByRole('tab');
    expect(tab.props['aria-label'] ?? tab.props.accessibilityLabel).toBe(
      'Home Tab',
    );
  });
});
