import { Gallery, Section, theme } from '@base-ui-rn/playbook';
import {
  ScrollArea,
  type ScrollAreaScrollbarState,
  type ScrollAreaThumbState,
} from '@base-ui-rn/scroll-area';
import * as React from 'react';
import {
  Platform,
  type StyleProp,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';

export function ScrollAreaPlaybook() {
  return (
    <Gallery title='Scroll Area'>
      <Section title='Vertical Scroll'>
        <ScrollArea.Root style={styles.root}>
          <ScrollArea.Viewport style={styles.viewport}>
            <ScrollArea.Content style={styles.content}>
              <Text style={styles.title}>Vernacular Architecture</Text>
              <Text style={styles.paragraph}>
                Vernacular architecture is building done outside any academic
                tradition, and without professional guidance. It is not a
                particular architectural movement or style, but rather a broad
                category, encompassing a wide range and variety of building
                types, with differing methods of construction, from around the
                world, both historical and extant and classical and modern.
              </Text>
              <Text style={styles.paragraph}>
                Vernacular architecture constitutes 95% of the world's built
                environment, as estimated in 1995 by Amos Rapoport, as measured
                against the small percentage of new buildings every year
                designed by architects and built by engineers.
              </Text>
              <Text style={styles.paragraph}>
                This type of architecture usually serves immediate, local needs,
                is constrained by the materials available in its particular
                region and reflects local traditions and cultural practices.
              </Text>
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            orientation='vertical'
            style={getScrollbarStyle}
          >
            <ScrollArea.Thumb style={getThumbStyle} />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </Section>

      <Section title='Always Visible'>
        <ScrollArea.Root scrollbarVisibility='always' style={styles.root}>
          <ScrollArea.Viewport style={styles.viewport}>
            <ScrollArea.Content style={styles.content}>
              <Text style={styles.title}>Persistent Scrollbars</Text>
              <Text style={styles.paragraph}>
                The `scrollbarVisibility="always"` prop ensures that scrollbars
                remain visible as long as there is overflow content to scroll,
                even when the user is not actively interacting with the area.
              </Text>
              {Array.from({ length: 10 }, (_, i) => (
                <Text key={i} style={styles.paragraph}>
                  This is some extra content to ensure that the area has
                  overflow and the scrollbar remains visible. Line {i + 1}.
                </Text>
              ))}
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            orientation='vertical'
            style={getScrollbarStyle}
          >
            <ScrollArea.Thumb style={getThumbStyle} />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </Section>

      <Section title='Horizontal Scroll'>
        <ScrollArea.Root style={styles.rootWide}>
          <ScrollArea.Viewport horizontal style={styles.viewport}>
            <ScrollArea.Content style={styles.horizontalContent}>
              {Array.from({ length: 20 }, (_, i) => (
                <View key={i} style={styles.horizontalItem}>
                  <Text style={styles.gridText}>{i + 1}</Text>
                </View>
              ))}
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            orientation='horizontal'
            style={getScrollbarStyle}
          >
            <ScrollArea.Thumb style={getThumbStyle} />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </Section>

      <Section title={`Both Orientations`}>
        <ScrollArea.Root style={styles.rootSquare}>
          {Platform.OS === 'web' ? (
            <ScrollArea.Viewport
              style={[
                styles.viewport,
                {
                  overflow: 'auto',
                  touchAction: 'auto',
                } as unknown as ViewStyle,
              ]}
            >
              <ScrollArea.Content style={styles.gridContent}>
                {Array.from({ length: 100 }, (_, i) => (
                  <View key={i} style={styles.gridItem}>
                    <Text style={styles.gridText}>{i + 1}</Text>
                  </View>
                ))}
              </ScrollArea.Content>
            </ScrollArea.Viewport>
          ) : (
            <ScrollArea.Viewport style={styles.viewport}>
              <ScrollArea.Viewport horizontal measure={false}>
                <ScrollArea.Content style={styles.gridContent}>
                  {Array.from({ length: 100 }, (_, i) => (
                    <View key={i} style={styles.gridItem}>
                      <Text style={styles.gridText}>{i + 1}</Text>
                    </View>
                  ))}
                </ScrollArea.Content>
              </ScrollArea.Viewport>
            </ScrollArea.Viewport>
          )}

          <ScrollArea.Scrollbar
            orientation='vertical'
            style={getScrollbarStyle}
          >
            <ScrollArea.Thumb style={getThumbStyle} />
          </ScrollArea.Scrollbar>
          <ScrollArea.Scrollbar
            orientation='horizontal'
            style={getScrollbarStyle}
          >
            <ScrollArea.Thumb style={getThumbStyle} />
          </ScrollArea.Scrollbar>
          <ScrollArea.Corner style={styles.corner} />
        </ScrollArea.Root>
      </Section>
    </Gallery>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: theme.spacing.lg,
  },
  corner: {
    bottom: 0,
    height: 10,
    position: 'absolute',
    right: 0,
    width: 10,
    zIndex: 10,
  },
  gridContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    width: 600, // Force horizontal overflow
  },
  gridItem: {
    alignItems: 'center',
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  gridText: {
    color: theme.colors.textPrimary,
    fontWeight: theme.font.weight.medium,
  },
  horizontalContent: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
  },
  horizontalItem: {
    alignItems: 'center',
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    height: 60,
    justifyContent: 'center',
    width: 60,
  },
  paragraph: {
    color: theme.colors.textSecondary,
    fontSize: theme.font.size.md,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  root: {
    alignSelf: 'center',
    backgroundColor: theme.colors.bg,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    height: 200,
    overflow: 'hidden',
    width: 300
  },
  rootSquare: {
    alignSelf: 'center',
    backgroundColor: theme.colors.bg,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    height: 300,
    overflow: 'hidden',
    width: 300,
  },
  rootWide: {
    alignSelf: 'center',
    backgroundColor: theme.colors.bg,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    height: 100,
    overflow: 'hidden',
    width: 300,
  },
  thumb: {
    backgroundColor: theme.colors.textSecondary,
    borderRadius: 99,
    opacity: 0.8,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.font.size.lg,
    fontWeight: theme.font.weight.bold,
    marginBottom: theme.spacing.md,
  },
  viewport: {
    flex: 1,
  },
});

function getScrollbarStyle(
  state: ScrollAreaScrollbarState,
): StyleProp<ViewStyle> {
  const isVertical = state.orientation === 'vertical';
  const hasBoth = state.hasOverflowX && state.hasOverflowY;

  const baseStyle: ViewStyle = {
    backgroundColor: state.isVisible ? 'rgba(0,0,0,0.1)' : 'transparent',
    borderRadius: 99,
    opacity: state.isVisible ? 1 : 0,
    position: 'absolute',
    zIndex: 10,
  };

  if (isVertical) {
    return [
      baseStyle,
      {
        bottom: hasBoth ? 14 : 6,
        right: 6,
        top: 6,
        width: 4,
      },
    ];
  }

  return [
    baseStyle,
    {
      bottom: 6,
      height: 4,
      left: 6,
      right: hasBoth ? 14 : 6,
    },
  ];
}

function getThumbStyle(state: ScrollAreaThumbState): StyleProp<ViewStyle> {
  return {
    backgroundColor: state.isDragging ? '#A0A0A0' : '#666666',
    borderRadius: 99,
  };
}
