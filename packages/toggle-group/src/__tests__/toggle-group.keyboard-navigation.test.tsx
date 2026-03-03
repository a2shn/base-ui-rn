import { Text, View } from 'react-native';
import { render } from '@testing-library/react-native';
import { ToggleGroup } from '../toggle-group';
import { Toggle } from '@base-ui-rn/toggle';
import { fireKeyPress } from '@base-ui-rn/test-utils';

describe('ToggleGroup - Keyboard Navigation', () => {
  it('navigates through toggles using arrow keys in horizontal orientation', () => {
    const focusA = jest.fn();
    const focusB = jest.fn();
    const focusC = jest.fn();

    const { getByRole } = render(
      <ToggleGroup orientation='horizontal'>
        {}
        <Toggle
          value='a'
          ref={
            { current: { focus: focusA } } as unknown as React.RefObject<View>
          }
        >
          <Text>A</Text>
        </Toggle>
        {}
        <Toggle
          value='b'
          ref={
            { current: { focus: focusB } } as unknown as React.RefObject<View>
          }
        >
          <Text>B</Text>
        </Toggle>
        {}
        <Toggle
          value='c'
          ref={
            { current: { focus: focusC } } as unknown as React.RefObject<View>
          }
        >
          <Text>C</Text>
        </Toggle>
      </ToggleGroup>,
    );

    const a = getByRole('checkbox', { name: 'A' });

    // From A, press Right -> Focus B
    fireKeyPress(a, 'ArrowRight');
    expect(focusB).toHaveBeenCalled();

    const b = getByRole('checkbox', { name: 'B' });
    // From B, press Right -> Focus C
    fireKeyPress(b, 'ArrowRight');
    expect(focusC).toHaveBeenCalled();

    const c = getByRole('checkbox', { name: 'C' });
    // From C, press Right -> Focus A (loopFocus defaults to true)
    fireKeyPress(c, 'ArrowRight');
    expect(focusA).toHaveBeenCalled();

    // From A, press Left -> Focus C
    fireKeyPress(a, 'ArrowLeft');
    expect(focusC).toHaveBeenCalledTimes(2);
  });

  it('navigates through toggles using arrow keys in vertical orientation', () => {
    const focusA = jest.fn();
    const focusB = jest.fn();

    const { getByRole } = render(
      <ToggleGroup orientation='vertical'>
        {}
        <Toggle
          value='a'
          ref={
            { current: { focus: focusA } } as unknown as React.RefObject<View>
          }
        >
          <Text>A</Text>
        </Toggle>
        {}
        <Toggle
          value='b'
          ref={
            { current: { focus: focusB } } as unknown as React.RefObject<View>
          }
        >
          <Text>B</Text>
        </Toggle>
      </ToggleGroup>,
    );

    const a = getByRole('checkbox', { name: 'A' });

    // From A, press Down -> Focus B
    fireKeyPress(a, 'ArrowDown');
    expect(focusB).toHaveBeenCalled();

    // Horizontal keys should be ignored in vertical orientation
    fireKeyPress(a, 'ArrowRight');
    expect(focusB).toHaveBeenCalledTimes(1);
  });

  it('respects loopFocus={false}', () => {
    const focusA = jest.fn();
    const focusB = jest.fn();

    const { getByRole } = render(
      <ToggleGroup orientation='horizontal' loopFocus={false}>
        {}
        <Toggle
          value='a'
          ref={
            { current: { focus: focusA } } as unknown as React.RefObject<View>
          }
        >
          <Text>A</Text>
        </Toggle>
        {}
        <Toggle
          value='b'
          ref={
            { current: { focus: focusB } } as unknown as React.RefObject<View>
          }
        >
          <Text>B</Text>
        </Toggle>
      </ToggleGroup>,
    );

    const b = getByRole('checkbox', { name: 'B' });

    // From B, press Right -> Should NOT loop to A
    fireKeyPress(b, 'ArrowRight');
    expect(focusA).not.toHaveBeenCalled();
  });

  it('ignores arrow keys when disabled', () => {
    const focusB = jest.fn();

    const { getByRole } = render(
      <ToggleGroup orientation='horizontal' disabled>
        <Toggle value='a'>
          <Text>A</Text>
        </Toggle>
        {}
        <Toggle
          value='b'
          ref={
            { current: { focus: focusB } } as unknown as React.RefObject<View>
          }
        >
          <Text>B</Text>
        </Toggle>
      </ToggleGroup>,
    );

    const a = getByRole('checkbox', { name: 'A' });
    fireKeyPress(a, 'ArrowRight');
    expect(focusB).not.toHaveBeenCalled();
  });
});
