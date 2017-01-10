  /**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  View,
  LayoutAnimation
} from 'react-native';

var Constants = require('./constants');
var {
  BUTTON_NAMES,
  IMG_URLS,
  UI_SIZES
} = Constants;

var Log = require('./log');
var Utils = require('./utils');
var ControlBarWidget = require('./widgets/controlBarWidgets');
var CollapsingBarUtils = require('./collapsingBarUtils');
var VolumeView = require('./widgets/VolumeView');
var ResponsiveDesignManager = require('./responsiveDesignManager');

var styles = Utils.getStyles(require('./style/controlBarStyles.json'));

var ControlBar = React.createClass({
  getInitialState: function() {
    return {
      showVolume: false,
    };
  },

  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    primaryButton: React.PropTypes.string.isRequired,
    fullscreen: React.PropTypes.bool.isRequired,
    playhead: React.PropTypes.number.isRequired,
    duration: React.PropTypes.number.isRequired,
    volume: React.PropTypes.number.isRequired,
    onPress: React.PropTypes.func.isRequired,
    handleControlsTouch: React.PropTypes.func.isRequired,
    live: React.PropTypes.object,
    config: React.PropTypes.object.isRequired,
  },

  getDefaultProps: function() {
    return {playhead: 0, duration: 0};
  },
  getPlayHeadTimeString: function() {
    if (this.props.live) {
      return this.props.live.label;
    } else {
      return (Utils.secondsToString(this.props.playhead) + " - ");
    }
  },
  getDurationString: function() {
    if (this.props.live) {
      return null;
    } else {
      return Utils.secondsToString(this.props.duration);
    }
  },

  getVolumeControlColor: function() {
    if (this.props.config.general.accentColor) {
      return this.props.config.general.accentColor;
    } else if (this.props.config.controlBar.volumeControl.color) {
      return this.props.config.controlBar.volumeControl.color;
    } else {
      return '#4389FF';
    }
  },

  onPlayPausePress: function() {
    this.props.onPress(BUTTON_NAMES.PLAY_PAUSE);
  },

  onVolumePress: function() {
    this.setState({showVolume:!this.state.showVolume});
  },

  onSocialSharePress: function() {
    this.props.onPress && this.props.onPress(BUTTON_NAMES.SHARE);
  },

  onClosedCaptionsPress: function() {
    this.props.onPress && this.props.onPress(BUTTON_NAMES.CLOSED_CAPTIONS);
  },

  onDiscoveryPress: function() {
    this.props.onPress && this.props.onPress(BUTTON_NAMES.DISCOVERY);
  },

  onFullscreenPress: function() {
    this.props.onPress && this.props.onPress(BUTTON_NAMES.FULLSCREEN);
  },

  onMorePress: function() {
    this.props.onPress && this.props.onPress(BUTTON_NAMES.MORE);
  },

  onRewindPress: function() {
    this.props.onPress && this.props.onPress(BUTTON_NAMES.REWIND);
  },

  render: function() {

    var iconFontSize = ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.CONTROLBAR_ICONSIZE);
    var labelFontSize = ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.CONTROLBAR_LABELSIZE);
    var waterMarkName;
    if(this.props.platform == Constants.PLATFORMS.ANDROID) {
      waterMarkName = this.props.config.controlBar.logo.imageResource.androidResource;
    }
    if(this.props.platform == Constants.PLATFORMS.IOS) {
      waterMarkName = this.props.config.controlBar.logo.imageResource.iosResource;
    }
    var controlBarWidgets = [];

    var widgetOptions = {
      playPause: {
        onPress: this.onPlayPausePress,
        style: [styles.icon, {"fontSize": iconFontSize}, this.props.config.controlBar.iconStyle.active],
        playIcon: this.props.config.icons.play,
        pauseIcon: this.props.config.icons.pause,
        replayIcon: this.props.config.icons.replay,
        primaryActionButton: this.props.primaryButton
      },
      volume: {
        onPress: this.onVolumePress,
        style: this.state.showVolume ? [styles.icon, {"fontSize": iconFontSize}, styles.iconHighlighted, this.props.config.controlBar.iconStyle.active] : [styles.icon, {"fontSize": iconFontSize}, this.props.config.controlBar.iconStyle.active],
        iconOn: this.props.config.icons.volume,
        iconOff: this.props.config.icons.volumeOff,
        iconTouchableStyle: styles.iconTouchable,
        showVolume: this.state.showVolume,
        volume: this.props.volume,
        scrubberStyle: styles.volumeSlider,
        volumeControlColor: this.getVolumeControlColor()
      },
      timeDuration: {
        onPress: this.props.live ? this.props.live.onGoLive : null,
        playHeadTimeStyle: [styles.playheadLabel, {"fontSize": labelFontSize}],
        durationStyle: [styles.durationLabel, {"fontSize": labelFontSize}],
        completeTimeStyle: [styles.completeTimeStyle],
        playHeadTimeString: this.getPlayHeadTimeString(),
        iconTouchableStyle: styles.iconTouchable,
        durationString: this.getDurationString()
      },
      fullscreen: {
        onPress: this.onFullscreenPress,
        iconTouchableStyle: styles.iconTouchable,
        style: [styles.icon, {"fontSize": iconFontSize}, this.props.config.controlBar.iconStyle.active],
        icon: this.props.fullscreen ? this.props.config.icons.compress : this.props.config.icons.expand
      },
       rewind: {
        onPress: this.onRewindPress,
        iconTouchableStyle: styles.iconTouchable,
        style: [styles.icon, {"fontSize": iconFontSize}, this.props.config.controlBar.iconStyle.active],
        icon: this.props.config.icons.rewind
      },
      moreOptions: {
        onPress: this.onMorePress,
        iconTouchableStyle: styles.iconTouchable,
        style: [styles.icon, {"fontSize": iconFontSize}, this.props.config.controlBar.iconStyle.active],
        icon: this.props.config.icons.ellipsis
      },
      discovery: {
        onPress: this.onDiscoveryPress,
        iconTouchableStyle: styles.iconTouchable,
        style: [styles.icon, {"fontSize": iconFontSize}, this.props.config.controlBar.iconStyle.active],
        icon: this.props.config.icons.discovery
      },
      share: {
        onPress: this.onSocialSharePress,
        iconTouchableStyle: styles.iconTouchable,
        style: [styles.icon, {"fontSize": iconFontSize}, this.props.config.controlBar.iconStyle.active],
        icon: this.props.config.icons.share
      },
      closedCaption: {
        onPress: this.onClosedCaptionsPress,
        iconTouchableStyle: styles.iconTouchable,
        style: [styles.icon, {"fontSize": iconFontSize}, this.props.config.controlBar.iconStyle.active],
        icon: this.props.config.icons.cc
      },
      watermark: {
        shouldShow: Utils.shouldShowLandscape(this.props.width, this.props.height),
        style: styles.waterMarkImage,
        icon:waterMarkName,
        resizeMode: Image.resizeMode.contain
      }
    };

    var itemCollapsingResults = CollapsingBarUtils.collapse( this.props.width, this.props.config.buttons );
    // Log.verbose(itemCollapsingResults);  even more than verbose.  see what is being placed in the control bar

    for(var i = 0; i < itemCollapsingResults.fit.length; i++) {
      var widget = itemCollapsingResults.fit[i];
      controlBarWidgets.push(<ControlBarWidget
        key={i}
        widgetType={widget}
        options={widgetOptions}/>);
    }

    var widthStyle = {width:this.props.width};
    return (
      <View style={[styles.controlBarContainer, widthStyle]} onTouchEnd={this.props.handleControlsTouch}>
        {controlBarWidgets}
      </View>
    );
  }
});

module.exports = ControlBar;
