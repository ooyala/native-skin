// @flow

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  dismissButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: 42,
    width: 44,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  dismissIcon: {
    flex: -1,
    maxHeight: 42,
    minHeight: 0,
    maxWidth: 44,
    minWidth: 16,
    textAlign: 'center',
    fontFamily: 'ooyala-slick-type',
    fontSize: 12,
    color: '#55595c',
  },
  volumeIconContainer: {
    marginLeft: 16,
  },
  volumeIcon: {
    fontSize: 20,
    color: 'white',
  },
  sliderContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    marginLeft: 8,
    marginRight: 16,
  },
  slider: {
    flex: 1,
    height: 5,
    borderRadius: 2.5,
    flexDirection: 'row',
    overflow: 'hidden',
  },
});
