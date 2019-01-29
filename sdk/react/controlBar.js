'use strict';

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  View,
  Platform,
  LayoutAnimation,
  NativeModules
} from 'react-native';

const AndroidAccessibility = NativeModules.AndroidAccessibility;

import {
  BUTTON_NAMES,
  ACCESSIBILITY_ANNOUNCERS,
  UI_SIZES
} from './constants';

import CollapsingBarUtils from './collapsingBarUtils';

var Log = require('./log');
var Utils = require('./utils');
var ControlBarWidget = require('./widgets/controlBarWidgets');
var ResponsiveDesignManager = require('./responsiveDesignManager');
var styles = Utils.getStyles(require('./style/controlBarStyles.json'));

class ControlBar extends React.Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    primaryButton: PropTypes.string.isRequired,
    fullscreen: PropTypes.bool.isRequired,
    playhead: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    volume: PropTypes.number.isRequired,
    onPress: PropTypes.func.isRequired,
    handleControlsTouch: PropTypes.func.isRequired,
    live: PropTypes.object,
    config: PropTypes.object.isRequired,
    stereoSupported: PropTypes.bool,
    showMoreOptionsButton: PropTypes.bool,
    showAudioAndCCButton: PropTypes.bool,
    showPlaybackSpeedButton: PropTypes.bool
  };

  static defaultProps = {playhead: 0, duration: 0};

  state = {
    showVolume: false,
  };

  getPlayHeadTimeString = () => {
    if (this.props.live) {
      return this.props.live.label;
    } else {
      return (Utils.secondsToString(this.props.playhead) + " - ");
    }
  };

  getDurationString = () => {
    if (this.props.live) {
      return null;
    } else {
      return Utils.secondsToString(this.props.duration);
    }
  };

  getSelectedPlaybackSpeedRate = () => {
    return Utils.formattedPlaybackSpeedRate(this.props.config.selectedPlaybackSpeedRate);
  };

  getVolumeControlColor = () => {
    if (!this.props.config.general.accentColor) {
      if (!this.props.config.controlBar.volumeControl.color) {
        Log.error("controlBar.volumeControl.color and general.accentColor are not defined in your skin.json.  Please update your skin.json file to the latest provided file, or add these to your skin.json");
        return '#4389FF';
      } else {
        return this.props.config.controlBar.volumeControl.color;
      }
    } else {
      return this.props.config.general.accentColor;
    }
  };

  onPlayPausePress = () => {
    this.props.onPress(BUTTON_NAMES.PLAY_PAUSE);
  };

  onVolumePress = () => {
    this.setState({showVolume:!this.state.showVolume});
  };

  onSocialSharePress = () => {
    this.props.onPress && this.props.onPress(BUTTON_NAMES.SHARE);
  };

  onDiscoveryPress = () => {
    this.props.onPress && this.props.onPress(BUTTON_NAMES.DISCOVERY);
  };

  onFullscreenPress = () => {
    if (Platform.OS === 'android') {
      AndroidAccessibility.announce(ACCESSIBILITY_ANNOUNCERS.SCREEN_MODE_CHANGED);
    }
    this.props.onPress && this.props.onPress(BUTTON_NAMES.FULLSCREEN);
  };

  onMorePress = () => {
    this.props.onPress && this.props.onPress(BUTTON_NAMES.MORE);
  };

  onRewindPress = () => {
    this.props.onPress && this.props.onPress(BUTTON_NAMES.REWIND);
  };

  onStereoscopicPress = () => {
    this.props.onPress && this.props.onPress(BUTTON_NAMES.STEREOSCOPIC);
  };

  onAudioAndCCPress = () => {
    this.props.onPress && this.props.onPress(BUTTON_NAMES.AUDIO_AND_CC);
  };

  onPlaybackSpeedPress = () => {
    this.props.onPress && this.props.onPress(BUTTON_NAMES.PLAYBACK_SPEED);
  };

  render() {
    let iconFontSize = ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.CONTROLBAR_ICONSIZE);
    let labelFontSize = ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.CONTROLBAR_LABELSIZE);
    let waterMarkName = Platform.select({
      ios: this.props.config.controlBar.logo.imageResource.iosResource,
      android: this.props.config.controlBar.logo.imageResource.androidResource
    });

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
        volumeControlColor: this.getVolumeControlColor(),
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
        icon: this.props.fullscreen ? this.props.config.icons.compress : this.props.config.icons.expand,
        fullscreen: this.props.fullscreen   // do we want to do this way ??
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
        icon: this.props.config.icons.ellipsis,
        enabled: this.props.showMoreOptionsButton
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
      watermark: {
        shouldShow: Utils.shouldShowLandscape(this.props.width, this.props.height),
        style: styles.waterMarkImage,
        icon:waterMarkName,
        resizeMode: "contain"
      },
      stereoscopic: {
        onPress: this.onStereoscopicPress,
        iconTouchableStyle: styles.iconTouchable,
        style: [styles.icon, {"fontSize": iconFontSize}, this.props.config.controlBar.iconStyle.active],
        icon: this.props.config.icons.stereoscopic
      },
      audioAndCC: {
        onPress: this.onAudioAndCCPress,
        iconTouchableStyle: styles.iconTouchable,
        style: [styles.icon, {"fontSize": iconFontSize}, this.props.config.controlBar.iconStyle.active],
        icon: this.props.config.icons.audioAndCC,
        enabled: this.props.showAudioAndCCButton
      },
      playbackSpeed: {
        onPress: this.onPlaybackSpeedPress,
        iconTouchableStyle: styles.iconTouchable,
        style: [styles.icon, {"fontSize": labelFontSize}, this.props.config.controlBar.iconStyle.active],
        selectedPlaybackSpeedRate: this.getSelectedPlaybackSpeedRate(),
        enabled: this.props.showPlaybackSpeedButton
      },
    };

    function _isVisible( item ) {
      let visible = true;
      switch (item.name) {
        case BUTTON_NAMES.MORE:
          visible = this.props.showMoreOptionsButton;
          break;
        case BUTTON_NAMES.AUDIO_AND_CC:
          visible = this.props.showAudioAndCCButton;
          break;
        case BUTTON_NAMES.PLAYBACK_SPEED:
          visible = this.props.showPlaybackSpeedButton;
          break;
        case BUTTON_NAMES.STEREOSCOPIC:
          visible = this.props.stereoSupported;
          break;
        default:
          visible = Object.keys(widgetOptions).includes(item.name);
      }
      item.isVisible = visible;
    }

    this.props.config.buttons.forEach(_isVisible, this);
    //Log.warn("collapse isVisible Results:"+JSON.stringify(this.props.config.buttons));

    const itemCollapsingResults = CollapsingBarUtils.collapse(this.props.width, this.props.config.buttons);

    function pushControl(item) {
      controlBarWidgets.push(item)
    }

    for (var i = 0; i < itemCollapsingResults.fit.length; i++) {
      const widget = itemCollapsingResults.fit[i];
      const item = <ControlBarWidget
        key={i}
        widgetType={widget}
        options={widgetOptions}/>;

      if (widget.name === BUTTON_NAMES.STEREOSCOPIC) {
        if (this.props.stereoSupported) {
          pushControl(item);
        }
      } else if (widget.name === BUTTON_NAMES.AUDIO_AND_CC) {
        if (this.props.showAudioAndCCButton) {
          pushControl(item);
        }
      } else {
        pushControl(item);
      }
    }
    const widthStyle = {width:this.props.width};
    return (
      <View style={[styles.controlBarContainer, widthStyle]} onTouchEnd={this.props.handleControlsTouch}>
        {controlBarWidgets}
      </View>
    );
  }
}

module.exports = ControlBar;
