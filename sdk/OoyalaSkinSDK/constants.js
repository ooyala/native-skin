var ICONS = {
  PLAY: '\uf04b',
  PAUSE: '\uf04c',
  VOLUMEDOWN: '\uf027',
  VOLUMEOFF: '\uf026',
  VOLUMEUP: '\uf028',
  EXPAND: '\uf065',
  COMPRESS: '\uf066',
  ELLIPSIS: '\uf142',
  REPLAY:'\uf01e',
  SHARE:'\uf045',
  CC: '\uf20a',
};

var BUTTON_NAMES = { // must match Objective-C code expectations.
  PLAY_PAUSE: 'PlayPause',
  SOCIAL_SHARE: 'SocialShare',
  CLOSED_CAPTIONS: 'ClosedCaptions',
  FULLSCREEN: 'Fullscreen',
  MORE: 'More',
};

var SCREEN_TYPES = {
  LOADING_SCREEN: 'loading',
  VIDEO_SCREEN: 'video',
  START_SCREEN: 'start',
  END_SCREEN: 'end',
  PAUSE_SCREEN: 'pause',
};

var OOSTATES = {
  PAUSED: 'paused',
};

module.exports = {ICONS, BUTTON_NAMES, SCREEN_TYPES, OOSTATES};