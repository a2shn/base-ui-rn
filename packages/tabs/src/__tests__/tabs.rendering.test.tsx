import { render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import { Tabs } from '../index';

describe('Tabs - Rendering', () => {
  it('renders active panel and hides others', () => {
    const { getByText, queryByTestId } = render(
      <Tabs.Root defaultValue='tab-1'>
        <Tabs.List>
          <Tabs.Tab value='tab-1'>
            <Text>Tab 1</Text>
          </Tabs.Tab>
          <Tabs.Tab value='tab-2'>
            <Text>Tab 2</Text>
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel testID='panel-1' value='tab-1'>
          <Text>Content 1</Text>
        </Tabs.Panel>
        <Tabs.Panel testID='panel-2' value='tab-2'>
          <Text>Content 2</Text>
        </Tabs.Panel>
      </Tabs.Root>,
    );

    expect(getByText('Content 1')).toBeTruthy();
    expect(queryByTestId('panel-2')).toBeNull();
  });

  it('honors keepMounted prop', () => {
    const { getByTestId } = render(
      <Tabs.Root defaultValue='tab-1'>
        <Tabs.List>
          <Tabs.Tab value='tab-1'>
            <Text>Tab 1</Text>
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel keepMounted testID='panel-2' value='tab-2'>
          <Text>Content 2</Text>
        </Tabs.Panel>
      </Tabs.Root>,
    );

    const panel = getByTestId('panel-2', { includeHiddenElements: true });
    expect(panel.props['data-hidden']).toBe('true');
  });
});
