import { Platform } from 'react-native';

export type InteractionModality = 'keyboard' | 'mouse' | 'touch';

/**
 * The input modality used for the last interaction.
 * Defaults to 'mouse' on web and 'touch' on native.
 */
let lastInputModality: InteractionModality =
  Platform.OS === 'web' ? 'mouse' : 'touch';

/**
 * Returns the modality of the last interaction.
 */
export function getInteractionModality(): InteractionModality {
  return lastInputModality;
}

/**
 * Sets the current interaction modality.
 */
export function setInteractionModality(modality: InteractionModality) {
  lastInputModality = modality;
}

if (
  Platform.OS === 'web' &&
  typeof window !== 'undefined' &&
  window.addEventListener
) {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.metaKey || e.altKey || e.ctrlKey) {
      return;
    }
    setInteractionModality('keyboard');
  };

  const handleMouseDown = () => setInteractionModality('mouse');
  const handleTouchStart = () => setInteractionModality('touch');

  const options = { capture: true, passive: true };

  window.addEventListener('keydown', handleKeyDown, true);
  window.addEventListener('mousedown', handleMouseDown, options);
  window.addEventListener('touchstart', handleTouchStart, options);
}
