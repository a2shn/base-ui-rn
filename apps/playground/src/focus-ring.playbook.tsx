import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FocusRing, type FocusRingRenderProps } from '@base-ui-rn/focus-ring';
import { Button } from '@base-ui-rn/button';
import { Gallery, Section, theme } from '@base-ui-rn/playbook';

export function FocusRingPlaybook() {
  return (
    <Gallery title='FocusRing'>
      <Section title='Themed Outline'>
        <View style={styles.container}>
          <FocusRing>
            {({ focusVisible }) => (
              <Button style={getOutlineButtonStyle({ focusVisible })}>
                <Text style={styles.textPrimary}>Focus Me</Text>
              </Button>
            )}
          </FocusRing>
          <Text style={styles.hint}>
            Focus this button via keyboard to see the themed outline.
          </Text>
        </View>
      </Section>

      <Section title='Custom Style'>
        <View style={styles.container}>
          <FocusRing>
            {({ focused }) => (
              <Button style={getCustomButtonStyle({ focused })}>
                <Text
                  style={focused ? styles.textPrimary : styles.textSecondary}
                >
                  {focused ? 'Focused' : 'Idle'}
                </Text>
              </Button>
            )}
          </FocusRing>
        </View>
      </Section>
    </Gallery>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.sm,
    gap: theme.spacing.md,
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonBase: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: {
    borderColor: theme.colors.textPrimary,
    borderWidth: 2,
  },
  focused: {
    backgroundColor: theme.colors.borderLight,
  },
  hint: {
    fontSize: theme.font.size.xs,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  textPrimary: {
    color: theme.colors.textPrimary,
  },
  textSecondary: {
    color: theme.colors.textSecondary,
  },
});

function getOutlineButtonStyle({
  focusVisible,
}: Partial<FocusRingRenderProps>) {
  return [styles.buttonBase, focusVisible && styles.outline];
}

function getCustomButtonStyle({ focused }: Partial<FocusRingRenderProps>) {
  return [styles.buttonBase, focused && styles.focused];
}
