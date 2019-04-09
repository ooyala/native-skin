// @flow

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  itemContainer: {
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemContainerSelected: {
    flex: 1,
    backgroundColor: 'rgba(114, 114, 114, 0.6)',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    paddingLeft: 30,
  },
  text: {
    paddingLeft: 36,
    paddingRight: 100,
    color: '#FFFFFF',
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 16,
  },
  textSelected: {
    paddingLeft: 36,
    paddingRight: 100,
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 16,
  },
});
