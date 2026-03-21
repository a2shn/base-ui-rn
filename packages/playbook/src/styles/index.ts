import { components } from './components';
import { theme } from './theme';
import type { Theme } from './theme';

export { theme };
export type { Theme };
export { components };

export function useStyles() {
  return components;
}
