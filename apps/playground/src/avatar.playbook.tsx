import { Avatar } from '@base-ui-rn/avatar';
import {
  Gallery,
  LiveConsole,
  Section,
  theme,
  usePlaybookToggles,
} from '@base-ui-rn/playbook';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function AvatarPlaybook() {
  const { status1, status2, status3 } = usePlaybookToggles({
    status1: 'idle',
    status2: 'idle',
    status3: 'idle',
  });

  return (
    <Gallery title='Avatar'>
      <Section title='Basic'>
        <View style={styles.container}>
          <Avatar.Root
            accessibilityHint='Displays user profile picture'
            accessibilityLabel='User avatar'
            style={styles.avatar}
          >
            <Avatar.Image
              height={60}
              onLoadingStatusChange={status1.setValue}
              source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
              style={styles.image}
              width={60}
            />
            <Avatar.Fallback style={styles.fallback}>
              <Text style={styles.fallbackText}>CN</Text>
            </Avatar.Fallback>
          </Avatar.Root>
          <LiveConsole state={status1} title='Loading Status' />
        </View>
      </Section>

      <Section title='Error Fallback'>
        <View style={styles.container}>
          <Avatar.Root
            accessibilityHint='Displays initials when image fails to load'
            accessibilityLabel='Error avatar showing fallback'
            style={styles.avatar}
          >
            <Avatar.Image
              height={60}
              onLoadingStatusChange={status2.setValue}
              source={{ uri: 'https://invalid-url-example.com/image.png' }}
              style={styles.image}
              width={60}
            />
            <Avatar.Fallback style={styles.fallback}>
              <Text style={styles.fallbackText}>JD</Text>
            </Avatar.Fallback>
          </Avatar.Root>
          <LiveConsole state={status2} title='Loading Status' />
        </View>
      </Section>

      <Section title='Loading Delay'>
        <View style={styles.container}>
          <Avatar.Root
            accessibilityHint='Displays fallback after a delay during loading'
            accessibilityLabel='Loading avatar with delayed fallback'
            style={styles.avatar}
          >
            <Avatar.Image
              height={60}
              onLoadingStatusChange={status3.setValue}
              source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
              style={styles.image}
              width={60}
            />
            <Avatar.Fallback delay={300} style={styles.fallback}>
              <Text style={styles.fallbackText}>VL</Text>
            </Avatar.Fallback>
          </Avatar.Root>
          <LiveConsole state={status3} title='Loading Status' />
          <Text style={styles.hint}>
            The fallback will only appear if loading takes more than 300ms.
          </Text>
        </View>
      </Section>
    </Gallery>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.lg * 2.5, // 30 is 60/2. radius.lg is 12, so 30 is lg*2.5
    height: 60,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 60,
  },
  container: {
    alignItems: 'center',
    alignSelf: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.sm,
  },
  fallback: {
    alignItems: 'center',
    backgroundColor: theme.colors.borderLight,
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  fallbackText: {
    color: theme.colors.textPrimary,
    fontSize: theme.font.size.xl,
    fontWeight: theme.font.weight.bold,
  },
  hint: {
    color: theme.colors.textMuted,
    fontSize: theme.font.size.xs,
    textAlign: 'center',
  },
  image: {
    height: '100%',
    position: 'absolute',
    width: '100%',
  },
});
