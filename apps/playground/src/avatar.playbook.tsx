import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
      <Section title='Basic Usage'>
        <View style={styles.container}>
          <Avatar.Root style={styles.avatar}>
            <Avatar.Image
              source={{ uri: 'https://github.com/shadcn.png' }}
              style={styles.image}
              onLoadingStatusChange={status1.setValue}
            />
            <Avatar.Fallback style={styles.fallback}>
              <Text style={styles.fallbackText}>CN</Text>
            </Avatar.Fallback>
          </Avatar.Root>
          <LiveConsole title='Loading Status' state={status1} />
        </View>
      </Section>

      <Section title='Error State with Fallback'>
        <View style={styles.container}>
          <Avatar.Root style={styles.avatar}>
            <Avatar.Image
              source={{ uri: 'https://invalid-url.com/image.png' }}
              style={styles.image}
              onLoadingStatusChange={status2.setValue}
            />
            <Avatar.Fallback style={styles.fallback}>
              <Text style={styles.fallbackText}>JD</Text>
            </Avatar.Fallback>
          </Avatar.Root>
          <LiveConsole title='Loading Status' state={status2} />
        </View>
      </Section>

      <Section title='Loading State with Delay'>
        <View style={styles.container}>
          <Avatar.Root style={styles.avatar}>
            <Avatar.Image
              source={{ uri: 'https://github.com/google.png' }}
              style={styles.image}
              onLoadingStatusChange={status3.setValue}
            />
            <Avatar.Fallback style={styles.fallback} delay={1000}>
              <Text style={styles.fallbackText}>GO</Text>
            </Avatar.Fallback>
          </Avatar.Root>
          <LiveConsole title='Loading Status' state={status3} />
          <Text style={styles.hint}>
            The fallback will only appear if loading takes more than 1s.
          </Text>
        </View>
      </Section>
    </Gallery>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    gap: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  fallback: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0071E3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  hint: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});
