import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Progress, type ProgressState } from '@base-ui-rn/progress';
import { Gallery, Section, theme } from '@base-ui-rn/playbook';

export function ProgressPlaybook() {
  const [value, setValue] = React.useState(0);

  // Simulate changes
  React.useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (value >= 100) {
      timeout = setTimeout(() => setValue(0), 2000);
    } else {
      timeout = setTimeout(() => {
        setValue((v) => Math.min(100, v + Math.floor(Math.random() * 5) + 1));
      }, 100);
    }

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <Gallery title='Progress'>
      <Section title='Basic'>
        <View style={styles.container}>
          <Progress.Root value={value} style={styles.meterRoot}>
            <View style={styles.meterHeader}>
              <Progress.Label style={styles.meterLabel}>
                Exporting data...
              </Progress.Label>
              <Progress.Value style={styles.meterValue} />
            </View>
            <Progress.Track style={styles.meterTrack}>
              <Progress.Indicator style={styles.meterIndicator} />
            </Progress.Track>
          </Progress.Root>
          <Text style={styles.hint}>Value: {value}%</Text>
        </View>
      </Section>

      <Section title='Indeterminate'>
        <View style={styles.container}>
          <Progress.Root value={null} style={styles.meterRoot}>
            <View style={styles.meterHeader}>
              <Progress.Label style={styles.meterLabel}>
                Searching...
              </Progress.Label>
            </View>
            <Progress.Track style={styles.meterTrack}>
              <Progress.Indicator
                style={[styles.meterIndicator, styles.indicatorIndeterminate]}
              />
            </Progress.Track>
          </Progress.Root>
          <Text style={styles.hint}>Indeterminate state has no value</Text>
        </View>
      </Section>

      <Section title='Custom Format'>
        <View style={styles.container}>
          <Progress.Root
            value={3}
            max={10}
            getAriaValueText={(formatted) => `Step ${formatted} of 10`}
            style={styles.meterRoot}
          >
            <View style={styles.meterHeader}>
              <Progress.Label style={styles.meterLabel}>
                Installation
              </Progress.Label>
              <Progress.Value style={styles.meterValue}>
                {(formatted) => `Step ${formatted} / 10`}
              </Progress.Value>
            </View>
            <Progress.Track style={styles.meterTrack}>
              <Progress.Indicator
                style={[styles.meterIndicator, styles.indicatorSuccess]}
              />
            </Progress.Track>
          </Progress.Root>
        </View>
      </Section>

      <Section title='State Data Attributes'>
        <View style={styles.container}>
          <Progress.Root value={value} style={styles.meterRoot}>
            {(state) => (
              <>
                <Progress.Label style={getProgressLabelStyle(state)}>
                  {state.isComplete ? '✓ Completed' : 'Processing...'}
                </Progress.Label>
                <Progress.Track style={styles.meterTrack}>
                  <Progress.Indicator
                    style={[styles.meterIndicator, styles.indicatorComplete]}
                  />
                </Progress.Track>
              </>
            )}
          </Progress.Root>
          <Text style={styles.hint}>
            Uses render function to style based on isComplete
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
  indicatorIndeterminate: {
    width: '30%',
    backgroundColor: '#8B5CF6',
  },
  indicatorSuccess: {
    backgroundColor: '#10B981',
  },
  indicatorComplete: {
    backgroundColor: '#059669',
  },
  hint: {
    fontSize: theme.font.size.xs,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  complete: {
    color: '#10B981',
    fontWeight: theme.font.weight.bold,
  },
});

function getProgressLabelStyle(state: ProgressState) {
  return [styles.meterLabel, state.isComplete && styles.complete];
}
