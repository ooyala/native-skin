// @flow

import {
  ACCESSIBILITY_ANNOUNCERS,
  ACCESSIBILITY_COMMON,
  ANNOUNCER_TYPES,
  CELL_TYPES,
  VIEW_ACCESSIBILITY_NAMES,
} from '../constants';

export const createAccessibilityLabelForCell = (cellType, param) => {
  switch (cellType) {
    case CELL_TYPES.MULTI_AUDIO:
      return `${param} ${VIEW_ACCESSIBILITY_NAMES.MULTI_AUDIO_CELL}`;

    case CELL_TYPES.SUBTITLES:
      return `${param} ${VIEW_ACCESSIBILITY_NAMES.CC_CELL}`;

    case CELL_TYPES.PLAYBACK_SPEED_RATE:
      return `${param} ${VIEW_ACCESSIBILITY_NAMES.PLAYBACK_SPEED_CELL}`;

    default:
      return '';
  }
};

export const createAccessibilityLabelForSelectedObject = selectedObject => (
  `${ACCESSIBILITY_COMMON.SELECTED} ${selectedObject}`
);

export const createAccessibilityAnnouncers = (announcerType, param) => {
  switch (announcerType) {
    case ANNOUNCER_TYPES.MOVING:
      return `${ACCESSIBILITY_ANNOUNCERS.PROGRESS_BAR_MOVING + param} %`;

    case ANNOUNCER_TYPES.MOVED:
      return `${ACCESSIBILITY_ANNOUNCERS.PROGRESS_BAR_MOVED + param} %`;

    default:
      return '';
  }
};

export const createAccessibilityForForwardButton = (isForward, param, timeUnit) => {
  const baseLabel = isForward ? VIEW_ACCESSIBILITY_NAMES.FORWARD_BUTTON : VIEW_ACCESSIBILITY_NAMES.BACKWARD_BUTTON;

  return `${baseLabel} ${param} ${timeUnit}`;
};

export const createAccessibilityForPlayPauseButton = buttonName => (
  `${buttonName} ${VIEW_ACCESSIBILITY_NAMES.PLAY_PAUSE_BUTTON} ${buttonName}`
);
