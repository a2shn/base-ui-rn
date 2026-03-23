import {
  Collapsible,
  type CollapsiblePanelState,
} from '@base-ui-rn/collapsible';
import {
  Gallery,
  Section,
  theme,
  usePlaybookToggles,
} from '@base-ui-rn/playbook';
import * as React from 'react';
import {
  type StyleProp,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

export function CollapsiblePlaybook() {
  const { open } = usePlaybookToggles({
    open: false,
  });

  return (
    <Gallery title='Collapsible'>
      <Section title='Default'>
        <View style={styles.container}>
          <Collapsible.Root>
            <Collapsible.Trigger
              style={styles.trigger}
              testID='collapsible-trigger-default'
            >
              {({ open }) => (
                <>
                  <ChevronIcon style={[styles.icon, open && styles.iconOpen]} />
                  <Text style={styles.text}>Recovery keys</Text>
                </>
              )}
            </Collapsible.Trigger>
            <Collapsible.Panel style={styles.panel}>
              <View style={styles.content}>
                <Text style={styles.text}>alien-bean-pasta</Text>
                <Text style={styles.text}>wild-irish-burrito</Text>
                <Text style={styles.text}>horse-battery-staple</Text>
              </View>
            </Collapsible.Panel>
          </Collapsible.Root>
        </View>
      </Section>
      <Section title='Default Open'>
        <View style={styles.container}>
          <Collapsible.Root defaultOpen>
            <Collapsible.Trigger
              style={styles.trigger}
              testID='collapsible-trigger-default-open'
            >
              {({ open }) => (
                <>
                  <ChevronIcon style={[styles.icon, open && styles.iconOpen]} />
                  <Text style={styles.text}>Recovery keys</Text>
                </>
              )}
            </Collapsible.Trigger>
            <Collapsible.Panel style={styles.panel}>
              <View style={styles.content}>
                <Text style={styles.text}>alien-bean-pasta</Text>
                <Text style={styles.text}>wild-irish-burrito</Text>
                <Text style={styles.text}>horse-battery-staple</Text>
              </View>
            </Collapsible.Panel>
          </Collapsible.Root>
        </View>
      </Section>
      <Section title='Controlled'>
        <View style={styles.container}>
          <Collapsible.Root
            onOpenChange={open.setValue}
            open={open.value as boolean}
          >
            <Collapsible.Trigger
              style={styles.trigger}
              testID='collapsible-trigger-controlled'
            >
              {({ open }) => (
                <>
                  <ChevronIcon style={[styles.icon, open && styles.iconOpen]} />
                  <Text style={styles.text}>{open ? 'Close' : 'Open'}</Text>
                </>
              )}
            </Collapsible.Trigger>
            <Collapsible.Panel style={styles.panel}>
              <View style={styles.content}>
                <Text style={styles.text}>alien-bean-pasta</Text>
                <Text style={styles.text}>wild-irish-burrito</Text>
                <Text style={styles.text}>horse-battery-staple</Text>
              </View>
            </Collapsible.Panel>
          </Collapsible.Root>
        </View>
      </Section>

      <Section title='Panel Dimensions'>
        <View style={styles.container}>
          <Collapsible.Root defaultOpen>
            <Collapsible.Trigger style={styles.trigger}>
              {({ open }) => (
                <>
                  <ChevronIcon style={[styles.icon, open && styles.iconOpen]} />
                  <Text style={styles.text}>Panel Dimensions</Text>
                </>
              )}
            </Collapsible.Trigger>
            <Collapsible.Panel keepMounted style={getPanelDimensionsStyle}>
              <View style={styles.content}>
                <Text style={styles.text}>
                  Use state.panel.height and state.panel.width for custom
                  animations.
                </Text>
              </View>
            </Collapsible.Panel>
          </Collapsible.Root>
        </View>
      </Section>

      <Section title='Disabled'>
        <View style={styles.container}>
          <Collapsible.Root disabled>
            <Collapsible.Trigger
              style={styles.trigger}
              testID='collapsible-trigger-disabled'
            >
              {({ open }) => (
                <>
                  <ChevronIcon style={[styles.icon, open && styles.iconOpen]} />
                  <Text style={styles.text}>Recovery keys</Text>
                </>
              )}
            </Collapsible.Trigger>
            <Collapsible.Panel style={styles.panel}>
              <View style={styles.content}>
                <Text style={styles.text}>alien-bean-pasta</Text>
                <Text style={styles.text}>wild-irish-burrito</Text>
                <Text style={styles.text}>horse-battery-staple</Text>
              </View>
            </Collapsible.Panel>
          </Collapsible.Root>
        </View>
      </Section>

      <Section title='Keep Mounted with Animation'>
        <View style={styles.container}>
          <Collapsible.Root>
            <Collapsible.Trigger
              style={styles.trigger}
              testID='collapsible-trigger-animated'
            >
              {({ open }) => (
                <>
                  <ChevronIcon style={[styles.icon, open && styles.iconOpen]} />
                  <Text style={styles.text}>Animated Panel</Text>
                </>
              )}
            </Collapsible.Trigger>
            <Collapsible.Panel keepMounted style={getPanelAnimatedStyle}>
              <View style={styles.content}>
                <Text style={styles.text}>
                  This panel stays mounted but animates its height and opacity.
                </Text>
                <Text style={styles.text}>
                  It uses dynamic styles based on the 'open' state.
                </Text>
              </View>
            </Collapsible.Panel>
          </Collapsible.Root>
        </View>
      </Section>
    </Gallery>
  );
}

export function ChevronIcon(props: { style?: StyleProp<ViewStyle> }) {
  return (
    <View style={props.style}>
      <Svg
        color={'white'}
        fill='none'
        height='10'
        viewBox='0 0 10 10'
        width='10'
      >
        <Path d='M3.5 9L7.5 5L3.5 1' stroke='currentColor' />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    backgroundColor: theme.colors.bgCanvas,
    borderColor: theme.colors.border,
    borderWidth: 1,
    padding: 16,
    width: 256,
  },
  content: {
    backgroundColor: theme.colors.borderLight,
    borderRadius: 4,
    flexDirection: 'column',
    gap: 8,
    marginTop: 4,
    paddingLeft: 28,
    paddingVertical: 8,
  },
  icon: {
    color: theme.colors.textPrimary,
    height: 12,
    width: 12,
  },
  iconOpen: {
    transform: [{ rotate: '90deg' }],
  },
  panel: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  text: {
    color: theme.colors.textPrimary,
  },
  trigger: {
    alignItems: 'center',
    backgroundColor: theme.colors.borderLight,
    borderRadius: 4,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});

function getPanelAnimatedStyle(
  state: CollapsiblePanelState,
): StyleProp<ViewStyle> {
  return [
    styles.panel,
    {
      height: state.open ? undefined : 0,
      opacity: state.open ? 1 : 0,
      paddingVertical: state.open ? theme.spacing.lg : 0,
    },
  ];
}

function getPanelDimensionsStyle(
  state: CollapsiblePanelState,
): StyleProp<ViewStyle> {
  return [
    styles.panel,
    {
      minHeight: 60,
      opacity: state.open ? 1 : 0,
    },
  ];
}
