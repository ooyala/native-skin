/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import Constants from './constants.js'

const {
  VIEW_ACCESSIBILITY_NAMES,
  ACCESSIBILITY_LABELS_TYPE,
  CELL_TYPES
} = Constants;

const AccessibilityUtils = {

  createAccessibilityLabelForCell(cellType, param) {
    switch (cellType) {
      case CELL_TYPES.MULTIAUDIO:
        return param + " " + VIEW_ACCESSIBILITY_NAMES.MUTLIAUDIO_CELL;
      case CELL_TYPES.SUBTITLES:
        return param + " " + VIEW_ACCESSIBILITY_NAMES.CC_CELL;
      default:
        return "";
    }
  },

  createAccessibilityLabelForScrubber(scrubberType, param) {

  }

};

module.export = AccessibilityUtils;