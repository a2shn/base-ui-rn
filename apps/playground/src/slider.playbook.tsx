import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Slider, type SliderThumbState } from '@base-ui-rn/slider';
import {
  Gallery,
  Section,
  usePlaybookToggles,
  LiveConsole,
  theme,
} from '@base-ui-rn/playbook';

export function SliderPlaybook() {
  const {
    basicValue,
    independentValue,
    swapValue,
    pushValue,
    fixedValue,
    maxStepsValue,
  } = usePlaybookToggles({
    basicValue: 25,
    independentValue: [20, 50, 80] as number[],
    swapValue: [20, 70] as number[],
    pushValue: [10, 20, 30, 40] as number[],
    fixedValue: [20, 40, 60] as number[],
    maxStepsValue: [10, 50] as number[],
  });

  return (
    <Gallery title='Slider'>
      <Section title='Basic' showAllProps>
        <View style={styles.container}>
          <Slider.Root
            value={basicValue.value as number}
            onValueChange={(nextValue) => {
              if (typeof nextValue === 'number') {
                basicValue.setValue(nextValue);
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
          </Slider.Root>
          <LiveConsole title='basicValue' state={basicValue} />
        </View>
      </Section>

      <Section title='Independent (None)'>
        <View style={styles.container}>
          <Slider.Root
            value={independentValue.value as number[]}
            onValueChange={(nextValue) => {
              if (Array.isArray(nextValue)) {
                independentValue.setValue(nextValue);
              }
            }}
            style={styles.root}
            thumbCollisionBehavior='none'
          >
            <Slider.Label style={styles.label}>
              Multi-thumb Overlap
            </Slider.Label>
            <Slider.Control style={styles.control}>
              <Slider.Track style={styles.track}>
                <Slider.Indicator style={styles.indicator} />

                {(independentValue.value as number[]).map((_, i) => (
                  <Slider.Thumb
                    key={i}
                    index={i}
                    aria-label={`Thumb ${i + 1}`}
                    style={getThumbStyle}
                  />
                ))}
              </Slider.Track>
            </Slider.Control>
            <Slider.Value style={styles.value}>
              {(formattedValues) => formattedValues.join(' | ')}
            </Slider.Value>
          </Slider.Root>
          <Text style={styles.hint}>
            Thumbs can pass through and overlap each other freely.
          </Text>
          <LiveConsole title='independentValue' state={independentValue} />
        </View>
      </Section>

      <Section title='Swap Behavior'>
        <View style={styles.container}>
          <Slider.Root
            value={swapValue.value as number[]}
            onValueChange={(nextValue) => {
              if (Array.isArray(nextValue)) {
                swapValue.setValue(nextValue);
              }
            }}
            style={styles.root}
            thumbCollisionBehavior='swap'
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
          <LiveConsole title='swapValue' state={swapValue} />
        </View>
      </Section>

      <Section title='Push Behavior'>
        <View style={styles.container}>
          <Slider.Root
            value={pushValue.value as number[]}
            thumbCollisionBehavior='push'
            minStepsBetweenValues={5}
            thumbAlignment='edge'
            onValueChange={(nextValue) => {
              if (Array.isArray(nextValue)) {
                pushValue.setValue(nextValue);
              }
            }}
            style={styles.root}
          >
            <Slider.Label style={styles.label}>Multi-thumb push</Slider.Label>
            <Slider.Control style={styles.control}>
              <Slider.Track style={styles.track}>
                <Slider.Indicator style={styles.indicator} />
                {(pushValue.value as number[]).map((_, i) => (
                  <Slider.Thumb
                    key={i}
                    index={i}
                    aria-label={`Thumb ${i + 1}`}
                    style={getThumbStyle}
                  />
                ))}
              </Slider.Track>
            </Slider.Control>
            <Slider.Value style={styles.value}>
              {(formattedValues) => formattedValues.join(' | ')}
            </Slider.Value>
          </Slider.Root>
          <Text style={styles.hint}>
            Thumbs push each other and maintain a minimum distance of 5 steps.
          </Text>
          <LiveConsole title='pushValue' state={pushValue} />
        </View>
      </Section>

      <Section title='Fixed Step Behavior'>
        <View style={styles.container}>
          <Slider.Root
            value={fixedValue.value as number[]}
            stepBetweenValues={20}
            onValueChange={(nextValue) => {
              if (Array.isArray(nextValue)) {
                fixedValue.setValue(nextValue);
              }
            }}
            style={styles.root}
          >
            <Slider.Label style={styles.label}>
              Fixed-distance chain
            </Slider.Label>
            <Slider.Control style={styles.control}>
              <Slider.Track style={styles.track}>
                <Slider.Indicator style={styles.indicator} />
                {(fixedValue.value as number[]).map((_, i) => (
                  <Slider.Thumb
                    key={i}
                    index={i}
                    aria-label={`Thumb ${i + 1}`}
                    style={getThumbStyle}
                  />
                ))}
              </Slider.Track>
            </Slider.Control>
            <Slider.Value style={styles.value}>
              {(formattedValues) => formattedValues.join(' | ')}
            </Slider.Value>
          </Slider.Root>
          <Text style={styles.hint}>
            Thumbs maintain a fixed distance of exactly 20 steps. Moving one
            pulls or pushes the others.
          </Text>
          <LiveConsole title='fixedValue' state={fixedValue} />
        </View>
      </Section>

      <Section title='Max Steps Between Values'>
        <View style={styles.container}>
          <Slider.Root
            value={maxStepsValue.value as number[]}
            maxStepsBetweenValues={30}
            thumbCollisionBehavior='push'
            onValueChange={(nextValue) => {
              if (Array.isArray(nextValue)) {
                maxStepsValue.setValue(nextValue);
              }
            }}
            style={styles.root}
          >
            <Slider.Label style={styles.label}>
              Max distance constraint
            </Slider.Label>
            <Slider.Control style={styles.control}>
              <Slider.Track style={styles.track}>
                <Slider.Indicator style={styles.indicator} />
                <Slider.Thumb
                  index={0}
                  aria-label='Min'
                  style={getThumbStyle}
                />
                <Slider.Thumb
                  index={1}
                  aria-label='Max'
                  style={getThumbStyle}
                />
              </Slider.Track>
            </Slider.Control>
            <Slider.Value style={styles.value}>
              {(formattedValues) => formattedValues.join(' | ')}
            </Slider.Value>
          </Slider.Root>
          <Text style={styles.hint}>
            Thumbs cannot be more than 30 steps apart. Try moving one thumb far
            away - the other will be pulled along.
          </Text>
          <LiveConsole title='maxStepsValue' state={maxStepsValue} />
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
    gap: theme.spacing.md,
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
    height: '100%',
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
    color: theme.colors.textMuted,
    fontSize: theme.font.size.xs,
  },
});

function getThumbStyle(state: SliderThumbState) {
  return state.disabled
    ? { ...styles.thumb, ...styles.thumbDisabled }
    : styles.thumb;
}
