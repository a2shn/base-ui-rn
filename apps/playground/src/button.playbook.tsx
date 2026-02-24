import * as React from 'react';
import { Text } from 'react-native';
import { Button } from '@base-ui-rn/button';
import {
  Gallery,
  Section,
  usePlaybookToggles,
  LiveConsole,
} from '@base-ui-rn/playbook';

export function ButtonPlaybook() {
  const { count, loading, loadingPressCount } = usePlaybookToggles({
    count: 0,
    loading: false,
    loadingPressCount: 0,
  });

  const handleLoadingPress = React.useCallback(() => {
    loadingPressCount.setValue((prev: number) => prev + 1);
    if (loading.value) return;
    loading.setValue(true);
    setTimeout(() => loading.setValue(false), 2000);
  }, [loading, loadingPressCount]);

  return (
    <Gallery title='Button'>
      <Section title='Counter Button'>
        <Button
          onPress={() => count.setValue(count.value + 1)}
          accessibilityHint='Increments the counter'
          testID='button-counter'
        >
          <Text>{count.value}</Text>
        </Button>

        <LiveConsole title='count' state={count} />
      </Section>

      <Section title='Disabled State'>
        <Button
          disabled
          accessibilityHint='Locked button'
          testID='button-disabled'
          accessibilityLabel='Disabled Button'
        >
          <Text>Disabled Button</Text>
        </Button>
      </Section>

      <Section title='Loading State'>
        <Button
          disabled={loading.value as boolean}
          focusableWhenDisabled
          onPress={handleLoadingPress}
          accessibilityHint={
            loading.value ? 'Loading, please wait' : 'Press to start loading'
          }
          accessibilityState={{ busy: loading.value as boolean }}
          testID='button-disabled-focusable'
          accessibilityLabel='Loading Button'
        >
          <Text>{loading.value ? 'Loading...' : 'Load'}</Text>
        </Button>

        <LiveConsole title='loading' state={loading} testID='loading-console' />
        <LiveConsole
          title='presses'
          state={loadingPressCount}
          testID='presses-console'
        />
      </Section>
    </Gallery>
  );
}
