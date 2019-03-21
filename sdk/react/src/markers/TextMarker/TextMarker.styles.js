// @flow

import { StyleSheet } from 'react-native';

const BORDER_WIDTH = 1;
const COLLAPSED_WIDTH = 64;
const EXPANDED_WIDTH = 128;
const FONT_SIZE = 13;
const PADDING = 2;

export default StyleSheet.create({
  expanded: {
    width: EXPANDED_WIDTH + 2 * PADDING + 2 * BORDER_WIDTH,
  },
  root: {
    backgroundColor: 'black',
    borderColor: '#4E4E4E',
    borderRadius: 2,
    borderWidth: BORDER_WIDTH,
    bottom: 6,
    color: 'white',
    fontSize: FONT_SIZE,
    lineHeight: FONT_SIZE,
    padding: PADDING,
    position: 'absolute',
    shadowColor: 'black',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    textAlign: 'center',
    width: COLLAPSED_WIDTH + 2 * PADDING + 2 * BORDER_WIDTH,
  },
});
