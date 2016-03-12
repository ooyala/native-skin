/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  ActivityIndicatorIOS,
  SliderIOS,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} = React;
var Dimensions = require('Dimensions');
var ActivityView = require('NativeModules').OOActivityView;
var StartScreen = require('./StartScreen');
var EndScreen = require('./EndScreen');
var ErrorScreen = require('./ErrorScreen');
var DiscoveryPanel = require('./discoveryPanel');
var MoreOptionScreen = require('./MoreOptionScreen');
var Log = require('./log');
var Constants = require('./constants');
var {
  BUTTON_NAMES,
  SCREEN_TYPES,
  OVERLAY_TYPES,
  OOSTATES,
  PLATFORMS
} = Constants;
var VideoView = require('./videoView');
var LanguageSelectionPanel = require('./languageSelectionPanel.js');
var OoyalaSkinBridgeListener = require('./ooyalaSkinBridgeListener');
var previousScreenType;

var OoyalaSkinCore = function(ooyalaSkin, eventBridge) {
  this.skin = ooyalaSkin;
  this.bridge = eventBridge;
  this.ooyalaSkinBridgeListener = new OoyalaSkinBridgeListener(ooyalaSkin, this, eventBridge);
};

OoyalaSkinCore.prototype.mount = function(eventEmitter) {
  this.ooyalaSkinBridgeListener.mount(eventEmitter);
};

OoyalaSkinCore.prototype.unmount = function() {
  this.ooyalaSkinBridgeListener.unmount();
};

// event handlers.
OoyalaSkinCore.prototype.onOptionButtonPress = function(buttonName) {
    switch (buttonName) {
    case BUTTON_NAMES.DISCOVERY:
      this.pushToOverlayStackAndMaybePause(OVERLAY_TYPES.DISCOVERY_SCREEN);
      break;
    case BUTTON_NAMES.CLOSED_CAPTIONS:
      this.pushToOverlayStackAndMaybePause(OVERLAY_TYPES.CLOSEDCAPTIONS_SCREEN);
      break; 
    case BUTTON_NAMES.SHARE:
      this.renderSocialOptions();
      break;
    case BUTTON_NAMES.QUALITY:
      break;
    case BUTTON_NAMES.SETTING:
      break;
    default:
      break;
  }
};

OoyalaSkinCore.prototype.pauseOnOptions = function() {
  if (this.skin.state.screenType != OVERLAY_TYPES.MOREOPTION_SCREEN) {
    this.previousScreenType = this.skin.state.screenType;
  }
};

OoyalaSkinCore.prototype.onOptionDismissed = function() {
  this.skin.setState({screenType: this.previousScreenType});
  this.popFromOverlayStackAndMaybeResume();
};

OoyalaSkinCore.prototype.onDiscoveryRow = function(info) {
  this.bridge.onDiscoveryRow(info);
};

OoyalaSkinCore.prototype.onOverlayDismissed = function() {
  Log.log("On Overlay Dismissed");
  this.popFromOverlayStackAndMaybeResume();
}

OoyalaSkinCore.prototype.onLanguageSelected = function(e) {
  Log.log('onLanguageSelected:'+e);
  this.skin.setState({selectedLanguage:e});
};
/**
 *  When a button is pressed on the control bar
 *  If it's a "fast-access" options button, open options menu and perform the options action
 */
OoyalaSkinCore.prototype.handlePress = function(n) {
  switch(n) {
    case BUTTON_NAMES.MORE:
      this.pauseOnOptions();
      this.pushToOverlayStackAndMaybePause(OVERLAY_TYPES.MOREOPTION_SCREEN);
      break;
    case BUTTON_NAMES.DISCOVERY:
      this.pauseOnOptions();
      this.pushToOverlayStackAndMaybePause(OVERLAY_TYPES.DISCOVERY_SCREEN);
      break;
    case BUTTON_NAMES.CLOSED_CAPTIONS:
      this.pauseOnOptions();
      this.pushToOverlayStackAndMaybePause(OVERLAY_TYPES.CLOSEDCAPTIONS_SCREEN);
      break;
    case BUTTON_NAMES.SETTING:
      this.pauseOnOptions();
      this.onOptionButtonPress(n);
      break;
    case BUTTON_NAMES.QUALITY:
    case BUTTON_NAMES.SHARE:
      break;
    default:
      this.bridge.onPress({name:n});
      break;
  }
};

OoyalaSkinCore.prototype.handleScrub = function(value) {
  this.bridge.onScrub({percentage:value});
};

OoyalaSkinCore.prototype.handleIconPress = function(index) {
  this.bridge.onPress({name:BUTTON_NAMES.AD_ICON, index:index})
};

OoyalaSkinCore.prototype.updateClosedCaptions = function() {
  if (this.skin.state.selectedLanguage) {
    this.bridge.onClosedCaptionUpdateRequested( {language:this.skin.state.selectedLanguage} );
  }
};

OoyalaSkinCore.prototype.shouldShowLandscape = function() {
  return this.skin.state.width > this.skin.state.height;
};

OoyalaSkinCore.prototype.renderStartScreen = function() {
  return (
    <StartScreen
      config={{
        startScreen: this.skin.props.startScreen,
        icons: this.skin.props.icons
      }}
      title={this.skin.state.title}
      description={this.skin.state.description}
      promoUrl={this.skin.state.promoUrl}
      width={this.skin.state.width}
      height={this.skin.state.height}
      platform={this.skin.state.platform}
      playhead={this.skin.state.playhead}
      onPress={(name) => this.handlePress(name)}/>
  );
};

OoyalaSkinCore.prototype.renderEndScreen = function() {
  return (
    <EndScreen
      config={{
        endScreen: this.skin.props.endScreen,
        controlBar: this.skin.props.controlBar,
        buttons: this.skin.props.buttons.mobileContent,
        icons: this.skin.props.icons
      }}
      title={this.skin.state.title}
      width={this.skin.state.width}
      height={this.skin.state.height}
      volume={this.skin.state.volume}
      onScrub={(value) => this.handleScrub(value)}
      upNextDismissed={this.skin.state.upNextDismissed}
      discoveryPanel={this.renderDiscoveryPanel()}
      description={this.skin.state.description}
      promoUrl={this.skin.state.promoUrl}
      duration={this.skin.state.duration}
      onPress={(name) => this.handlePress(name)}/>
  );
};

OoyalaSkinCore.prototype.renderErrorScreen = function() {
  return (
    <ErrorScreen
      error={this.skin.state.error}
      localizableStrings={this.skin.props.localization}
      locale={this.skin.props.locale} />);
};

OoyalaSkinCore.prototype.renderVideoView = function() {
  return (
    <VideoView
      rate={this.skin.state.rate}
      playhead={this.skin.state.playhead}
      duration={this.skin.state.duration}
      ad ={this.skin.state.ad}
      live ={this.skin.state.live}
      platform={this.skin.state.platform}
      width={this.skin.state.width}
      height={this.skin.state.height}
      volume={this.skin.state.volume}
      fullscreen={this.skin.state.fullscreen}
      cuePoints={this.skin.state.cuePoints}
      onPress={(value) => this.handlePress(value)}
      onIcon={(value)=>this.handleIconPress(value)}
      onScrub={(value) => this.handleScrub(value)}
      closedCaptionsLanguage={this.skin.state.selectedLanguage}
      // todo: change to boolean showCCButton.
      availableClosedCaptionsLanguages={this.skin.state.availableClosedCaptionsLanguages}
      captionJSON={this.skin.state.captionJSON}
      config={{
        controlBar: this.skin.props.controlBar,
        general: this.skin.props.general,
        buttons: this.skin.props.buttons.mobileContent,
        upNext: this.skin.props.upNext,
        icons: this.skin.props.icons,
        adScreen: this.skin.props.adScreen,
        live: this.skin.props.live
      }}
      nextVideo={this.skin.state.nextVideo}
      upNextDismissed={this.skin.state.upNextDismissed}
      localizableStrings={this.skin.props.localization}
      locale={this.skin.props.locale}
      playing={this.skin.state.playing}
      loading={this.skin.state.loading}
      initialPlay={this.skin.state.initialPlay}>
    </VideoView>
  );
};
OoyalaSkinCore.prototype.renderCCOptions = function() {
  return (
    <LanguageSelectionPanel
      languages={this.skin.state.availableClosedCaptionsLanguages}
      selectedLanguage={this.skin.state.selectedLanguage}
      onSelect={(value)=>this.onLanguageSelected(value)}
      onDismiss={() => this.onOverlayDismissed()}
      width={this.skin.state.width}
      height={this.skin.state.height}
      config={{localizableStrings:this.skin.props.localization,
               locale:this.skin.props.locale,
               icons:this.skin.props.icons}}>
    </LanguageSelectionPanel>);
};

OoyalaSkinCore.prototype.renderSocialOptions = function() {
  if(this.skin.state.platform == Constants.PLATFORMS.ANDROID) {
    this.bridge.shareTitle({shareTitle:this.skin.state.title});
    this.bridge.shareUrl({shareUrl:this.skin.state.hostedAtUrl});
    this.bridge.onPress({name:"Share"});
  }
  else if(this.skin.state.platform == Constants.PLATFORMS.IOS) {
    ActivityView.show({
      'text':this.skin.state.title,
      'link':this.skin.state.hostedAtUrl,
    });
  }
},
OoyalaSkinCore.prototype.renderDiscoveryPanel = function() {
  if (!this.skin.state.discoveryResults) {
    return null;
  }
  return (
    <DiscoveryPanel
      config={{
        discoveryScreen: this.skin.props.discoveryScreen,
        icons: this.skin.props.icons,
      }}
      onDismiss={() => this.onOverlayDismissed()}
      platform={this.skin.state.platform}
      localizableStrings={this.skin.props.localization}
      locale={this.skin.props.locale}
      dataSource={this.skin.state.discoveryResults}
      onRowAction={(info) => this.onDiscoveryRow(info)}
      width={this.skin.state.width}
      height={this.skin.state.height}
      screenType={this.skin.state.screenType}>
    </DiscoveryPanel>);
};

OoyalaSkinCore.prototype.renderMoreOptionScreen = function() {
  return (
    <MoreOptionScreen
      height={this.skin.state.height}
      onDismiss={() => this.onOptionDismissed()}
      onOptionButtonPress={(buttonName) => this.onOptionButtonPress(buttonName)}
      config={{
        moreOptionsScreen: this.skin.props.moreOptionsScreen,
        buttons: this.skin.props.buttons.mobileContent,
        icons: this.skin.props.icons,
        // TODO: assumes this is how control bar width is calculated everywhere.
        controlBarWidth: this.skin.state.width
      }} >
    </MoreOptionScreen>
  );
};

OoyalaSkinCore.prototype.shouldShowDiscoveryEndscreen = function() {
  return (this.skin.state.upNextDismissed == true && this.skin.props.endScreen.screenToShowOnEnd == "discovery");
};


OoyalaSkinCore.prototype.pushToOverlayStackAndMaybePause = function(overlay) {
  if (this.skin.state.overlayStack.length === 0 && this.skin.state.playing) {
    Log.log("New stack of overlays, pausing")
    this.skin.setState({pausedByOverlay:true});
    this.bridge.onPress({name:BUTTON_NAMES.PLAY_PAUSE});
  }
  var retVal = this.skin.state.overlayStack.push(overlay);
  this.skin.forceUpdate();
  return retVal;
},

OoyalaSkinCore.prototype.clearOverlayStack = function(overlay) {
  this.skin.setState({overlayStack: []});
},

OoyalaSkinCore.prototype.popFromOverlayStackAndMaybeResume = function(overlay) {
  var retVal = this.skin.state.overlayStack.pop();

  if (this.skin.state.overlayStack.length === 0 && this.skin.state.pausedByOverlay) {
    Log.log("Emptied stack of overlays, resuming");
    this.skin.setState({pausedByOverlay:false});
    this.bridge.onPress({name:BUTTON_NAMES.PLAY_PAUSE});
  }
  this.skin.forceUpdate();
  return retVal;
},

OoyalaSkinCore.prototype.renderScreen = function(overlayType, screenType) {
  if (overlayType) {
    switch (overlayType) {
      case OVERLAY_TYPES.MOREOPTION_SCREEN:  
        return this.renderMoreOptionScreen();  
        break;
      case OVERLAY_TYPES.DISCOVERY_SCREEN:  
        return this.renderDiscoveryPanel();  
        break;
      case OVERLAY_TYPES.CLOSEDCAPTIONS_SCREEN:  
        return this.renderCCOptions();  
        break;
    }
    return;
  }
  switch (screenType) {
    case SCREEN_TYPES.START_SCREEN: 
      return this.renderStartScreen(); 
      break;
    case SCREEN_TYPES.END_SCREEN:   
      return this.renderEndScreen();   
      break;
    case SCREEN_TYPES.LOADING_SCREEN: 
      return this.skin.renderLoadingScreen(); 
      break;
    case SCREEN_TYPES.ERROR_SCREEN: 
      return this.renderErrorScreen(); 
      break;
    default:      
      return this.renderVideoView();   
      break;
  }
}

module.exports = OoyalaSkinCore;
