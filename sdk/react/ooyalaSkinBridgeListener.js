/**
 * The OoyalaSkinBridgeListener handles all of the listening of Player events from the Bridge
 */
 'use strict';

var Log = require('./log');
var Constants = require('./constants');
var {
  SCREEN_TYPES,
  OVERLAY_TYPES,
} = Constants;

var OoyalaSkinBridgeListener = function(ooyalaSkin, ooyalaCore, eventBridge) {
  Log.log("SkinBridgeListener Created");
  this.skin = ooyalaSkin;
  this.core = ooyalaCore;

};

OoyalaSkinBridgeListener.prototype.mount = function(eventEmitter) {
  Log.log("SkinBridgeListener Mounted");
  this.listeners = [];
  var listenerDefinitions = [
    [ 'timeChanged',              (event) => this.onTimeChange(event) ],
    [ 'ccStylingChanged',         (event) => this.onCcStylingChange(event) ],
    [ 'currentItemChanged',       (event) => this.onCurrentItemChange(event) ],
    [ 'frameChanged',             (event) => this.onFrameChange(event) ],
    [ 'volumeChanged',            (event) => this.onVolumeChanged(event) ],
    [ 'playCompleted',            (event) => this.onPlayComplete(event) ],
    [ 'stateChanged',             (event) => this.onStateChange(event) ],
    [ 'desiredStateChanged',      (event) => this.onDesiredStateChange(event) ],
    [ 'discoveryResultsReceived', (event) => this.onDiscoveryResult(event) ],
    [ 'onClosedCaptionUpdate',    (event) => this.onClosedCaptionUpdate(event) ],
    [ 'adStarted',                (event) => this.onAdStarted(event) ],
    [ 'adSwitched',               (event) => this.onAdSwitched(event) ],
    [ 'adPodCompleted',           (event) => this.onAdPodCompleted(event) ],
    [ 'adOverlay',                (event) => this.onAdOverlay(event) ],
    [ 'adError',                  (event) => this.onAdError(event) ],
    [ 'setNextVideo',             (event) => this.onSetNextVideo(event) ],
    [ 'upNextDismissed',          (event) => this.onUpNextDismissed(event) ],
    [ 'playStarted',              (event) => this.onPlayStarted(event) ],
    [ 'error',                    (event) => this.onError(event) ],
    [ 'embedCodeSet',             (event) => this.onEmbedCodeSet(event) ]
  ];

  for (var i = 0; i < listenerDefinitions.length; i++) {
    var d = listenerDefinitions[i];
    this.listeners.push(eventEmitter.addListener( d[0], d[1] ) );
  }
};

OoyalaSkinBridgeListener.prototype.unmount = function() {
  for (var i = 0; i < this.listeners.length; i++) {
    this.listeners[i].remove;
  }
  this.listeners = [];
};


OoyalaSkinBridgeListener.prototype.onClosedCaptionUpdate = function(e) {
  this.skin.setState({caption: e.text});
};

OoyalaSkinBridgeListener.prototype.onTimeChange = function(e) { // todo: naming consistency? playheadUpdate vs. onTimeChange vs. ...
  this.skin.setState({
    playhead: e.playhead,
    duration: e.duration,
    initialPlay: false,
    availableClosedCaptionsLanguages: e.availableClosedCaptionsLanguages,
    cuePoints: e.cuePoints
  });

  if(this.skin.state.screenType == SCREEN_TYPES.VIDEO_SCREEN ||
     this.skin.state.screenType == SCREEN_TYPES.END_SCREEN) {
    this.core.previousScreenType = this.skin.state.screenType;
  }
};

OoyalaSkinBridgeListener.prototype.onAdStarted = function(e) {
  Log.log( "onAdStarted");
  Log.log(e);
  this.skin.setState({ad:e, screenType:SCREEN_TYPES.VIDEO_SCREEN, adOverlay: null});
};

OoyalaSkinBridgeListener.prototype.onCcStylingChange = function(e) {
  Log.log( "onCcStylingChange");
  this.skin.setState({
    ccTextSize: e.textSize,
    ccFontName: e.fontName,
    ccTextColor: e.textColor,
    ccBackgroundColor: e.backgroundColor,
    ccEdgeType: e.edgeType,
    ccEdgeColor: e.edgeColor,
  });
};

OoyalaSkinBridgeListener.prototype.onAdSwitched = function(e) {
  Log.log( "onAdSwitched");
  this.skin.setState({ad:e});
};

OoyalaSkinBridgeListener.prototype.onAdPodCompleted = function(e) {
  Log.log( "onAdPodCompleted ");
  this.skin.setState({ad: null});
};

OoyalaSkinBridgeListener.prototype.onAdOverlay = function(e) {
  Log.log( "onAdOverlay");
  this.skin.setState({adOverlay: e});
}

OoyalaSkinBridgeListener.prototype.onAdError = function(e) {
  Log.log( "onAdError ");
  this.skin.setState({ad: null});
};

OoyalaSkinBridgeListener.prototype.onCurrentItemChange = function(e) {
  Log.log("currentItemChangeReceived, promoUrl is " + e.promoUrl);
  this.skin.setState({
    title:e.title,
    description:e.description,
    duration:e.duration,
    live:e.live,
    promoUrl:e.promoUrl,
    hostedAtUrl: e.hostedAtUrl,
    playhead:e.playhead,
    width:e.width,
    height:e.height,
    volume:e.volume,
    caption:null});
  if (!this.skin.state.autoPlay) {
    this.skin.setState({screenType: SCREEN_TYPES.START_SCREEN});
  };
  this.core.clearOverlayStack();
};

OoyalaSkinBridgeListener.prototype.onFrameChange = function(e) {
  Log.log("receive frameChange, frame width is" + e.width + " height is" + e.height);
  this.skin.setState({width:e.width, height:e.height, fullscreen:e.fullscreen});
};

OoyalaSkinBridgeListener.prototype.onPlayStarted = function(e) {
  Log.log("Play Started received");
  this.skin.setState({screenType: SCREEN_TYPES.VIDEO_SCREEN, autoPlay: false});
};

OoyalaSkinBridgeListener.prototype.onPlayComplete = function(e) {
  Log.log("Play Complete received: upNext dismissed: "  + this.skin.state.upNextDismissed);
  this.skin.setState({"playing": false, screenType: SCREEN_TYPES.END_SCREEN});
  
  if (this.core.shouldShowDiscoveryEndscreen()) {
      this.core.pushToOverlayStackAndMaybePause(OVERLAY_TYPES.DISCOVERY_SCREEN);
  }
};

OoyalaSkinBridgeListener.prototype.onDiscoveryResult = function(e) {
  Log.log("onDiscoveryResult results are:", e.results);
  this.skin.setState({discoveryResults:e.results});
  if(e.results) {
    this.onSetNextVideo({nextVideo:e.results[0]})
  }
};

OoyalaSkinBridgeListener.prototype.onStateChange = function(e) {
  Log.log("state changed to:" + e.state)
  switch (e.state) {
    case "completed":
    case "error":
    case "init":
    case "paused":
    case "suspended":
    case "ready":
      this.skin.setState({
        playing: false,
        loading: false
      });
      break;
    case "playing":
      this.skin.setState({
        playing: true,
        loading: false,
        initialPlay: (this.skin.state.screenType == SCREEN_TYPES.START_SCREEN) ? true : false,
        screenType: SCREEN_TYPES.VIDEO_SCREEN});
      break;
    case "loading":
      this.skin.setState({
        loading: true
      })
      break;
    default:
      break;
  }
};

OoyalaSkinBridgeListener.prototype.onDesiredStateChange = function(e) {
  Log.log("desired state change received:" + e.desiredState);
  this.skin.setState({
    desiredState:e.desiredState,
  });
};
OoyalaSkinBridgeListener.prototype.onError = function(e) {
  Log.log("Error received");
  this.skin.setState({screenType:SCREEN_TYPES.ERROR_SCREEN, error:e});
};

OoyalaSkinBridgeListener.prototype.onEmbedCodeSet = function(e) {
  Log.log("EmbedCodeSet received");
  this.skin.setState({screenType:SCREEN_TYPES.LOADING_SCREEN, ad: null});
};

OoyalaSkinBridgeListener.prototype.onUpNextDismissed = function(e) {
  Log.log("SetNextVideo received");
  this.skin.setState({upNextDismissed:e.upNextDismissed});
};

OoyalaSkinBridgeListener.prototype.onSetNextVideo = function(e) {
  Log.log("SetNextVideo received");
  this.skin.setState({nextVideo:e.nextVideo});
};

OoyalaSkinBridgeListener.prototype.onVolumeChanged = function(e) {
  this.skin.setState({volume: e.volume});
};

module.exports = OoyalaSkinBridgeListener;