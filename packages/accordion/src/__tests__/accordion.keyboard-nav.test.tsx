import { fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';

import { Accordion } from '../index';

describe('Accordion Keyboard Navigation', () => {
  it('navigates between triggers with arrow keys', () => {
    const onFocusChange = jest.fn();
    const { getByTestId } = render(
      <Accordion.Root onFocusChange={onFocusChange}>
        <Accordion.Item value='item-1'>
          <Accordion.Trigger testID='trigger-1'>Trigger 1</Accordion.Trigger>
        </Accordion.Item>
        <Accordion.Item value='item-2'>
          <Accordion.Trigger testID='trigger-2'>Trigger 2</Accordion.Trigger>
        </Accordion.Item>
        <Accordion.Item value='item-3'>
          <Accordion.Trigger testID='trigger-3'>Trigger 3</Accordion.Trigger>
        </Accordion.Item>
      </Accordion.Root>,
    );

    const trigger1 = getByTestId('trigger-1');

    fireEvent(trigger1, 'keyDown', { nativeEvent: { key: 'ArrowDown' } });
    expect(onFocusChange).toHaveBeenCalledWith('item-2');

    fireEvent(getByTestId('trigger-2'), 'keyDown', {
      nativeEvent: { key: 'ArrowDown' },
    });
    expect(onFocusChange).toHaveBeenCalledWith('item-3');

    // Test looping (default true)
    fireEvent(getByTestId('trigger-3'), 'keyDown', {
      nativeEvent: { key: 'ArrowDown' },
    });
    expect(onFocusChange).toHaveBeenCalledWith('item-1');

    // Test backward navigation
    fireEvent(trigger1, 'keyDown', { nativeEvent: { key: 'ArrowUp' } });
    expect(onFocusChange).toHaveBeenCalledWith('item-3');
  });

  it('honors loopFocus=false', () => {
    const onFocusChange = jest.fn();
    const { getByTestId } = render(
      <Accordion.Root loopFocus={false} onFocusChange={onFocusChange}>
        <Accordion.Item value='item-1'>
          <Accordion.Trigger testID='trigger-1'>Trigger 1</Accordion.Trigger>
        </Accordion.Item>
        <Accordion.Item value='item-2'>
          <Accordion.Trigger testID='trigger-2'>Trigger 2</Accordion.Trigger>
        </Accordion.Item>
      </Accordion.Root>,
    );

    const trigger2 = getByTestId('trigger-2');
    fireEvent(trigger2, 'keyDown', { nativeEvent: { key: 'ArrowDown' } });
    expect(onFocusChange).not.toHaveBeenCalledWith('item-1');

    const trigger1 = getByTestId('trigger-1');
    fireEvent(trigger1, 'keyDown', { nativeEvent: { key: 'ArrowUp' } });
    expect(onFocusChange).not.toHaveBeenCalledWith('item-2');
  });

  it('navigates with Home and End keys', () => {
    const onFocusChange = jest.fn();
    const { getByTestId } = render(
      <Accordion.Root onFocusChange={onFocusChange}>
        <Accordion.Item value='item-1'>
          <Accordion.Trigger testID='trigger-1'>Trigger 1</Accordion.Trigger>
        </Accordion.Item>
        <Accordion.Item value='item-2'>
          <Accordion.Trigger testID='trigger-2'>Trigger 2</Accordion.Trigger>
        </Accordion.Item>
        <Accordion.Item value='item-3'>
          <Accordion.Trigger testID='trigger-3'>Trigger 3</Accordion.Trigger>
        </Accordion.Item>
      </Accordion.Root>,
    );

    const trigger2 = getByTestId('trigger-2');

    fireEvent(trigger2, 'keyDown', { nativeEvent: { key: 'Home' } });
    expect(onFocusChange).toHaveBeenCalledWith('item-1');

    fireEvent(trigger2, 'keyDown', { nativeEvent: { key: 'End' } });
    expect(onFocusChange).toHaveBeenCalledWith('item-3');
  });

  it('supports horizontal navigation when orientation is horizontal', () => {
    const onFocusChange = jest.fn();
    const { getByTestId } = render(
      <Accordion.Root onFocusChange={onFocusChange} orientation='horizontal'>
        <Accordion.Item value='item-1'>
          <Accordion.Trigger testID='trigger-1'>Trigger 1</Accordion.Trigger>
        </Accordion.Item>
        <Accordion.Item value='item-2'>
          <Accordion.Trigger testID='trigger-2'>Trigger 2</Accordion.Trigger>
        </Accordion.Item>
      </Accordion.Root>,
    );

    const trigger1 = getByTestId('trigger-1');
    fireEvent(trigger1, 'keyDown', { nativeEvent: { key: 'ArrowRight' } });
    expect(onFocusChange).toHaveBeenCalledWith('item-2');

    const trigger2 = getByTestId('trigger-2');
    fireEvent(trigger2, 'keyDown', { nativeEvent: { key: 'ArrowLeft' } });
    expect(onFocusChange).toHaveBeenCalledWith('item-1');
  });
});
