/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import Constants from './constants.js'

const {
  ACCESSIBILITY_LABELS_TYPE
} = Constants;

const AccessibilityUtils = {

  createAccessibilityLabel(labelType, baseLabel, param) {
    let resultLabel;
    switch (labelType) {
      case ACCESSIBILITY_LABELS_TYPE.CELL_VIEWS:
        resultLabel = param + " " + baseLabel;
        break;

    }
    return resultLabel;
  }
};

module.export = AccessibilityUtils;