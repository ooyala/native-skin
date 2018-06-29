/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import Constants from './constants.js'

const {
  VIEW_ACCESSIBILITY_NAMES,
  ACCESSIBILITY_LABELS,
  SCRUBBER_TYPES,
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

  createAccessibilityLabelForScrubbers(scrubberType, param) {
    switch (scrubberType) {
      case SCRUBBER_TYPES.PROGRESS:
        return param + " " + ACCESSIBILITY_LABELS.PROGRESS_BAR_INFO;
      case SCRUBBER_TYPES.VOLUME:
        return param + " " + ACCESSIBILITY_LABELS.VOLUME_BAR_INFO;
      default:
        return "";
    }
  },

};

module.export = AccessibilityUtils;