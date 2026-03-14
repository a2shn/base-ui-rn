import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Slider, type SliderState } from '@base-ui-rn/slider';
import { Gallery, Section, theme } from '@base-ui-rn/playbook';

export function SliderPlaybook() {
  return (
    <Gallery title='Slider'>
      <Section title='Basic'>
        <View style={styles.container}>
          <Slider.Root defaultValue={25}>
            <Slider.Label style={styles.label}>Volume</Slider.Label>
            <Slider.Control style={styles.control}>
              <Slider.Track style={styles.track}>
                <Slider.Indicator style={styles.indicator} />
                <Slider.Thumb style={styles.thumb} />
              </Slider.Track>
            </Slider.Control>
            <Slider.Value />
          </Slider.Root>
        </View>
      </Section>

      <Section title='Range'>
        <View style={styles.container}>
          <Slider.Root defaultValue={[25, 75]}>
            <Slider.Label style={styles.label}>Price Range</Slider.Label>
            <Slider.Control style={styles.control}>
              <Slider.Track style={styles.track}>
                <Slider.Indicator style={styles.indicator} />
                <Slider.Thumb index={0} style={styles.thumb} />
                <Slider.Thumb index={1} style={styles.thumb} />
              </Slider.Track>
            </Slider.Control>
            <Slider.Value />
          </Slider.Root>
        </View>
      </Section>

      <Section title='Vertical'>
        <View style={[styles.container, { height: 200 }]}>
          <Slider.Root defaultValue={50} orientation='vertical'>
            <Slider.Control style={[styles.control, styles.controlVertical]}>
              <Slider.Track style={[styles.track, styles.trackVertical]}>
                <Slider.Indicator style={styles.indicator} />
                <Slider.Thumb style={styles.thumb} />
              </Slider.Track>
            </Slider.Control>
          </Slider.Root>
        </View>
      </Section>

      <Section title='Custom Step (10)'>
        <View style={styles.container}>
          <Slider.Root defaultValue={40} step={10}>
            <Slider.Control style={styles.control}>
              <Slider.Track style={styles.track}>
                <Slider.Indicator style={styles.indicator} />
                <Slider.Thumb style={styles.thumb} />
              </Slider.Track>
            </Slider.Control>
            <Slider.Value />
          </Slider.Root>
        </View>
      </Section>
    </Gallery>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
    width: '100%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  label: {
    fontSize: theme.font.size.md,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  control: {
    width: 200,
    height: 40,
    justifyContent: 'center',
  },
  controlVertical: {
    width: 40,
    height: '100%',
    alignItems: 'center',
  },
  track: {
    height: 4,
    width: '100%',
    backgroundColor: theme.colors.border,
    borderRadius: 2,
  },
  trackVertical: {
    width: 4,
    height: '100%',
  },
  indicator: {
    backgroundColor: '#0A7EA4',
    borderRadius: 2,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
