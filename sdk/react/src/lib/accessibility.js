// @flow

import {
  ACCESSIBILITY_ANNOUNCERS, ACCESSIBILITY_COMMON, ANNOUNCER_TYPES, CELL_TYPES, VIEW_ACCESSIBILITY_NAMES,
} from '../constants';

export const createAccessibilityLabelForCell = (cellType: string, param: string): string => {
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

export const createAccessibilityLabelForSelectedObject = (selectedObject: string): string => (
  `${ACCESSIBILITY_COMMON.SELECTED} ${selectedObject}`
);

export const createAccessibilityAnnouncers = (announcerType: string, param: string): string => {
  switch (announcerType) {
    case ANNOUNCER_TYPES.MOVING:
      return `${ACCESSIBILITY_ANNOUNCERS.PROGRESS_BAR_MOVING + param} %`;

    case ANNOUNCER_TYPES.MOVED:
      return `${ACCESSIBILITY_ANNOUNCERS.PROGRESS_BAR_MOVED + param} %`;

    default:
      return '';
  }
};

export const createAccessibilityForForwardButton = (isForward: boolean, param: string, timeUnit: string): string => {
  const baseLabel = isForward ? VIEW_ACCESSIBILITY_NAMES.FORWARD_BUTTON : VIEW_ACCESSIBILITY_NAMES.BACKWARD_BUTTON;

  return `${baseLabel} ${param} ${timeUnit}`;
};

export const createAccessibilityForPlayPauseButton = (buttonName: string): string => (
  `${buttonName} ${VIEW_ACCESSIBILITY_NAMES.PLAY_PAUSE_BUTTON} ${buttonName}`
);
