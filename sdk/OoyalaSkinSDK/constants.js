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
  DISCOVERY: '\uf14e',
  QUALITY: '\uf080',
  SETTING: '\uf013',
  DISMISS: '\uf00d',
  TOGGLEOFF: '\uf204',
  TOGGLEON: '\uf205'
};

var BUTTON_NAMES = { // must match Objective-C code expectations.
  PLAY_PAUSE: 'PlayPause',
  SOCIAL_SHARE: 'SocialShare',
  CLOSED_CAPTIONS: 'ClosedCaptions',
  FULLSCREEN: 'Fullscreen',
  MORE: 'More',
  TWITTER: 'Twitter',
  FACEBOOK: 'Facebook',
  GOOGLEPLUS: 'GooglePlus',
  EMAIL: 'Email',
  LEARNMORE: 'LearnMore',
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
};

var OVERLAY_TYPES = {
  DISCOVERY_OVERLAY: 'discovery',
  SOCIAL_OVERLAY: 'social',
  CC_OPTIONS: 'cc_options',
};

var OOSTATES = {
  PAUSED: 'paused',
};

var UI_TEXT = {
  LEARNMORE : 'Learn More',
  CC_PREVIEW: 'CLOSE CAPTION PREVIEW',
  CC_SAMPLE: 'Sample Text',
  AD_PLAYING: 'Ad Playing',
  LIVE: 'LIVE',
  GO_LIVE: 'GO LIVE',
  SEPERATOR: '/',
  CC_OPTIONS: 'CC Options',
  ON: 'On',
  OFF: 'Off',
};

module.exports = {ICONS, BUTTON_NAMES, IMG_URLS, SCREEN_TYPES, OOSTATES, UI_TEXT, OVERLAY_TYPES};