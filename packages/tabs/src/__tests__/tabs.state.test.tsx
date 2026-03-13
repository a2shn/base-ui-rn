import * as React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Tabs } from '../index';

describe('Tabs - State', () => {
  it('supports controlled mode', () => {
    const onValueChange = jest.fn();
    const { getByText, rerender } = render(
      <Tabs.Root value="tab-1" onValueChange={onValueChange}>
        <Tabs.List>
          <Tabs.Tab value="tab-1"><Text>Tab 1</Text></Tabs.Tab>
          <Tabs.Tab value="tab-2" testID="tab-2"><Text>Tab 2</Text></Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="tab-1"><Text>Content 1</Text></Tabs.Panel>
        <Tabs.Panel value="tab-2"><Text>Content 2</Text></Tabs.Panel>
      </Tabs.Root>
    );

    fireEvent.press(getByText('Tab 2'));
    expect(onValueChange).toHaveBeenCalledWith('tab-2');
    // Content should not change yet because it's controlled
    expect(getByText('Content 1')).toBeTruthy();

    rerender(
      <Tabs.Root value="tab-2" onValueChange={onValueChange}>
        <Tabs.List>
          <Tabs.Tab value="tab-1"><Text>Tab 1</Text></Tabs.Tab>
          <Tabs.Tab value="tab-2"><Text>Tab 2</Text></Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="tab-1"><Text>Content 1</Text></Tabs.Panel>
        <Tabs.Panel value="tab-2"><Text>Content 2</Text></Tabs.Panel>
      </Tabs.Root>
    );

    expect(getByText('Content 2')).toBeTruthy();
  });
});
