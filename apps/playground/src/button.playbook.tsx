import * as React from 'react';
import { Text } from 'react-native';
import { Button } from '@base-ui-rn/button';
import {
  Gallery,
  Section,
  usePlaybookToggles,
  LiveConsole,
} from '@base-ui-rn/playbook';
import styles from './playbookStyles';

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

  const buttonBaseStyle = styles.buttonBase;

  return (
    <Gallery title='Button'>
      <Section title='Counter'>
        <Button
          onPress={() => count.setValue(count.value + 1)}
          accessibilityHint='Increments the counter'
          testID='button-counter'
          style={({ pressed }) => [
            buttonBaseStyle,
            pressed && { opacity: 0.7, backgroundColor: '#e0e0e0' },
          ]}
        >
          <Text>{count.value}</Text>
        </Button>
        <LiveConsole title='count' state={count} />
      </Section>

      <Section title='Disabled'>
        <Button
          disabled
          accessibilityHint='Locked button'
          testID='button-disabled'
          accessibilityLabel='Disabled Button'
          style={[buttonBaseStyle, { opacity: 0.5 }]}
          disableDefaultFocusRing
        >
          <Text>Disabled Button</Text>
        </Button>
      </Section>

      <Section title='Loading'>
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
          style={({ pressed }) => [
            buttonBaseStyle,
            pressed && { opacity: 0.7, backgroundColor: '#e0e0e0' },
          ]}
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

      <Section title='Custom Focus'>
        <Button
          disableDefaultFocusRing
          onPress={() => { }}
          style={buttonBaseStyle}
        >
          {({ focusVisible }) => (
            <Text style={{ color: focusVisible ? '#0071E3' : '#000', fontWeight: focusVisible ? 'bold' : 'normal' }}>
              {focusVisible ? 'Keyboard Focused' : 'Custom focus logic'}
            </Text>
          )}
        </Button>
      </Section>
    </Gallery>
  );
}
