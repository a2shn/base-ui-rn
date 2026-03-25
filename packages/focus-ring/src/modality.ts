import { Platform } from 'react-native';

let lastInputModality: 'keyboard' | 'mouse' | 'touch' = 'keyboard';

function getInteractionModality(): typeof lastInputModality {
  return lastInputModality;
}

function setInteractionModality(modality: typeof lastInputModality) {
  lastInputModality = modality;
}

export { getInteractionModality, setInteractionModality };

if (Platform.OS === 'web') {
  try {
    const win = globalThis as
      | { addEventListener?: (type: string, handler: () => void) => void }
      | undefined;
    if (win?.addEventListener) {
      win.addEventListener('keydown', () => setInteractionModality('keyboard'));
      win.addEventListener('mousedown', () => setInteractionModality('mouse'));
      win.addEventListener('touchstart', () => setInteractionModality('touch'));
    }
  } catch {}
}
