// @flow
/* eslint-disable max-len */
// `max-len` rule disabled because sometimes strings can be huge.

export const CONTENT_TYPES = {
  CHANNEL_SET: 'MultiChannel',
  CHANNEL: 'Channel',
  VIDEO: 'Video',
  LIVE_STREAM: 'LiveStream',
  AUDIO: 'Audio',
};

export const UI_SIZES = {
  VIDEOVIEW_PLAYPAUSE: 60,
  CONTROLBAR_HEIGHT: 75,
  VIDEOWATERMARK: 30,
  LOADING_ICON: 30,
  CONTROLBAR_ICONSIZE: 20,
  CONTROLBAR_LABELSIZE: 16,
  CC_PREVIEW_HEIGHT: 80,
  CAST_AIR_SCREEN_HEIGHT: 200,
};

export const BUTTON_NAMES = { // must match Objective-C code expectations & skin.json.
  PLAY: 'Play',
  PLAY_PAUSE: 'PlayPause',
  FULLSCREEN: 'fullscreen',
  MORE: 'moreOptions',
  CAST: 'chromecast',
  CAST_AIRPLAY: 'castAirplay',
  CAST_CONNECTED: 'cast_connected',
  DISCONNECT: 'disconnect',
  DISMISS: 'dismiss',
  VOLUME: 'volume',
  REPLAY: 'replay',
  REWIND: 'rewind',
  TWITTER: 'Twitter',
  FACEBOOK: 'Facebook',
  GOOGLEPLUS: 'GooglePlus',
  EMAIL: 'Email',
  LEARNMORE: 'LearnMore',
  // more option buttons
  DISCOVERY: 'discovery',
  QUALITY: 'quality',
  AUDIO_AND_CC: 'audioAndCC',
  PLAYBACK_SPEED: 'playbackSpeed',
  SHARE: 'share',
  SETTING: 'settings',
  STEREOSCOPIC: 'stereoscopic',
  NONE: 'None',
  // a dummy button to reset auto hide
  RESET_AUTOHIDE: 'ResetAutoHide',
  SKIP: 'Skip',
  AD_ICON: 'Icon',
  AD_OVERLAY: 'Overlay',
  PIP: 'PIP',
  UP_NEXT: 'Select up next',
  CLOSED_CAPTIONS: 'closedCaption',
  MORE_DETAILS: 'moreDetails',
};

export const VIEW_NAMES = {
  // Time seek bar views
  TIME_SEEK_BAR: 'seekBar',
  TIME_SEEK_BAR_THUMB: 'seekBar_thumb',
  TIME_SEEK_BAR_PLAYED: 'seekBar_played',
  TIME_SEEK_BAR_BACKGROUND: 'seekBar_background',
  TIME_SEEK_BAR_BUFFERED: 'seekBar_buffered',
};

export const IMG_URLS = {
  FACEBOOK: 'http://static1.squarespace.com/static/54823afbe4b023af78555735/549860e4e4b03ff49a6f3da6/549860e5e4b01fe317edf760/1419276283280/facebook+logo+png+transparent+background.png',
  TWITTER: 'https://g.twimg.com/ios_homescreen_icon.png',
  GOOGLEPLUS: 'https://lh3.ggpht.com/1Ug9gpwI16ARkDni8VYezbIaETcukEtwrnzRyzqWKV2u15SGpZGSmHQDVX0uPlzmgg=w300',
  EMAIL: 'http://www.themissionsuite.com/wp-content/uploads/2014/06/large.png',
  OOYALA_LOGO: 'http://www.palantir.net/presentations/dcamsterdam2014-decoupled-drupal-silex/assets/ooyala-logo.png',
};

export const SCREEN_TYPES = {
  LOADING_SCREEN: 'loading',
  VIDEO_SCREEN: 'video',
  AUDIO_SCREEN: 'audio',
  START_SCREEN: 'start',
  DISCOVERY_END_SCREEN: 'discovery_end',
  END_SCREEN: 'end',
  PAUSE_SCREEN: 'pause',
  AD_SCREEN: 'ad',
  ERROR_SCREEN: 'error',
  ERROR_SCREEN_AUDIO: 'error_audio',
};

export const OVERLAY_TYPES = {
  DISCOVERY_SCREEN: 'discovery_screen',
  MOREOPTION_SCREEN: 'moreOption',
  AUDIO_AND_CC_SCREEN: 'audioAndCCScreen',
  PLAYBACK_SPEED_SCREEN: 'playbackSpeedScreen',
  MORE_DETAILS: 'moreDetails',
  VOLUME_SCREEN: 'volumeScreen',
  CAST_AIRPLAY: 'castAirplay',
  CAST_DEVICES: 'cast_devices',
  CAST_CONNECTING: 'cast_connecting',
  CAST_CONNECTED: 'cast_connected',
};

export const DESIRED_STATES = {
  DESIRED_PAUSE: 'desired_pause',
  DESIRED_PLAY: 'desired_play',
};

export const LOG_LEVEL = {
  VERBOSE: 4,
  INFO: 3,
  WARN: 2,
  ERROR: 1,
  NONE: 0,
};

export const STRING_CONSTANTS = {
  SECONDS: 'seconds',
  TOTAL_SECONDS: 'seconds total time',
  VIDEO_SEEK_SCRUBBER: 'video scrubber',
};

export const VALUES = {
  SEEK_VALUE: 10,
  MAX_SKIP_VALUE: 99,
  MIN_SKIP_VALUE: 1,
  MAX_PROGRESS_PERCENT: 100,
  LIVE_THRESHOLD: 0.95,
  LIVE_AUDIO_THRESHOLD: 0.99,
  DELAY_BETWEEN_SKIPS_MS: 300,
};

export const SAS_ERROR_CODES = {
  // Numbers quoted because they are accessible as string , plus Flow doesn't support numbers as index signature.
  /* eslint-disable quote-props */
  '22': 'account_device_limit',
  '29': 'entitlement_device_limit',
  /* eslint-enable quote-props */
};

export const ERROR_MESSAGE = {
  account_device_limit: 'Unable to register this device to this account, as the maximum number of authorized devices has already been reached. Error Code 22',
  entitlement_device_limit: 'Unable to access this content, as the maximum number of devices has already been authorized. Error Code 29',
};

export const CELL_TYPES = {
  MULTI_AUDIO: 'multi_audio',
  SUBTITLES: 'subtitles',
  PLAYBACK_SPEED_RATE: 'playback_speed_rate',
};

export const VIEW_ACCESSIBILITY_NAMES = {
  SCRUBBER_BAR_VIEW: 'Scrubber bar',
  VOLUME_VIEW: 'Volume view',
  MULTI_AUDIO_CELL: 'Language cell. Tap twice to choose this audio track',
  CC_CELL: 'Subtitle cell. Tap twice to choose this subtitles',
  PLAYBACK_SPEED_CELL: 'Playback speed cell. Tap twice to choose this playback speed rate',
  PROGRESS_BAR: 'Progress bar. ',
  PROGRESS_BAR_ANDROID_SPECIFIC: ' %.  Use two fingers to adjust the progress value',
  VOLUME_BAR: 'Volume bar. Use two fingers to adjust the volume value',
  FORWARD_BUTTON: 'Forward button. Tap twice to seek forward',
  BACKWARD_BUTTON: 'Backward button. Tap twice to seek backward',
  ENTER_FULLSCREEN: 'Enter Fullscreen mode button selected. Double tap to activate.',
  ACTIVE_PIP: 'Enter PIP mode button selected. Double tap to activate.',
  EXIT_FULLSCREEN: 'Exit Fullscreen mode button selected. Double tap to activate.',
  EXIT_PIP: 'Exit PIP mode button selected. Double tap to activate.',
  PLAY_PAUSE_BUTTON: 'button. Tap twice to',
  PLAYBACK_SPEED_BUTTON: 'Playback speed',
};

export const ACCESSIBILITY_ANNOUNCERS = {
  PROGRESS_BAR_MOVING: 'Moving to ',
  PROGRESS_BAR_MOVED: 'Moved to ',
  SCREEN_MODE_CHANGED: 'Screen mode changed',
};

export const ANNOUNCER_TYPES = {
  MOVING: 'moving',
  MOVED: 'moved',
};

export const ACCESSIBILITY_COMMON = {
  SELECTED: 'selected',
};

export const MAX_DATE_VALUE = 8640000000000000;

export const AUTOHIDE_DELAY = 5000;

export const MARKERS_SIZES = {
  BORDER_WIDTH: 1,
  // Calculate height based on the biggest possible marker which is TextMarker with max lines. The dimensions of
  // container should cover all markers because touch events are not supported on overflow elements on Android.
  // Refer https://github.com/facebook/react-native/issues/21455
  // distance + 2 * padding + 2 * border + number of lines * font size
  CONTAINER_HEIGHT: 6 + 2 * 2 + 2 + 4 * 13,
  DISTANCE_FROM_BOTTOM: 6,
  FONT_SIZE: 13,
  ICON_COLLAPSED_SIZE: 32,
  ICON_EXPANDED_SIZE: 64,
  PADDING: 2,
  TEXT_COLLAPSED_WIDTH: 64,
  TEXT_EXPANDED_WIDTH: 128,
  TEXT_NUMBER_OF_LINES: 4,
};
