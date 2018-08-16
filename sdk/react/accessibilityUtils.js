/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React, { Component } from 'react'
import Constants from './constants.js'

const {
  VIEW_ACCESSIBILITY_NAMES,
  ACCESSIBILITY_ANNOUNCERS,
  ANNOUNCER_TYPES,
  CELL_TYPES
} = Constants;

let AccessibilityUtils = {

  createAccessibilityLabelForCell: function(cellType, param) {
    switch (cellType) {
      case CELL_TYPES.MULTI_AUDIO:
        return param + " " + VIEW_ACCESSIBILITY_NAMES.MULTI_AUDIO_CELL;
      case CELL_TYPES.SUBTITLES:
        return param + " " + VIEW_ACCESSIBILITY_NAMES.CC_CELL;
      default:
        return "";
    }
  },

  createAccessibilityAnnouncers: function(announcerType, param) {
    switch (announcerType) {
      case ANNOUNCER_TYPES.MOVING:
        return ACCESSIBILITY_ANNOUNCERS.PROGRESS_BAR_MOVING + param + " %";
      case ANNOUNCER_TYPES.MOVED:
        return ACCESSIBILITY_ANNOUNCERS.PROGRESS_BAR_MOVED + param + " %";
      default:
        return "";
    }
  },

  createAccessibilityForForwardButton: function(isForward, param, timeUnit) {
    const baseLabel = isForward ? VIEW_ACCESSIBILITY_NAMES.FORWARD_BUTTON : VIEW_ACCESSIBILITY_NAMES.BACKWARD_BUTTON;
    return baseLabel + ' ' + param + ' ' + timeUnit;
  },

  createAccessibilityForPlayPauseButton: function(buttonName) {
    return buttonName + ' ' + VIEW_ACCESSIBILITY_NAMES.PLAY_PAUSE_BUTTON + ' ' + buttonName;
  }

};

module.exports = AccessibilityUtils;