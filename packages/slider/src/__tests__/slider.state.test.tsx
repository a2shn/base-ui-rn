import * as React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Slider } from '../index';

describe('Slider state', () => {
  it('supports uncontrolled updates via keyboard', () => {
    const { getByLabelText, getByText } = render(
      <Slider.Root defaultValue={10}>
        <Slider.Value />
        <Slider.Thumb aria-label='Volume thumb' />
      </Slider.Root>,
    );

    fireEvent(getByLabelText('Volume thumb'), 'keyPress', {
      nativeEvent: { key: 'ArrowRight' },
    });

    expect(getByText('11')).toBeTruthy();
  });

  it('supports controlled value', () => {
    const onValueChange = jest.fn();
    const { getByLabelText } = render(
      <Slider.Root value={20} onValueChange={onValueChange}>
        <Slider.Thumb aria-label='Volume thumb' />
      </Slider.Root>,
    );

    fireEvent(getByLabelText('Volume thumb'), 'keyPress', {
      nativeEvent: { key: 'ArrowRight' },
    });

    expect(onValueChange).toHaveBeenCalledWith(21, expect.anything());
  });

  it('respects minStepsBetweenValues when moving thumb 0 right', () => {
    const onValueChange = jest.fn();
    const { getByLabelText } = render(
      <Slider.Root 
        defaultValue={[10, 20]} 
        minStepsBetweenValues={5}
        thumbCollisionBehavior='none'
        onValueChange={onValueChange}
      >
        <Slider.Thumb index={0} aria-label='Thumb 0' />
        <Slider.Thumb index={1} aria-label='Thumb 1' />
      </Slider.Root>,
    );

    const thumb0 = getByLabelText('Thumb 0');

    // Move thumb 0 to 15 (at the limit)
    for (let i = 0; i < 5; i++) {
      fireEvent(thumb0, 'keyPress', { nativeEvent: { key: 'ArrowRight' } });
    }
    expect(onValueChange).toHaveBeenLastCalledWith([15, 20], expect.anything());

    // Try to move thumb 0 to 16 (should be blocked by minStepsBetweenValues=5)
    fireEvent(thumb0, 'keyPress', { nativeEvent: { key: 'ArrowRight' } });
    expect(onValueChange).toHaveBeenLastCalledWith([15, 20], expect.anything());
  });

  it('pushes other thumbs when thumbCollisionBehavior="push"', () => {
    const onValueChange = jest.fn();
    const { getByLabelText } = render(
      <Slider.Root 
        defaultValue={[10, 20]} 
        thumbCollisionBehavior='push'
        minStepsBetweenValues={5}
        onValueChange={onValueChange}
      >
        <Slider.Thumb index={0} aria-label='Thumb 0' />
        <Slider.Thumb index={1} aria-label='Thumb 1' />
      </Slider.Root>,
    );

    const thumb0 = getByLabelText('Thumb 0');

    // Move thumb 0 from 10 to 16. It should push thumb 1 to 21.
    for (let i = 0; i < 6; i++) {
      fireEvent(thumb0, 'keyPress', { nativeEvent: { key: 'ArrowRight' } });
    }
    expect(onValueChange).toHaveBeenLastCalledWith([16, 21], expect.anything());
  });

  it('enforces fixed distance with stepBetweenValues', () => {
    const onValueChange = jest.fn();
    const { getByLabelText } = render(
      <Slider.Root 
        defaultValue={[10, 20, 30]} 
        stepBetweenValues={10}
        onValueChange={onValueChange}
      >
        <Slider.Thumb index={1} aria-label='Thumb 1' />
      </Slider.Root>,
    );

    const thumb1 = getByLabelText('Thumb 1');

    // Move thumb 1 from 20 to 25. 
    // Thumb 0 should pull to 15, Thumb 2 should push to 35.
    for (let i = 0; i < 5; i++) {
        fireEvent(thumb1, 'keyPress', { nativeEvent: { key: 'ArrowRight' } });
    }
    expect(onValueChange).toHaveBeenLastCalledWith([15, 25, 35], expect.anything());
  });

  it('shifts entire chain at bounds with stepBetweenValues', () => {
    const onValueChange = jest.fn();
    const { getByLabelText } = render(
      <Slider.Root 
        defaultValue={[80, 90, 100]} 
        min={0}
        max={100}
        stepBetweenValues={10}
        onValueChange={onValueChange}
      >
        <Slider.Thumb index={0} aria-label='Thumb 0' />
        <Slider.Thumb index={1} aria-label='Thumb 1' />
        <Slider.Thumb index={2} aria-label='Thumb 2' />
      </Slider.Root>,
    );

    const thumb0 = getByLabelText('Thumb 0');

    // Current: [80, 90, 100]
    // Move thumb 0 from 80 to 81. 
    // Chain would be [81, 91, 101] which overflows max 100.
    // Chain should shift back to [80, 90, 100].
    fireEvent(thumb0, 'keyPress', { nativeEvent: { key: 'ArrowRight' } });
    
    // If it was successful, it would have called onValueChange. 
    // Since it's blocked, it might not have been called or called with same values.
    // In our implementation, emit is only called if values changed.
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
