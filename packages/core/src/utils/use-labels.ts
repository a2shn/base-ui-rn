import { useId } from 'react';
import type { AccessibilityProps } from 'react-native';

export interface NativeAriaLabelingProps extends Omit<
  AccessibilityProps,
  'accessibilityLabel' | 'accessibilityLabelledBy'
> {
  id?: string;
  nativeID?: string;
  accessibilityLabel?: string | string[];
  accessibilityLabelledBy?: string | string[];
}

export interface ResolvedNativeAriaLabelingProps {
  id?: string;
  nativeID?: string;
  accessibilityLabel?: string;
  accessibilityLabelledBy?: string;
}

export function useLabels(
  props: NativeAriaLabelingProps,
  defaultLabel?: string,
): ResolvedNativeAriaLabelingProps {
  const { accessibilityLabel, accessibilityLabelledBy, id, nativeID } = props;

  const reactId = useId();
  const currentId = id || nativeID || reactId;

  let label = Array.isArray(accessibilityLabel)
    ? accessibilityLabel.filter(Boolean).join(' ')
    : accessibilityLabel;

  let labelledByList: string[] = [];

  if (Array.isArray(accessibilityLabelledBy)) {
    labelledByList = accessibilityLabelledBy;
  } else if (typeof accessibilityLabelledBy === 'string') {
    labelledByList = accessibilityLabelledBy.trim().split(/\s+/);
  }

  labelledByList = labelledByList.filter(Boolean);

  let finalLabelledBy: string | undefined = undefined;

  if (labelledByList.length > 0 && label) {
    const ids = new Set([currentId, ...labelledByList]);
    finalLabelledBy = Array.from(ids).join(' ');
  } else if (labelledByList.length > 0) {
    finalLabelledBy = labelledByList.join(' ');
  }

  if (!label && !finalLabelledBy && defaultLabel) {
    label = defaultLabel;
  }

  return {
    accessibilityLabel: label,
    accessibilityLabelledBy: finalLabelledBy,
    id: currentId,
    nativeID: currentId,
  };
}
