import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Meter } from '@base-ui-rn/meter';
import { Gallery, Section, theme } from '@base-ui-rn/playbook';

export function MeterPlaybook() {
  return (
    <Gallery title='Meter'>
      <Section title='Basic'>
        <View style={styles.container}>
          <Meter.Root value={24} style={styles.meterRoot}>
            <View style={styles.meterHeader}>
              <Meter.Label style={styles.meterLabel}>Storage Used</Meter.Label>
              <Meter.Value style={styles.meterValue} />
            </View>
            <Meter.Track style={styles.meterTrack}>
              <Meter.Indicator style={styles.meterIndicator} />
            </Meter.Track>
          </Meter.Root>
        </View>
      </Section>

      <Section title='Custom Range (0-500)'>
        <View style={styles.container}>
          <Meter.Root value={350} min={0} max={500} style={styles.meterRoot}>
            <View style={styles.meterHeader}>
              <Meter.Label style={styles.meterLabel}>Points</Meter.Label>
              <Meter.Value style={styles.meterValue}>
                {(_, value) => `${value} / 500`}
              </Meter.Value>
            </View>
            <Meter.Track style={styles.meterTrack}>
              <Meter.Indicator
                style={[styles.meterIndicator, styles.indicatorSuccess]}
              />
            </Meter.Track>
          </Meter.Root>
        </View>
      </Section>

      <Section title='Formatted Value (Currency)'>
        <View style={styles.container}>
          <Meter.Root
            value={750}
            max={1000}
            format={{ style: 'currency', currency: 'USD' }}
            style={styles.meterRoot}
          >
            <View style={styles.meterHeader}>
              <Meter.Label style={styles.meterLabel}>Budget</Meter.Label>
              <Meter.Value style={styles.meterValue} />
            </View>
            <Meter.Track style={styles.meterTrack}>
              <Meter.Indicator
                style={[styles.meterIndicator, styles.indicatorWarning]}
              />
            </Meter.Track>
          </Meter.Root>
        </View>
      </Section>

      <Section title='Custom Accessibility Text'>
        <View style={styles.container}>
          <Meter.Root
            value={85}
            getAriaValueText={(value) => `${value}% critical`}
            style={styles.meterRoot}
          >
            <View style={styles.meterHeader}>
              <Meter.Label style={styles.meterLabel}>CPU Load</Meter.Label>
              <Meter.Value style={styles.meterValue} />
            </View>
            <Meter.Track style={styles.meterTrack}>
              <Meter.Indicator
                style={[styles.meterIndicator, styles.indicatorCritical]}
              />
            </Meter.Track>
          </Meter.Root>
          <Text style={styles.hint}>
            Check screen reader output for "85% critical"
          </Text>
        </View>
      </Section>
    </Gallery>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
    alignItems: 'center',
    alignSelf: 'center',
  },
  meterRoot: {
    width: 200,
    gap: theme.spacing.sm,
  },
  meterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meterLabel: {
    fontSize: theme.font.size.md,
    fontWeight: theme.font.weight.medium,
    color: theme.colors.textPrimary,
  },
  meterValue: {
    fontSize: theme.font.size.md,
    color: theme.colors.textSecondary,
  },
  meterTrack: {
    height: 8,
    width: '100%',
    backgroundColor: theme.colors.bgCanvas,
    borderRadius: theme.radius.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  meterIndicator: {
    height: '100%',
    width: '100%',
    backgroundColor: '#4A90D9', // Accent color
  },
  indicatorSuccess: {
    backgroundColor: '#10B981',
  },
  indicatorWarning: {
    backgroundColor: '#F59E0B',
  },
  indicatorCritical: {
    backgroundColor: '#EF4444',
  },
  hint: {
    fontSize: theme.font.size.xs,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});
