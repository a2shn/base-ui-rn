import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Slider,
  type SliderThumbState,
} from '@base-ui-rn/slider';
import { Gallery, Section, theme } from '@base-ui-rn/playbook';

export function SliderPlaybook() {
  const [value, setValue] = React.useState(25);
  const [rangeValue, setRangeValue] = React.useState<number[]>([20, 70]);

  return (
    <Gallery title='Slider'>
      <Section title='Basic'>
        <View style={styles.container}>
          <Slider.Root
            value={value}
            onValueChange={(nextValue) => {
              if (typeof nextValue === 'number') {
                setValue(nextValue);
              }
            }}
            style={styles.root}
          >
            <Slider.Label style={styles.label}>Volume</Slider.Label>
            <Slider.Control style={styles.control}>
              <Slider.Track style={styles.track}>
                <Slider.Indicator style={styles.indicator} />
                <Slider.Thumb aria-label='Volume' style={getThumbStyle} />
              </Slider.Track>
            </Slider.Control>
            <Slider.Value style={styles.value}>
              {(_formatted, values) => `${values[0]}%`}
            </Slider.Value>
          </Slider.Root>
        </View>
      </Section>

      <Section title='Range'>
        <View style={styles.container}>
          <Slider.Root
            value={rangeValue}
            onValueChange={(nextValue) => {
              if (Array.isArray(nextValue)) {
                setRangeValue(nextValue);
              }
            }}
            style={styles.root}
          >
            <Slider.Label style={styles.label}>Price range</Slider.Label>
            <Slider.Control style={styles.control}>
              <Slider.Track style={styles.track}>
                <Slider.Indicator style={styles.indicator} />

                <Slider.Thumb
                  index={0}
                  aria-label='Minimum price'
                  style={getThumbStyle}
                />
                <Slider.Thumb
                  index={1}
                  aria-label='Maximum price'
                  style={getThumbStyle}
                />
              </Slider.Track>
            </Slider.Control>
            <Slider.Value style={styles.value}>
              {(formattedValues) =>
                `$${formattedValues[0]} - $${formattedValues[1]}`
              }
            </Slider.Value>
          </Slider.Root>
        </View>
      </Section>

      <Section title='Disabled'>
        <View style={styles.container}>
          <Slider.Root defaultValue={40} disabled style={styles.root}>
            <Slider.Label style={styles.label}>Disabled slider</Slider.Label>
            <Slider.Control style={styles.control}>
              <Slider.Track style={styles.track}>
                <Slider.Indicator style={styles.indicator} />
                <Slider.Thumb
                  aria-label='Disabled value'
                  style={getThumbStyle}
                />
              </Slider.Track>
            </Slider.Control>
            <Slider.Value style={styles.value} />
          </Slider.Root>
          <Text style={styles.hint}>
            Keyboard and pointer interactions are blocked.
          </Text>
        </View>
      </Section>
    </Gallery>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
    padding: theme.spacing.lg,
  },
  root: {
    gap: theme.spacing.sm,
  },
  label: {
    fontSize: theme.font.size.md,
    color: theme.colors.textPrimary,
    fontWeight: theme.font.weight.medium,
  },
  value: {
    fontSize: theme.font.size.sm,
    color: theme.colors.textSecondary,
  },
  control: {
    width: '100%',
    height: 32,
    justifyContent: 'center',
  },
  track: {
    height: 6,
    width: '100%',
    borderRadius: 999,
    backgroundColor: theme.colors.bgCanvas,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: 'center',
  },
  indicator: {
    borderRadius: 999,
    backgroundColor: '#4A90D9',
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#23527C',
    backgroundColor: '#FFFFFF',
  },
  thumbDisabled: {
    opacity: 0.6,
    borderColor: theme.colors.textMuted,
  },
  hint: {
    marginTop: theme.spacing.sm,
    color: theme.colors.textMuted,
    fontSize: theme.font.size.xs,
  },
});


function getThumbStyle(state: SliderThumbState) {
  return state.disabled
    ? { ...styles.thumb, ...styles.thumbDisabled }
    : styles.thumb;
}
