import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { ToggleGroup } from '@base-ui-rn/toggle-group';
import { Toggle, type ToggleState } from '@base-ui-rn/toggle';
import {
  Gallery,
  Section,
  usePlaybookToggles,
  LiveConsole,
  theme,
} from '@base-ui-rn/playbook';

export function ToggleGroupPlaybook() {
  const { alignment, formats, isGroupDisabled } = usePlaybookToggles({
    alignment: ['center'],
    formats: ['bold', 'italic'],
    isGroupDisabled: false,
  });

  return (
    <Gallery title='ToggleGroup'>
      <Section title='Loop Focus Horizontal'>
        <ToggleGroup
          orientation='horizontal'
          loopFocus={true}
          defaultValue={['h1']}
          style={[styles.groupBase, styles.row]}
          testID='toggle-group-loop-h'
        >
          {['h1', 'h2', 'h3'].map((val, i) => (
            <Toggle key={val} value={val} testID={`toggle-h${i + 1}`}>
              {(state) => (
                <View style={getToggleStyle(state)}>
                  <Text style={styles.toggleText}>Option {i + 1}</Text>
                </View>
              )}
            </Toggle>
          ))}
        </ToggleGroup>
        <Text style={styles.hint}>
          Navigate with Left/Right arrows. It should loop from 3 to 1.
        </Text>
      </Section>

      <Section title='Loop Focus Vertical'>
        <ToggleGroup
          orientation='vertical'
          loopFocus={true}
          defaultValue={['v1']}
          style={[styles.groupBase, styles.column]}
          testID='toggle-group-loop-v'
        >
          {['v1', 'v2', 'v3'].map((val, i) => (
            <Toggle key={val} value={val} testID={`toggle-v${i + 1}`}>
              {(state) => (
                <View style={getToggleStyle(state)}>
                  <Text style={styles.toggleText}>Option {i + 1}</Text>
                </View>
              )}
            </Toggle>
          ))}
        </ToggleGroup>
        <Text style={styles.hint}>
          Navigate with Up/Down arrows. It should loop from 3 to 1.
        </Text>
      </Section>

      <Section title='Uncontrolled Single'>
        <ToggleGroup
          defaultValue={['center']}
          testID='toggle-group-uncontrolled-single'
          style={[styles.groupBase, styles.row]}
        >
          {['left', 'center', 'right'].map((val) => (
            <Toggle key={val} value={val} testID={`toggle-${val}`}>
              {(state) => (
                <View style={getToggleStyle(state)}>
                  <Text style={styles.toggleText}>
                    {val.charAt(0).toUpperCase() + val.slice(1)}
                  </Text>
                </View>
              )}
            </Toggle>
          ))}
        </ToggleGroup>
      </Section>

      <Section title='Controlled Single'>
        <ToggleGroup
          value={alignment.value as string[]}
          onValueChange={alignment.setValue}
          testID='toggle-group-controlled-single'
          style={[styles.groupBase, styles.row]}
        >
          {['left', 'center', 'right'].map((val) => (
            <Toggle key={val} value={val} testID={`toggle-${val}-controlled`}>
              {(state) => (
                <View style={getToggleStyle(state)}>
                  <Text style={styles.toggleText}>
                    {val.charAt(0).toUpperCase() + val.slice(1)}
                  </Text>
                </View>
              )}
            </Toggle>
          ))}
        </ToggleGroup>
        <LiveConsole
          title='alignment'
          state={alignment}
          testID='alignment-console'
        />
      </Section>

      <Section title='Multiple'>
        <ToggleGroup
          multiple
          value={formats.value as string[]}
          onValueChange={formats.setValue}
          testID='toggle-group-multiple'
          style={[styles.groupBase, styles.row]}
        >
          {['bold', 'italic', 'underline'].map((val) => (
            <Toggle key={val} value={val} testID={`toggle-${val}`}>
              {(state) => (
                <View style={getToggleStyle(state)}>
                  <Text style={styles.toggleText}>
                    {val.charAt(0).toUpperCase() + val.slice(1)}
                  </Text>
                </View>
              )}
            </Toggle>
          ))}
        </ToggleGroup>
        <LiveConsole title='formats' state={formats} testID='formats-console' />
      </Section>

      <Section title='Disabled'>
        <View style={styles.disabledContainer}>
          <Toggle
            pressed={isGroupDisabled.value as boolean}
            onPressedChange={isGroupDisabled.setValue}
            testID='toggle-group-disabled-switch'
          >
            {(state) => (
              <View
                style={[getToggleStyle(state), styles.alignStart]}
              >
                <Text testID='is-disabled-label' style={styles.toggleText}>
                  {isGroupDisabled.value ? 'Enable Group' : 'Disable Group'}
                </Text>
              </View>
            )}
          </Toggle>

          <ToggleGroup
            disabled={isGroupDisabled.value as boolean}
            defaultValue={['bold']}
            style={[
              styles.groupBase,
              styles.row,
              isGroupDisabled.value && styles.disabledGroup,
            ]}
            testID='toggle-group-disabled'
          >
            {['bold', 'italic'].map((val) => (
              <Toggle key={val} value={val} testID={`toggle-disabled-${val}`}>
                {(state) => (
                  <View style={getToggleStyle(state)}>
                    <Text style={styles.toggleText}>
                      {val.charAt(0).toUpperCase() + val.slice(1)}
                    </Text>
                  </View>
                )}
              </Toggle>
            ))}
          </ToggleGroup>
        </View>
        <LiveConsole
          title='isGroupDisabled'
          state={isGroupDisabled}
          testID='disabled-console'
        />
      </Section>
    </Gallery>
  );
}

const styles = StyleSheet.create({
  groupBase: {
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.sm,
    alignSelf: 'center',
    backgroundColor: theme.colors.bgCanvas,
    borderRadius: theme.radius.md,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  toggle: {
    borderWidth: 0,
    borderRadius: theme.radius.sm + 2,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.borderLight,
  },
  toggleText: {
    color: theme.colors.textPrimary,
    fontSize: theme.font.size.md,
  },
  togglePressed: {
    backgroundColor: theme.colors.border,
  },
  toggleFocused: {
    backgroundColor: '#333333',
  },
  toggleDefault: {
    backgroundColor: 'transparent',
  },
  hint: {
    fontSize: theme.font.size.xs,
    marginTop: theme.spacing.xs,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  disabledGroup: {
    opacity: 0.5,
  },
  disabledContainer: {
    gap: theme.spacing.md,
  },
  alignStart: {
    alignSelf: 'flex-start',
  },
});

function getToggleStyle({ pressed, focusVisible }: ToggleState) {
  return [
    styles.toggle,
    pressed
      ? styles.togglePressed
      : focusVisible
        ? styles.toggleFocused
        : styles.toggleDefault,
  ];
}
