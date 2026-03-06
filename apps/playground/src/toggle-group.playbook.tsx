import * as React from 'react';
import { Text, View } from 'react-native';
import { ToggleGroup } from '@base-ui-rn/toggle-group';
import { Toggle, type ToggleState } from '@base-ui-rn/toggle';
import {
  Gallery,
  Section,
  usePlaybookToggles,
  LiveConsole,
} from '@base-ui-rn/playbook';
import styles from './playbookStyles';

export function ToggleGroupPlaybook() {
  const { alignment, formats, isGroupDisabled } = usePlaybookToggles({
    alignment: ['center'],
    formats: ['bold', 'italic'],
    isGroupDisabled: false,
  });

  const groupBaseStyle = styles.groupBase;

  const toggleStyle = ({ pressed, focusVisible }: ToggleState) => ({
    borderWidth: 1,
    borderColor: pressed ? 'blue' : focusVisible ? '#0071E3' : '#ccc',
    padding: 8,
    backgroundColor: pressed ? '#f0f0f0' : 'transparent',
  });

  return (
    <Gallery title='ToggleGroup'>
      <Section title='Loop Focus Horizontal'>
        <ToggleGroup
          orientation='horizontal'
          loopFocus={true}
          defaultValue={['h1']}
          style={{ ...groupBaseStyle, flexDirection: 'row' }}
          testID='toggle-group-loop-h'
        >
          {['h1', 'h2', 'h3'].map((val, i) => (
            <Toggle key={val} value={val} testID={`toggle-h${i + 1}`}>
              {(state) => (
                <View style={toggleStyle(state)}>
                  <Text>Option {i + 1}</Text>
                </View>
              )}
            </Toggle>
          ))}
        </ToggleGroup>
        <Text style={{ fontSize: 12, marginTop: 4, color: '#666' }}>
          Navigate with Left/Right arrows. It should loop from 3 to 1.
        </Text>
      </Section>

      <Section title='Loop Focus Vertical'>
        <ToggleGroup
          orientation='vertical'
          loopFocus={true}
          defaultValue={['v1']}
          style={{ ...groupBaseStyle, flexDirection: 'column' }}
          testID='toggle-group-loop-v'
        >
          {['v1', 'v2', 'v3'].map((val, i) => (
            <Toggle key={val} value={val} testID={`toggle-v${i + 1}`}>
              {(state) => (
                <View style={toggleStyle(state)}>
                  <Text>Option {i + 1}</Text>
                </View>
              )}
            </Toggle>
          ))}
        </ToggleGroup>
        <Text style={{ fontSize: 12, marginTop: 4, color: '#666' }}>
          Navigate with Up/Down arrows. It should loop from 3 to 1.
        </Text>
      </Section>

      <Section title='Uncontrolled Single'>
        <ToggleGroup
          defaultValue={['center']}
          testID='toggle-group-uncontrolled-single'
          style={{ ...groupBaseStyle, flexDirection: 'row' }}
        >
          {['left', 'center', 'right'].map((val) => (
            <Toggle key={val} value={val} testID={`toggle-${val}`}>
              {(state) => (
                <View style={toggleStyle(state)}>
                  <Text>{val.charAt(0).toUpperCase() + val.slice(1)}</Text>
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
          style={{ ...groupBaseStyle, flexDirection: 'row' }}
        >
          {['left', 'center', 'right'].map((val) => (
            <Toggle key={val} value={val} testID={`toggle-${val}-controlled`}>
              {(state) => (
                <View style={toggleStyle(state)}>
                  <Text>{val.charAt(0).toUpperCase() + val.slice(1)}</Text>
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
          style={{ ...groupBaseStyle, flexDirection: 'row' }}
        >
          {['bold', 'italic', 'underline'].map((val) => (
            <Toggle key={val} value={val} testID={`toggle-${val}`}>
              {(state) => (
                <View style={toggleStyle(state)}>
                  <Text>{val.charAt(0).toUpperCase() + val.slice(1)}</Text>
                </View>
              )}
            </Toggle>
          ))}
        </ToggleGroup>
        <LiveConsole title='formats' state={formats} testID='formats-console' />
      </Section>

      <Section title='Disabled'>
        <View style={{ gap: 10 }}>
          <Toggle
            pressed={isGroupDisabled.value as boolean}
            onPressedChange={isGroupDisabled.setValue}
            testID='toggle-group-disabled-switch'
          >
            {(state) => (
              <View
                style={{
                  ...toggleStyle(state),
                  alignSelf: 'flex-start',
                }}
              >
                <Text testID='is-disabled-label'>
                  {isGroupDisabled.value ? 'Enable Group' : 'Disable Group'}
                </Text>
              </View>
            )}
          </Toggle>

          <ToggleGroup
            disabled={isGroupDisabled.value as boolean}
            defaultValue={['bold']}
            style={{
              ...groupBaseStyle,
              flexDirection: 'row',
              opacity: isGroupDisabled.value ? 0.5 : 1,
            }}
            testID='toggle-group-disabled'
          >
            {['bold', 'italic'].map((val) => (
              <Toggle key={val} value={val} testID={`toggle-disabled-${val}`}>
                {(state) => (
                  <View style={toggleStyle(state)}>
                    <Text>{val.charAt(0).toUpperCase() + val.slice(1)}</Text>
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
