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
            Uses focusRingStyle from useFocusRing when focusVisible is true.
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
  const { focusVisible, focusRingStyle, onFocus, onBlur } = useFocusRing();

  return (
    <View
      onFocus={onFocus}
      onBlur={onBlur}
      tabIndex={0}
      style={[styles.viewBase, focusRingStyle]}
    >
      <Text style={styles.viewText}>
        {focusVisible ? 'Focused' : 'Focus Me'}
      </Text>
    </View>
  );
}

function ThemedFocusRingView({
  style,
}: {
  style: (state: { focusVisible: boolean }) => object;
}) {
  const { focusVisible, onFocus, onBlur } = useFocusRing({
    disableDefaultFocusRing: true,
  });

  return (
    <View
      onFocus={onFocus}
      onBlur={onBlur}
      tabIndex={0}
      style={style({ focusVisible })}
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

function getOutlineStyle({ focusVisible }: { focusVisible: boolean }) {
  const baseStyles = isWeb
    ? [styles.viewBase, { outlineStyle: 'none' as const }]
    : [styles.viewBase];

  return [...baseStyles, focusVisible && styles.outline];
}
