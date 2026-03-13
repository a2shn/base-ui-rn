import * as React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { Tabs } from '../index';
import { fireKeyPress } from '@base-ui-rn/test-utils';

describe('Tabs - Keyboard Navigation', () => {
  it('navigates with arrow keys', () => {
    const onValueChange = jest.fn();
    const { getByTestId } = render(
      <Tabs.Root onValueChange={onValueChange} defaultValue='tab-1'>
        <Tabs.List>
          <Tabs.Tab value='tab-1' testID='tab-1'>
            <Text>Tab 1</Text>
          </Tabs.Tab>
          <Tabs.Tab value='tab-2' testID='tab-2'>
            <Text>Tab 2</Text>
          </Tabs.Tab>
          <Tabs.Tab value='tab-3' testID='tab-3'>
            <Text>Tab 3</Text>
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.Root>,
    );

    fireKeyPress(getByTestId('tab-1'), 'ArrowRight');
    expect(onValueChange).toHaveBeenCalledWith('tab-2');

    fireKeyPress(getByTestId('tab-2'), 'ArrowRight');
    expect(onValueChange).toHaveBeenCalledWith('tab-3');

    // Loop
    fireKeyPress(getByTestId('tab-3'), 'ArrowRight');
    expect(onValueChange).toHaveBeenCalledWith('tab-1');
  });

  it('navigates vertically when orientation is vertical', () => {
    const onValueChange = jest.fn();
    const { getByTestId } = render(
      <Tabs.Root
        orientation='vertical'
        onValueChange={onValueChange}
        defaultValue='tab-1'
      >
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

    fireKeyPress(getByTestId('tab-1'), 'ArrowDown');
    expect(onValueChange).toHaveBeenCalledWith('tab-2');
  });
});
