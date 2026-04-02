import { Button } from '@base-ui-rn/button';
import {
  Gallery,
  LiveConsole,
  Section,
  theme,
  usePlaybookToggles,
} from '@base-ui-rn/playbook';
import * as React from 'react';
import { StyleSheet, Text } from 'react-native';

export function ButtonPlaybook() {
  const { count, lastEvent, loading, loadingPressCount } = usePlaybookToggles({
    count: 0,
    lastEvent: 'None',
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
    <Gallery title='Button API Coverage'>
      <Section title='Counter'>
        <Button
          accessibilityHint='Increments the counter'
          accessibilityLabel='Counter Button'
          onPress={() => {
            console.log("hello")
            count.setValue((count.value as number) + 1)
          }}
          style={styles.buttonBase}
          testID='button-counter'
        >
          <Text style={styles.textWhite}>{count.value as number}</Text>
        </Button>
        <LiveConsole state={count} title='count' />
      </Section>

      <Section title='Stateful Children'>
        <Button
          accessibilityLabel='Stateful Children Button'
          onPress={() => { }}
          style={styles.buttonBase}
        >
          {({ focused, pressed, focusVisible }) => (
            <Text
              style={[
                styles.textSecondary,
                (pressed || focused) && styles.textWhiteBold,
              ]}
            >
              {pressed
                ? 'Currently Pressed'
                : focused
                  ? 'Currently Focused'
                  : 'Idle State'}
              {focusVisible ? "focus-visible" : ""}
            </Text>
          )}
        </Button>
      </Section>

      <Section title='Disabled'>
        <Button
          accessibilityLabel='Disabled Button'
          disabled
          disableDefaultFocusRing
          style={[styles.buttonBase, styles.disabled]}
          testID='button-disabled'
        >
          <Text style={styles.textWhite}>Disabled Button</Text>
        </Button>
      </Section>

      <Section title='Loading & Focusable'>
        <Button
          accessibilityHint={
            loading.value ? 'Loading, please wait' : 'Press to start loading'
          }
          accessibilityLabel='Loading Button'
          accessibilityState={{ busy: loading.value as boolean }}
          disabled={loading.value as boolean}
          focusableWhenDisabled
          onPress={handleLoadingPress}
          style={styles.buttonBase}
          testID='button-disabled-focusable'
        >
          <Text style={styles.textWhite}>
            {loading.value ? 'Loading...' : 'Load'}
          </Text>
        </Button>

        <LiveConsole state={loading} testID='loading-console' title='loading' />
        <LiveConsole
          state={loadingPressCount}
          testID='presses-console'
          title='presses'
        />
      </Section>
      <Section title='Explicit Event Handlers'>
        <Button
          accessibilityLabel='Event Handlers Button'
          onBlur={() => lastEvent.setValue('Lost focus')}
          onFocus={() => lastEvent.setValue('Gained focus')}
          onKeyDown={(e) =>
            lastEvent.setValue(`Key pressed: ${e.nativeEvent.key}`)
          }
          onPress={() => lastEvent.setValue('Pressed')}
          style={styles.buttonBase}
        >
          <Text style={styles.textWhite}>Interact to see events</Text>
        </Button>
        <LiveConsole state={lastEvent} title='last event' />
      </Section>
    </Gallery>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.md,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
  },
  disabled: {
    opacity: 0.5,
  },
  textSecondary: {
    color: theme.colors.textSecondary,
    fontWeight: theme.font.weight.regular,
  },
  textWhite: {
    color: theme.colors.textPrimary,
  },
  textWhiteBold: {
    color: theme.colors.textPrimary,
    fontWeight: theme.font.weight.bold,
  },
});
