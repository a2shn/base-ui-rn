import {
  Gallery,
  LiveConsole,
  Section,
  theme,
  usePlaybookToggles,
} from '@base-ui-rn/playbook';
import { Switch } from '@base-ui-rn/switch';
import * as React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

export function SwitchPlaybook() {
  const { darkMode } = usePlaybookToggles({
    darkMode: false,
  });

  return (
    <Gallery title='Switch'>
      <Section title='Uncontrolled'>
        <View style={styles.row}>
          <Switch.Root defaultChecked style={styles.rootBase}>
            <AnimatedThumb />
          </Switch.Root>
          <Text style={styles.label}>Notifications</Text>
        </View>
      </Section>

      <Section title='Controlled'>
        <View style={styles.row}>
          <Switch.Root
            checked={darkMode.value as boolean}
            onCheckedChange={darkMode.setValue}
            style={styles.rootBase}
          >
            <AnimatedThumb />
          </Switch.Root>
          <Text style={styles.label}>Dark Mode</Text>
        </View>
        <LiveConsole state={darkMode} title='darkMode' />
      </Section>

      <Section title='Disabled'>
        <View style={styles.row}>
          <Switch.Root disabled style={[styles.rootBase, styles.rootDisabled]}>
            <AnimatedThumb />
          </Switch.Root>
          <Text style={styles.label}>Disabled Off</Text>
        </View>
        <View style={styles.row}>
          <Switch.Root
            checked
            disabled
            style={[styles.rootBase, styles.rootDisabled]}
          >
            <AnimatedThumb />
          </Switch.Root>
          <Text style={styles.label}>Disabled On</Text>
        </View>
      </Section>
    </Gallery>
  );
}

// A simple wrapper to animate the thumb based on the Switch context
function AnimatedThumb() {
  const position = React.useRef(new Animated.Value(0)).current;

  return (
    <Switch.Thumb style={StyleSheet.absoluteFill}>
      {(state) => {
        // Animate whenever the checked state changes
        React.useEffect(() => {
          Animated.spring(position, {
            bounciness: 12,
            speed: 20,
            toValue: state.checked ? 20 : 0,
            useNativeDriver: false,
          }).start();
        }, [state.checked]);

        return (
          <View
            style={[
              StyleSheet.absoluteFill,
              styles.rootBackground,
              state.checked ? styles.rootChecked : styles.rootUnchecked,
              state.focusVisible && styles.rootFocused,
            ]}
          >
            <Animated.View
              style={[
                styles.thumb,
                { transform: [{ translateX: position }] },
                state.disabled && styles.thumbDisabled,
              ]}
            />
          </View>
        );
      }}
    </Switch.Thumb>
  );
}

const styles = StyleSheet.create({
  label: {
    color: theme.colors.textPrimary,
    fontSize: theme.font.size.md,
  },
  rootBackground: {
    borderColor: 'transparent',
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    padding: 2,
  },
  rootBase: {
    height: 24,
    width: 44,
  },
  rootChecked: {
    backgroundColor: '#0A7EA4', // A nice blue
  },
  rootDisabled: {
    opacity: 0.5,
  },
  rootFocused: {
    borderColor: '#0A7EA4',
  },
  rootUnchecked: {
    backgroundColor: theme.colors.border,
  },
  row: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  thumb: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 2,
    height: 16,
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    width: 16,
  },
  thumbDisabled: {
    backgroundColor: '#E0E0E0',
  },
});
