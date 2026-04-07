import { Meter } from '@base-ui-rn/meter';
import { Gallery, Section, theme } from '@base-ui-rn/playbook';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function MeterPlaybook() {
  return (
    <Gallery title='Meter'>
      <Section title='Basic'>
        <View style={styles.container}>
          <Meter.Root style={styles.meterRoot} value={24}>
            <View style={styles.meterHeader}>

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
          <Meter.Root max={500} min={0} style={styles.meterRoot} value={350}>
            <View style={styles.meterHeader}>

              <Meter.Value style={styles.meterValue}>
                {(state) => `${state.formattedValue} / 500`}
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
            format={{ currency: 'USD', style: 'currency' }}
            max={1000}
            style={styles.meterRoot}
            value={750}
          >
            <View style={styles.meterHeader}>

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
            getAccessibilityValueText={(value) => `${value}% critical`}
            style={styles.meterRoot}
            value={85}
          >
            <View style={styles.meterHeader}>

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
    alignItems: 'center',
    alignSelf: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
  },
  hint: {
    color: theme.colors.textMuted,
    fontSize: theme.font.size.xs,
    textAlign: 'center',
  },
  indicatorCritical: {
    backgroundColor: '#EF4444',
  },
  indicatorSuccess: {
    backgroundColor: '#10B981',
  },
  indicatorWarning: {
    backgroundColor: '#F59E0B',
  },
  meterHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  meterIndicator: {
    backgroundColor: '#4A90D9', // Accent color
    height: '100%',
    width: '100%',
  },
  meterLabel: {
    color: theme.colors.textPrimary,
    fontSize: theme.font.size.md,
    fontWeight: theme.font.weight.medium,
  },
  meterRoot: {
    gap: theme.spacing.sm,
    width: 200,
  },
  meterTrack: {
    backgroundColor: theme.colors.bgCanvas,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    height: 8,
    overflow: 'hidden',
    width: '100%',
  },
  meterValue: {
    color: theme.colors.textSecondary,
    fontSize: theme.font.size.md,
  },
});
