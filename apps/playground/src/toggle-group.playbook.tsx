import * as React from 'react';
import { Text, View } from 'react-native';
import { ToggleGroup } from '@base-ui-rn/toggle-group';
import { Toggle } from '@base-ui-rn/toggle';
import {
  Gallery,
  Section,
  usePlaybookToggles,
  LiveConsole,
} from '@base-ui-rn/playbook';

export function ToggleGroupPlaybook() {
  const { alignment, formats, isGroupDisabled } = usePlaybookToggles({
    alignment: ['center'],
    formats: ['bold', 'italic'],
    isGroupDisabled: false,
  });

  return (
    <Gallery title='Toggle Group'>
      <Section title='Uncontrolled (Single Selection)'>
        <ToggleGroup
          defaultValue={['center']}
          testID='toggle-group-uncontrolled-single'
          style={{
            flexDirection: 'row',
            gap: 8,
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 8,
          }}
        >
          {['left', 'center', 'right'].map((val) => (
            <Toggle key={val} value={val} testID={`toggle-${val}`}>
              {({ pressed }) => (
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: pressed ? 'blue' : '#ccc',
                    padding: 8,
                    backgroundColor: pressed ? '#f0f0f0' : 'transparent',
                  }}
                >
                  <Text>{val.charAt(0).toUpperCase() + val.slice(1)}</Text>
                </View>
              )}
            </Toggle>
          ))}
        </ToggleGroup>
      </Section>

      <Section title='Controlled (Single Selection)'>
        <ToggleGroup
          value={alignment.value as string[]}
          onValueChange={alignment.setValue}
          testID='toggle-group-controlled-single'
          style={{
            flexDirection: 'row',
            gap: 8,
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 8,
          }}
        >
          {['left', 'center', 'right'].map((val) => (
            <Toggle key={val} value={val} testID={`toggle-${val}-controlled`}>
              {({ pressed }) => (
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: pressed ? 'blue' : '#ccc',
                    padding: 8,
                    backgroundColor: pressed ? '#f0f0f0' : 'transparent',
                  }}
                >
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

      <Section title='Multiple Selection'>
        <ToggleGroup
          multiple
          value={formats.value as string[]}
          onValueChange={formats.setValue}
          testID='toggle-group-multiple'
          style={{
            flexDirection: 'row',
            gap: 8,
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 8,
          }}
        >
          {['bold', 'italic', 'underline'].map((val) => (
            <Toggle key={val} value={val} testID={`toggle-${val}`}>
              {({ pressed }) => (
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: pressed ? 'blue' : '#ccc',
                    padding: 8,
                    backgroundColor: pressed ? '#f0f0f0' : 'transparent',
                  }}
                >
                  <Text>{val.charAt(0).toUpperCase() + val.slice(1)}</Text>
                </View>
              )}
            </Toggle>
          ))}
        </ToggleGroup>
        <LiveConsole title='formats' state={formats} testID='formats-console' />
      </Section>

      <Section title='Disabled State'>
        <View style={{ gap: 10 }}>
          <Toggle
            pressed={isGroupDisabled.value as boolean}
            onPressedChange={isGroupDisabled.setValue}
            testID='toggle-group-disabled-switch'
          >
            {({ pressed }) => (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: pressed ? 'blue' : '#ccc',
                  padding: 8,
                  alignSelf: 'flex-start',
                  backgroundColor: pressed ? '#f0f0f0' : 'transparent',
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
              flexDirection: 'row',
              gap: 8,
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 8,
              opacity: isGroupDisabled.value ? 0.5 : 1,
            }}
            testID='toggle-group-disabled'
          >
            {['bold', 'italic'].map((val) => (
              <Toggle key={val} value={val} testID={`toggle-disabled-${val}`}>
                {({ pressed }) => (
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: pressed ? 'blue' : '#ccc',
                      padding: 8,
                      backgroundColor: pressed ? '#f0f0f0' : 'transparent',
                    }}
                  >
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

      <Section title='Vertical Orientation'>
        <ToggleGroup
          orientation='vertical'
          defaultValue={['option1']}
          style={{
            flexDirection: 'column',
            gap: 8,
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 8,
          }}
          testID='toggle-group-vertical'
          loopFocus={true}
        >
          {['option1', 'option2', 'option3'].map((val) => (
            <Toggle key={val} value={val} testID={`toggle-v${val.slice(-1)}`}>
              {({ pressed }) => (
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: pressed ? 'blue' : '#ccc',
                    padding: 8,
                    backgroundColor: pressed ? '#f0f0f0' : 'transparent',
                  }}
                >
                  <Text>Option {val.slice(-1)}</Text>
                </View>
              )}
            </Toggle>
          ))}
        </ToggleGroup>
      </Section>
    </Gallery>
  );
}
