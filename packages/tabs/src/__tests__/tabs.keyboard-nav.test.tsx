import * as React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Tabs } from '../index';

describe('Tabs - Keyboard Navigation', () => {
  it('navigates with arrow keys without activating by default', () => {
    const onValueChange = jest.fn();
    const onFocusChange = jest.fn();
    const { getByTestId } = render(
      <Tabs.Root
        onValueChange={onValueChange}
        onFocusChange={onFocusChange}
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

    fireEvent(getByTestId('tab-1'), 'keyDown', {
      nativeEvent: { key: 'ArrowRight' },
    });
    expect(onFocusChange).toHaveBeenCalledWith('tab-2');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('activates on focus when activateOnFocus is true', () => {
    const onValueChange = jest.fn();
    const { getByTestId } = render(
      <Tabs.Root
        onValueChange={onValueChange}
        defaultValue='tab-1'
        activateOnFocus
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

    fireEvent(getByTestId('tab-1'), 'keyDown', {
      nativeEvent: { key: 'ArrowRight' },
    });
    expect(onValueChange).toHaveBeenCalledWith('tab-2');
  });

  it('navigates vertically when orientation is vertical', () => {
    const onFocusChange = jest.fn();
    const { getByTestId } = render(
      <Tabs.Root
        orientation='vertical'
        onFocusChange={onFocusChange}
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

    fireEvent(getByTestId('tab-1'), 'keyDown', {
      nativeEvent: { key: 'ArrowDown' },
    });
    expect(onFocusChange).toHaveBeenCalledWith('tab-2');
  });
});
