import { useControllableState } from '@base-ui-rn/core';
import * as React from 'react';

import type { CollapsibleRootProps, CollapsibleRootState } from './types';

function useId(prefix = 'collapsible') {
  return React.useMemo(
    () => `${prefix}-${Math.random().toString(36).slice(2, 9)}`,
    [prefix],
  );
}

export function useCollapsible(props: CollapsibleRootProps) {
  const {
    defaultOpen = false,
    disabled = false,
    onOpenChange,
    open: controlledOpen,
  } = props;

  const baseId = useId();
  const isDisabled = disabled === true;

  const [open, setOpen] = useControllableState<boolean>({
    defaultProp: defaultOpen,
    onChange: (nextOpen: boolean) =>
      onOpenChange?.(nextOpen, { open: nextOpen }),
    prop: controlledOpen,
  });

  const toggle = React.useCallback(() => {
    if (isDisabled) return;
    setOpen((prev) => !prev);
  }, [isDisabled, setOpen]);

  const state: CollapsibleRootState = {
    disabled: isDisabled,
    open: open ?? false,
  };

  return {
    baseId,
    isDisabled,
    open: open ?? false,
    state,
    toggle,
  };
}
