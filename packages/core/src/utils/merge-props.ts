import * as React from 'react';
import type {
  AccessibilityActionInfo,
  AccessibilityState,
  StyleProp,
} from 'react-native';

import {
  mergeAccessibilityActions,
  mergeAccessibilityState,
} from '../accessibility/merge-accessibility-props';
import { composeEventHandlers } from './compose-event-handlers';
import { AnyFn, HandlerMap, ProtectedKey } from '@/types';


const PROTECTED_KEYS = new Set<string>([
  'disabled',
  'focusable',
  'ref',
  'style',
  'children',
  'accessibilityState',
  'accessibilityActions',
] satisfies ProtectedKey[]);

export type MergePropsResult<
  TProps extends Record<string, unknown>,
  THandlers extends HandlerMap,
  TElement = unknown,
  TStyle = unknown,
> = Omit<TProps, ProtectedKey | keyof THandlers> &
  {
    [K in keyof THandlers]: THandlers[K] extends (event: infer E) => void
    ? (event: E) => void
    : (event: unknown) => void;
  } & {
    disabled: boolean;
    focusable: boolean;
    ref: React.Ref<TElement>;
    style: StyleProp<TStyle>;
  };

export interface MergePropsConfig<
  THandlers extends HandlerMap,
  TElement = unknown,
  TStyle = unknown,
> {
  handlers: THandlers;
  disabled: boolean;
  focusable: boolean;
  ref: React.Ref<TElement>;
  style: StyleProp<TStyle>;
  accessibilityState?: AccessibilityState;
  accessibilityActions?: readonly AccessibilityActionInfo[];
}

export function mergeProps<
  TProps extends Record<string, unknown>,
  THandlers extends HandlerMap,
  TElement = unknown,
  TStyle = unknown,
>(
  userProps: TProps,
  config: MergePropsConfig<THandlers, TElement, TStyle>,
): MergePropsResult<TProps, THandlers, TElement, TStyle> {
  const {
    handlers,
    disabled,
    focusable,
    ref,
    style,
    accessibilityState: internalA11yState,
    accessibilityActions: internalA11yActions,
  } = config;

  const { externalHandlers, passthrough } = React.useMemo(() => {
    const extHandlers: Record<string, AnyFn | undefined> = {};
    const passProps: Record<string, unknown> = {};
    const handlerKeys = new Set(Object.keys(handlers));

    for (const key of handlerKeys) {
      extHandlers[key] = userProps[key] as AnyFn | undefined;
    }

    for (const key of Object.keys(userProps)) {
      if (!handlerKeys.has(key) && !PROTECTED_KEYS.has(key)) {
        passProps[key] = userProps[key];
      }
    }

    return { externalHandlers: extHandlers, passthrough: passProps };
  }, [userProps, Object.keys(handlers).join(',')]);

  const composedHandlers = composeEventHandlers(
    externalHandlers as THandlers,
    handlers,
  );

  const mergedA11yState = React.useMemo(() => {
    if (!internalA11yState && !userProps.accessibilityState) return undefined;
    return mergeAccessibilityState(
      internalA11yState,
      userProps.accessibilityState as AccessibilityState | undefined,
    );
  }, [internalA11yState, userProps.accessibilityState]);

  const mergedA11yActions = React.useMemo(() => {
    if (!internalA11yActions && !userProps.accessibilityActions) return undefined;
    return mergeAccessibilityActions(
      internalA11yActions,
      userProps.accessibilityActions as readonly AccessibilityActionInfo[] | undefined,
    );
  }, [internalA11yActions, userProps.accessibilityActions]);

  return {
    ...passthrough,
    ...composedHandlers,
    ...(mergedA11yState ? { accessibilityState: mergedA11yState } : {}),
    ...(mergedA11yActions ? { accessibilityActions: mergedA11yActions } : {}),
    disabled,
    focusable,
    ref,
    style,
  } as unknown as MergePropsResult<TProps, THandlers, TElement, TStyle>;
}
