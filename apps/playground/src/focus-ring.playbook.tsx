import { useFocusRing } from '@base-ui-rn/focus-ring';
import { Gallery, Section } from '@base-ui-rn/playbook';
import * as React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

const isWeb = Platform.OS === 'web';

export function FocusRingPlaybook() {
  return (
    <Gallery title='FocusRing'>
      <Section title='Default'>
        <View style={styles.container}>
          <DefaultFocusRingView />
          <Text style={styles.hint}>
            Uses focusRingStyle from useFocusRing when focused.
          </Text>
        </View>
      </Section>

      <Section title='Themed Outline'>
        <View style={styles.container}>
          <ThemedFocusRingView style={getOutlineStyle} />
          <Text style={styles.hint}>
            Custom themed outline (disableDefaultFocusRing: true).
          </Text>
        </View>
      </Section>
    </Gallery>
  );
}

function DefaultFocusRingView() {
  const { focused, focusRingStyle, onFocus, onBlur } = useFocusRing({
    disabled: false,
    focusableWhenDisabled: false,
    disableDefaultFocusRing: false,
  });

  return (
    <View
      onFocus={onFocus}
      onBlur={onBlur}
      tabIndex={0}
      style={[styles.viewBase, focusRingStyle]}
    >
      <Text style={styles.viewText}>{focused ? 'Focused' : 'Focus Me'}</Text>
    </View>
  );
}

function ThemedFocusRingView({
  style,
}: {
  style: (state: { focused: boolean }) => object;
}) {
  const { focused, onFocus, onBlur } = useFocusRing({
    disabled: false,
    focusableWhenDisabled: false,
    disableDefaultFocusRing: true,
  });

  return (
    <View
      onFocus={onFocus}
      onBlur={onBlur}
      tabIndex={0}
      style={style({ focused })}
    >
      <Text style={styles.viewText}>Focus Me</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  viewBase: {
    alignItems: 'center',
    backgroundColor: '#333333',
    borderRadius: 8,
    justifyContent: 'center',
    minWidth: 120,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  viewText: {
    color: '#ffffff',
    fontSize: 14,
  },
  container: {
    alignItems: 'center',
    alignSelf: 'center',
    gap: 12,
    padding: 16,
  },
  hint: {
    color: '#666666',
    fontSize: 12,
    textAlign: 'center',
  },
  outline: {
    borderColor: '#FF6B35',
    borderWidth: 4,
    outlineWidth: 0,
  },
});

function getOutlineStyle({ focused }: { focused: boolean }) {
  const baseStyles = isWeb
    ? [styles.viewBase, { outlineStyle: 'none' as const }]
    : [styles.viewBase];

  return [...baseStyles, focused && styles.outline];
}
