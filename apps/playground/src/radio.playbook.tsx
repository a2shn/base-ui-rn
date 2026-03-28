import { Radio, RadioGroup } from '@base-ui-rn/radio';
import type { RadioRootState } from '@base-ui-rn/radio';
import {
  Gallery,
  LiveConsole,
  Section,
  theme,
  usePlaybookToggles,
} from '@base-ui-rn/playbook';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function RadioPlaybook() {
  const { value, horizontalValue } = usePlaybookToggles({
    value: 'fuji',
    horizontalValue: 'a',
  });

  return (
    <Gallery title='Radio'>
      <Section title='Basic'>
        <RadioGroup
          onValueChange={(v) => value.setValue(v)}
          style={styles.group}
          value={value.value as string}
        >
          <View style={styles.item}>
            <Radio.Root style={getRadioRootStyle} value='fuji'>
              <Radio.Indicator style={getRadioIndicatorStyle} />
            </Radio.Root>
            <Text style={styles.label}>Fuji</Text>
          </View>
          <View style={styles.item}>
            <Radio.Root style={getRadioRootStyle} value='gala'>
              <Radio.Indicator style={getRadioIndicatorStyle} />
            </Radio.Root>
            <Text style={styles.label}>Gala</Text>
          </View>
          <View style={styles.item}>
            <Radio.Root style={getRadioRootStyle} value='honeycrisp'>
              <Radio.Indicator style={getRadioIndicatorStyle} />
            </Radio.Root>
            <Text style={styles.label}>Honeycrisp</Text>
          </View>
        </RadioGroup>
        <LiveConsole state={value} title='value' />
      </Section>

      <Section title='Horizontal'>
        <RadioGroup
          onValueChange={(v) => horizontalValue.setValue(v)}
          orientation='horizontal'
          style={[styles.group, styles.row]}
          value={horizontalValue.value as string}
        >
          <Radio.Root style={getRadioRootStyle} value='a'>
            <Radio.Indicator style={getRadioIndicatorStyle} />
          </Radio.Root>
          <Radio.Root style={getRadioRootStyle} value='b'>
            <Radio.Indicator style={getRadioIndicatorStyle} />
          </Radio.Root>
          <Radio.Root style={getRadioRootStyle} value='c'>
            <Radio.Indicator style={getRadioIndicatorStyle} />
          </Radio.Root>
        </RadioGroup>
        <LiveConsole state={horizontalValue} title='horizontalValue' />
      </Section>

      <Section title='Disabled'>
        <RadioGroup disabled style={styles.group} value='a'>
          <View style={styles.item}>
            <Radio.Root style={getRadioRootStyle} value='a'>
              <Radio.Indicator style={getRadioIndicatorStyle} />
            </Radio.Root>
            <Text style={styles.label}>Disabled Checked</Text>
          </View>
          <View style={styles.item}>
            <Radio.Root style={getRadioRootStyle} value='b'>
              <Radio.Indicator style={getRadioIndicatorStyle} />
            </Radio.Root>
            <Text style={styles.label}>Disabled Unchecked</Text>
          </View>
        </RadioGroup>
      </Section>
    </Gallery>
  );
}

function getRadioRootStyle(state: RadioRootState) {
  return [
    styles.radioRootBase,
    state.checked ? styles.radioRootChecked : styles.radioRootUnchecked,
    state.disabled && styles.disabled,
  ];
}

function getRadioIndicatorStyle(state: RadioRootState) {
  return [
    styles.radioIndicatorBase,
    state.disabled && styles.indicatorDisabled,
  ];
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
  group: {
    alignSelf: 'center',
    gap: theme.spacing.md,
  },
  indicatorDisabled: {
    backgroundColor: theme.colors.border,
  },
  label: {
    color: theme.colors.textPrimary,
    fontSize: theme.font.size.md,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  radioIndicatorBase: {
    backgroundColor: theme.colors.textPrimary,
    borderRadius: 9999,
    height: 12,
    width: 12,
  },
  radioRootBase: {
    alignItems: 'center',
    borderRadius: 9999,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  radioRootChecked: {
    borderColor: theme.colors.textPrimary,
  },
  radioRootUnchecked: {
    borderColor: theme.colors.border,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.xl,
  },
});

