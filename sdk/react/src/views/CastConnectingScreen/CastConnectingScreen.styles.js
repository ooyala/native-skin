// @flow

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  fullscreenContainer: {
    flexDirection: 'column',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelTextStyle: {
    fontFamily: 'Roboto',
    fontSize: 16,
    borderWidth: 0.8,
    borderColor: 'white',
    borderRadius: 4,
    backgroundColor: 'transparent',
    color: 'white',
    paddingLeft: 50,
    paddingRight: 50,
    paddingTop: 10,
    paddingBottom: 10,
  },
  connectingTextStyle: {
    fontFamily: 'Roboto',
    color: 'white',
    fontSize: 18,
    paddingBottom: 20,
  },
  circleIndicator: {
    paddingBottom: 65,
    paddingTop: 100,
    color: 'white',
  },
});
