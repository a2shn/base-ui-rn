import { render } from '@testing-library/react-native';
import * as React from 'react';

import { Radio, RadioGroup, RadioIndicator, RadioRoot } from '../index';

describe('Radio - Rendering', () => {
  it('renders a RadioGroup, Radio.Root and Radio.Indicator without errors', () => {
    const { getAllByRole, getByTestId } = render(
      <RadioGroup aria-label='Test group' defaultValue='a' testID='radiogroup'>
        <Radio.Root aria-label='Option A' value='a'>
          <Radio.Indicator testID='indicator-a' />
        </Radio.Root>
        <Radio.Root aria-label='Option B' value='b'>
          <Radio.Indicator testID='indicator-b' />
        </Radio.Root>
      </RadioGroup>,
    );

    expect(getByTestId('radiogroup')).toBeTruthy();
    expect(getAllByRole('radio')).toHaveLength(2);
  });

  it('Radio.Indicator is mounted when radio is checked', () => {
    const { getByTestId } = render(
      <RadioGroup defaultValue='a'>
        <Radio.Root aria-label='A' value='a'>
          <Radio.Indicator testID='indicator-a' />
        </Radio.Root>
      </RadioGroup>,
    );
    expect(getByTestId('indicator-a')).toBeTruthy();
  });

  it('Radio.Indicator is not mounted when radio is unchecked (keepMounted=false)', () => {
    const { queryByTestId } = render(
      <RadioGroup defaultValue='b'>
        <Radio.Root aria-label='A' value='a'>
          <Radio.Indicator testID='indicator-a' />
        </Radio.Root>
        <Radio.Root aria-label='B' value='b'>
          <Radio.Indicator testID='indicator-b' />
        </Radio.Root>
      </RadioGroup>,
    );
    expect(queryByTestId('indicator-a')).toBeNull();
    expect(queryByTestId('indicator-b')).toBeTruthy();
  });

  it('Radio.Indicator stays mounted when unchecked with keepMounted=true', () => {
    const { getByTestId } = render(
      <RadioGroup defaultValue='b'>
        <Radio.Root aria-label='A' value='a'>
          <Radio.Indicator keepMounted testID='indicator-a' />
        </Radio.Root>
      </RadioGroup>,
    );
    expect(getByTestId('indicator-a')).toBeTruthy();
  });

  it('renders individual named exports correctly', () => {
    const { getByRole, getByTestId } = render(
      <RadioGroup aria-label='Named exports group' testID='radiogroup'>
        <RadioRoot aria-label='X' value='x'>
          <RadioIndicator keepMounted testID='x-indicator' />
        </RadioRoot>
      </RadioGroup>,
    );
    expect(getByTestId('radiogroup')).toBeTruthy();
    expect(getByRole('radio')).toBeTruthy();
  });

  it('has correct displayNames', () => {
    expect(RadioGroup.displayName).toBe('RadioGroup');
    expect(RadioRoot.displayName).toBe('Radio.Root');
    expect(RadioIndicator.displayName).toBe('Radio.Indicator');
  });
});
