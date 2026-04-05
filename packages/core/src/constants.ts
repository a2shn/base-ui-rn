export const DEFAULT_HIT_SLOP = {
  bottom: 10,
  left: 10,
  right: 10,
  top: 10,
} as const;

export const ACTIVATION_KEYS = [
  'Enter',
  ' ',
  'Spacebar',
  'Space',
  'Select',
  'Return',
  'OK',
  'Accept',
  'GamepadA',
  'buttonA',
  'buttonX',
  'Cross',
] as const;


export const ACTIVATION_ACTIONS = ['activate', 'magicTap'] as const;
