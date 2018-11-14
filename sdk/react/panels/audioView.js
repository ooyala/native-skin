'use strict';

import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {
  Text,
  View,
  TouchableHighlight,
  Slider,
  NativeModules
} from 'react-native';

const ProgressBar = require('../progressBar');
const VolumeView = require('../widgets/VolumeView');
const ControlBarWidget = require('../widgets/controlBarWidgets');
const CollapsingBarUtils = require('../collapsingBarUtils');

const Log = require('../log');
const Utils = require('../utils');
const styles = Utils.getStyles(require('./style/audioViewStyles.json'));
const controlBarStyles = Utils.getStyles(require('../style/controlBarStyles.json'));
const ResponsiveDesignManager = require('../responsiveDesignManager');

const topMargin = 6;
const leftMargin = 20;
const progressBarHeight = 3;
const scrubberSize = 14;
const scrubTouchableDistance = 45;

const Constants = require('../constants');
const {
  BUTTON_NAMES,
  IMG_URLS,
  UI_SIZES,
  VALUES,
  VIEW_NAMES
} = Constants;
const timerForSkipButtons = require('react-native-timer');

const constants = {
  playbackSpeedRatePostfix: "x"
};

class AudioView extends React.Component {
  static propTypes = {
    rate: PropTypes.number,
    playhead: PropTypes.number,
    duration: PropTypes.number,
    live: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number,
    volume: PropTypes.number,
    cuePoints: PropTypes.array,
    stereoSupported: PropTypes.bool,
    multiAudioEnabled: PropTypes.bool,
    playbackSpeedEnabled: PropTypes.bool,
    selectedPlaybackSpeedRate: PropTypes.string,
    handlers: PropTypes.shape({
      onPress: PropTypes.func.isRequired,
      onScrub: PropTypes.func.isRequired,
      handleVideoTouchStart: PropTypes.func.isRequired,
      handleVideoTouchMove: PropTypes.func.isRequired,
      handleVideoTouchEnd: PropTypes.func.isRequired
    }),
    config: PropTypes.object,
    nextVideo: PropTypes.object,
    upNextDismissed: PropTypes.bool,
    localizableStrings: PropTypes.object,
    locale: PropTypes.string,
    playing: PropTypes.bool,
    loading: PropTypes.bool,
    initialPlay: PropTypes.bool,
  };

  static defaultProps = {playhead: 0, duration: 0};

  state = {
    playing: false,
    showVolume: false,
    skipCount: 0
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.playhead !== nextProps.playhead) {
      this.setState({cachedPlayhead: -1.0});
    }
  }

  componentWillUnmount() {
    timerForSkipButtons.clearTimeout(this);
  }

  getSelectedPlaybackSpeedRate = () => {
    const selectedPlaybackSpeedRateFloat = parseFloat(parseFloat(String(this.props.config.selectedPlaybackSpeedRate)).toFixed(2))
    const selectedPlaybackSpeedRateString = selectedPlaybackSpeedRateFloat.toString();

    return selectedPlaybackSpeedRateString.concat(constants.playbackSpeedRatePostfix);
  };

  // MARK: - Actions
  onPlayPausePress = () => {
    this.props.handlers.onPress(BUTTON_NAMES.PLAY_PAUSE);
  };

  onVolumePress = () => {
    this.setState({showVolume:!this.state.showVolume});
  };

  onSeekPressed = (skipCountValue) => {
    if (skipCountValue == 0) { return null; }

    let configSeekValue = skipCountValue > 0 ?
                          this.props.config.skipControls.skipForwardTime : this.props.config.skipControls.skipBackwardTime;
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

  onMorePress = () => {
    this.props.handlers.onPress(BUTTON_NAMES.MORE);
  };

  onRewindPress = () => {
    this.props.handlers.onPress(BUTTON_NAMES.REWIND);
  };

  onPlaybackSpeedPress = () => {
    this.props.onPress(BUTTON_NAMES.PLAYBACK_SPEED);
  };

  onSkipPressBackwards = () => {
    this.onSkipPress(false);
  }

  onSkipPressForward = () => {
    this.onSkipPress(true);
  }

  onSkipPress = (isForward) => {
    timerForSkipButtons.clearTimeout(this);
    const value = this.state.skipCount + (isForward ? 1 : -1);
    this.setState({skipCount: value}, () => timerForSkipButtons.setTimeout(
      this,
      'sendSummedSkip',
      () => {
        this.onSeekPressed(this.state.skipCount);
        this.setState({skipCount: 0});
      },
      VALUES.DELAY_BETWEEN_SKIPS_MS
    ));
  };

  handleScrub = (value) => {
    this.props.handlers.onScrub(value);
  };

  handlePress = (name) => {
    Log.verbose("AudioView Handle Press: " + name);
    this.props.handlers.onPress(name);
  };

  // MARK: - Volume
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

  // MARK: - Title
  _renderTitle = () => {
    const titleLabel = <Text style={styles.titleLabel}>{this.skin.state.title}</Text>;
    const subtitleLabel = <Text style={styles.subtitleLabel}>{this.skin.state.description}</Text>;
    return (
      <View
        style={styles.background}>
        {titleLabel}
        {subtitleLabel}
      </View>
    )
  };

  // MARK: - ControlBar
  _renderControlBar = () => {
    let iconFontSize = ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.CONTROLBAR_ICONSIZE);
    let labelFontSize = ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.CONTROLBAR_LABELSIZE);

    var controlBarWidgets = [];

    let widgetOptions = {
      volume: {
        onPress: this.onVolumePress,
        style: this.state.showVolume ?
               [controlBarStyles.icon, {"fontSize": iconFontSize}, controlBarStyles.iconHighlighted, this.props.config.controlBar.iconStyle.active] : [controlBarStyles.icon, {"fontSize": iconFontSize}, this.props.config.controlBar.iconStyle.active],
        iconOn: this.props.config.icons.volume,
        iconOff: this.props.config.icons.volumeOff,
        iconTouchableStyle: controlBarStyles.iconTouchable,
        showVolume: this.state.showVolume,
        volume: this.props.volume,
        scrubberStyle: controlBarStyles.volumeSlider,
        volumeControlColor: this.getVolumeControlColor()
      },
      seekBackwards: {
        onPress: this.onSkipPressBackwards,
        style: [controlBarStyles.icon, {"fontSize": iconFontSize}, this.props.config.controlBar.iconStyle.active],
        seekValue: this.props.config.skipControls.skipBackwardTime,
        icon: this.props.config.icons.replay,
        size: iconFontSize
      },
      playPause: {
        onPress: this.onPlayPausePress,
        style: [controlBarStyles.icon, {"fontSize": iconFontSize}, this.props.config.controlBar.iconStyle.active],
        playIcon: this.props.config.icons.play,
        pauseIcon: this.props.config.icons.pause,
        replayIcon: this.props.config.icons.replay,
        primaryActionButton: !this.props.playing ? "play" : "pause"
      },
      // rewind: {
      //   onPress: this.onRewindPress,
      //   iconTouchableStyle: controlBarStyles.iconTouchable,
      //   style: [controlBarStyles.icon, {"fontSize": iconFontSize}, this.props.config.controlBar.iconStyle.active],
      //   icon: this.props.config.icons.rewind
      // },
      seekForward: {
        onPress: this.onSkipPressForward,
        style: [controlBarStyles.icon, {"fontSize": iconFontSize}, this.props.config.controlBar.iconStyle.active],
        seekValue: this.props.config.skipControls.skipForwardTime,
        icon: this.props.config.icons.forward,
        size: iconFontSize
      },
      moreOptions: {
        onPress: this.onMorePress,
        iconTouchableStyle: controlBarStyles.iconTouchable,
        style: [controlBarStyles.icon, {"fontSize": iconFontSize}, this.props.config.controlBar.iconStyle.active],
        icon: this.props.config.icons.ellipsis,
        enabled: this.props.showMoreOptionsButton
      },
      playbackSpeed: {
        onPress: this.onPlaybackSpeedPress,
        iconTouchableStyle: controlBarStyles.iconTouchable,
        style: [controlBarStyles.icon, {"fontSize": labelFontSize}, this.props.config.controlBar.iconStyle.active],
        selectedPlaybackSpeedRate: this.getSelectedPlaybackSpeedRate(),
        enabled: this.props.playbackSpeedEnabled
      },
      share: {
        onPress: this.onSocialSharePress,
        iconTouchableStyle: controlBarStyles.iconTouchable,
        style: [controlBarStyles.icon, {"fontSize": iconFontSize}, this.props.config.controlBar.iconStyle.active],
        icon: this.props.config.icons.share
      }
    };

    function _isVisible(item) {
      var visible = true;
      switch (item.name) {
        case BUTTON_NAMES.PLAYBACK_SPEED:
          visible = false;
          break;
        case BUTTON_NAMES.SHARE:
          visible = false;
          break;
        default:
          break;
      }
      item.isVisible = visible;
    };

    this.props.config.forEach(_isVisible, this);

    let itemCollapsingResults = CollapsingBarUtils.collapse(this.props.width, this.props.config.buttons);
    for (var i = 0; i < itemCollapsingResults.fit.length; i++) {
      let widget = itemCollapsingResults.fit[i];

      let item =
        <ControlBarWidget
          key={i}
          widgetType={widget}
          options={widgetOptions}>
        </ControlBarWidget>;

      controlBarWidgets.push(item);
    }
    var widthStyle = {width: this.props.width};
    return (
      <View
        style={[controlBarStyles.controlBarContainer, widthStyle]}
        onTouchEnd={this.props.handleControlsTouch}>
        {controlBarWidgets}
      </View>
    );
  };

  // MARK: - Progress bar + scrubber
  _calculateProgressBarWidth = () => {
    return this.props.width - 2 * leftMargin;
  };

  _calculateTopOffset = (componentSize) => {
    const padding = 0;
    return topMargin + padding + progressBarHeight / 2 - componentSize / 2;
  };

  _calculateLeftOffset = (componentSize, percent, progressBarWidth) => {
    return leftMargin + percent * progressBarWidth - componentSize / 2
  };

  _renderProgressScrubber = (percent) => {
    const progressBarWidth = this._calculateProgressBarWidth();
    const topOffset = this._calculateTopOffset(scrubberSize);
    const leftOffset = this._calculateLeftOffset(scrubberSize, percent, progressBarWidth);
    const positionStyle = {top:topOffset, left:leftOffset};
    const scrubberStyle = this._customizeScrubber();

    return (
      <View
        style={[scrubberStyle, positionStyle, {width:scrubberSize, height:scrubberSize}]}>
      </View>
    );
  };

  getScrubberHandleColor = () => {
    if (this.props.config.general.accentColor) {
      return this.props.config.general.accentColor;
    } else if (!this.props.config.controlBar.scrubberBar.scrubberHandleColor) {
      Log.error("controlBar.scrubberBar.scrubberHandleColor is not defined in your skin.json.  Please update your skin.json file to the latest provided file, or add this to your skin.json");
      return "#4389FF";
    } else {
      return this.props.config.controlBar.scrubberBar.scrubberHandleColor ;
    }
  };

  _customizeScrubber = () => {
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
  };

  getPlayHeadTimeString = () => {
    return Utils.secondsToString(this.props.playhead);
  };

  getDurationString = () => {
    return Utils.secondsToString(this.props.duration);
  };

  _renderProgressBar = (percent) => {
    return (
      <ProgressBar
        accessible={false}
        ref='progressBar'
        percent={percent}
        config={this.props.config}
        ad={null}
        renderDuration={true}
        playHeadString={this.getPlayHeadTimeString()}
        durationString={this.getDurationString()}>
      </ProgressBar>
    );
  };

  _renderCompleteProgressBar = () => {
    let playedPercent = this.playedPercent(this.props.playhead, this.props.duration);
    if (this.state.cachedPlayhead >= 0.0) {
      playedPercent = this.playedPercent(this.state.cachedPlayhead, this.props.duration);
    }

    const currentPercent = parseInt(playedPercent * 100, 10);
    const barStyle = styles.progressBarStyle;

    return (
      <Animated.View
        onTouchStart={(event) => this.handleTouchStart(event)}
        onTouchMove={(event) => this.handleTouchMove(event)}
        onTouchEnd={(event) => this.handleTouchEnd(event)}
        style={barStyle}>
        {this._renderProgressBar(playedPercent)}
        {this._renderProgressScrubber(this.state.touch ? this.touchPercent(this.state.x) : playedPercent)}
      </Animated.View>
    )
  };

  // MARK: - AudioView rendering
  _renderPlayer = () => {
    return (
      <View
        style={styles.container}>
        {this._renderTitle()}
        {<View style ={[styles.bottomOverlayFlexibleSpace]}/>}
        {this._renderControlBar()}
        {<View style ={[styles.bottomOverlayFlexibleSpace]}/>}
        {this._renderCompleteProgressBar()}
        {<View style ={[styles.bottomOverlayFlexibleSpace]}/>}
      </View>
    )
  }

  render() {
    return (
      <View
        style={styles.background}>
      </View>
    )
  };
}

module.exports = AudioView;
