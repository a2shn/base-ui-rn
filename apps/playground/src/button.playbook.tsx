import * as React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Button, type ButtonState } from '@base-ui-rn/button';
import {
  Gallery,
  Section,
  usePlaybookToggles,
  LiveConsole,
  theme,
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
      <Section title='Counter'>
        <Button
          onPress={() => count.setValue(count.value + 1)}
          accessibilityHint='Increments the counter'
          testID='button-counter'
          style={getButtonStyle}
        >
          <Text style={styles.textWhite}>{count.value}</Text>
        </Button>
        <LiveConsole title='count' state={count} />
      </Section>

      <Section title='Disabled'>
        <Button
          disabled
          accessibilityHint='Locked button'
          testID='button-disabled'
          accessibilityLabel='Disabled Button'
          style={[styles.buttonBase, styles.disabled]}
          disableDefaultFocusRing
        >
          <Text style={styles.textWhite}>Disabled Button</Text>
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
          style={getButtonStyle}
        >
          <Text style={styles.textWhite}>
            {loading.value ? 'Loading...' : 'Load'}
          </Text>
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
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  pressed: {
    opacity: 0.7,
    backgroundColor: theme.colors.borderLight,
  },
  disabled: {
    opacity: 0.5,
  },
  textWhite: {
    color: theme.colors.textPrimary,
  },
  textWhiteBold: {
    color: theme.colors.textPrimary,
    fontWeight: theme.font.weight.bold,
  },
  textSecondary: {
    color: theme.colors.textSecondary,
    fontWeight: theme.font.weight.regular,
  },
});

function getButtonStyle({ pressed }: ButtonState) {
  return [styles.buttonBase, pressed && styles.pressed];
}
