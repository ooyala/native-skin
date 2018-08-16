
UI_SIZES = {
  VIDEOVIEW_PLAYPAUSE: 60,
  CONTROLBAR_HEIGHT: 75,
  VIDEOWATERMARK: 30,
  LOADING_ICON: 30,
  CONTROLBAR_ICONSIZE: 20,
  CONTROLBAR_LABELSIZE: 16,
  CC_PREVIEW_HEIGHT: 80,
};

const BUTTON_NAMES = { // must match Objective-C code expectations & skin.json.
  PLAY: 'Play',
  PLAY_PAUSE: 'PlayPause',
  FULLSCREEN: 'Fullscreen',
  MORE: 'moreOptions',
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
  AUDIO_AND_CC: 'Audio and closed captions',
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
};

const VIEW_NAMES = {

  // Time seek bar views
  TIME_SEEK_BAR: 'seekBar',
  TIME_SEEK_BAR_THUMB: 'seekBar_thumb',
  TIME_SEEK_BAR_PLAYED: 'seekBar_played',
  TIME_SEEK_BAR_BACKGROUND: 'seekBar_background',
  TIME_SEEK_BAR_BUFFERED: 'seekBar_buffered'
};

const PLATFORMS = {
  ANDROID:'android',
  IOS: 'ios',
};

const IMG_URLS = {
  FACEBOOK: 'http://static1.squarespace.com/static/54823afbe4b023af78555735/549860e4e4b03ff49a6f3da6/549860e5e4b01fe317edf760/1419276283280/facebook+logo+png+transparent+background.png',
  TWITTER: 'https://g.twimg.com/ios_homescreen_icon.png',
  GOOGLEPLUS: 'https://lh3.ggpht.com/1Ug9gpwI16ARkDni8VYezbIaETcukEtwrnzRyzqWKV2u15SGpZGSmHQDVX0uPlzmgg=w300',
  EMAIL: 'http://www.themissionsuite.com/wp-content/uploads/2014/06/large.png',
  OOYALA_LOGO: 'http://www.palantir.net/presentations/dcamsterdam2014-decoupled-drupal-silex/assets/ooyala-logo.png'
};

const SCREEN_TYPES = {
  LOADING_SCREEN: 'loading',
  VIDEO_SCREEN: 'video',
  START_SCREEN: 'start',
  DISCOVERY_END_SCREEN: 'discovery_end',
  END_SCREEN: 'end',
  PAUSE_SCREEN: 'pause',
  AD_SCREEN: 'ad',
  ERROR_SCREEN: 'error',
};

const OVERLAY_TYPES = {
  DISCOVERY_SCREEN: 'discovery_screen',
  MOREOPTION_SCREEN: 'moreOption',
  AUDIO_AND_CC_SCREEN: 'audioAndCCScreen',
}

const OOSTATES = {
  PAUSED: 'paused',
};

const DESIRED_STATES = {
  DESIRED_PAUSE: 'desired_pause',
  DESIRED_PLAY: 'desired_play',
};

const LOG_LEVEL = {
  VERBOSE: 4,
  INFO: 3,
  WARN: 2,
  ERROR: 1,
  NONE: 0
};

const STRING_CONSTANTS = {
  SECONDS: 'seconds',
  TOTAL_SECONDS: 'seconds total time',
  VIDEO_SEEK_SCRUBBER: 'video scrubber'
};

const VALUES = {
  SEEK_VALUE: 10,
  MAX_SKIP_VALUE: 99,
  MIN_SKIP_VALUE: 1,
  LIVE_THRESHOLD: 0.95,
  DELAY_BETWEEN_SKIPS_MS: 300
};

const SAS_ERROR_CODES = {
  '22': 'account_device_limit',
  '29': 'entitlement_device_limit'
};

const ERROR_MESSAGE = {
  'account_device_limit': 'Unable to register this device to this account, as the maximum number of authorized devices has already been reached. Error Code 22',
  'entitlement_device_limit': 'Unable to access this content, as the maximum number of devices has already been authorized. Error Code 29'
};

const CELL_TYPES = {
  MULTI_AUDIO: 'multi_audio',
  SUBTITLES: "subtitles"
};

const VIEW_ACCESSIBILITY_NAMES = {
  SCRUBBER_BAR_VIEW: 'Scrubber bar',
  VOLUME_VIEW: 'Volume view',
  MULTI_AUDIO_CELL: 'Language cell. Tap twice to choose this audio track',
  CC_CELL: 'Subtitle cell. Tap twice to choose this subtitles',
  PROGRESS_BAR: 'Progress bar. Use two fingers to adjust the progress value',
  VOLUME_BAR: 'Volume bar. Use two fingers to adjust the volume value',
  FORWARD_BUTTON: 'Forward button. Tap twice to seek forward',
  BACKWARD_BUTTON: 'Backward button. Tap twice to seek backward',
  ENTER_FULLSCREEN: 'Enter Fullscreen mode button selected. Double tap to activate.',
  EXIT_FULLSCREEN: 'Exit Fullscreen mode button selected. Double tap to activate.',
  PLAY_PAUSE_BUTTON: "button. Tap twice to",
};

const ACCESSIBILITY_ANNOUNCERS = {
  PROGRESS_BAR_MOVING: 'Moving to ',
  PROGRESS_BAR_MOVED: 'Moved to ',
  SCREEN_MODE_CHANGED: 'Screen mode changed'
};

const ANNOUNCER_TYPES = {
  MOVING: 'moving',
  MOVED: 'moved'
};

MAX_DATE_VALUE = 8640000000000000;
AUTOHIDE_DELAY = 5000;
module.exports = {
  UI_SIZES,
  BUTTON_NAMES,
  VIEW_NAMES,
  IMG_URLS,
  SCREEN_TYPES,
  OVERLAY_TYPES,
  OOSTATES,
  LOG_LEVEL,
  PLATFORMS,
  MAX_DATE_VALUE,
  AUTOHIDE_DELAY,
  DESIRED_STATES,
  STRING_CONSTANTS,
  VALUES,
  SAS_ERROR_CODES,
  ERROR_MESSAGE,
  CELL_TYPES,
  VIEW_ACCESSIBILITY_NAMES,
  ACCESSIBILITY_ANNOUNCERS,
  ANNOUNCER_TYPES,
};
