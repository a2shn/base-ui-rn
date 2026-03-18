import * as React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Tabs } from '../index';

describe('Tabs - Keyboard', () => {
  it('activates tab on Enter or Space', () => {
    const onValueChange = jest.fn();
    const { getByTestId } = render(
      <Tabs.Root onValueChange={onValueChange}>
        <Tabs.List>
          <Tabs.Tab value='tab-1' testID='tab-1'>
            <Text>Tab 1</Text>
          </Tabs.Tab>
          <Tabs.Tab value='tab-2' testID='tab-2'>
            <Text>Tab 2</Text>
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.Root>,
    );

    fireEvent(getByTestId('tab-2'), 'keyDown', {
      nativeEvent: { key: 'Enter' },
    });
    expect(onValueChange).toHaveBeenCalledWith('tab-2');

    fireEvent(getByTestId('tab-1'), 'keyDown', { nativeEvent: { key: ' ' } });
    expect(onValueChange).toHaveBeenCalledWith('tab-1');
  });

  it('does not activate disabled tab', () => {
    const onValueChange = jest.fn();
    const { getByTestId } = render(
      <Tabs.Root onValueChange={onValueChange}>
        <Tabs.List>
          <Tabs.Tab value='tab-1' testID='tab-1'>
            <Text>Tab 1</Text>
          </Tabs.Tab>
          <Tabs.Tab value='tab-2' disabled testID='tab-2'>
            <Text>Tab 2</Text>
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.Root>,
    );

    fireEvent(getByTestId('tab-2'), 'keyDown', {
      nativeEvent: { key: 'Enter' },
    });
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
