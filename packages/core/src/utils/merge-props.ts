import { Ref } from 'react';
import { StyleProp } from 'react-native';

import {
  mergeAccessibilityActions,
  mergeAccessibilityState,
} from '../accessibility/merge-accessibility-props';
import { composeEventHandler } from './compose-event-handlers';
import { mergeRefs } from './merge-refs';

type PropsArg = Record<string, unknown> | null | undefined;

type TupleTypes<T> = { [P in keyof T]: T[P] } extends { [key: number]: infer V }
  ? NullToObject<V>
  : never;
type NullToObject<T> = T extends null | undefined ? Record<string, never> : T;

type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type MergedResult<T> = UnionToIntersection<TupleTypes<T>> & {
  ref: Ref<unknown>;
  style: StyleProp<unknown>;
};
/**
 * Merges user props with internal component configuration.
 * Ref and Style are strictly required in the configuration object.
 * * @see {@link https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/utils/src/mergeProps.ts}
 * Derived from Adobe's React Aria (Apache-2.0 License).
 */
export function mergeProps<T extends PropsArg[]>(...args: T): MergedResult<T> {
  const result: Record<string, unknown> = { ...args[0] };

  for (let i = 1; i < args.length; i++) {
    const props = args[i];
    if (!props) continue;

    for (const key in props) {
      const a = result[key];
      const b = props[key];

      const isEventHandler =
        key[0] === 'o' &&
        key[1] === 'n' &&
        key.charCodeAt(2) >= 65 &&
        key.charCodeAt(2) <= 90;

      if (isEventHandler) {
        if (typeof a === 'function' && typeof b === 'function') {
          result[key] = composeEventHandler(
            a as (...args: unknown[]) => void,
            b as (...args: unknown[]) => void,
          );
        } else {
          result[key] = typeof a === 'function' ? a : b;
        }
      }
      // 2. Special Merges
      else if (key === 'ref') {
        result.ref =
          a && b
            ? mergeRefs(a as Ref<unknown>, b as Ref<unknown>)
            : (a as Ref<unknown>) || (b as Ref<unknown>);
      } else if (key === 'style') {
        result.style = a && b ? [a, b] : a || b;
      } else if (key === 'accessibilityState') {
        result[key] = a && b ? mergeAccessibilityState(a, b) : a || b;
      } else if (key === 'accessibilityActions') {
        result[key] =
          a && b ? mergeAccessibilityActions(a as never, b as never) : a || b;
      }
      // 3. Standard Props: First-in-Wins
      else {
        result[key] = a !== undefined ? a : b;
      }
    }
  }

  return result as MergedResult<T>;
}
