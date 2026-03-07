import * as React from 'react';
import { View, Text } from 'react-native';
import styles from './playbookStyles';
import { Progress } from '@base-ui-rn/progress';
import { Gallery, Section } from '@base-ui-rn/playbook';

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
                style={[
                  styles.meterIndicator,
                  { width: '30%', backgroundColor: '#8B5CF6' },
                ]}
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
                style={[styles.meterIndicator, { backgroundColor: '#10B981' }]}
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
                <Progress.Label
                  style={[
                    styles.meterLabel,
                    state.isComplete && {
                      color: '#059669',
                      fontWeight: 'bold' as const,
                    },
                  ]}
                >
                  {state.isComplete ? '✓ Completed' : 'Processing...'}
                </Progress.Label>
                <Progress.Track style={styles.meterTrack}>
                  <Progress.Indicator
                    style={[
                      styles.meterIndicator,
                      { backgroundColor: '#059669' },
                    ]}
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
