import {
  Gallery,
  Section,
  theme,
  usePlaybookToggles,
} from '@base-ui-rn/playbook';
import { Progress, type ProgressState } from '@base-ui-rn/progress';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function ProgressPlaybook() {
  const { progressValue } = usePlaybookToggles({
    progressValue: 0,
  });

  // Simulate changes
  React.useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (progressValue.value >= 100) {
      return () => clearTimeout(timeout);
    } else {
      timeout = setTimeout(() => {
        progressValue.setValue((v) =>
          Math.min(100, v + Math.floor(Math.random() * 5) + 1),
        );
      }, 100);
    }

    return () => clearTimeout(timeout);
  }, [progressValue.value]);

  return (
    <Gallery title='Progress'>
      <Section title='Basic'>
        <View style={styles.container}>
          <Progress.Root style={styles.meterRoot} value={progressValue.value}>
            <View style={styles.meterHeader}>
              <Progress.Label style={styles.meterLabel}>
                Exporting data...
              </Progress.Label>
              <Progress.Value style={styles.meterValue} />
            </View>
            <Progress.Track style={styles.meterTrack}>
              <Progress.Indicator
                style={(state) => [
                  styles.meterIndicator,
                  { width: state.percentage ? `${state.percentage}%` : '0%' },
                ]}
              />
            </Progress.Track>
          </Progress.Root>
          <Text style={styles.hint}>Value: {progressValue.value}%</Text>
        </View>
      </Section>

      <Section title='Indeterminate'>
        <View style={styles.container}>
          <Progress.Root style={styles.meterRoot} value={null}>
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
            getAriaValueText={(formatted) => `Step ${formatted} of 10`}
            max={10}
            style={styles.meterRoot}
            value={3}
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
                style={(state) => [
                  styles.meterIndicator,
                  styles.indicatorSuccess,
                  { width: state.percentage ? `${state.percentage}%` : '0%' },
                ]}
              />
            </Progress.Track>
          </Progress.Root>
        </View>
      </Section>

      <Section title='State Data Attributes'>
        <View style={styles.container}>
          <Progress.Root style={styles.meterRoot} value={progressValue.value}>
            <Progress.Label style={(state) => getProgressLabelStyle(state)}>
              {(state) => (state.isComplete ? '✓ Completed' : 'Processing...')}
            </Progress.Label>
            <Progress.Track style={styles.meterTrack}>
              <Progress.Indicator
                style={(state) => [
                  styles.meterIndicator,
                  styles.indicatorComplete,
                  { width: state.percentage ? `${state.percentage}%` : '0%' },
                ]}
              />
            </Progress.Track>
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
  complete: {
    color: '#10B981',
    fontWeight: theme.font.weight.bold,
  },
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
  indicatorComplete: {
    backgroundColor: '#059669',
  },
  indicatorIndeterminate: {
    backgroundColor: '#8B5CF6',
    width: '30%',
  },
  indicatorSuccess: {
    backgroundColor: '#10B981',
  },
  meterHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  meterIndicator: {
    backgroundColor: '#4A90D9', // Accent color
    height: '100%',
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

function getProgressLabelStyle(state: ProgressState) {
  return [styles.meterLabel, state.isComplete && styles.complete];
}
