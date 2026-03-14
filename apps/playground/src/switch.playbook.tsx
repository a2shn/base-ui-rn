import * as React from 'react';
import { Text, View, StyleSheet, Animated } from 'react-native';
import { Switch } from '@base-ui-rn/switch';
import {
  Gallery,
  Section,
  usePlaybookToggles,
  LiveConsole,
  theme,
} from '@base-ui-rn/playbook';

export function SwitchPlaybook() {
  const { darkMode } = usePlaybookToggles({
    darkMode: false,
  });

  return (
    <Gallery title='Switch'>
      <Section title='Uncontrolled'>
        <View style={styles.row}>
          <Switch.Root style={styles.rootBase} defaultChecked>
            <AnimatedThumb />
          </Switch.Root>
          <Text style={styles.label}>Notifications</Text>
        </View>
      </Section>

      <Section title='Controlled'>
        <View style={styles.row}>
          <Switch.Root
            style={styles.rootBase}
            checked={darkMode.value as boolean}
            onCheckedChange={darkMode.setValue}
          >
            <AnimatedThumb />
          </Switch.Root>
          <Text style={styles.label}>Dark Mode</Text>
        </View>
        <LiveConsole title='darkMode' state={darkMode} />
      </Section>

      <Section title='Disabled'>
        <View style={styles.row}>
          <Switch.Root style={[styles.rootBase, styles.rootDisabled]} disabled>
            <AnimatedThumb />
          </Switch.Root>
          <Text style={styles.label}>Disabled Off</Text>
        </View>
        <View style={styles.row}>
          <Switch.Root
            style={[styles.rootBase, styles.rootDisabled]}
            checked
            disabled
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
            toValue: state.checked ? 20 : 0,
            useNativeDriver: false,
            bounciness: 12,
            speed: 20,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.font.size.md,
    color: theme.colors.textPrimary,
  },
  rootBase: {
    width: 44,
    height: 24,
  },
  rootBackground: {
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  rootUnchecked: {
    backgroundColor: theme.colors.border,
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
  thumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  thumbDisabled: {
    backgroundColor: '#E0E0E0',
  },
});
