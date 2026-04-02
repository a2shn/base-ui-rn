import { useA11y } from '@base-ui-rn/core';

import type { SeparatorProps } from './types';

export function useSeparatorA11y(props: SeparatorProps) {
  const { decorative = false } = props;

  return useA11y(props, {
    accessibilityElementsHidden: decorative,
    accessibilityLiveRegion: 'none',
    accessible: true,
    importantForAccessibility: decorative ? 'no-hide-descendants' : 'yes',
    role: decorative ? 'presentation' : 'separator',
  });
}
