import { Platform } from 'react-native';

export const DEFAULT_FOCUS_RING_STYLE = Platform.select({
  default: {
    borderColor: '#1a73e8',
    borderWidth: 3,
  },
  web: null,
});
