import { composeEventHandler } from './compose-event-handlers';
import {
  mergeAccessibilityActions,
  mergeAccessibilityState,
} from '../accessibility/merge-accessibility-props';
import { mergeRefs } from './merge-refs';
import { StyleProp } from 'react-native';
import { Ref } from 'react';

type PropsArg = Record<string, any> | null | undefined;

type TupleTypes<T> = { [P in keyof T]: T[P] } extends { [key: number]: infer V }
  ? NullToObject<V>
  : never;
type NullToObject<T> = T extends null | undefined ? {} : T;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

export type MergedResult<T> = UnionToIntersection<TupleTypes<T>> & {
  ref: Ref<any>;
  style: StyleProp<any>;
};
/**
 * Merges user props with internal component configuration.
 * Ref and Style are strictly required in the configuration object.
 * * @see {@link https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/utils/src/mergeProps.ts}
 * Derived from Adobe's React Aria (Apache-2.0 License).
 */
export function mergeProps<T extends PropsArg[]>(...args: T): MergedResult<T> {
  let result: Record<string, any> = { ...args[0] };

  for (let i = 1; i < args.length; i++) {
    let props = args[i];
    if (!props) continue;

    for (let key in props) {
      let a = result[key];
      let b = props[key];

      const isEventHandler =
        key[0] === 'o' &&
        key[1] === 'n' &&
        key.charCodeAt(2) >= 65 &&
        key.charCodeAt(2) <= 90;

      if (isEventHandler) {
        if (typeof a === 'function' && typeof b === 'function') {
          result[key] = composeEventHandler(a, b);
        } else {
          result[key] = typeof a === 'function' ? a : b;
        }
      }
      // 2. Special Merges
      else if (key === 'ref') {
        result.ref = (a && b) ? mergeRefs(a, b) : (a || b);
      } else if (key === 'style') {
        result.style = (a && b) ? [a, b] : (a || b);
      } else if (key === 'accessibilityState') {
        result[key] = (a && b) ? mergeAccessibilityState(a, b) : (a || b);
      } else if (key === 'accessibilityActions') {
        result[key] = (a && b) ? mergeAccessibilityActions(a, b) : (a || b);
      }
      // 3. Standard Props: First-in-Wins
      else {
        result[key] = a !== undefined ? a : b;
      }
    }
  }

  return result as MergedResult<T>;
}
