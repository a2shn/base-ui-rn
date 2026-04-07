import {
  Gallery,
  LiveConsole,
  Section,
  theme,
  usePlaybookToggles,
} from '@base-ui-rn/playbook';
import { Toggle, type ToggleState } from '@base-ui-rn/toggle';
import { ToggleGroup } from '@base-ui-rn/toggle-group';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
          defaultValue={['h1']}
          orientation='horizontal'
          style={[styles.groupBase, styles.row]}
          testID='toggle-group-loop-h'
        >
          {['h1', 'h2', 'h3'].map((val, i) => (
            <Toggle key={val} testID={`toggle-h${i + 1}`} value={val}>
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
          defaultValue={['v2']}
          loopFocus={true}
          orientation='vertical'
          style={[styles.groupBase, styles.column]}
          testID='toggle-group-loop-v'
        >
          {['v1', 'v2', 'v3'].map((val, i) => (
            <Toggle key={val} testID={`toggle-v${i + 1}`} value={val}>
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
          style={[styles.groupBase, styles.row]}
          testID='toggle-group-uncontrolled-single'
        >
          {['left', 'center', 'right'].map((val) => (
            <Toggle key={val} testID={`toggle-${val}`} value={val}>
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
          onValueChange={alignment.setValue}
          style={[styles.groupBase, styles.row]}
          testID='toggle-group-controlled-single'
          value={alignment.value as string[]}
        >
          {['left', 'center', 'right'].map((val) => (
            <Toggle key={val} testID={`toggle-${val}-controlled`} value={val}>
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
          state={alignment}
          testID='alignment-console'
          title='alignment'
        />
      </Section>

      <Section title='Multiple'>
        <ToggleGroup
          multiple
          onValueChange={formats.setValue}
          style={[styles.groupBase, styles.row]}
          testID='toggle-group-multiple'
          value={formats.value as string[]}
        >
          {['bold', 'italic', 'underline'].map((val) => (
            <Toggle key={val} testID={`toggle-${val}`} value={val}>
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
        <LiveConsole state={formats} testID='formats-console' title='formats' />
      </Section>

      <Section title='Disabled'>
        <View style={styles.disabledContainer}>
          <Toggle
            onPressedChange={isGroupDisabled.setValue}
            pressed={isGroupDisabled.value as boolean}
            testID='toggle-group-disabled-switch'
          >
            {(state) => (
              <View style={[getToggleStyle(state), styles.alignStart]}>
                <Text style={styles.toggleText} testID='is-disabled-label'>
                  {isGroupDisabled.value ? 'Enable Group' : 'Disable Group'}
                </Text>
              </View>
            )}
          </Toggle>

          <ToggleGroup
            defaultValue={['bold']}
            disabled={isGroupDisabled.value as boolean}
            style={[
              styles.groupBase,
              styles.row,
              isGroupDisabled.value && styles.disabledGroup,
            ]}
            testID='toggle-group-disabled'
          >
            {['bold', 'italic'].map((val) => (
              <Toggle key={val} testID={`toggle-disabled-${val}`} value={val}>
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
          state={isGroupDisabled}
          testID='disabled-console'
          title='isGroupDisabled'
        />
      </Section>
    </Gallery>
  );
}

const styles = StyleSheet.create({
  alignStart: {
    alignSelf: 'flex-start',
  },
  column: {
    flexDirection: 'column',
  },
  disabledContainer: {
    gap: theme.spacing.md,
  },
  disabledGroup: {
    opacity: 0.5,
  },
  groupBase: {
    alignSelf: 'center',
    backgroundColor: theme.colors.bgCanvas,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.sm,
  },
  hint: {
    color: theme.colors.textMuted,
    fontSize: theme.font.size.xs,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  toggle: {
    padding: theme.spacing.sm,
  },
  toggleDefault: {
    backgroundColor: 'transparent',
  },
  toggleFocused: {
    backgroundColor: '#333333',
  },
  togglePressed: {
    backgroundColor: theme.colors.border,
  },
  toggleText: {
    color: theme.colors.textPrimary,
    fontSize: theme.font.size.md,
  },
});

function getToggleStyle({ focusVisible, pressed }: ToggleState) {
  return [
    styles.toggle,
    pressed ? styles.togglePressed : styles.toggleDefault,
    focusVisible && styles.toggleFocused,
  ];
}
