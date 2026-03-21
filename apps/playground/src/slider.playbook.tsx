import {
  Gallery,
  LiveConsole,
  Section,
  theme,
  usePlaybookToggles,
} from '@base-ui-rn/playbook';
import { Slider, type SliderThumbState } from '@base-ui-rn/slider';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function SliderPlaybook() {
  const {
    basicValue,
    fixedValue,
    independentValue,
    maxStepsValue,
    pushValue,
    swapValue,
  } = usePlaybookToggles({
    basicValue: 25,
    fixedValue: [20, 40, 60] as number[],
    independentValue: [20, 50, 80] as number[],
    maxStepsValue: [10, 50] as number[],
    pushValue: [10, 20, 30, 40] as number[],
    swapValue: [20, 70] as number[],
  });

  return (
    <Gallery title='Slider'>
      <Section showAllProps title='Basic'>
        <View style={styles.container}>
          <Slider.Root
            onValueChange={(nextValue) => {
              if (typeof nextValue === 'number') {
                basicValue.setValue(nextValue);
              }
            }}
            style={styles.root}
            value={basicValue.value as number}
          >
            <Slider.Label style={styles.label}>Volume</Slider.Label>

              <Slider.Track style={styles.track}>
                <Slider.Indicator style={styles.indicator} />
                <Slider.Thumb aria-label='Volume' style={getThumbStyle} />
              </Slider.Track>

          </Slider.Root>
          <LiveConsole state={basicValue} title='basicValue' />
        </View>
      </Section>

      <Section title='Independent (None)'>
        <View style={styles.container}>
          <Slider.Root
            onValueChange={(nextValue) => {
              if (Array.isArray(nextValue)) {
                independentValue.setValue(nextValue);
              }
            }}
            style={styles.root}
            thumbCollisionBehavior='none'
            value={independentValue.value as number[]}
          >
            <Slider.Label style={styles.label}>
              Multi-thumb Overlap
            </Slider.Label>

              <Slider.Track style={styles.track}>
                <Slider.Indicator style={styles.indicator} />

                {(independentValue.value as number[]).map((_, i) => (
                  <Slider.Thumb
                    aria-label={`Thumb ${i + 1}`}
                    index={i}
                    key={i}
                    style={getThumbStyle}
                  />
                ))}
              </Slider.Track>

            <Slider.Value style={styles.value}>
              {(formattedValues) => formattedValues.join(' | ')}
            </Slider.Value>
          </Slider.Root>
          <Text style={styles.hint}>
            Thumbs can pass through and overlap each other freely.
          </Text>
          <LiveConsole state={independentValue} title='independentValue' />
        </View>
      </Section>

      <Section title='Swap Behavior'>
        <View style={styles.container}>
          <Slider.Root
            onValueChange={(nextValue) => {
              if (Array.isArray(nextValue)) {
                swapValue.setValue(nextValue);
              }
            }}
            style={styles.root}
            thumbCollisionBehavior='swap'
            value={swapValue.value as number[]}
          >
            <Slider.Label style={styles.label}>Price range</Slider.Label>

              <Slider.Track style={styles.track}>
                <Slider.Indicator style={styles.indicator} />

                <Slider.Thumb
                  aria-label='Minimum price'
                  index={0}
                  style={getThumbStyle}
                />
                <Slider.Thumb
                  aria-label='Maximum price'
                  index={1}
                  style={getThumbStyle}
                />
              </Slider.Track>

            <Slider.Value style={styles.value}>
              {(formattedValues) =>
                `$${formattedValues[0]} - $${formattedValues[1]}`
              }
            </Slider.Value>
          </Slider.Root>
          <LiveConsole state={swapValue} title='swapValue' />
        </View>
      </Section>

      <Section title='Push Behavior'>
        <View style={styles.container}>
          <Slider.Root
            minStepsBetweenValues={5}
            onValueChange={(nextValue) => {
              if (Array.isArray(nextValue)) {
                pushValue.setValue(nextValue);
              }
            }}
            style={styles.root}
            thumbAlignment='edge'
            thumbCollisionBehavior='push'
            value={pushValue.value as number[]}
          >
            <Slider.Label style={styles.label}>Multi-thumb push</Slider.Label>

              <Slider.Track style={styles.track}>
                <Slider.Indicator style={styles.indicator} />
                {(pushValue.value as number[]).map((_, i) => (
                  <Slider.Thumb
                    aria-label={`Thumb ${i + 1}`}
                    index={i}
                    key={i}
                    style={getThumbStyle}
                  />
                ))}
              </Slider.Track>

            <Slider.Value style={styles.value}>
              {(formattedValues) => formattedValues.join(' | ')}
            </Slider.Value>
          </Slider.Root>
          <Text style={styles.hint}>
            Thumbs push each other and maintain a minimum distance of 5 steps.
          </Text>
          <LiveConsole state={pushValue} title='pushValue' />
        </View>
      </Section>

      <Section title='Fixed Step Behavior'>
        <View style={styles.container}>
          <Slider.Root
            onValueChange={(nextValue) => {
              if (Array.isArray(nextValue)) {
                fixedValue.setValue(nextValue);
              }
            }}
            stepBetweenValues={20}
            style={styles.root}
            value={fixedValue.value as number[]}
          >
            <Slider.Label style={styles.label}>
              Fixed-distance chain
            </Slider.Label>

              <Slider.Track style={styles.track}>
                <Slider.Indicator style={styles.indicator} />
                {(fixedValue.value as number[]).map((_, i) => (
                  <Slider.Thumb
                    aria-label={`Thumb ${i + 1}`}
                    index={i}
                    key={i}
                    style={getThumbStyle}
                  />
                ))}
              </Slider.Track>

            <Slider.Value style={styles.value}>
              {(formattedValues) => formattedValues.join(' | ')}
            </Slider.Value>
          </Slider.Root>
          <Text style={styles.hint}>
            Thumbs maintain a fixed distance of exactly 20 steps. Moving one
            pulls or pushes the others.
          </Text>
          <LiveConsole state={fixedValue} title='fixedValue' />
        </View>
      </Section>

      <Section title='Max Steps Between Values'>
        <View style={styles.container}>
          <Slider.Root
            maxStepsBetweenValues={30}
            onValueChange={(nextValue) => {
              if (Array.isArray(nextValue)) {
                maxStepsValue.setValue(nextValue);
              }
            }}
            style={styles.root}
            thumbCollisionBehavior='push'
            value={maxStepsValue.value as number[]}
          >
            <Slider.Label style={styles.label}>
              Max distance constraint
            </Slider.Label>

              <Slider.Track style={styles.track}>
                <Slider.Indicator style={styles.indicator} />
                <Slider.Thumb
                  aria-label='Min'
                  index={0}
                  style={getThumbStyle}
                />
                <Slider.Thumb
                  aria-label='Max'
                  index={1}
                  style={getThumbStyle}
                />
              </Slider.Track>

            <Slider.Value style={styles.value}>
              {(formattedValues) => formattedValues.join(' | ')}
            </Slider.Value>
          </Slider.Root>
          <Text style={styles.hint}>
            Thumbs cannot be more than 30 steps apart. Try moving one thumb far
            away - the other will be pulled along.
          </Text>
          <LiveConsole state={maxStepsValue} title='maxStepsValue' />
        </View>
      </Section>

      <Section title='Disabled'>
        <View style={styles.container}>
          <Slider.Root defaultValue={40} disabled style={styles.root}>
            <Slider.Label style={styles.label}>Disabled slider</Slider.Label>

              <Slider.Track style={styles.track}>
                <Slider.Indicator style={styles.indicator} />
                <Slider.Thumb
                  aria-label='Disabled value'
                  style={getThumbStyle}
                />
              </Slider.Track>

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
    alignSelf: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    width: '100%',
  },

  hint: {
    color: theme.colors.textMuted,
    fontSize: theme.font.size.xs,
  },
  indicator: {
    backgroundColor: '#4A90D9',
    borderRadius: 999,
    height: '100%',
  },
  label: {
    color: theme.colors.textPrimary,
    fontSize: theme.font.size.md,
    fontWeight: theme.font.weight.medium,
  },
  root: {
    gap: theme.spacing.sm,
  },
  thumb: {
    backgroundColor: '#FFFFFF',
    borderColor: '#23527C',
    borderRadius: 999,
    borderWidth: 1,
    height: 20,
    width: 20,
  },
  thumbDisabled: {
    borderColor: theme.colors.textMuted,
    opacity: 0.6,
  },
  track: {
    backgroundColor: theme.colors.bgCanvas,
    borderColor: theme.colors.border,
    borderRadius: 999,
    borderWidth: 1,
    height: 6,
    justifyContent: 'center',
    width: '100%',
  },
  value: {
    color: theme.colors.textSecondary,
    fontSize: theme.font.size.sm,
  },
});

function getThumbStyle(state: SliderThumbState) {
  return state.disabled
    ? { ...styles.thumb, ...styles.thumbDisabled }
    : styles.thumb;
}
