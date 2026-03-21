import { Button, type ButtonState } from '@base-ui-rn/button';
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
      <Section title='Counter'>
        <Button
          accessibilityHint='Increments the counter'
          onPress={() => count.setValue(count.value + 1)}
          style={getButtonStyle}
          testID='button-counter'
        >
          <Text style={styles.textWhite}>{count.value}</Text>
        </Button>
        <LiveConsole state={count} title='count' />
      </Section>

      <Section title='Disabled'>
        <Button
          accessibilityHint='Locked button'
          accessibilityLabel='Disabled Button'
          disabled
          disableDefaultFocusRing
          style={[styles.buttonBase, styles.disabled]}
          testID='button-disabled'
        >
          <Text style={styles.textWhite}>Disabled Button</Text>
        </Button>
      </Section>

      <Section title='Loading'>
        <Button
          accessibilityHint={
            loading.value ? 'Loading, please wait' : 'Press to start loading'
          }
          accessibilityLabel='Loading Button'
          accessibilityState={{ busy: loading.value as boolean }}
          disabled={loading.value as boolean}
          focusableWhenDisabled
          onPress={handleLoadingPress}
          style={getButtonStyle}
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

      <Section title='Custom Focus'>
        <Button
          disableDefaultFocusRing
          onPress={() => {}}
          style={styles.buttonBase}
        >
          {({ focusVisible }) => (
            <Text
              style={[
                styles.textSecondary,
                focusVisible && styles.textWhiteBold,
              ]}
            >
              {focusVisible ? 'Keyboard Focused' : 'Custom focus logic'}
            </Text>
          )}
        </Button>
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
  pressed: {
    backgroundColor: theme.colors.borderLight,
    opacity: 0.7,
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

function getButtonStyle({ pressed }: ButtonState) {
  return [styles.buttonBase, pressed && styles.pressed];
}
