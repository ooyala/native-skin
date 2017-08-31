/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React, { Component } from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  View,
  StyleSheet,
  TouchableHighlight
} from 'react-native';

var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
var BottomOverlay = require('../bottomOverlay');
var AdBar = require('../adBar');
var UpNext = require('../upNext');
var RectButton = require('../widgets/RectButton');
var VideoViewPlayPause = require('../widgets/VideoViewPlayPause');
var Constants = require('../constants');
var Log = require('../log');
var Utils = require('../utils');
var styles = Utils.getStyles(require('./style/videoViewStyles.json'));
var ResponsiveDesignManager = require('../responsiveDesignManager');
var VideoWaterMark = require('../widgets/videoWaterMark');
var autohideDelay = 5000;
var panelStyles = require('./style/panelStyles.json');

var {
  BUTTON_NAMES,
  PLATFORMS,
  IMG_URLS,
  UI_SIZES,
  AUTOHIDE_DELAY
} = Constants;

var VideoView = React.createClass({
  propTypes: {
    rate: React.PropTypes.number,
    platform: React.PropTypes.string,
    playhead: React.PropTypes.number,
    buffered: React.PropTypes.number,
    duration: React.PropTypes.number,
    adOverlay: React.PropTypes.object,
    live: React.PropTypes.bool,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    volume: React.PropTypes.number,
    fullscreen: React.PropTypes.bool,
    cuePoints: React.PropTypes.array,
    handlers:  React.PropTypes.shape({
      onPress: React.PropTypes.func,
      onAdOverlay: React.PropTypes.func,
      onAdOverlayDismiss: React.PropTypes.func,
      onScrub: React.PropTypes.func,
      handleVideoTouch: React.PropTypes.func,
      handleControlsTouch: React.PropTypes.func,
    }),
    lastPressedTime: React.PropTypes.any,
    closedCaptionsLanguage: React.PropTypes.string,
    availableClosedCaptionsLanguages: React.PropTypes.array,
    caption: React.PropTypes.string,
    captionStyles: React.PropTypes.object,
    showWatermark: React.PropTypes.bool,
    config: React.PropTypes.object,
    nextVideo: React.PropTypes.object,
    upNextDismissed: React.PropTypes.bool,
    localizableStrings: React.PropTypes.object,
    locale: React.PropTypes.string,
    playing: React.PropTypes.bool,
    loading: React.PropTypes.bool,
    initialPlay: React.PropTypes.bool,
  },

  componentWillReceiveProps: function(nextProps) {

  },

  getInitialState: function() {
    return {
    };
  },

  generateLiveObject: function() {
    if (this.props.live) {
      var isLive = this.props.playhead >= this.props.duration * 0.95;
      return ({
        label:
          isLive ? Utils.localizedString(this.props.locale, "LIVE", this.props.localizableStrings) :
          Utils.localizedString(this.props.locale, "GO LIVE", this.props.localizableStrings),
        onGoLive: isLive? null : this.onGoLive});
    } else {
      return null;
    }
  },

  onGoLive: function() {
    Log.log("onGoLive");
    if (this.props.handlers.onScrub) {
      this.props.handlers.onScrub(1);
    }
  },

  handlePress: function(name) {
    Log.verbose("VideoView Handle Press: " + name);
    if (this.state.showControls) {
      if (name == "LIVE") {
        this.props.handlers.onScrub(1);
      } else {
        this.props.handlers.onPress(name);
      }
    } else {
      this.props.handlers.onPress(name);
    }
  },

  _placeholderTapHandler: function(event) {
    if (this.props.screenReaderEnabled) {
      this.handlePress(BUTTON_NAMES.PLAY_PAUSE);
    } else {
      this.props.handlers.handleVideoTouch(event);
    }
  },

  _createOnIcon: function(index, func) {
    return function() {
      func(index);
    }
  },

  _renderBottomOverlay: function(show) {
    var shouldShowClosedCaptionsButton =
      this.props.availableClosedCaptionsLanguages &&
      this.props.availableClosedCaptionsLanguages.length > 0;

    return (<BottomOverlay
      width={this.props.width}
      height={this.props.height}
      primaryButton={!this.props.playing ? "play" : "pause"}
      fullscreen = {this.props.fullscreen}
      cuePoints = {this.props.cuePoints}
      playhead={this.props.playhead}
      platform={this.props.platform}
      duration={this.props.duration}
      volume={this.props.volume}
      live={this.generateLiveObject()}
      onPress={(name) => this.handlePress(name)}
      onScrub={(value)=>this.handleScrub(value)}
      handleControlsTouch={() => this.props.handlers.handleControlsTouch()}
      showClosedCaptionsButton={shouldShowClosedCaptionsButton}
      showWatermark={this.props.showWatermark}
      isShow={show}
      config={{
        controlBar: this.props.config.controlBar,
        buttons: this.props.config.buttons,
        icons: this.props.config.icons,
        live: this.props.config.live,
        general: this.props.config.general
      }} />);
  },

  _renderPlaceholder: function() {
    return (
      <View
        reactTag={1}
        accessible={true}
        accessibilityLabel={"Video player. Tap twice to play or pause"}
        style={styles.placeholder}
        onTouchEnd={(event) => this._placeholderTapHandler(event)}>
      </View>);
  },

  _renderBottom: function() {
    var VideoWaterMarkSize = ResponsiveDesignManager.makeResponsiveMultiplier(UI_SIZES.VIDEOWATERMARK, UI_SIZES.VIDEOWATERMARK);
    var waterMarkName;
    if(this.props.platform == Constants.PLATFORMS.ANDROID) {
      waterMarkName = this.props.config.general.watermark.imageResource.androidResource;
    }
    if(this.props.platform == Constants.PLATFORMS.IOS) {
      waterMarkName = this.props.config.general.watermark.imageResource.iosResource;
    }

    if (waterMarkName) {
      var watermark = this._renderVideoWaterMark(waterMarkName, VideoWaterMarkSize);
    }

    return (
      <View
        style={{flexDirection:"row", justifyContent:"center", alignItems: "flex-end"}}>
        {this._renderClosedCaptions(waterMarkName, VideoWaterMarkSize)}
        {watermark}
      </View>);
  },

  _renderClosedCaptions: function(waterMarkName, VideoWaterMarkSize) {
    var containerPadding = 5;
    var captionWidth = this.props.width - (containerPadding * 4);
    if (waterMarkName) {
      captionWidth = captionWidth - VideoWaterMarkSize;
    }

    var ccStyle = {color:this.props.captionStyles.textColor,fontFamily:this.props.captionStyles.fontName,
      backgroundColor:this.props.captionStyles.textBackgroundColor};
    if (this.props.caption) {
      return (
        <View
          style={[panelStyles.closedCaptionsContainer, {padding: containerPadding, width: captionWidth}]}
          onTouchEnd={(event) => this.props.handlers.handleVideoTouch(event)}>
          <View
            style={[{backgroundColor:this.props.captionStyles.backgroundColor}]}>
            <Text style={[panelStyles.closedCaptions, ccStyle]}>
              {this.props.caption}
            </Text>
          </View>
        </View>
        );
    }
    return null;
  },

  _renderUpNext: function() {
    if (this.props.live) {
      return null;
    }

    return <UpNext
      config={{
        upNext: this.props.config.upNext,
        icons: this.props.config.icons
      }}
      ad={this.props.ad}
      playhead={this.props.playhead}
      duration={this.props.duration}
      nextVideo={this.props.nextVideo}
      upNextDismissed={this.props.upNextDismissed}
      onPress={(value) => this.handlePress(value)}
      platform={this.props.platform}
      width={this.props.width}/>;
  },

  _renderPlayPause: function(show) {
    var iconFontSize = ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.VIDEOVIEW_PLAYPAUSE);
      return (
        <VideoViewPlayPause
          icons={{
            play: {
              icon: this.props.config.icons.play.fontString,
              fontFamily: this.props.config.icons.play.fontFamilyName
            },
            pause: {
              icon: this.props.config.icons.pause.fontString,
              fontFamily: this.props.config.icons.pause.fontFamilyName
            }
          }}
          position={"center"}
          onPress={(name) => this.handlePress(name)}
          frameWidth={this.props.width}
          frameHeight={this.props.height}
          buttonWidth={iconFontSize}
          buttonHeight={iconFontSize}
          platform={this.props.platform}
          fontSize={iconFontSize}
          showButton={show}
          rate={this.props.rate}
          playing={this.props.playing}
          loading={this.props.loading}
          initialPlay={this.props.initialPlay}>
        </VideoViewPlayPause>);
  },

  _renderVideoWaterMark: function(waterMarkName, VideoWaterMarkSize) {
    if (waterMarkName) {
      return (
        <View
            style={{flex:1, justifyContent:"flex-end", alignItems:"flex-end"}}>
            <VideoWaterMark
              buttonWidth={VideoWaterMarkSize}
              buttonHeight={VideoWaterMarkSize}
              waterMarkName={waterMarkName}/>
        </View>
      );
    }
  },

  _renderAdOverlay: function() {
    if (!this.props.adOverlay) {
      return null;
    }

    //width and height of the ad overlay
    var width = this.props.adOverlay.width;
    var height = this.props.adOverlay.height;

    //if the width of the ad is larger than the player width
    var sidePadding = 10;
    var maxWidth = this.props.width - 2 * sidePadding;
    if (width > maxWidth) {
      height = height / width * maxWidth;
      width = maxWidth;
    }
    var left = (this.props.width - width) / 2;

    return (
      <View
        accesible={false}
        style={{height:height, width:width}}>
        <TouchableHighlight
          style={{left: left, bottom: 10, width:width, height:height}}
          onPress={this.handleOverlayClick}>
          <View
            style={styles.container}>
            <Image
              style={styles.container}
              source={{uri: this.props.adOverlay.resourceUrl}}
              resizeMode={Image.resizeMode.contain}>
            </Image>
            <TouchableHighlight
              style={panelStyles.dismissOverlay}
              onPress={this.props.handlers.onAdOverlayDismiss}>
              <Text style={panelStyles.dismissIcon}>
                {this.props.config.icons.dismiss.fontString}
              </Text>
            </TouchableHighlight>
          </View>
        </TouchableHighlight>
      </View>);
  },

  _renderLoading: function() {
    var loadingSize = ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.LOADING_ICON);
    var scaleMultiplier = this.props.platform == Constants.PLATFORMS.ANDROID ? 2 : 1;
    var topOffset = Math.round((this.props.height - loadingSize * scaleMultiplier) * 0.5);
    var leftOffset = Math.round((this.props.width - loadingSize * scaleMultiplier) * 0.5);
    var loadingStyle = {position: 'absolute', top:topOffset, left:leftOffset, width: loadingSize, height: loadingSize};
    if (this.props.loading) {
      return (
       <ActivityIndicator
          style={loadingStyle}
          size="large"
      />
      );
    }
  },

  handleScrub: function(value) {
    this.props.handlers.onScrub(value);
  },

  getDefaultProps: function() {
    return {playhead: 0, buffered: 0, duration: 1};
  },

  handleTouchEnd: function(event) {
    this.props.handlers.handleVideoTouch();
  },

  handleOverlayClick: function() {
    this.props.handlers.onAdOverlay(this.props.adOverlay.clickUrl);
  },

  render: function() {
    var isPastAutoHideTime = (new Date).getTime() - this.props.lastPressedTime > AUTOHIDE_DELAY;
    var shouldShowControls = this.props.screenReaderEnabled ? true : !isPastAutoHideTime;

    // for renderPlayPause, if the screen reader is enabled, we want to hide the button
    return (
      <View
        accessible={false}
        style={styles.container}>
        {this._renderPlaceholder()}
        {this._renderBottom()}
        {this._renderAdOverlay()}
        {this._renderPlayPause(this.props.screenReaderEnabled ? false : shouldShowControls)}
        {this._renderUpNext()}
        {this._renderBottomOverlay(shouldShowControls)}
        {this._renderLoading()}
      </View>
    );
  }
});

module.exports = VideoView;
