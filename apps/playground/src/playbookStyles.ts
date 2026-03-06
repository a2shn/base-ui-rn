import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    padding: 10,
    gap: 12,
    alignItems: 'flex-start',
  },

  // Avatar
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  fallback: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0071E3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  hint: {
    fontSize: 12,
    color: '#666',
  },

  // Buttons
  buttonBase: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Groups
  groupBase: {
    gap: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
  },
  toggleBase: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Separator
  sep_row: {
    gap: 10,
    padding: 10,
  },
  sep_horizontal: {
    height: 1,
    backgroundColor: '#ccc',
    width: '100%',
  },
  sep_verticalRow: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    gap: 10,
    padding: 10,
  },
  sep_vertical: {
    width: 1,
    height: '100%',
    backgroundColor: '#ccc',
  },

  // Meter
  meterRoot: {
    width: 200,
    gap: 8,
  },
  meterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111',
  },
  meterValue: {
    fontSize: 14,
    color: '#666',
  },
  meterTrack: {
    height: 8,
    width: '100%',
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
  },
  meterIndicator: {
    height: '100%',
    width: '100%',
    backgroundColor: '#0071E3',
  },
});
