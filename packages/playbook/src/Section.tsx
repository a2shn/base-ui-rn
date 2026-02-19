import * as React from 'react';
import { View, Text } from 'react-native';

import { DebugTable } from './DebugTable';
import { ExtractionBadge } from './ExtractionBadge';
import { mergeRefs } from './utils/mergeRefs';
import { serialisePropValue } from './utils/inspectNativeProps';
import { useStyles } from './styles';

import { useInspector } from './utils/useInspector';
import type { SectionProps } from './types';
import { AnimatedButton } from './AnimatedButton';

/**
 * Renders a labeled section that can inspect and display props
 * from its first valid React element child.
 *
 * @param title
 * Section title displayed in the header.
 *
 * @param description
 * Optional descriptive text rendered below the title.
 *
 * @param children
 * Section content. The first valid React element child is used
 * as the inspection target.
 *
 * @param contentStyle
 * Optional style applied to the section content container.
 *
 * @param showAllProps
 * Whether to include non-serializable or unstable props during inspection.
 *
 * @default showAllProps false
 *
 * @example
 * ```tsx
 * <Section title="Button" description="Primary action">
 *   <Button.Root accessibilityHint="Submits the form" />
 * </Section>
 * ```
 */
export const Section = ({
  title,
  description,
  children,
  contentStyle,
  showAllProps = false,
}: SectionProps) => {
  const styles = useStyles();

  const {
    showDebug,
    setShowDebug,
    debugData,
    extractionMethod,
    spyCallbackRef,
    buildCallbackOverrides,
  } = useInspector(showAllProps);

  const childrenArray = React.Children.toArray(children);
  const targetChild = childrenArray.find(React.isValidElement) as
    | React.ReactElement
    | undefined;

  let injectedChildren = children;

  if (targetChild) {
    const existingRef = (targetChild as { ref?: React.Ref<unknown> }).ref;
    const mergedRef = existingRef
      ? mergeRefs(existingRef as React.Ref<unknown>, spyCallbackRef)
      : spyCallbackRef;

    const cloned = React.cloneElement(targetChild, {
      ref: mergedRef,
      ...buildCallbackOverrides(targetChild.props as Record<string, unknown>),
    } as object);

    injectedChildren = [
      cloned,
      ...childrenArray.filter((c) => c !== targetChild),
    ];
  }

  const fallbackData = React.useMemo<Record<string, string>>(() => {
    if (!targetChild) return {};
    const rest = { ...(targetChild.props as Record<string, unknown>) };
    delete rest.children;
    delete rest.ref;
    return Object.fromEntries(
      Object.entries(rest).map(([k, v]) => [k, serialisePropValue(v)]),
    );
  }, [targetChild]);

  const hasProps =
    (debugData && Object.keys(debugData).length > 0) ||
    Object.keys(fallbackData).length > 0;

  const displayData = debugData ?? fallbackData;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {description && <Text style={styles.sectionDesc}>{description}</Text>}
        </View>

        {hasProps && (
          <View style={styles.buttonRow}>
            <AnimatedButton
              onPress={() => setShowDebug((v) => !v)}
              style={styles.debugToggle}
            >
              <Text style={styles.debugToggleText}>
                {showDebug ? 'Hide Props' : 'Inspect Props'}
              </Text>
            </AnimatedButton>
          </View>
        )}
      </View>

      <View style={[styles.canvas, contentStyle]}>{injectedChildren}</View>

      {showDebug && hasProps && (
        <>
          <View style={styles.methodRow}>
            <Text style={styles.methodLabel}>Extraction via </Text>
            <ExtractionBadge method={extractionMethod} />
          </View>
          <DebugTable data={displayData} />
        </>
      )}
    </View>
  );
};
