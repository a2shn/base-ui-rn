import { mergeHandlers } from './merge-handlers';

interface MockEvent {
  defaultPrevented?: boolean;
  type: string;
}

describe('mergeHandlers', () => {
  it('returns consumer when primitive is undefined', () => {
    const consumer = jest.fn();
    const handler = mergeHandlers<MockEvent>(undefined, consumer);

    handler?.({ type: 'press' });

    expect(consumer).toHaveBeenCalledTimes(1);
  });

  it('returns primitive when consumer is undefined', () => {
    const primitive = jest.fn();
    const handler = mergeHandlers<MockEvent>(primitive, undefined);

    handler?.({ type: 'press' });

    expect(primitive).toHaveBeenCalledTimes(1);
  });

  it('calls both handlers when defaultPrevented is false or undefined', () => {
    const primitive = jest.fn();
    const consumer = jest.fn();
    const event: MockEvent = { type: 'press' };

    const handler = mergeHandlers<MockEvent>(primitive, consumer);
    handler?.(event);

    expect(primitive).toHaveBeenCalledWith(event);
    expect(consumer).toHaveBeenCalledWith(event);
  });

  it('does not call consumer when primitive sets defaultPrevented to true', () => {
    const primitive = jest.fn((e: MockEvent) => {
      e.defaultPrevented = true;
    });
    const consumer = jest.fn();
    const event: MockEvent = { type: 'press', defaultPrevented: false };

    const handler = mergeHandlers<MockEvent>(primitive, consumer);
    handler?.(event);

    expect(primitive).toHaveBeenCalledWith(event);
    expect(consumer).not.toHaveBeenCalled();
  });
});
