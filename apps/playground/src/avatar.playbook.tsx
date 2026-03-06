import * as React from 'react';
import { View, Text } from 'react-native';
import styles from './playbookStyles';
import { Avatar } from '@base-ui-rn/avatar';
import {
  Gallery,
  Section,
  LiveConsole,
  usePlaybookToggles,
} from '@base-ui-rn/playbook';

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
            style={styles.avatar}
            accessibilityLabel='User avatar'
            accessibilityHint='Displays user profile picture'
          >
            <Avatar.Image
              source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
              style={styles.image}
              width={60}
              height={60}
              onLoadingStatusChange={status1.setValue}
            />
            <Avatar.Fallback style={styles.fallback}>
              <Text style={styles.fallbackText}>CN</Text>
            </Avatar.Fallback>
          </Avatar.Root>
          <LiveConsole title='Loading Status' state={status1} />
        </View>
      </Section>

      <Section title='Error Fallback'>
        <View style={styles.container}>
          <Avatar.Root
            style={styles.avatar}
            accessibilityLabel='Error avatar showing fallback'
            accessibilityHint='Displays initials when image fails to load'
          >
            <Avatar.Image
              source={{ uri: 'https://invalid-url-example.com/image.png' }}
              style={styles.image}
              onLoadingStatusChange={status2.setValue}
              width={60}
              height={60}
            />
            <Avatar.Fallback style={styles.fallback}>
              <Text style={styles.fallbackText}>JD</Text>
            </Avatar.Fallback>
          </Avatar.Root>
          <LiveConsole title='Loading Status' state={status2} />
        </View>
      </Section>

      <Section title='Loading Delay'>
        <View style={styles.container}>
          <Avatar.Root
            style={styles.avatar}
            accessibilityLabel='Loading avatar with delayed fallback'
            accessibilityHint='Displays fallback after a delay during loading'
          >
            <Avatar.Image
              source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
              style={styles.image}
              width={60}
              height={60}
              onLoadingStatusChange={status3.setValue}
            />
            <Avatar.Fallback style={styles.fallback} delay={300}>
              <Text style={styles.fallbackText}>VL</Text>
            </Avatar.Fallback>
          </Avatar.Root>
          <LiveConsole title='Loading Status' state={status3} />
          <Text style={styles.hint}>
            The fallback will only appear if loading takes more than 300ms.
          </Text>
        </View>
      </Section>
    </Gallery>
  );
}
