import { ACTIVATION_ACTIONS } from '../constants';
import { ActivationAction } from '../types';

/**
 * Checks if the given accessibility action name is a standard OS-level activation.
 * - 'activate': Standard activation (Android, Web, iOS single-tap).
 * - 'magicTap': iOS two-finger double-tap.
 */
export function isActivationAction(
  actionName: string,
): actionName is ActivationAction {
  return ACTIVATION_ACTIONS.includes(actionName as ActivationAction);
}
