import { testAccessibility } from '@base-ui-rn/test-utils';
import { render } from '@testing-library/react-native';
import * as React from 'react';

import { Radio, RadioGroup } from '../index';

const renderRadioGroup = (value?: string) =>
  render(
    <RadioGroup aria-label='Best apple' defaultValue={value} testID='radiogroup'>
      <Radio.Root aria-label='Fuji' value='fuji'>
        <Radio.Indicator testID='fuji-indicator' />
      </Radio.Root>
      <Radio.Root aria-label='Gala' value='gala'>
        <Radio.Indicator testID='gala-indicator' />
      </Radio.Root>
    </RadioGroup>,
  );

describe('Radio - Accessibility', () => {
  it('RadioGroup has role radiogroup', () => {
    const { getByTestId } = renderRadioGroup();
    expect(getByTestId('radiogroup').props.role).toBe('radiogroup');
  });

  it('Radio.Root has role radio', () => {
    const { getAllByRole } = renderRadioGroup();
    const radios = getAllByRole('radio');
    expect(radios).toHaveLength(2);
  });

  it('has correct default accessibility attributes when unchecked', () => {
    const { getAllByRole } = renderRadioGroup();
    const [fuji] = getAllByRole('radio');

    testAccessibility(fuji, {
      checked: false,
      disabled: false,
    });

    expect(fuji.props['data-checked']).toBeUndefined();
    expect(fuji.props['data-unchecked']).toBe('true');
    expect(fuji.props['data-disabled']).toBeUndefined();
  });

  it('has correct attributes when checked', () => {
    const { getAllByRole, getByTestId } = renderRadioGroup('fuji');
    const [fuji] = getAllByRole('radio');

    testAccessibility(fuji, { checked: true });
    expect(fuji.props['data-checked']).toBe('true');
    expect(fuji.props['data-unchecked']).toBeUndefined();

    // Indicator mounts when checked
    expect(getByTestId('fuji-indicator')).toBeTruthy();
    expect(getByTestId('fuji-indicator').props['data-checked']).toBe('true');
  });

  it('has correct attributes when disabled', () => {
    const { getByRole } = render(
      <RadioGroup disabled>
        <Radio.Root aria-label='A' value='a' />
      </RadioGroup>,
    );
    const radio = getByRole('radio');
    testAccessibility(radio, { disabled: true });
    expect(radio.props['data-disabled']).toBe('true');
  });

  it('reflects readOnly via data attribute', () => {
    const { getByRole } = render(
      <RadioGroup readOnly>
        <Radio.Root aria-label='A' value='a' />
      </RadioGroup>,
    );
    const radio = getByRole('radio');
    expect(radio.props['data-readonly']).toBe('true');
  });

  it('RadioGroup reflects disabled via data-disabled', () => {
    const { getByTestId } = render(<RadioGroup aria-label='Group' disabled testID='radiogroup' />);
    const group = getByTestId('radiogroup');
    expect(group.props['data-disabled']).toBe('true');
  });
});
