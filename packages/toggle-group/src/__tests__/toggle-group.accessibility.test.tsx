import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { ToggleGroup } from '../toggle-group';
import { Toggle } from '@base-ui-rn/toggle';

describe('ToggleGroup - Accessibility & Dev Mode', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('warns about duplicate toggle values in development', () => {
    process.env.NODE_ENV = 'development';

    render(
      <ToggleGroup>
        <Toggle value='duplicate'>
          <Text>A</Text>
        </Toggle>
        <Toggle value='duplicate'>
          <Text>B</Text>
        </Toggle>
      </ToggleGroup>,
    );

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining(
        'ToggleGroup: Duplicate value "duplicate" detected',
      ),
    );
  });

  it('does not warn about duplicate toggle values in production', () => {
    process.env.NODE_ENV = 'production';

    render(
      <ToggleGroup>
        <Toggle value='duplicate'>
          <Text>A</Text>
        </Toggle>
        <Toggle value='duplicate'>
          <Text>B</Text>
        </Toggle>
      </ToggleGroup>,
    );

    expect(console.warn).not.toHaveBeenCalled();
  });

  it('warns when a Toggle is used without a value within a ToggleGroup', () => {
    process.env.NODE_ENV = 'development';

    // Toggle itself throws this warning
    render(
      <ToggleGroup>
        <Toggle value={undefined as unknown as string}>
          <Text>No Value</Text>
        </Toggle>
      </ToggleGroup>,
    );

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining(
        'Toggle: A Toggle used within a ToggleGroup must have a "value" prop.',
      ),
    );
  });

  it('sets role="group" and aria-orientation on the container', () => {
    const { getByTestId } = render(
      <ToggleGroup testID='group' orientation='vertical'>
        <Toggle value='a'>
          <Text>A</Text>
        </Toggle>
      </ToggleGroup>,
    );

    const group = getByTestId('group');
    expect(group.props.role).toBe('group');
    expect(group.props['aria-orientation']).toBe('vertical');
    expect(group.props['data-orientation']).toBe('vertical');
  });

  it('sets data-disabled and data-multiple attributes', () => {
    const { getByTestId, rerender } = render(
      <ToggleGroup testID='group' disabled multiple>
        <Toggle value='a'>
          <Text>A</Text>
        </Toggle>
      </ToggleGroup>,
    );

    let group = getByTestId('group');
    expect(group.props['data-disabled']).toBe(true);
    expect(group.props['data-multiple']).toBe(true);

    rerender(
      <ToggleGroup testID='group' disabled={false} multiple={false}>
        <Toggle value='a'>
          <Text>A</Text>
        </Toggle>
      </ToggleGroup>,
    );

    group = getByTestId('group');
    expect(group.props['data-disabled']).toBe(false);
    expect(group.props['data-multiple']).toBe(false);
  });

  it('allows overriding data attributes', () => {
    const { getByTestId } = render(
      <ToggleGroup
        testID='group'
        data-orientation='vertical'
        orientation='horizontal'
      >
        <Toggle value='a'>
          <Text>A</Text>
        </Toggle>
      </ToggleGroup>,
    );

    const group = getByTestId('group');
    expect(group.props['data-orientation']).toBe('vertical');
    expect(group.props['aria-orientation']).toBe('horizontal');
  });

  it('allows overriding role on the container', () => {
    const { getByTestId } = render(
      <ToggleGroup testID='group' accessibilityRole='radiogroup'>
        <Toggle value='a'>
          <Text>A</Text>
        </Toggle>
      </ToggleGroup>,
    );

    const group = getByTestId('group');
    expect(group.props.role).toBe('radiogroup');
  });
});
