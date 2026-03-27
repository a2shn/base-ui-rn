import { Platform } from 'react-native';

let lastInputModality: 'keyboard' | 'mouse' | 'touch' = 'keyboard';

function getInteractionModality(): typeof lastInputModality {
  return lastInputModality;
}

function setInteractionModality(modality: typeof lastInputModality) {
  lastInputModality = modality;
}

export { getInteractionModality, setInteractionModality };

interface GlobalLike {
  addEventListener: (
    type: string,
    listener: (event: unknown) => void,
    options?: { capture: boolean },
  ) => void;
}

if (Platform.OS === 'web') {
  try {
    const win = globalThis as unknown as GlobalLike;
    if (typeof win !== 'undefined' && win.addEventListener) {
      win.addEventListener(
        'keydown',
        () => setInteractionModality('keyboard'),
        {
          capture: true,
        },
      );
      win.addEventListener('mousedown', () => setInteractionModality('mouse'), {
        capture: true,
      });
      win.addEventListener(
        'touchstart',
        () => setInteractionModality('touch'),
        {
          capture: true,
        },
      );
      win.addEventListener(
        'pointerdown',
        (e: unknown) => {
          const pointerEvent = e as { pointerType?: string };
          if (pointerEvent.pointerType === 'mouse')
            setInteractionModality('mouse');
          else if (
            pointerEvent.pointerType === 'touch' ||
            pointerEvent.pointerType === 'pen'
          )
            setInteractionModality('touch');
        },
        { capture: true },
      );
    }
  } catch {}
}
