import { renderHook } from '@testing-library/react-native';

import { composeEventHandlers } from './compose-event-handlers';

describe('composeEventHandlers', () => {
  it('calls both external and internal handlers when default is not prevented', () => {
    const externalHandler = jest.fn();
    const internalHandler = jest.fn();
    const event = { type: 'click' };

    const { result } = renderHook(() =>
      composeEventHandlers(
        { onClick: externalHandler },
        { onClick: internalHandler },
      ),
    );

    result.current.onClick(event);

    expect(externalHandler).toHaveBeenCalledWith(event);
    expect(internalHandler).toHaveBeenCalledWith(event);
  });

  it('does not call internal handler if external handler prevents default via defaultPrevented property', () => {
    const internalHandler = jest.fn();
    const event = { defaultPrevented: false };

    const externalHandler = jest.fn((e) => {
      e.defaultPrevented = true;
    });

    const { result } = renderHook(() =>
      composeEventHandlers(
        { onClick: externalHandler },
        { onClick: internalHandler },
      ),
    );

    result.current.onClick(event);

    expect(externalHandler).toHaveBeenCalledWith(event);
    expect(internalHandler).not.toHaveBeenCalled();
  });

  it('does not call internal handler if external handler prevents default via isDefaultPrevented method', () => {
    const internalHandler = jest.fn();
    let isPrevented = false;

    const event = {
      isDefaultPrevented: () => isPrevented,
      preventDefault: () => {
        isPrevented = true;
      },
    };

    const externalHandler = jest.fn((e) => {
      e.preventDefault();
    });

    const { result } = renderHook(() =>
      composeEventHandlers(
        { onClick: externalHandler },
        { onClick: internalHandler },
      ),
    );

    result.current.onClick(event);

    expect(externalHandler).toHaveBeenCalledWith(event);
    expect(internalHandler).not.toHaveBeenCalled();
  });

  it('handles missing external or internal handlers gracefully', () => {
    const externalHandler = jest.fn();
    const internalHandler = jest.fn();
    const event = {};

    const { result: result1 } = renderHook(() =>
      composeEventHandlers({ onClick: externalHandler }, {}),
    );
    result1.current.onClick(event);
    expect(externalHandler).toHaveBeenCalled();

    const { result: result2 } = renderHook(() =>
      composeEventHandlers(
        { onClick: undefined as ((e: unknown) => void) | undefined },
        { onClick: internalHandler },
      ),
    );
    result2.current.onClick(event);
    expect(internalHandler).toHaveBeenCalled();
  });
});
