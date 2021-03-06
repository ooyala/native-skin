// @flow

import React from 'react';
import {
  Animated, PanResponder, Text, View,
} from 'react-native';
import timerForSkipButtons from 'react-native-timer';

import { BUTTON_NAMES, UI_SIZES, VALUES } from '../../constants';
import { collapse } from '../../lib/collapser';
import * as Log from '../../lib/log';
import responsiveMultiplier from '../../lib/responsiveMultiplier';
import * as Utils from '../../lib/utils';
import ControlBarWidget from '../../shared/ControlBarWidgets';
import ProgressBar from '../../shared/ProgressBar';
import type { Config } from '../../types/Config';

import styles from './AudioView.styles';

const scrubberSize = 14;
const scrubTouchableDistance = 45;

type Props = {
  playhead: number,
  duration: number,
  live: boolean,
  width: number,
  height: number,
  volume: number,
  playbackSpeedEnabled: boolean,
  selectedPlaybackSpeedRate: number,
  handlers: {
    onPress: () => void,
    onScrub: () => void,
    handleControlsTouch: () => void,
    onControlsVisibilityChanged: boolean => void,
  },
  config: Config,
  upNextDismissed: boolean,
  localizableStrings: {},
  locale: string,
  playing: boolean,
  title: string,
  description: string,
  onPlayComplete: boolean,
};

type State = {
  skipCount: number,
  cachedPlayhead: number,
  progressBarWidth: number,
  progressBarHeight: number,
};

export default class AudioView extends React.Component<Props, State> {
  panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,

    onStartShouldSetPanResponderCapture: () => true,

    onMoveShouldSetPanResponder: () => true,

    onMoveShouldSetPanResponderCapture: () => true,

    onPanResponderGrant: (event) => {
      this.locationPageOffset = event.nativeEvent.pageX - event.nativeEvent.locationX;
      this.handleTouchStart(event);
    },

    onPanResponderMove: (event) => {
      this.handleTouchMove(event);
    },

    onPanResponderTerminationRequest: () => true,

    onPanResponderRelease: (event) => {
      this.handleTouchEnd(event);
    },
  });

  constructor(props: Props) {
    super(props);

    this.state = {
      skipCount: 0,
      cachedPlayhead: -1,
      progressBarWidth: 0,
      progressBarHeight: 0,
    };
  }

  componentDidMount() {
    const { handlers } = this.props;

    handlers.onControlsVisibilityChanged(true);
  }

  componentWillReceiveProps(nextProps: Props) {
    const { playhead } = this.props;

    if (playhead !== nextProps.playhead) {
      this.setState({
        cachedPlayhead: -1.0,
      });
    }
  }

  componentWillUnmount() {
    timerForSkipButtons.clearTimeout(this);
  }

  getSelectedPlaybackSpeedRate = () => {
    const { config } = this.props;

    return Utils.formattedPlaybackSpeedRate(config.selectedPlaybackSpeedRate);
  };

  // MARK: - Actions
  onPlayPausePress = () => {
    const { handlers } = this.props;

    handlers.onPress(BUTTON_NAMES.PLAY_PAUSE);
  };

  onVolumePress = () => {
    const { handlers } = this.props;

    handlers.onPress(BUTTON_NAMES.VOLUME);
  };

  onSeekPressed = (skipCountValue) => {
    const {
      config, duration, onPlayComplete, playhead,
    } = this.props;

    if ((onPlayComplete && skipCountValue > 0) || skipCountValue === 0) {
      return;
    }

    let configSeekValue = skipCountValue > 0 ? config.skipControls.skipForwardTime
      : config.skipControls.skipBackwardTime;
    configSeekValue = Utils.restrictSeekValueIfNeeded(configSeekValue);
    const seekValue = configSeekValue * skipCountValue;

    const currentPlayhead = playhead;
    let resultedPlayhead = currentPlayhead + seekValue;
    if (resultedPlayhead < 0) {
      resultedPlayhead = 0;
    } else if (resultedPlayhead > duration) {
      resultedPlayhead = duration;
    }
    const resultedPlayheadPercent = duration === 0 ? 0 : resultedPlayhead / duration;
    this.handleScrub(resultedPlayheadPercent);

    if (onPlayComplete && skipCountValue < 0) {
      this.onPlayPausePress();
    }
  };

  onMorePress = () => {
    const { handlers } = this.props;

    handlers.onPress(BUTTON_NAMES.MORE);
  };

  onReplayPress = () => {
    const { handlers } = this.props;

    handlers.onPress(BUTTON_NAMES.REPLAY);
  };

  onPlaybackSpeedPress = () => {
    const { handlers } = this.props;

    handlers.onPress(BUTTON_NAMES.PLAYBACK_SPEED);
  };

  onSkipPressBackwards = () => {
    this.onSkipPress(false);
  };

  onSkipPressForward = () => {
    this.onSkipPress(true);
  };

  onSkipPress = (isForward) => {
    const { skipCount } = this.state;

    timerForSkipButtons.clearTimeout(this);
    const value = skipCount + (isForward ? 1 : -1);
    this.setState({
      skipCount: value,
    }, () => timerForSkipButtons.setTimeout(
      this,
      'sendSummedSkip',
      () => {
        this.onSeekPressed(value);
        this.setState({
          skipCount: 0,
        });
      },
      VALUES.DELAY_BETWEEN_SKIPS_MS,
    ));
  };

  handleScrub = (value) => {
    const { handlers } = this.props;

    handlers.onScrub(value);
  };

  handlePress = (name) => {
    const { handlers } = this.props;

    Log.verbose(`AudioView Handle Press: ${name}`);
    handlers.onPress(name);
  };

  // MARK: - Volume
  getVolumeControlColor = () => {
    const { config } = this.props;

    if (config.general.accentColor) {
      return config.general.accentColor;
    }

    if (config.controlBar.volumeControl.color) {
      return config.controlBar.volumeControl.color;
    }

    Log.error('controlBar.volumeControl.color and general.accentColor are not defined in your skin.json. Please '
      + 'update your skin.json file to the latest provided file, or add these to your skin.json');

    return '#4389FF';
  };

  // MARK: - Header view
  renderHeaderView = () => {
    const { description, title } = this.props;

    const titleLabel = <Text style={styles.titleLabel}>{`${title}: `}</Text>;
    const subtitleLabel = <Text style={styles.subtitleLabel}>{description}</Text>;

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
  renderControlBar = () => {
    const {
      config, handlers, onPlayComplete, playbackSpeedEnabled, playing, volume, width,
    } = this.props;

    const iconFontSize = responsiveMultiplier(width, UI_SIZES.CONTROLBAR_ICONSIZE);
    const labelFontSize = responsiveMultiplier(width, UI_SIZES.CONTROLBAR_LABELSIZE);

    const controlBarWidgets = [];

    const widgetOptions = {
      volume: {
        onPress: this.onVolumePress,
        style: [styles.controlBarIcon, { fontSize: iconFontSize }, config.controlBar.iconStyle.active],
        iconOn: config.icons.volume,
        iconOff: config.icons.volumeOff,
        iconTouchableStyle: styles.controlBarIconTouchable,
        showVolume: false,
        volume,
        scrubberStyle: styles.controlBarVolumeSlider,
        volumeControlColor: this.getVolumeControlColor(),
      },
      seekBackwards: {
        onPress: this.onSkipPressBackwards,
        style: [styles.controlBarIcon, { fontSize: iconFontSize }, config.controlBar.iconStyle.active],
        seekValue: config.skipControls.skipBackwardTime,
        icon: config.icons.replay,
        size: iconFontSize,
        visible: true,
      },
      playPause: {
        onPress: this.onPlayPausePress,
        style: [styles.controlBarIcon,
          {
            fontSize: iconFontSize,
            marginLeft: 15,
            marginRight: 15,
          },
          config.controlBar.iconStyle.active],
        playIcon: config.icons.play,
        pauseIcon: config.icons.pause,
        replayIcon: config.icons.replay,
        // eslint-disable-next-line no-nested-ternary
        primaryActionButton: (onPlayComplete ? 'replay' : (playing ? 'pause' : 'play')),
        onReplay: this.onReplayPress,
      },
      seekForward: {
        onPress: this.onSkipPressForward,
        style: [styles.controlBarIcon, { fontSize: iconFontSize }, onPlayComplete
          ? config.controlBar.iconStyle.inactive
          : config.controlBar.iconStyle.active],
        opacity: { opacity: onPlayComplete ? 0.5 : 1.0 },
        seekValue: config.skipControls.skipForwardTime,
        icon: config.icons.forward,
        size: iconFontSize,
        visible: true,
      },
      moreOptions: {
        onPress: this.onMorePress,
        iconTouchableStyle: styles.controlBarIconTouchable,
        style: [styles.controlBarIcon, { fontSize: iconFontSize }, config.controlBar.iconStyle.active],
        icon: config.icons.ellipsis,
        enabled: false,
      },
      playbackSpeed: {
        onPress: this.onPlaybackSpeedPress,
        iconTouchableStyle: styles.controlBarIconTouchable,
        style: [styles.controlBarIcon, { fontSize: labelFontSize }, config.controlBar.iconStyle.active],
        selectedPlaybackSpeedRate: this.getSelectedPlaybackSpeedRate(),
        enabled: playbackSpeedEnabled,
      },
      share: {
        onPress: this.onSocialSharePress,
        iconTouchableStyle: styles.controlBarIconTouchable,
        style: [styles.controlBarIcon, { fontSize: iconFontSize }, config.controlBar.iconStyle.active],
        icon: config.icons.share,
      },
    };

    const itemCollapsingResults = collapse(width, config.buttons);
    for (let i = 0; i < itemCollapsingResults.fit.length; i += 1) {
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
        onTouchEnd={handlers.handleControlsTouch}
      >
        {controlBarWidgets}
      </View>
    );
  };

  // MARK: - Progress bar + scrubber
  calculateTopOffset = (componentSize, progressBarHeight) => progressBarHeight / 2 - componentSize / 2;

  calculateLeftOffset = (componentSize, percent, progressBarWidth) => percent * progressBarWidth - componentSize
    * percent;

  renderProgressScrubber = (percent) => {
    const { progressBarHeight, progressBarWidth } = this.state;

    const topOffset = this.calculateTopOffset(scrubberSize, progressBarHeight);
    const leftOffset = this.calculateLeftOffset(scrubberSize, percent, progressBarWidth);
    const positionStyle = {
      top: topOffset,
      left: leftOffset,
    };
    const scrubberStyle = this.customizeScrubber();

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
    const { config } = this.props;

    if (config.general.accentColor) {
      return config.general.accentColor;
    }

    if (config.controlBar.scrubberBar.scrubberHandleColor) {
      return config.controlBar.scrubberBar.scrubberHandleColor;
    }

    Log.error('controlBar.scrubberBar.scrubberHandleColor is not defined in your skin.json. Please update your '
      + 'skin.json file to the latest provided file, or add this to your skin.json');

    return '#4389FF';
  };

  customizeScrubber = () => {
    const { config } = this.props;

    let { scrubberHandleBorderColor } = config.controlBar.scrubberBar;

    if (!scrubberHandleBorderColor) {
      Log.error('controlBar.scrubberBar.scrubberHandleBorderColor is not defined in your skin.json. Please update '
        + 'your skin.json file to the latest provided file, or add this to your skin.json');
      scrubberHandleBorderColor = 'white';
    }

    return {
      flex: 0,
      position: 'absolute',
      backgroundColor: this.getScrubberHandleColor(),
      borderRadius: 100,
      borderWidth: 1.5,
      borderColor: scrubberHandleBorderColor,
    };
  };

  getPlayHeadTimeString = () => {
    const { playhead } = this.props;

    return Utils.secondsToString(playhead);
  };

  getDurationString = () => {
    const { duration } = this.props;

    return Utils.secondsToString(duration);
  };

  getLiveDurationString = () => {
    const { duration, playhead } = this.props;

    let diff = playhead - duration;

    if (diff > -1 && diff < 0) diff = 0;

    return Utils.secondsToString(diff);
  };

  playedPercent = (playhead, duration) => {
    const { duration: propsDuration } = this.props;

    if (propsDuration === 0) {
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
    const { progressBarWidth } = this.state;

    let percent = x / progressBarWidth;

    if (percent > 1) {
      percent = 1;
    } else if (percent < 0) {
      percent = 0;
    }

    return percent;
  };

  handleTouchStart = (event) => {
    const { handlers, height } = this.props;
    const { progressBarWidth } = this.state;

    handlers.handleControlsTouch();
    const touchableDistance = responsiveMultiplier(progressBarWidth, scrubTouchableDistance);

    if ((height - event.nativeEvent.locationY) < touchableDistance) {
      return;
    }

    this.setState({
      touch: true,
      x: event.nativeEvent.locationX,
    });
  };

  handleTouchMove = (event) => {
    const { handlers } = this.props;

    const locationX = event.nativeEvent.pageX - this.locationPageOffset;

    handlers.handleControlsTouch();

    this.setState({
      x: locationX,
    });
  };

  handleTouchEnd = (event) => {
    const { duration, handlers, onPlayComplete } = this.props;
    const { touch } = this.state;

    const locationX = event.nativeEvent.pageX - this.locationPageOffset;

    handlers.handleControlsTouch();

    if (touch && handlers.onScrub) {
      if (onPlayComplete) {
        this.onPlayPausePress();
      }

      handlers.onScrub(this.touchPercent(locationX));

      this.setState({
        cachedPlayhead: this.touchPercent(locationX) * duration,
      });
    }

    this.setState({
      touch: false,
      x: null,
    });
  };

  renderProgressBar = (percent) => {
    const { config } = this.props;

    return (
      <View
        style={styles.progressBarContainer}
        accessible={false}
        pointerEvents="none"
      >
        <ProgressBar
          accessible={false}
          percent={percent}
          config={config}
          ad={null}
          renderDuration
        />
      </View>
    );
  };

  renderLiveCircle = (isLive) => {
    const { live } = this.props;

    if (!live) {
      return null;
    }

    return <View style={isLive ? styles.liveCircleActive : styles.liveCircleNonActive} />;
  };

  renderCompleteProgressBar = () => {
    const {
      duration, live, locale, localizableStrings, playhead,
    } = this.props;
    const { cachedPlayhead, touch, x } = this.state;

    let playedPercent = this.playedPercent(playhead, duration);

    if (cachedPlayhead >= 0.0) {
      playedPercent = this.playedPercent(cachedPlayhead, duration);
    }

    const playHeadTime = this.getPlayHeadTimeString();
    const durationTime = this.getDurationString();

    let isLive = false;
    if (live) {
      isLive = playhead >= duration * VALUES.LIVE_AUDIO_THRESHOLD;
    }

    return (
      <View style={styles.progressBar}>
        {this.renderLiveCircle(isLive)}
        <View>
          <Text style={live ? styles.liveLabel : styles.progressBarTimeLabel}>
            {live ? Utils.localizedString(locale, 'LIVE', localizableStrings) : playHeadTime}
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
          {...this.panResponder.panHandlers}
        >
          {this.renderProgressBar(playedPercent)}
          {this.renderProgressScrubber(touch ? this.touchPercent(x) : playedPercent)}
        </Animated.View>
        <View>
          <Text style={isLive ? styles.progressBarNoTimeLabel : styles.progressBarTimeLabel}>
            {/* eslint-disable-next-line no-nested-ternary */}
            {!live ? durationTime : (isLive ? '- - : - -' : this.getLiveDurationString())}
          </Text>
        </View>
      </View>
    );
  };

  // MARK: - AudioView rendering
  renderPlayer = () => (
    <View style={styles.container}>
      {this.renderHeaderView()}
      {this.renderControlBar()}
      {this.renderCompleteProgressBar()}
    </View>
  );

  render() {
    const { height, width } = this.props;

    return (
      <View style={[
        styles.backgroundView,
        { height, width },
      ]}
      >
        {this.renderPlayer()}
      </View>
    );
  }
}
