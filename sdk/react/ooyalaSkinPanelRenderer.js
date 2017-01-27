/**
 * The OoyalaSkinPanelRenderer handles rendering of all panels using Skin state and Core method
 */
'use strict';

import React, { Component } from 'react';
var Constants = require('./constants');
var {
  BUTTON_NAMES,
  SCREEN_TYPES,
  OVERLAY_TYPES,
  OOSTATES,
  PLATFORMS,
  DESIRED_STATES
} = Constants;
var Log = require('./log');

var Dimensions = require('Dimensions');
var ActivityView = require('NativeModules').OOActivityView;
var StartScreen = require('./panels/StartScreen');
var EndScreen = require('./panels/EndScreen');
var ErrorScreen = require('./panels/ErrorScreen');
var DiscoveryPanel = require('./panels/discoveryPanel');
var MoreOptionScreen = require('./panels/MoreOptionScreen');
var VideoView = require('./panels/videoView');
var LanguageSelectionPanel = require('./panels/languageSelectionPanel');
var AdPlaybackScreen = require('./panels/adPlaybackScreen')

var OoyalaSkinPanelRenderer = function(ooyalaSkin, ooyalaCore, eventBridge) {
  Log.log("OoyalaSkinPanelRenderer Created");
  this.skin = ooyalaSkin;
  this.core = ooyalaCore;
};

OoyalaSkinPanelRenderer.prototype.renderStartScreen = function() {
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
      onPress={(name) => this.core.handlePress(name)}/>
  );
};

OoyalaSkinPanelRenderer.prototype.renderEndScreen = function() {
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
      onScrub={(value) => this.core.handleScrub(value)}
      handleControlsTouch={() => this.core.handleControlsTouch()}
      fullscreen={this.skin.state.fullscreen}
      upNextDismissed={this.skin.state.upNextDismissed}
      description={this.skin.state.description}
      promoUrl={this.skin.state.promoUrl}
      duration={this.skin.state.duration}
      onPress={(name) => this.core.handlePress(name)}/>
  );
};

OoyalaSkinPanelRenderer.prototype.renderErrorScreen = function() {
  return (
    <ErrorScreen
      error={this.skin.state.error}
      localizableStrings={this.skin.props.localization}
      locale={this.skin.props.locale} />);
};

OoyalaSkinPanelRenderer.prototype.renderVideoView = function() {
  return (
    <VideoView
      rate={this.skin.state.rate}
      playhead={this.skin.state.playhead}
      duration={this.skin.state.duration}
      adOverlay = {this.skin.state.adOverlay}
      live ={this.skin.state.live}
      platform={this.skin.state.platform}
      width={this.skin.state.width}
      height={this.skin.state.height}
      volume={this.skin.state.volume}
      fullscreen={this.skin.state.fullscreen}
      cuePoints={this.skin.state.cuePoints}
      handlers={{
        onPress: (value) => this.core.handlePress(value),
        onAdOverlay: (value)=>this.core.handleAdOverlayPress(value),
        onAdOverlayDismiss: () => this.core.handleAdOverlayDismiss(),
        onScrub: (value) => this.core.handleScrub(value),
        handleVideoTouch: (event) => this.core.handleVideoTouch(event),
        handleControlsTouch: () => this.core.handleControlsTouch()
      }}
      lastPressedTime={this.skin.state.lastPressedTime}
      closedCaptionsLanguage={this.skin.state.selectedLanguage}
      // todo: change to boolean showCCButton.
      availableClosedCaptionsLanguages={this.skin.state.availableClosedCaptionsLanguages}
      caption={this.skin.state.caption}
      captionStyles={{
        textSize: this.skin.state.ccTextSize,
        textColor: this.skin.state.ccTextColor,
        fontName: this.skin.state.ccFontName,
        backgroundColor: this.skin.state.ccBackgroundColor,
        textBackgroundColor: this.skin.state.ccTextBackgroundColor,
        backgroundOpacity: this.skin.state.ccBackgroundOpacity,
        edgeType: this.skin.state.ccEdgeType,
        edgeColor: this.skin.state.ccEdgeColor,
      }}
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
      playing={this.skin.state.desiredState === DESIRED_STATES.DESIRED_PLAY ? true : false}
      loading={this.skin.state.loading}
      initialPlay={this.skin.state.initialPlay}>
    </VideoView>
  );
};

OoyalaSkinPanelRenderer.prototype.renderAdPlaybackScreen = function() {
  return (
    <AdPlaybackScreen
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
      handlers={{
        onPress: (value) => this.core.handlePress(value),
        onIcon: (value)=>this.core.handleIconPress(value),
        onScrub: (value) => this.core.handleScrub(value),
        handleVideoTouch: (event) => this.core.handleVideoTouch(event),
        handleControlsTouch: () => this.core.handleControlsTouch()
      }}
      lastPressedTime={this.skin.state.lastPressedTime}
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
      playing={this.skin.state.desiredState === DESIRED_STATES.DESIRED_PLAY ? true : false}
      loading={this.skin.state.loading}
      initialPlay={this.skin.state.initialPlay}>
    </AdPlaybackScreen>
  );
};

OoyalaSkinPanelRenderer.prototype.renderCCOptions = function() {
  return (
    <LanguageSelectionPanel
      languages={this.skin.state.availableClosedCaptionsLanguages}
      selectedLanguage={this.skin.state.selectedLanguage}
      onSelect={(value)=>this.core.handleLanguageSelection(value)}
      onDismiss={() => this.core.dismissOverlay()}
      width={this.skin.state.width}
      height={this.skin.state.height}
      config={{localizableStrings:this.skin.props.localization,
               locale:this.skin.props.locale,
               icons:this.skin.props.icons,
               general: this.skin.props.general}}>
    </LanguageSelectionPanel>);
};

OoyalaSkinPanelRenderer.prototype.renderSocialOptions = function() {
  if(this.skin.state.platform == Constants.PLATFORMS.ANDROID) {
    this.core.bridge.shareTitle({shareTitle:this.skin.state.title});
    this.core.bridge.shareUrl({shareUrl:this.skin.state.hostedAtUrl});
    this.core.bridge.onPress({name:"Share"});
  }
  else if(this.skin.state.platform == Constants.PLATFORMS.IOS) {
    ActivityView.show({
      'text':this.skin.state.title,
      'link':this.skin.state.hostedAtUrl,
    });
  }
},

OoyalaSkinPanelRenderer.prototype.renderDiscoveryPanel = function() {
  if (!this.skin.state.discoveryResults) {
    return (
    <DiscoveryPanel
      config={{
        discoveryScreen: this.skin.props.discoveryScreen,
        icons: this.skin.props.icons,
      }}
      localizableStrings={this.skin.props.localization}
      onDismiss={() => this.core.dismissOverlay()}
      dataSource={[]}
      screenType={this.skin.state.screenType}>
    </DiscoveryPanel>);
  }
  else {
    return (
    <DiscoveryPanel
      config={{
        discoveryScreen: this.skin.props.discoveryScreen,
        icons: this.skin.props.icons,
      }}
      onDismiss={() => this.core.dismissOverlay()}
      platform={this.skin.state.platform}
      localizableStrings={this.skin.props.localization}
      locale={this.skin.props.locale}
      dataSource={this.skin.state.discoveryResults}
      onRowAction={(info) => this.core.emitDiscoveryOptionChosen(info)}
      width={this.skin.state.width}
      height={this.skin.state.height}
      screenType={this.skin.state.screenType}>
    </DiscoveryPanel>);
  }
};

OoyalaSkinPanelRenderer.prototype.renderMoreOptionScreen = function() {
  return (
    <MoreOptionScreen
      height={this.skin.state.height}
      onDismiss={() => this.core.dismissOverlay()}
      onOptionButtonPress={(buttonName) => this.core.handleMoreOptionsButtonPress(buttonName)}
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

OoyalaSkinPanelRenderer.prototype.renderScreen = function(overlayType, inAdPod, screenType) {
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

  if (inAdPod) {
    return this.renderAdPlaybackScreen();
  }

  switch (screenType) {
    case SCREEN_TYPES.START_SCREEN: 
      if(this.skin.state.desiredState != DESIRED_STATES.DESIRED_PLAY) {
        return this.renderStartScreen();   
      } else {
        return this.skin.renderLoadingScreen(); 
      }
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
};

module.exports = OoyalaSkinPanelRenderer;