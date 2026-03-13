import * as React from 'react';
import { render } from '@testing-library/react-native';
import { Accordion } from '../index';
import { fireKeyPress } from '@base-ui-rn/test-utils';

describe('Accordion Keyboard Navigation', () => {
  it('navigates between triggers with arrow keys', () => {
    const onFocusChange = jest.fn();
    const { getByTestId } = render(
      <Accordion.Root onFocusChange={onFocusChange}>
        <Accordion.Item value="item-1">
          <Accordion.Trigger testID="trigger-1">Trigger 1</Accordion.Trigger>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Trigger testID="trigger-2">Trigger 2</Accordion.Trigger>
        </Accordion.Item>
        <Accordion.Item value="item-3">
          <Accordion.Trigger testID="trigger-3">Trigger 3</Accordion.Trigger>
        </Accordion.Item>
      </Accordion.Root>
    );

    const trigger1 = getByTestId('trigger-1');

    fireKeyPress(trigger1, 'ArrowDown');
    expect(onFocusChange).toHaveBeenCalledWith('item-2');

    fireKeyPress(getByTestId('trigger-2'), 'ArrowDown');
    expect(onFocusChange).toHaveBeenCalledWith('item-3');

    // Test looping (default true)
    fireKeyPress(getByTestId('trigger-3'), 'ArrowDown');
    expect(onFocusChange).toHaveBeenCalledWith('item-1');

    // Test backward navigation
    fireKeyPress(trigger1, 'ArrowUp');
    expect(onFocusChange).toHaveBeenCalledWith('item-3');
  });

  it('honors loopFocus=false', () => {
    const onFocusChange = jest.fn();
    const { getByTestId } = render(
      <Accordion.Root onFocusChange={onFocusChange} loopFocus={false}>
        <Accordion.Item value="item-1">
          <Accordion.Trigger testID="trigger-1">Trigger 1</Accordion.Trigger>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Trigger testID="trigger-2">Trigger 2</Accordion.Trigger>
        </Accordion.Item>
      </Accordion.Root>
    );

    const trigger2 = getByTestId('trigger-2');
    fireKeyPress(trigger2, 'ArrowDown');
    expect(onFocusChange).not.toHaveBeenCalledWith('item-1');

    const trigger1 = getByTestId('trigger-1');
    fireKeyPress(trigger1, 'ArrowUp');
    expect(onFocusChange).not.toHaveBeenCalledWith('item-2');
  });

  it('navigates with Home and End keys', () => {
    const onFocusChange = jest.fn();
    const { getByTestId } = render(
      <Accordion.Root onFocusChange={onFocusChange}>
        <Accordion.Item value="item-1">
          <Accordion.Trigger testID="trigger-1">Trigger 1</Accordion.Trigger>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Trigger testID="trigger-2">Trigger 2</Accordion.Trigger>
        </Accordion.Item>
        <Accordion.Item value="item-3">
          <Accordion.Trigger testID="trigger-3">Trigger 3</Accordion.Trigger>
        </Accordion.Item>
      </Accordion.Root>
    );

    const trigger2 = getByTestId('trigger-2');

    fireKeyPress(trigger2, 'Home');
    expect(onFocusChange).toHaveBeenCalledWith('item-1');

    fireKeyPress(trigger2, 'End');
    expect(onFocusChange).toHaveBeenCalledWith('item-3');
  });

  it('supports horizontal navigation when orientation is horizontal', () => {
    const onFocusChange = jest.fn();
    const { getByTestId } = render(
      <Accordion.Root onFocusChange={onFocusChange} orientation="horizontal">
        <Accordion.Item value="item-1">
          <Accordion.Trigger testID="trigger-1">Trigger 1</Accordion.Trigger>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Trigger testID="trigger-2">Trigger 2</Accordion.Trigger>
        </Accordion.Item>
      </Accordion.Root>
    );

    const trigger1 = getByTestId('trigger-1');
    fireKeyPress(trigger1, 'ArrowRight');
    expect(onFocusChange).toHaveBeenCalledWith('item-2');

    const trigger2 = getByTestId('trigger-2');
    fireKeyPress(trigger2, 'ArrowLeft');
    expect(onFocusChange).toHaveBeenCalledWith('item-1');
  });
});
