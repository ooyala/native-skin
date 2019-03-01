import {
  VIEW_ACCESSIBILITY_NAMES,
  ACCESSIBILITY_ANNOUNCERS,
  ANNOUNCER_TYPES,
  CELL_TYPES,
  ACCESSIBILITY_COMMON
} from './constants'

class AccessibilityUtils {

  static createAccessibilityLabelForCell(cellType, param) {
    switch (cellType) {
      case CELL_TYPES.MULTI_AUDIO:
        return param + ' ' + VIEW_ACCESSIBILITY_NAMES.MULTI_AUDIO_CELL;
      case CELL_TYPES.SUBTITLES:
        return param + ' ' + VIEW_ACCESSIBILITY_NAMES.CC_CELL;
      case CELL_TYPES.PLAYBACK_SPEED_RATE:
        return param + ' ' + VIEW_ACCESSIBILITY_NAMES.PLAYBACK_SPEED_CELL;
      default:
        return '';
    }
  }

  static createAccessibilityLabelForSelectedObject(selectedObject) {
    return ACCESSIBILITY_COMMON.SELECTED + ' ' + selectedObject;
  }

  static createAccessibilityAnnouncers(announcerType, param) {
    switch (announcerType) {
      case ANNOUNCER_TYPES.MOVING:
        return ACCESSIBILITY_ANNOUNCERS.PROGRESS_BAR_MOVING + param + ' %';
      case ANNOUNCER_TYPES.MOVED:
        return ACCESSIBILITY_ANNOUNCERS.PROGRESS_BAR_MOVED + param + ' %';
      default:
        return '';
    }
  }

  static createAccessibilityForForwardButton(isForward, param, timeUnit) {
    const baseLabel = isForward ? VIEW_ACCESSIBILITY_NAMES.FORWARD_BUTTON : VIEW_ACCESSIBILITY_NAMES.BACKWARD_BUTTON;
    return baseLabel + ' ' + param + ' ' + timeUnit;
  }

  static createAccessibilityForPlayPauseButton(buttonName) {
    return buttonName + ' ' + VIEW_ACCESSIBILITY_NAMES.PLAY_PAUSE_BUTTON + ' ' + buttonName;
  }
};

module.exports = AccessibilityUtils;
