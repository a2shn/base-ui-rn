import { render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import { SwitchRoot, SwitchThumb } from '../index';

describe('Switch - Rendering', () => {
  it('renders correctly', () => {
    const { getByRole } = render(
      <SwitchRoot>
        <SwitchThumb />
      </SwitchRoot>,
    );

    const root = getByRole('switch');
    expect(root).toBeDefined();
  });

  it('supports custom styles', () => {
    const { getByRole } = render(
      <SwitchRoot style={{ backgroundColor: 'red' }} />,
    );
    const root = getByRole('switch');
    expect(root.props.style).toMatchObject({ backgroundColor: 'red' });
  });

  it('provides state to children functions', () => {
    const { getByText } = render(
      <SwitchRoot checked>
        {(state) => (
          <Text testID='child'>
            {state.checked ? 'Is Checked' : 'Is Unchecked'}
          </Text>
        )}
      </SwitchRoot>,
    );

    expect(getByText('Is Checked')).toBeDefined();
  });
});
