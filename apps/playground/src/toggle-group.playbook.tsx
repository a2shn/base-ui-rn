import * as React from 'react';
import { Text } from 'react-native';
import { ToggleGroup } from '@base-ui-rn/toggle-group';
import { Toggle, type ToggleState } from '@base-ui-rn/toggle';
import {
  Gallery,
  Section,
  LiveConsole,
  usePlaybookToggles,
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
          value={alignment.value}
          onValueChange={alignment.setValue}
          style={groupBaseStyle}
          disabled={isGroupDisabled.value}
        >
          <Toggle value='left' style={toggleStyle}>
            <Text>Left</Text>
          </Toggle>
          <Toggle value='center' style={toggleStyle}>
            <Text>Center</Text>
          </Toggle>
          <Toggle value='right' style={toggleStyle}>
            <Text>Right</Text>
          </Toggle>
        </ToggleGroup>
        <LiveConsole title='Alignment' state={alignment} />
      </Section>

      <Section title='Multi-select Vertical'>
        <ToggleGroup
          orientation='vertical'
          multiple
          value={formats.value}
          onValueChange={formats.setValue}
          style={[groupBaseStyle, { width: 100 }]}
          disabled={isGroupDisabled.value}
        >
          <Toggle value='bold' style={toggleStyle}>
            <Text>Bold</Text>
          </Toggle>
          <Toggle value='italic' style={toggleStyle}>
            <Text>Italic</Text>
          </Toggle>
          <Toggle value='underline' style={toggleStyle}>
            <Text>Underline</Text>
          </Toggle>
        </ToggleGroup>
        <LiveConsole title='Formats' state={formats} />
      </Section>

      <Section title='Disabled State'>
        <ToggleGroup
          value={alignment.value}
          onValueChange={alignment.setValue}
          style={groupBaseStyle}
          disabled
        >
          <Toggle value='left' style={toggleStyle}>
            <Text>Left</Text>
          </Toggle>
          <Toggle value='center' style={toggleStyle}>
            <Text>Center</Text>
          </Toggle>
          <Toggle value='right' style={toggleStyle}>
            <Text>Right</Text>
          </Toggle>
        </ToggleGroup>
      </Section>
    </Gallery>
  );
}
