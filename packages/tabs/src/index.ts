import { TabsRoot } from './tabs';
import { TabsList } from './list';
import { Tab } from './tab';
import { TabsIndicator } from './indicator';
import { TabPanel } from './panel';

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Tab: Tab,
  Indicator: TabsIndicator,
  Panel: TabPanel,
};

export {
  TabsRoot,
  TabsList,
  Tab as TabsTab,
  TabsIndicator,
  TabPanel as TabsPanel,
};

export * from './types';
export * from './use-tabs';
