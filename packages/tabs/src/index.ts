import { TabsIndicator } from './indicator';
import { TabsList } from './list';
import { TabPanel } from './panel';
import { Tab } from './tab';
import { TabsRoot } from './tabs';

export const Tabs = {
  Indicator: TabsIndicator,
  List: TabsList,
  Panel: TabPanel,
  Root: TabsRoot,
  Tab: Tab,
};

export {
  TabsIndicator,
  TabsList,
  TabPanel as TabsPanel,
  TabsRoot,
  Tab as TabsTab,
};

export * from './types';
export * from './use-tabs';
