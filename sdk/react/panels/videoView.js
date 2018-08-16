'use strict';

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
import PropTypes from 'prop-types';

import React, {Component} from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  View,
  StyleSheet,
  TouchableHighlight
} from 'react-native';

const BottomOverlay = require('../bottomOverlay');
const UpNext = require('../upNext');
const VideoViewPlayPause = require('../widgets/VideoViewPlayPause');
const Constants = require('../constants');
const Log = require('../log');
const Utils = require('../utils');
const styles = Utils.getStyles(require('./style/videoViewStyles.json'));
const ResponsiveDesignManager = require('../responsiveDesignManager');
const VideoWaterMark = require('../widgets/videoWaterMark');
const panelStyles = require('./style/panelStyles.json');

const {
  BUTTON_NAMES,
  PLATFORMS,
  IMG_URLS,
  UI_SIZES,
  AUTOHIDE_DELAY,
  VALUES
} = Constants;

class VideoView extends React.Component {
  static propTypes = {
    rate: PropTypes.number,
    platform: PropTypes.string,
    playhead: PropTypes.number,
    buffered: PropTypes.number,
    duration: PropTypes.number,
    adOverlay: PropTypes.object,
    live: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number,
    volume: PropTypes.number,
    fullscreen: PropTypes.bool,
    cuePoints: PropTypes.array,
    stereoSupported: PropTypes.bool,
    multiAudioEnabled: PropTypes.bool,
    handlers: PropTypes.shape({
      onPress: PropTypes.func,
      onAdOverlay: PropTypes.func,
      onAdOverlayDismiss: PropTypes.func,
      onScrub: PropTypes.func,
      handleVideoTouchStart: PropTypes.func,
      handleVideoTouchMove: PropTypes.func,
      handleVideoTouchEnd: PropTypes.func,
      handleControlsTouch: PropTypes.func,
      showControls: PropTypes.func,
    }),
    lastPressedTime: PropTypes.any,
    screenReaderEnabled: PropTypes.bool,
    closedCaptionsLanguage: PropTypes.string,
    availableClosedCaptionsLanguages: PropTypes.array,
    caption: PropTypes.string,
    captionStyles: PropTypes.object,
    showWatermark: PropTypes.bool,
    config: PropTypes.object,
    nextVideo: PropTypes.object,
    upNextDismissed: PropTypes.bool,
    localizableStrings: PropTypes.object,
    locale: PropTypes.string,
    playing: PropTypes.bool,
    loading: PropTypes.bool,
    initialPlay: PropTypes.bool,
  };

  state = {};

  componentWillReceiveProps(nextProps) {

  }

  generateLiveObject = () => {
    if (this.props.live) {
      const isLive = this.props.playhead >= this.props.duration * VALUES.LIVE_THRESHOLD;
      return ({
        label:
          isLive ? Utils.localizedString(this.props.locale, "LIVE", this.props.localizableStrings) :
            Utils.localizedString(this.props.locale, "GO LIVE", this.props.localizableStrings),
        onGoLive: isLive ? null : this.onGoLive
      });
    } else {
      return null;
    }
  };

  onGoLive = () => {
    Log.log("onGoLive");
    if (this.props.handlers.onScrub) {
      this.props.handlers.onScrub(1);
    }
  };

  handlePress = (name) => {
    Log.verbose("VideoView Handle Press: " + name);
    if (this.state.showControls) {
      if (name === "LIVE") {
        this.props.handlers.onScrub(1);
      } else {
        this.props.handlers.onPress(name);
      }
    } else {
      this.props.handlers.showControls();
      this.props.handlers.onPress(name);
    }
  };

  onSeekPressed = (skipCountValue) => {
    if (skipCountValue == 0) { return null; }

    let configSeekValue = (skipCountValue > 0) ? this.props.config.skipControls.skipForwardTime : this.props.config.skipControls.skipBackwardTime;
    configSeekValue = Utils.restrictSeekValueIfNeeded(configSeekValue);
    const seekValue = configSeekValue * skipCountValue;

    const currentPlayhead = this.props.playhead;
    let resultedPlayhead = currentPlayhead + seekValue;
    if (resultedPlayhead < 0) {
      resultedPlayhead = 0;
    } else if (resultedPlayhead > this.props.duration) {
      resultedPlayhead = this.props.duration;
    }
    const resultedPlayheadPercent = this.props.duration === 0 ? 0 : resultedPlayhead / this.props.duration;
    this.handleScrub(resultedPlayheadPercent);
  };

  _placeholderTapHandler = (event) => {
    if (this.props.screenReaderEnabled) {
      this.handlePress(BUTTON_NAMES.PLAY_PAUSE);
    } else {
      this.props.handlers.handleVideoTouchEnd(event);
    }
  };

  _createOnIcon = (index, func) => {
    return function () {
      func(index);
    }
  };

  _renderBottomOverlay = (show) => {
    const ссEnabled =
      this.props.availableClosedCaptionsLanguages &&
      this.props.availableClosedCaptionsLanguages.length > 0;

    return (<BottomOverlay
      width={this.props.width}
      height={this.props.height}
      primaryButton={!this.props.playing ? "play" : "pause"}
      fullscreen={this.props.fullscreen}
      cuePoints={this.props.cuePoints}
      playhead={this.props.playhead}
      platform={this.props.platform}
      duration={this.props.duration}
      volume={this.props.volume}
      live={this.generateLiveObject()}
      onPress={(name) => this.handlePress(name)}
      onScrub={(value) => this.handleScrub(value)}
      handleControlsTouch={() => this.props.handlers.handleControlsTouch()}
      closedCaptionsEnabled={ссEnabled}
      showAudioAndCCButton={this.props.multiAudioEnabled || ссEnabled}
      showWatermark={this.props.showWatermark}
      isShow={show}
      screenReaderEnabled={this.props.screenReaderEnabled}
      stereoSupported={this.props.stereoSupported}
      multiAudioEnabled={this.props.multiAudioEnabled}
      config={{
        controlBar: this.props.config.controlBar,
        buttons: this.props.config.buttons,
        icons: this.props.config.icons,
        live: this.props.config.live,
        general: this.props.config.general
      }}
    />);
  };

  _renderPlaceholder = () => {
    return (
      <View
        reactTag={1}
        accessible={true}
        accessibilityLabel={"Video player. Tap twice to play or pause"}
        style={styles.placeholder}
        importantForAccessibility={'no'}
        onTouchStart={(event) => this.props.handlers.handleVideoTouchStart(event)}
        onTouchMove={(event) => this.props.handlers.handleVideoTouchMove(event)}
        onTouchEnd={(event) => this._placeholderTapHandler(event)}>
      </View>);
  };

  _renderBottom = () => {
    const VideoWaterMarkSize = ResponsiveDesignManager.makeResponsiveMultiplier(UI_SIZES.VIDEOWATERMARK, UI_SIZES.VIDEOWATERMARK);
    let waterMarkName, watermark;
    if (this.props.platform === Constants.PLATFORMS.ANDROID) {
      waterMarkName = this.props.config.general.watermark.imageResource.androidResource;
    }
    if (this.props.platform === Constants.PLATFORMS.IOS) {
      waterMarkName = this.props.config.general.watermark.imageResource.iosResource;
    }

    if (waterMarkName) {
      watermark = this._renderVideoWaterMark(waterMarkName, VideoWaterMarkSize);
    }

    return (
      <View
        style={{flexDirection: "row", justifyContent: "center", alignItems: "flex-end"}}>
        {this._renderClosedCaptions(waterMarkName, VideoWaterMarkSize)}
        {watermark}
      </View>);
  };

  _renderClosedCaptions = (waterMarkName, VideoWaterMarkSize) => {
    const containerPadding = 5;
    let captionWidth = this.props.width - (containerPadding * 4);
    if (waterMarkName) {
      captionWidth = captionWidth - VideoWaterMarkSize;
    }

    const ccStyle = {
      color: this.props.captionStyles.textColor, fontFamily: this.props.captionStyles.fontName,
      backgroundColor: this.props.captionStyles.textBackgroundColor
    };
    if (this.props.caption) {
      return (
        <View
          style={[panelStyles.closedCaptionsContainer, {padding: containerPadding, width: captionWidth}]}
          onTouchEnd={(event) => this.props.handlers.handleVideoTouchEnd(event)}>
          <View
            style={[{backgroundColor: this.props.captionStyles.backgroundColor}]}>
            <Text style={[panelStyles.closedCaptions, ccStyle]}>
              {this.props.caption}
            </Text>
          </View>
        </View>
      );
    }
    return null;
  };

  _renderUpNext = () => {
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
  };

  _renderPlayPause = (show) => {
    const iconFontSize = ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.VIDEOVIEW_PLAYPAUSE);
    const seekVisible = !this.props.config.live.forceDvrDisabled || !this.props.live;
    const notInLiveRegion = this.props.playhead <= this.props.duration * VALUES.LIVE_THRESHOLD;
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
          },
          seekForward: {
            icon: this.props.config.icons.forward.fontString,
            fontFamily: this.props.config.icons.forward.fontFamilyName
          },
          seekBackward: {
            icon: this.props.config.icons.replay.fontString,
            fontFamily: this.props.config.icons.replay.fontFamilyName
          }
        }}
        seekEnabled={seekVisible}
        ffActive={this.props.live ? notInLiveRegion : true}
        position={"center"}
        onPress={(name) => this.handlePress(name)}
        onSeekPressed={(isForward) => this.onSeekPressed(isForward)}
        seekForwardValue={this.props.config.skipControls.skipForwardTime}
        seekBackwardValue={this.props.config.skipControls.skipBackwardTime}
        frameWidth={this.props.width}
        frameHeight={this.props.height}
        buttonWidth={iconFontSize}
        buttonHeight={iconFontSize}
        platform={this.props.platform}
        fontSize={iconFontSize}
        showButton={show}
        isLive={this.props.live}
        showSeekButtons={this.props.config.skipControls.enabled && show}
        rate={this.props.rate}
        playing={this.props.playing}
        loading={this.props.loading}
        initialPlay={this.props.initialPlay}>
      </VideoViewPlayPause>
    );
  };

  _renderVideoWaterMark = (waterMarkName, VideoWaterMarkSize) => {
    if (waterMarkName) {
      return (
        <View
          style={{flex: 1, justifyContent: "flex-end", alignItems: "flex-end"}}>
          <VideoWaterMark
            buttonWidth={VideoWaterMarkSize}
            buttonHeight={VideoWaterMarkSize}
            waterMarkName={waterMarkName}/>
        </View>
      );
    }
  };

  _renderAdOverlay = () => {
    if (!this.props.adOverlay) {
      return null;
    }

    //width and height of the ad overlay
    let width = this.props.adOverlay.width;
    let height = this.props.adOverlay.height;

    //if the width of the ad is larger than the player width
    const sidePadding = 10;
    const maxWidth = this.props.width - 2 * sidePadding;
    if (width > maxWidth) {
      height = height / width * maxWidth;
      width = maxWidth;
    }
    const left = (this.props.width - width) / 2;

    return (
      <View
        accesible={false}
        style={{height: height, width: width}}>
        <TouchableHighlight
          style={{left: left, bottom: 10, width: width, height: height}}
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
  };

  _renderLoading = () => {
    const loadingSize = ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.LOADING_ICON);
    const scaleMultiplier = this.props.platform === Constants.PLATFORMS.ANDROID ? 2 : 1;
    const topOffset = Math.round((this.props.height - loadingSize * scaleMultiplier) * 0.5);
    const leftOffset = Math.round((this.props.width - loadingSize * scaleMultiplier) * 0.5);
    const loadingStyle = {
      position: 'absolute',
      top: topOffset,
      left: leftOffset,
      width: loadingSize,
      height: loadingSize
    };
    if (this.props.loading) {
      return (
        <ActivityIndicator
          style={loadingStyle}
          size="large"/>
      );
    }
  };

  handleScrub = (value) => {
    this.props.handlers.onScrub(value);
  };

  handleOverlayClick = () => {
    this.props.handlers.onAdOverlay(this.props.adOverlay.clickUrl);
  };

  render() {
    const isPastAutoHideTime = (new Date).getTime() - this.props.lastPressedTime > AUTOHIDE_DELAY;
    const shouldShowControls = this.props.screenReaderEnabled ? true : !isPastAutoHideTime;

    // for renderPlayPause, if the screen reader is enabled, we want to hide the button
    return (
      <View
        accessible={false}
        style={styles.container}>
        {this._renderPlaceholder()}
        {this._renderBottom()}
        {this._renderAdOverlay()}
        {this._renderPlayPause(shouldShowControls)}
        {this._renderUpNext()}
        {this._renderBottomOverlay(shouldShowControls)}
        {this._renderLoading()}
      </View>
    );
  }
}

module.exports = VideoView;
