
UI_SIZES = {
  VIDEOVIEW_PLAYPAUSE: 60,
  CONTROLBAR_HEIGHT: 75,
  VIDEOWATERMARK: 30,
  CONTROLBAR_ICONSIZE: 20,
  CONTROLBAR_LABELSIZE: 16,
  CC_PREVIEW_HEIGHT: 80,
};

var BUTTON_NAMES = { // must match Objective-C code expectations & skin.json.
  PLAY: 'Play',
  PLAY_PAUSE: 'PlayPause',
  FULLSCREEN: 'Fullscreen',
  MORE: 'More',
  TWITTER: 'Twitter',
  FACEBOOK: 'Facebook',
  GOOGLEPLUS: 'GooglePlus',
  EMAIL: 'Email',
  LEARNMORE: 'LearnMore',
  // more option buttons
  DISCOVERY: 'discovery',
  QUALITY: 'quality',
  CLOSED_CAPTIONS: 'closedCaption',
  SHARE: 'share',
  SETTING: 'settings',
  NONE: 'None',
  // a dummy button to reset auto hide
  RESET_AUTOHIDE: 'ResetAutoHide',
  SKIP: 'Skip',
};

var PLATFORMS = { 
  ANDROID:'android',
  IOS: 'ios',
};

var IMG_URLS = {
  FACEBOOK: 'http://static1.squarespace.com/static/54823afbe4b023af78555735/549860e4e4b03ff49a6f3da6/549860e5e4b01fe317edf760/1419276283280/facebook+logo+png+transparent+background.png',
  TWITTER: 'https://g.twimg.com/ios_homescreen_icon.png',
  GOOGLEPLUS: 'https://lh3.ggpht.com/1Ug9gpwI16ARkDni8VYezbIaETcukEtwrnzRyzqWKV2u15SGpZGSmHQDVX0uPlzmgg=w300',
  EMAIL: 'http://www.themissionsuite.com/wp-content/uploads/2014/06/large.png',
  OOYALA_LOGO: 'http://www.palantir.net/presentations/dcamsterdam2014-decoupled-drupal-silex/assets/ooyala-logo.png'
};

var SCREEN_TYPES = {
  LOADING_SCREEN: 'loading',
  VIDEO_SCREEN: 'video',
  START_SCREEN: 'start',
  END_SCREEN: 'end',
  PAUSE_SCREEN: 'pause',
  AD_SCREEN: 'ad',
  MOREOPTION_SCREEN: 'moreOption',
  ERROR_SCREEN: 'error'
};

var OOSTATES = {
  PAUSED: 'paused',
};


var LOG_LEVEL = {
  VERBOSE: 4,
  INFO: 3,
  WARN: 2,
  ERROR: 1,
  NONE: 0
};

module.exports = {UI_SIZES, BUTTON_NAMES, IMG_URLS, SCREEN_TYPES, OOSTATES, LOG_LEVEL, PLATFORMS};
