import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Animated, PanResponder, Text, View,
} from 'react-native';
import timerForSkipButtons from 'react-native-timer';

import { BUTTON_NAMES, UI_SIZES, VALUES } from '../../constants';
import { collapse } from '../../lib/collapser';
import Log from '../../lib/log';
import ResponsiveDesignManager from '../../lib/responsiveMultiplier';
import * as Utils from '../../lib/utils';
import ControlBarWidget from '../../shared/ControlBarWidgets';
import ProgressBar from '../../shared/ProgressBar';

import styles from './AudioView.styles';

const scrubberSize = 14;
const scrubTouchableDistance = 45;

export default class AudioView extends Component {
  static propTypes = {
    playhead: PropTypes.number,
    duration: PropTypes.number,
    live: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number,
    volume: PropTypes.number,
    playbackSpeedEnabled: PropTypes.bool,
    selectedPlaybackSpeedRate: PropTypes.number,
    handlers: PropTypes.shape({
      onPress: PropTypes.func.isRequired,
      onScrub: PropTypes.func.isRequired,
      handleControlsTouch: PropTypes.func.isRequired,
    }),
    config: PropTypes.object,
    upNextDismissed: PropTypes.bool,
    localizableStrings: PropTypes.object,
    locale: PropTypes.string,
    playing: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    onPlayComplete: PropTypes.bool,
  };

  state = {
    playing: false,
    skipCount: 0,
    height: new Animated.Value(
      ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.CONTROLBAR_HEIGHT),
    ),
    cachedPlayhead: -1,
    progressBarWidth: 0,
    progressBarHeight: 0,
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.playhead !== nextProps.playhead) {
      this.setState({
        cachedPlayhead: -1.0,
      });
    }
  }

  componentWillUnmount() {
    timerForSkipButtons.clearTimeout(this);
  }

  getSelectedPlaybackSpeedRate = () => Utils.formattedPlaybackSpeedRate(this.props.config.selectedPlaybackSpeedRate);

  // MARK: - Actions
  onPlayPausePress = () => {
    this.props.handlers.onPress(BUTTON_NAMES.PLAY_PAUSE);
  };

  onVolumePress = () => {
    this.props.handlers.onPress(BUTTON_NAMES.VOLUME);
  };

  onSeekPressed = (skipCountValue) => {
    if (this.props.onPlayComplete && skipCountValue > 0 || skipCountValue == 0) {
      return null;
    }

    let configSeekValue = skipCountValue > 0
      ? this.props.config.skipControls.skipForwardTime : this.props.config.skipControls.skipBackwardTime;
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

    if (this.props.onPlayComplete && skipCountValue < 0) {
      this.onPlayPausePress();
    }
  };

  onMorePress = () => {
    this.props.handlers.onPress(BUTTON_NAMES.MORE);
  };

  onReplayPress = () => {
    this.props.handlers.onPress(BUTTON_NAMES.REPLAY);
  };

  onPlaybackSpeedPress = () => {
    this.props.onPress(BUTTON_NAMES.PLAYBACK_SPEED);
  };

  onSkipPressBackwards = () => {
    this.onSkipPress(false);
  };

  onSkipPressForward = () => {
    this.onSkipPress(true);
  };

  onSkipPress = (isForward) => {
    timerForSkipButtons.clearTimeout(this);
    const value = this.state.skipCount + (isForward ? 1 : -1);
    this.setState({
      skipCount: value,
    }, () => timerForSkipButtons.setTimeout(
      this,
      'sendSummedSkip',
      () => {
        this.onSeekPressed(this.state.skipCount);
        this.setState({
          skipCount: 0,
        });
      },
      VALUES.DELAY_BETWEEN_SKIPS_MS,
    ));
  };

  handleScrub = (value) => {
    this.props.handlers.onScrub(value);
  };

  handlePress = (name) => {
    Log.verbose(`AudioView Handle Press: ${name}`);
    this.props.handlers.onPress(name);
  };

  // MARK: - Volume
  getVolumeControlColor = () => {
    if (this.props.config.general.accentColor) {
      return this.props.config.general.accentColor;
    }
    if (this.props.config.controlBar.volumeControl.color) {
      return this.props.config.controlBar.volumeControl.color;
    }
    Log.error(
      'controlBar.volumeControl.color and general.accentColor are not defined in your skin.json.  Please update your skin.json file to the latest provided file, or add these to your skin.json',
    );
    return '#4389FF';
  };

  // MARK: - Header view
  _renderHeaderView = () => {
    const titleLabel = <Text style={styles.titleLabel}>{`${this.props.title}: `}</Text>;
    const subtitleLabel = <Text style={styles.subtitleLabel}>{this.props.description}</Text>;
    return (
      <View style={styles.headerView}>
        <Text
          style={styles.headerBaseLabel}
          numberOfLines={1}
        >
          {titleLabel}
          {subtitleLabel}
        </Text>
      </View>
    );
  };

  // MARK: - ControlBar
  _renderControlBar = () => {
    const iconFontSize = ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width,
      UI_SIZES.CONTROLBAR_ICONSIZE);
    const labelFontSize = ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width,
      UI_SIZES.CONTROLBAR_LABELSIZE);

    const controlBarWidgets = [];

    const widgetOptions = {
      volume: {
        onPress: this.onVolumePress,
        style: [styles.controlBarIcon, { fontSize: iconFontSize }, this.props.config.controlBar.iconStyle.active],
        iconOn: this.props.config.icons.volume,
        iconOff: this.props.config.icons.volumeOff,
        iconTouchableStyle: styles.controlBarIconTouchable,
        showVolume: false,
        volume: this.props.volume,
        scrubberStyle: styles.controlBarVolumeSlider,
        volumeControlColor: this.getVolumeControlColor(),
      },
      seekBackwards: {
        onPress: this.onSkipPressBackwards,
        style: [styles.controlBarIcon, { fontSize: iconFontSize }, this.props.config.controlBar.iconStyle.active],
        seekValue: this.props.config.skipControls.skipBackwardTime,
        icon: this.props.config.icons.replay,
        size: iconFontSize,
      },
      playPause: {
        onPress: this.onPlayPausePress,
        style: [styles.controlBarIcon,
          {
            fontSize: iconFontSize,
            marginLeft: 15,
            marginRight: 15,
          },
          this.props.config.controlBar.iconStyle.active],
        playIcon: this.props.config.icons.play,
        pauseIcon: this.props.config.icons.pause,
        replayIcon: this.props.config.icons.replay,
        primaryActionButton: this.props.onPlayComplete ? 'replay' : (this.props.playing ? 'pause' : 'play'),
        onReplay: this.onReplayPress,
      },
      seekForward: {
        onPress: this.onSkipPressForward,
        style: [styles.controlBarIcon, { fontSize: iconFontSize }, this.props.onPlayComplete
          ? this.props.config.controlBar.iconStyle.inactive
          : this.props.config.controlBar.iconStyle.active],
        opacity: { opacity: this.props.onPlayComplete ? 0.5 : 1.0 },
        seekValue: this.props.config.skipControls.skipForwardTime,
        icon: this.props.config.icons.forward,
        size: iconFontSize,
      },
      moreOptions: {
        onPress: this.onMorePress,
        iconTouchableStyle: styles.controlBarIconTouchable,
        style: [styles.controlBarIcon, { fontSize: iconFontSize }, this.props.config.controlBar.iconStyle.active],
        icon: this.props.config.icons.ellipsis,
        enabled: this.props.showMoreOptionsButton,
      },
      playbackSpeed: {
        onPress: this.onPlaybackSpeedPress,
        iconTouchableStyle: styles.controlBarIconTouchable,
        style: [styles.controlBarIcon, { fontSize: labelFontSize }, this.props.config.controlBar.iconStyle.active],
        selectedPlaybackSpeedRate: this.getSelectedPlaybackSpeedRate(),
        enabled: this.props.playbackSpeedEnabled,
      },
      share: {
        onPress: this.onSocialSharePress,
        iconTouchableStyle: styles.controlBarIconTouchable,
        style: [styles.controlBarIcon, { fontSize: iconFontSize }, this.props.config.controlBar.iconStyle.active],
        icon: this.props.config.icons.share,
      },
    };

    const itemCollapsingResults = collapse(this.props.width, this.props.config.buttons);
    for (let i = 0; i < itemCollapsingResults.fit.length; i++) {
      const widget = itemCollapsingResults.fit[i];
      const item = (
        <ControlBarWidget
          key={i}
          widgetType={widget}
          options={widgetOptions}
        />
      );

      controlBarWidgets.push(item);
    }

    // Add flexible spaces for first and last widget
    const flexibleSpace1 = <View style={styles.flexibleSpace} key="flexibleSpace1" />;
    const flexibleSpace2 = <View style={styles.flexibleSpace} key="flexibleSpace2" />;

    controlBarWidgets.splice(1, 0, flexibleSpace1);
    controlBarWidgets.splice(controlBarWidgets.length - 1, 0, flexibleSpace2);

    return (
      <View
        style={styles.controlBar}
        onTouchEnd={this.props.handlers.handleControlsTouch}
      >
        {controlBarWidgets}
      </View>
    );
  };

  // MARK: - Progress bar + scrubber
  _calculateTopOffset = (componentSize, progressBarHeight) => progressBarHeight / 2 - componentSize / 2;

  _calculateLeftOffset = (componentSize, percent, progressBarWidth) => percent * progressBarWidth - componentSize
    * percent;

  _renderProgressScrubber = (percent) => {
    const topOffset = this._calculateTopOffset(scrubberSize, this.state.progressBarHeight);
    const leftOffset = this._calculateLeftOffset(scrubberSize, percent, this.state.progressBarWidth);
    const positionStyle = {
      top: topOffset,
      left: leftOffset,
    };
    const scrubberStyle = this._customizeScrubber();

    return (
      <View
        pointerEvents="none"
        style={[scrubberStyle,
          positionStyle,
          {
            width: scrubberSize,
            height: scrubberSize,
          }]}
      />
    );
  };

  getScrubberHandleColor = () => {
    if (this.props.config.general.accentColor) {
      return this.props.config.general.accentColor;
    }
    if (this.props.config.controlBar.scrubberBar.scrubberHandleColor) {
      return this.props.config.controlBar.scrubberBar.scrubberHandleColor;
    }
    Log.error(
      'controlBar.scrubberBar.scrubberHandleColor is not defined in your skin.json.  Please update your skin.json file to the latest provided file, or add this to your skin.json',
    );
    return '#4389FF';
  };

  _customizeScrubber = () => {
    let { scrubberHandleBorderColor } = this.props.config.controlBar.scrubberBar;
    if (!scrubberHandleBorderColor) {
      Log.error(
        'controlBar.scrubberBar.scrubberHandleBorderColor is not defined in your skin.json.  Please update your skin.json file to the latest provided file, or add this to your skin.json',
      );
      scrubberHandleBorderColor = 'white';
    }
    const scrubberStyle = {
      flex: 0,
      position: 'absolute',
      backgroundColor: this.getScrubberHandleColor(),
      borderRadius: 100,
      borderWidth: 1.5,
      borderColor: scrubberHandleBorderColor,
    };
    return scrubberStyle;
  };

  getPlayHeadTimeString = () => Utils.secondsToString(this.props.playhead);

  getDurationString = () => Utils.secondsToString(this.props.duration);

  getLiveDurationString = () => {
    let diff = this.props.playhead - this.props.duration;
    if (diff > -1 && diff < 0) diff = 0;
    return Utils.secondsToString(diff);
  };

  playedPercent = (playhead, duration) => {
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
  };

  touchPercent = (x) => {
    let percent = x / (this.state.progressBarWidth);

    if (percent > 1) {
      percent = 1;
    } else if (percent < 0) {
      percent = 0;
    }
    return percent;
  };

  handleTouchStart = (event) => {
    this.props.handlers.handleControlsTouch();
    const touchableDistance = ResponsiveDesignManager.makeResponsiveMultiplier(this.state.progressBarWidth,
      scrubTouchableDistance);
    if ((this.props.height - event.nativeEvent.locationY) < touchableDistance) {
      return;
    }
    this.setState({
      touch: true,
      x: event.nativeEvent.locationX,
    });
  };

  handleTouchMove = (event) => {
    const locationX = event.nativeEvent.pageX - this.locationPageOffset;
    this.props.handlers.handleControlsTouch();
    this.setState({
      x: locationX,
    });
  };

  handleTouchEnd = (event) => {
    const locationX = event.nativeEvent.pageX - this.locationPageOffset;
    this.props.handlers.handleControlsTouch();
    if (this.state.touch && this.props.handlers.onScrub) {
      if (this.props.onPlayComplete) {
        this.onPlayPausePress();
      }
      this.props.handlers.onScrub(this.touchPercent(locationX));
      this.setState({
        cachedPlayhead: this.touchPercent(locationX) * this.props.duration,
      });
    }
    this.setState({
      touch: false,
      x: null,
    });
  };

  _panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (event, gestureState) => true,
    onStartShouldSetPanResponderCapture: (event, gestureState) => true,
    onMoveShouldSetPanResponder: (event, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (event, gestureState) => true,

    onPanResponderGrant: (event, gestureState) => {
      this.locationPageOffset = event.nativeEvent.pageX - event.nativeEvent.locationX;
      this.handleTouchStart(event);
    },
    onPanResponderMove: (event, gestureState) => {
      this.handleTouchMove(event);
    },
    onPanResponderTerminationRequest: (event, gestureState) => true,
    onPanResponderRelease: (event, gestureState) => {
      this.handleTouchEnd(event);
    },
  });

  _renderProgressBar = percent => (
    <View
      style={styles.progressBarContainer}
      accessible={false}
      pointerEvents="none"
    >
      <ProgressBar
        accessible={false}
        ref="progressBar"
        percent={percent}
        config={this.props.config}
        ad={null}
        renderDuration
      />
    </View>
  );

  _renderLiveCircle = (isLive) => {
    if (this.props.live) {
      return (<View style={isLive ? styles.liveCircleActive : styles.liveCircleNonActive} />);
    }
    return null;
  };

  _renderCompleteProgressBar = () => {
    let playedPercent = this.playedPercent(this.props.playhead, this.props.duration);
    if (this.state.cachedPlayhead >= 0.0) {
      playedPercent = this.playedPercent(this.state.cachedPlayhead, this.props.duration);
    }

    const playHeadTime = this.getPlayHeadTimeString();
    const durationTime = this.getDurationString();


    let isLive = false;
    if (this.props.live) {
      isLive = this.props.playhead >= this.props.duration * VALUES.LIVE_AUDIO_THRESHOLD;
    }

    return (
      <View style={styles.progressBar}>
        {this._renderLiveCircle(isLive)}
        <View>
          <Text style={this.props.live ? styles.liveLabel : styles.progressBarTimeLabel}>
            {this.props.live ? Utils.localizedString(this.props.locale, 'LIVE', this.props.localizableStrings)
              : playHeadTime}
          </Text>
        </View>
        <Animated.View
          onLayout={(event) => {
            this.setState({
              progressBarWidth: event.nativeEvent.layout.width,
              progressBarHeight: event.nativeEvent.layout.height,
            });
          }}
          style={styles.progressBarScrubberContainer}
          {...this._panResponder.panHandlers}
        >
          {this._renderProgressBar(playedPercent)}
          {this._renderProgressScrubber(this.state.touch ? this.touchPercent(this.state.x) : playedPercent)}
        </Animated.View>
        <View>
          <Text style={isLive ? styles.progressBarNoTimeLabel : styles.progressBarTimeLabel}>
            {!this.props.live ? durationTime : isLive ? '- - : - -' : this.getLiveDurationString()}
          </Text>
        </View>
      </View>
    );
  };

  // MARK: - AudioView rendering
  _renderPlayer = () => (
    <View style={styles.container}>
      {this._renderHeaderView()}
      {this._renderControlBar()}
      {this._renderCompleteProgressBar()}
    </View>
  );

  render() {
    return (
      <View style={[styles.backgroundView,
        {
          height: this.props.height,
          width: this.props.width,
        }]}
      >
        {this._renderPlayer()}
      </View>
    );
  }
}
