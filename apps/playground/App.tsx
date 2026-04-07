import { PlaybookApp, type PlaybookConfig } from '@base-ui-rn/playbook';
import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SwitchPlaybook } from '@/switch.playbook';

import { AccordionPlaybook } from './src/accordion.playbook';
import { AvatarPlaybook } from './src/avatar.playbook';
import { ButtonPlaybook } from './src/button.playbook';
import { CollapsiblePlaybook } from './src/collapsible.playbook';
import { InputPlaybook } from './src/input.playbook';
import { MeterPlaybook } from './src/meter.playbook';
import { ProgressPlaybook } from './src/progress.playbook';
import { RadioPlaybook } from './src/radio.playbook';
// import { ScrollAreaPlaybook } from './src/scroll-area.playbook';
import { SeparatorPlaybook } from './src/separator.playbook';
import { SliderPlaybook } from './src/slider.playbook';
import { TabsPlaybook } from './src/tabs.playbook';
import { ToggleGroupPlaybook } from './src/toggle-group.playbook';
import { TogglePlaybook } from './src/toggle.playbook';

const REGISTRY: PlaybookConfig = {
  Accordion: {
    component: AccordionPlaybook,
    testID: 'accordion',
    title: 'Accordion',
  },
  Avatar: {
    component: AvatarPlaybook,
    testID: 'avatar',
    title: 'Avatar',
  },
  Button: {
    component: ButtonPlaybook,
    testID: 'button',
    title: 'Button',
  },
  Collapsible: {
    component: CollapsiblePlaybook,
    testID: 'collapsible',
    title: 'Collapsible',
  },
  Input: {
    component: InputPlaybook,
    testID: 'input',
    title: 'Input',
  },
  Meter: {
    component: MeterPlaybook,
    testID: 'meter',
    title: 'Meter',
  },
  Progress: {
    component: ProgressPlaybook,
    testID: 'progress',
    title: 'Progress',
  },
  Radio: {
    component: RadioPlaybook,
    testID: 'radio',
    title: 'Radio',
  },
  // ScrollArea: {
  //   component: ScrollAreaPlaybook,
  //   testID: 'scroll-area',
  //   title: 'Scroll Area',
  // },
  //
  Separator: {
    component: SeparatorPlaybook,
    testID: 'separator',
    title: 'Separator',
  },
  Slider: {
    component: SliderPlaybook,
    testID: 'slider',
    title: 'Slider',
  },
  Switch: {
    component: SwitchPlaybook,
    testID: 'switch',
    title: 'switch',
  },
  Tabs: {
    component: TabsPlaybook,
    testID: 'tabs',
    title: 'Tabs',
  },
  Toggle: {
    component: TogglePlaybook,
    testID: 'toggle',
    title: 'Toggle',
  },
  ToggleGroup: {
    component: ToggleGroupPlaybook,
    testID: 'toggle-group',
    title: 'Toggle Group',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PlaybookApp registry={REGISTRY} />
    </SafeAreaProvider>
  );
}
