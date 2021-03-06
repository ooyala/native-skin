// @flow

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  fullscreenContainer: {
    flexDirection: 'column',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  scrollContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  dismissButtonTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  iconDismiss: {
    padding: 25,
  },
  title: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 15,
    marginHorizontal: 50,
    textAlign: 'center',
    color: '#FFFFFF',
    fontFamily: 'AvenirNext-DemiBold',
  },
  description: {
    fontSize: 18,
    marginBottom: 20,
    marginHorizontal: 50,
    textAlign: 'center',
    color: '#FFFFFF',
    fontFamily: 'AvenirNext-DemiBold',
  },
});
