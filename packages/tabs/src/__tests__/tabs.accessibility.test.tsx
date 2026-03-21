import { render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import { Tabs } from '../index';

describe('Tabs - Accessibility', () => {
  it('has correct ARIA roles and attributes', () => {
    const { getByRole, getByTestId } = render(
      <Tabs.Root defaultValue='tab-1'>
        <Tabs.List testID='list'>
          <Tabs.Tab testID='tab-1' value='tab-1'>
            <Text>Tab 1</Text>
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel testID='panel-1' value='tab-1'>
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
          <Tabs.Tab aria-label='Home Tab' value='tab-1'>
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
