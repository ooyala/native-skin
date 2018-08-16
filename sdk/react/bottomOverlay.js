'use strict';

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
import PropTypes from 'prop-types';

import React, { Component } from 'react';
import createReactClass from 'create-react-class';
import {
  Animated,
  View,
  Slider,
  NativeModules,
  AccessibilityInfo
} from 'react-native';

const Constants = require('./constants');
const {
  VIEW_NAMES,
  UI_SIZES,
  PLATFORMS,
  VALUES,
  ANNOUNCER_TYPES
} = Constants;

const AndroidAccessibility = NativeModules.AndroidAccessibility;
const AccessibilityUtils = require('./accessibilityUtils');
const Log = require('./log');
const Utils = require('./utils');
const ProgressBar = require('./progressBar');
const ControlBar = require('./controlBar');
const ResponsiveDesignManager = require('./responsiveDesignManager');

const styles = Utils.getStyles(require('./style/bottomOverlayStyles.json'));
const topMargin = 6;
const leftMargin = 20;
const progressBarHeight = 3;
const scrubberSize = 14;
const scrubTouchableDistance = 45;
const cuePointSize = 8;
let previousAnnouncing = 0;
const accessibilityDelay = 2000; // Workaround for accessibility announcing for Android.
const BottomOverlay = createReactClass({
  displayName: 'BottomOverlay',

  propTypes: {
    width: PropTypes.number,
    height: PropTypes.number,
    primaryButton: PropTypes.string,
    fullscreen: PropTypes.bool,
    cuePoints: PropTypes.array,
    playhead: PropTypes.number,
    duration: PropTypes.number,
    ad: PropTypes.object,
    volume: PropTypes.number,
    onPress: PropTypes.func,
    onScrub: PropTypes.func,
    handleControlsTouch: PropTypes.func.isRequired,
    isShow: PropTypes.bool,
    shouldShowProgressBar: PropTypes.bool,
    live: PropTypes.object,
    shouldShowLandscape: PropTypes.bool,
    screenReaderEnabled: PropTypes.bool,
    config: PropTypes.object,
    closedCaptionsEnabled: PropTypes.bool,
    stereoSupported: PropTypes.bool,
    multiAudioEnabled: PropTypes.bool,
    showMoreOptionsButton: PropTypes.bool,
    showAudioAndCCButton: PropTypes.bool
  },

  getDefaultProps: function() {
    return {"shouldShowProgressBar": true, "showMoreOptionsButton": true, "showAudioAndCCButton": true};
  },

  getInitialState: function() {
    if (this.props.isShow) {
      return {
        touch: false,
        opacity: new Animated.Value(1),
        height: new Animated.Value(ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.CONTROLBAR_HEIGHT)),
        cachedPlayhead: -1,
      };
    }
    return {
      touch: false,
      opacity: new Animated.Value(0),
      height: new Animated.Value(0),
      cachedPlayhead: -1,
    };
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (prevProps.width !== this.props.width && this.props.isShow) {
      this.state.height.setValue(ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.CONTROLBAR_HEIGHT));
    }
    if (prevProps.isShow !== this.props.isShow ) {
      this.state.opacity.setValue(this.props.isShow? 0 : 1);
      this.state.height.setValue(this.props.isShow? 1 : ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.CONTROLBAR_HEIGHT));
      Animated.parallel([
        Animated.timing(
          this.state.opacity,
          {
            toValue: this.props.isShow ? 1 : 0,
            duration: 500,
            delay: 0
          }),
        Animated.timing(
          this.state.height,
          {
            toValue: this.props.isShow ? ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.CONTROLBAR_HEIGHT) : 1,
            duration: 500,
            delay: 0
          })
      ]).start();
    }
  },

  componentDidMount: function () {
    AccessibilityInfo.fetch().done((isEnabled) => {
      this.setState({
        accessibilityEnabled: isEnabled
      });
    });
  },

  /*
  If the playhead position has changed, reset the cachedPlayhead to -1 so that it is not used when rendering the scrubber
  */
  componentWillReceiveProps: function(nextProps) {
    if (this.props.playhead !== nextProps.playhead) {
       this.setState({cachedPlayhead:-1.0});
    }
  },

  _renderProgressBarWidth: function() {
    return this.props.width - 2 * leftMargin;
  },

  _renderTopOffset: function(componentSize) {
    return topMargin + progressBarHeight / 2 - componentSize / 2;
  },

  _renderLeftOffset: function(componentSize, percent, progressBarWidth) {
    return leftMargin + percent * progressBarWidth - componentSize / 2
  },

  _renderProgressScrubber: function(percent) {
    const progressBarWidth = this._renderProgressBarWidth();
    const topOffset = this._renderTopOffset(scrubberSize);
    const leftOffset = this._renderLeftOffset(scrubberSize, percent, progressBarWidth);
    const positionStyle = {top:topOffset, left:leftOffset};
    const scrubberStyle = this._customizeScrubber();

    return (
      <View
        testID={VIEW_NAMES.TIME_SEEK_BAR_THUMB}
        accessible={false}
        accessibilityLabel={VIEW_NAMES.TIME_SEEK_BAR_THUMB}
        style={[scrubberStyle, positionStyle, {width:scrubberSize, height:scrubberSize}]}>
      </View>
      );
  },

  getScrubberHandleColor: function() {
    if (this.props.config.general.accentColor) {
      return this.props.config.general.accentColor;
    } else if (!this.props.config.controlBar.scrubberBar.scrubberHandleColor) {
      Log.error("controlBar.scrubberBar.scrubberHandleColor is not defined in your skin.json.  Please update your skin.json file to the latest provided file, or add this to your skin.json");
      return "#4389FF";
    } else {
      return this.props.config.controlBar.scrubberBar.scrubberHandleColor ;
    }
  },

  _customizeScrubber: function() {
    let scrubberHandleBorderColor = this.props.config.controlBar.scrubberBar.scrubberHandleBorderColor;
    if (!scrubberHandleBorderColor) {
      Log.error("controlBar.scrubberBar.scrubberHandleBorderColor is not defined in your skin.json.  Please update your skin.json file to the latest provided file, or add this to your skin.json");
      scrubberHandleBorderColor = "white";
    }
    const scrubberStyle = {
      flex: 0,
      position: "absolute",
      backgroundColor: this.getScrubberHandleColor(),
      borderRadius: 100,
      borderWidth: 1.5,
      borderColor: scrubberHandleBorderColor
    };
    return scrubberStyle;
  },

  _renderProgressBar: function(percent) {
    return (<ProgressBar accessible={false} ref='progressBar' percent={percent} config={this.props.config} ad={this.props.ad}/>);
  },

  _renderCompleteProgressBar: function() {
    if (!this.props.shouldShowProgressBar) {
      return;
    }
    let playedPercent = this.playedPercent(this.props.playhead, this.props.duration);
    if (this.state.cachedPlayhead >= 0.0) {
      playedPercent = this.playedPercent(this.state.cachedPlayhead, this.props.duration);
    }

    const scrubberBarAccessibilityLabel = Constants.VIEW_ACCESSIBILITY_NAMES.PROGRESS_BAR;

    if (this.props.platform === PLATFORMS.IOS && this.props.screenReaderEnabled) {
      const minimumTrackTintColor = this.props.config.controlBar.scrubberBar.playedColor || this.props.config.general.accentColor;
      const maximumTrackTintColor = this.props.config.controlBar.scrubberBar.bufferedColor;

      return (
        <Slider
          style={[{flexDirection: "row", height: 5, marginVertical: 6, marginHorizontal: 20}]}
          testID={VIEW_NAMES.TIME_SEEK_BAR}
          accessibilityLabel={scrubberBarAccessibilityLabel}
          minimumTrackTintColor={minimumTrackTintColor}
          maximumTrackTintColor={maximumTrackTintColor}
          value={this.props.playhead}
          maximumValue={this.props.duration}
          step={1.0}
          onValueChange={this._onValueChange}>
        </Slider>
      );
    } else {
      return (
        <Animated.View
          testID={VIEW_NAMES.TIME_SEEK_BAR}
          accessible={this.state.accessibilityEnabled}
          accessibilityLabel={scrubberBarAccessibilityLabel}
          onTouchStart={(event) => this.handleTouchStart(event)}
          onTouchMove={(event) => this.handleTouchMove(event)}
          onTouchEnd={(event) => this.handleTouchEnd(event)}
          style={styles.progressBarStyle}>
          {this._renderProgressBar(playedPercent)}
          {this._renderProgressScrubber(!this.props.ad && this.state.touch ? this.touchPercent(this.state.x) : playedPercent)}
          {this._renderCuePoints(this.props.cuePoints)}
        </Animated.View>
      )
    }
  },

  _onValueChange: function(value) {
    // increase or decrease playhead by X seconds
    let newPlayhead = this.props.playhead - value;
    if (newPlayhead >= 0) {
      newPlayhead = this.props.playhead - VALUES.SEEK_VALUE;
    } else {
      newPlayhead = this.props.playhead + VALUES.SEEK_VALUE;
    }

    const seekPercent = this.playedPercent(newPlayhead, this.props.duration);
    this.props.onScrub(seekPercent);
  },

  _getCuePointLeftOffset: function(cuePoint, progressBarWidth) {
    let cuePointPercent = cuePoint / this.props.duration;
    if (cuePointPercent > 1) {
      cuePointPercent = 1;
    }
    if (cuePointPercent < 0) {
      cuePointPercent = 0;
    }
    const leftOffset = this._renderLeftOffset(cuePointSize, cuePointPercent, progressBarWidth);
    return leftOffset;
  },

  _renderCuePoints: function(cuePoints) {
    if (!cuePoints) {
      return;
    }
    const cuePointsView = [];
    const progressBarWidth = this._renderProgressBarWidth();
    const topOffset = this._renderTopOffset(cuePointSize);
    let leftOffset = 0;
    let positionStyle;
    let cuePointView;

    for (var i = 0; i < cuePoints.length; i++) {
      var cuePoint = cuePoints[i];
      leftOffset = this._getCuePointLeftOffset(cuePoint, progressBarWidth);
      positionStyle = {top:topOffset, left:leftOffset};
      cuePointView = (
        <View
          accessible={false}
          key={i}
          style={[styles.cuePoint, positionStyle,{width:cuePointSize, height:cuePointSize}]}/>
      );
      cuePointsView.push(cuePointView);
    }

    return cuePointsView;
  },

  _renderControlBar: function() {
    return (
      <ControlBar
        ref='controlBar'
        primaryButton={this.props.primaryButton}
        platform={this.props.platform}
        playhead={this.props.playhead}
        duration={this.props.duration}
        volume={this.props.volume}
        live={this.props.live}
        width={this.props.width - 2 * leftMargin}
        height={this.props.height}
        fullscreen = {this.props.fullscreen}
        onPress={this.props.onPress}
        handleControlsTouch={this.props.handleControlsTouch}
        showWatermark={this.props.showWatermark}
        config={this.props.config}
        closedCaptionsEnabled={this.props.closedCaptionsEnabled}
        stereoSupported={this.props.stereoSupported}
        multiAudioEnabled={this.props.multiAudioEnabled}
        showMoreOptionsButton={this.props.showMoreOptionsButton}
        showAudioAndCCButton={this.props.showAudioAndCCButton}
      />
    );
  },

  playedPercent: function(playhead, duration) {
    if (this.props.duration === 0) {
      return 0;
    }
    let percent = playhead / duration;
    if (percent > 1) {
      percent = 1;
    } else if (percent < 0) {
      percent = 0;
    }
    return percent;
  },

  touchPercent: function(x) {
    let percent = (x - leftMargin) / (this.props.width - 2 * leftMargin);
    if (percent > 1) {
      percent = 1;
    } else if (percent < 0) {
      percent = 0;
    }
    return percent;
  },

  handleTouchStart: function(event) {
    this.props.handleControlsTouch();
    if (this.isMounted()) {
      let touchableDistance = ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, scrubTouchableDistance);
      if ((this.props.height - event.nativeEvent.pageY) < touchableDistance) {
        return;
      }
      this.setState({touch:true, x:event.nativeEvent.pageX});
    }
  },

  handleTouchMove: function(event) {
    this.props.handleControlsTouch();
    if (this.isMounted()) {
      this.setState({x:event.nativeEvent.pageX});
    }
    if (this.props.platform === PLATFORMS.ANDROID) {
      const playedPercent =  this.touchPercent(event.nativeEvent.pageX);
      const currentPercent = parseInt(playedPercent * 100, 10);
      const announcingLabel = AccessibilityUtils.createAccessibilityAnnouncers(ANNOUNCER_TYPES.MOVING, currentPercent);
      const currentAnnouncing = new Date().getTime();
      if (previousAnnouncing === 0 || currentAnnouncing - previousAnnouncing > accessibilityDelay) {
        previousAnnouncing = currentAnnouncing;
        AndroidAccessibility.announce(announcingLabel);
      }
    }
  },

  handleTouchEnd: function(event) {
    this.props.handleControlsTouch();
     if (this.isMounted()) {
       if (this.state.touch && this.props.onScrub) {
        this.props.onScrub(this.touchPercent(event.nativeEvent.pageX));
        this.setState({cachedPlayhead: this.touchPercent(event.nativeEvent.pageX) * this.props.duration});
       }
     }
     this.setState({touch:false, x:null});

     if (this.props.platform === PLATFORMS.ANDROID) {
       const playedPercent =  this.touchPercent(event.nativeEvent.pageX);
       const currentPercent = parseInt(playedPercent * 100, 10);
       const announcingLabel = AccessibilityUtils.createAccessibilityAnnouncers(ANNOUNCER_TYPES.MOVED, currentPercent);
       AndroidAccessibility.announce(announcingLabel);
       previousAnnouncing = 0;
    }
  },

  renderDefault: function(widthStyle) {
    return (
      <Animated.View
        accessible={false}
        style={[styles.container, widthStyle, {"height": this.state.height}]}>
        {this._renderCompleteProgressBar()}
        {<View style ={[styles.bottomOverlayFlexibleSpace]}/>}
        {this._renderControlBar()}
        {<View style ={[styles.bottomOverlayFlexibleSpace]}/> }
      </Animated.View>
    );
  },

  renderLiveWithoutDVR: function(widthStyle) {
    return (
      <Animated.View style={[styles.container, widthStyle, {"height": this.state.height - 6}]}>
        {this._renderControlBar()}
      </Animated.View>
    );
  },

  render: function() {
    var widthStyle = {width:this.props.width, opacity:this.state.opacity};
    if (this.props.live && (this.props.config.live != null && this.props.config.live.forceDvrDisabled)) {
      return this.renderLiveWithoutDVR(widthStyle);
    }

    return this.renderDefault(widthStyle);
  },
});

module.exports = BottomOverlay;
