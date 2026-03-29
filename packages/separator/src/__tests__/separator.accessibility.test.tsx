import { testAccessibility } from '@base-ui-rn/test-utils';
import { render } from '@testing-library/react-native';

import { Separator } from '../index';

describe('Separator - Accessibility', () => {
  describe('Default Accessibility', () => {
    it('has correct default accessibility role and label', () => {
      const { getByRole } = render(<Separator />);
      const separator = getByRole('separator');

      testAccessibility(separator, {
        importantForAccessibility: 'yes',
        label: 'Horizontal separator',
      });
    });
  });

  describe('Orientation', () => {
    it('has correct label for vertical orientation', () => {
      const { getByRole } = render(<Separator orientation='vertical' />);
      const separator = getByRole('separator');

      testAccessibility(separator, {
        label: 'Vertical separator',
      });
    });
  });
});
