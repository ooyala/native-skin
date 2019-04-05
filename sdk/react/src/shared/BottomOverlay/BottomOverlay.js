// @flow

import * as React from 'react';
import {
  AccessibilityInfo, Animated, NativeModules, Platform, Slider, View,
} from 'react-native';
import type AnimatedValue from 'react-native/Libraries/Animated/src/nodes/AnimatedValue';

import AccessibilityUtils from '../../lib/accessibility';
import ProgressBar from '../ProgressBar';
import {
  ANNOUNCER_TYPES, MARKERS_SIZES, UI_SIZES, VALUES, VIEW_ACCESSIBILITY_NAMES, VIEW_NAMES,
} from '../../constants';
import ControlBar from './ControlBar';
import Log from '../../lib/log';
import ResponsiveDesignManager from '../../lib/responsiveMultiplier';
import styles from './BottomOverlay.styles';
import MarkersContainer from './MarkersContainer';
import MarkersProgressBarOverlayContainer from './MarkersProgressBarOverlayContainer';
import type { Config } from '../../types/Config';
import type { Marker } from '../../types/Markers';

const { AndroidAccessibility } = NativeModules;

const topMargin = 6;
const leftMargin = 20;
const progressBarHeight = 3;
const padding = 3;
const scrubberSize = 14;
const scrubTouchableDistance = 45;
const cuePointSize = 8;

let previousAnnouncing = 0;
const accessibilityDelay = 2000; // Workaround for accessibility announcing for Android.
const accessibilityProgressDelay = 5000; // Workaround for accessibility announcing for Android.

type Props = {
  width: number,
  height?: ?number,
  primaryButton?: ?string,
  fullscreen?: ?boolean,
  isPipActivated?: ?boolean,
  isPipButtonVisible?: ?boolean,
  cuePoints?: ?Array<number>,
  playhead: number,
  duration: number,
  ad?: ?{},
  volume: number,
  onPress?: ?(() => void),
  onScrub: (number) => void,
  handleControlsTouch: () => void,
  isShow?: ?boolean,
  shouldShowProgressBar?: ?boolean,
  live?: ?{},
  screenReaderEnabled?: ?boolean,
  config: Config,
  stereoSupported?: ?boolean,
  showMoreOptionsButton?: ?boolean,
  showAudioAndCCButton?: ?boolean,
  showPlaybackSpeedButton?: ?boolean,
  inCastMode?: ?boolean,
  showWatermark?: ?boolean,
  markers: Array<Marker>,
};

type State = {
  accessibilityEnabled: boolean,
  cachedPlayhead: number,
  height: AnimatedValue,
  markersContainerHeight: AnimatedValue,
  opacity: AnimatedValue,
  touch: boolean,
  x: number,
};

export default class BottomOverlay extends React.Component<Props, State> {
  static defaultProps = {
    height: undefined,
    primaryButton: undefined,
    fullscreen: undefined,
    isPipActivated: undefined,
    isPipButtonVisible: undefined,
    cuePoints: undefined,
    ad: undefined,
    onPress: undefined,
    isShow: undefined,
    screenReaderEnabled: undefined,
    live: undefined,
    stereoSupported: undefined,
    shouldShowProgressBar: true,
    showMoreOptionsButton: true,
    showAudioAndCCButton: true,
    showPlaybackSpeedButton: undefined,
    inCastMode: undefined,
    showWatermark: undefined,
  };

  static calculateLeftOffset(componentSize: number, percent: number, progressBarWidth: number) {
    return leftMargin + percent * progressBarWidth - componentSize / 2;
  }

  static calculateTopOffset(componentSize: number) {
    return topMargin + padding + progressBarHeight / 2 - componentSize / 2;
  }

  static playedPercent(playhead: number, duration: number) {
    if (duration === 0) {
      return 0;
    }

    let percent = playhead / duration;

    if (percent > 1) {
      percent = 1;
    } else if (percent < 0) {
      percent = 0;
    }

    return percent;
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      accessibilityEnabled: false,
      cachedPlayhead: -1,
      height: new Animated.Value(props.isShow
        ? ResponsiveDesignManager.makeResponsiveMultiplier(props.width, UI_SIZES.CONTROLBAR_HEIGHT) : 0),
      markersContainerHeight: new Animated.Value(props.isShow ? MARKERS_SIZES.CONTAINER_HEIGHT : 0),
      opacity: new Animated.Value(props.isShow ? 1 : 0),
      touch: false,
      x: 0,
    };

    (this: Object).handleMarkerSeek = this.handleMarkerSeek.bind(this);
    (this: Object).handleTouchEnd = this.handleTouchEnd.bind(this);
    (this: Object).handleTouchMove = this.handleTouchMove.bind(this);
    (this: Object).handleTouchStart = this.handleTouchStart.bind(this);
  }

  componentDidMount() {
    AccessibilityInfo.fetch().done((isEnabled) => {
      this.setState({ accessibilityEnabled: isEnabled });
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    // If the playhead position has changed, reset the cachedPlayhead to -1 so that it is not used when rendering the
    // scrubber.
    const { playhead } = this.props;

    if (playhead !== nextProps.playhead) {
      this.setState({ cachedPlayhead: -1.0 });
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { isShow, width } = this.props;
    const { height, markersContainerHeight, opacity } = this.state;

    if (prevProps.width !== width && isShow) {
      height.setValue(ResponsiveDesignManager.makeResponsiveMultiplier(width, UI_SIZES.CONTROLBAR_HEIGHT));
      markersContainerHeight.setValue(MARKERS_SIZES.CONTAINER_HEIGHT);
    }

    if (prevProps.isShow !== isShow) {
      height.setValue(isShow ? 1 : ResponsiveDesignManager.makeResponsiveMultiplier(width, UI_SIZES.CONTROLBAR_HEIGHT));
      opacity.setValue(isShow ? 0 : 1);
      markersContainerHeight.setValue(isShow ? 0 : MARKERS_SIZES.CONTAINER_HEIGHT);

      Animated.parallel([
        Animated.timing(opacity, {
          delay: 0,
          duration: 500,
          toValue: (isShow ? 1 : 0),
        }),
        Animated.timing(height, {
          delay: 0,
          duration: 500,
          toValue: (isShow ? ResponsiveDesignManager.makeResponsiveMultiplier(width, UI_SIZES.CONTROLBAR_HEIGHT) : 1),
        }),
        Animated.timing(markersContainerHeight, {
          delay: 0,
          duration: 500,
          toValue: (isShow ? MARKERS_SIZES.CONTAINER_HEIGHT : 0),
        }),
      ]).start();
    }
  }

  onValueChange(value: number) {
    const { duration, onScrub, playhead } = this.props;

    let newPlayhead = playhead - value;

    if (newPlayhead >= 0) {
      newPlayhead = playhead - VALUES.SEEK_VALUE;
    } else {
      newPlayhead = playhead + VALUES.SEEK_VALUE;
    }

    const seekPercent = this.constructor.playedPercent(newPlayhead, duration);

    onScrub(seekPercent);
  }

  getScrubberHandleColor() {
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
  }

  customizeScrubber() {
    const { config } = this.props;
    let { scrubberHandleBorderColor } = config.controlBar.scrubberBar;

    if (!scrubberHandleBorderColor) {
      Log.error('controlBar.scrubberBar.scrubberHandleBorderColor is not defined in your skin.json. Please update your '
        + 'skin.json file to the latest provided file, or add this to your skin.json');

      scrubberHandleBorderColor = 'white';
    }

    return {
      backgroundColor: this.getScrubberHandleColor(),
      borderColor: scrubberHandleBorderColor,
      borderRadius: 100,
      borderWidth: 1.5,
      flex: 0,
      position: 'absolute',
    };
  }

  calculateProgressBarWidth() {
    const { width } = this.props;

    return width - 2 * leftMargin;
  }

  calculateCuePointsLeftOffset(cuePoint: number, progressBarWidth: number) {
    const { duration } = this.props;

    let cuePointPercent = cuePoint / duration;

    if (cuePointPercent > 1) {
      cuePointPercent = 1;
    }

    if (cuePointPercent < 0) {
      cuePointPercent = 0;
    }

    return this.constructor.calculateLeftOffset(cuePointSize, cuePointPercent, progressBarWidth);
  }

  touchPercent(x: number) {
    const { width } = this.props;

    let percent = (x - leftMargin) / (width - 2 * leftMargin);

    if (percent > 1) {
      percent = 1;
    } else if (percent < 0) {
      percent = 0;
    }

    return percent;
  }

  handleTouchStart(event: SyntheticTouchEvent<Object>) {
    const { handleControlsTouch, height, width } = this.props;
    const { pageX, pageY } = (event.nativeEvent: Object);

    handleControlsTouch();

    const touchableDistance = ResponsiveDesignManager.makeResponsiveMultiplier(width, scrubTouchableDistance);

    // Accessing Animated.Value provides number, so it can be used in arithmetic operations.
    // $FlowFixMe
    if ((height - pageY) < touchableDistance) {
      return;
    }

    this.setState({
      touch: true,
      x: pageX,
    });
  }

  handleTouchMove(event: SyntheticTouchEvent<Object>) {
    const { handleControlsTouch } = this.props;

    handleControlsTouch();

    const { pageX } = (event.nativeEvent: Object);

    this.setState({ x: pageX });

    if (Platform.OS === 'android') {
      const playedPercent = this.touchPercent(pageX);
      const currentPercent = parseInt(playedPercent * 100, 10);
      const announcingLabel = AccessibilityUtils.createAccessibilityAnnouncers(ANNOUNCER_TYPES.MOVING, currentPercent);
      const currentAnnouncing = new Date().getTime();

      if (previousAnnouncing === 0 || currentAnnouncing - previousAnnouncing > accessibilityDelay) {
        previousAnnouncing = currentAnnouncing;
        AndroidAccessibility.announce(announcingLabel);
      }
    }
  }

  handleTouchEnd(event: SyntheticTouchEvent<Object>) {
    const { duration, handleControlsTouch, onScrub } = this.props;
    const { touch } = this.state;
    const { pageX } = (event.nativeEvent: Object);

    handleControlsTouch();

    if (touch && onScrub) {
      onScrub(this.touchPercent(pageX));

      this.setState({
        cachedPlayhead: this.touchPercent(pageX) * duration,
      });
    }

    this.setState({
      touch: false,
      x: 0,
    });

    if (Platform.OS === 'android') {
      const playedPercent = this.touchPercent(pageX);
      const currentPercent = parseInt(playedPercent * 100, 10);
      const announcingLabel = AccessibilityUtils.createAccessibilityAnnouncers(ANNOUNCER_TYPES.MOVED, currentPercent);

      AndroidAccessibility.announce(announcingLabel);
      previousAnnouncing = 0;
    }
  }

  handleMarkerSeek(position: number) {
    const { duration, handleControlsTouch, onScrub } = this.props;

    handleControlsTouch();
    onScrub(position / duration);
  }

  renderProgressBar(percent: number) {
    const { ad, config } = this.props;

    return (
      <View accessible={false} style={styles.progressBarContainer}>
        <ProgressBar
          accessible={false}
          ad={!!ad}
          percent={percent}
          config={config}
          renderDuration={false}
        />
      </View>
    );
  }

  renderMarkersProgressBarOverlayContainer() {
    const { config, duration, markers } = this.props;
    const progressBarWidth = this.calculateProgressBarWidth();

    return (
      <MarkersProgressBarOverlayContainer
        accentColor={config.general.accentColor}
        duration={duration}
        markers={markers}
        style={{
          height: progressBarHeight,
          left: leftMargin,
          top: this.constructor.calculateTopOffset(progressBarHeight),
          width: progressBarWidth,
        }}
      />
    );
  }

  renderProgressScrubber(percent: number) {
    const progressBarWidth = this.calculateProgressBarWidth();
    const scrubberStyle = this.customizeScrubber();

    return (
      <View
        accessible={false}
        accessibilityLabel=""
        importantForAccessibility="no-hide-descendants"
        testID={VIEW_NAMES.TIME_SEEK_BAR_THUMB}
        style={[
          scrubberStyle,
          {
            height: scrubberSize,
            left: this.constructor.calculateLeftOffset(scrubberSize, percent, progressBarWidth),
            top: this.constructor.calculateTopOffset(scrubberSize),
            width: scrubberSize,
          },
        ]}
      />
    );
  }

  renderCuePoints(cuePoints: ?Array<number>) {
    if (!cuePoints) {
      return null;
    }

    const progressBarWidth = this.calculateProgressBarWidth();
    const cuePointsView = [];

    for (let i = 0; i < cuePoints.length; i += 1) {
      cuePointsView.push(
        <View
          accessible={false}
          key={i}
          style={[
            styles.cuePoint,
            {
              height: cuePointSize,
              left: this.calculateCuePointsLeftOffset(cuePoints[i], progressBarWidth),
              top: this.constructor.calculateTopOffset(cuePointSize),
              width: cuePointSize,
            },
          ]}
        />,
      );
    }

    return cuePointsView;
  }

  renderDefaultProgressBar(playedPercent: number, scrubberBarAccessibilityLabel: string) {
    const { ad, cuePoints } = this.props;
    const { accessibilityEnabled, touch, x } = this.state;

    return (
      <Animated.View
        accessibilityLabel={scrubberBarAccessibilityLabel}
        accessible={accessibilityEnabled}
        importantForAccessibility="yes"
        onTouchEnd={this.handleTouchEnd}
        onTouchMove={this.handleTouchMove}
        onTouchStart={this.handleTouchStart}
        style={styles.progressBarStyle}
        testID={VIEW_NAMES.TIME_SEEK_BAR}
      >
        {this.renderProgressBar(playedPercent)}
        {this.renderMarkersProgressBarOverlayContainer()}
        {this.renderProgressScrubber(!ad && touch ? this.touchPercent(x) : playedPercent)}
        {this.renderCuePoints(cuePoints)}
      </Animated.View>
    );
  }

  renderCompleteProgressBar() {
    const {
      config, duration, playhead, screenReaderEnabled, shouldShowProgressBar,
    } = this.props;
    const { cachedPlayhead } = this.state;

    if (!shouldShowProgressBar) {
      return null;
    }

    const playedPercent = this.constructor.playedPercent((cachedPlayhead >= 0.0 ? cachedPlayhead : playhead), duration);
    const currentPercent = parseInt(playedPercent * 100, 10);

    const scrubberBarAccessibilityLabel = Platform.select({
      android: VIEW_ACCESSIBILITY_NAMES.PROGRESS_BAR + currentPercent
        + VIEW_ACCESSIBILITY_NAMES.PROGRESS_BAR_ANDROID_SPECIFIC,
      ios: VIEW_ACCESSIBILITY_NAMES.PROGRESS_BAR,
    });

    if (Platform.OS === 'ios' && screenReaderEnabled) {
      const maximumTrackTintColor = config.controlBar.scrubberBar.bufferedColor;
      const minimumTrackTintColor = config.controlBar.scrubberBar.playedColor || config.general.accentColor;

      return (
        <Slider
          accessibilityLabel={scrubberBarAccessibilityLabel}
          maximumTrackTintColor={maximumTrackTintColor}
          minimumTrackTintColor={minimumTrackTintColor}
          maximumValue={duration}
          onValueChange={this.onValueChange}
          step={1.0}
          style={{
            flexDirection: 'row',
            height: 5,
            marginHorizontal: 20,
            marginVertical: 6,
          }}
          testID={VIEW_NAMES.TIME_SEEK_BAR}
          value={playhead}
        />
      );
    }

    const currentAnnouncing = new Date().getTime();

    if ((previousAnnouncing === 0 || currentAnnouncing - previousAnnouncing > accessibilityProgressDelay)
      && currentPercent !== VALUES.MAX_PROGRESS_PERCENT) {
      previousAnnouncing = currentAnnouncing;

      return this.renderDefaultProgressBar(playedPercent, scrubberBarAccessibilityLabel);
    }

    if (Platform.OS === 'android' && currentPercent === VALUES.MAX_PROGRESS_PERCENT && previousAnnouncing !== 0) {
      AndroidAccessibility.announce(scrubberBarAccessibilityLabel);
      previousAnnouncing = 0;
    }

    return this.renderDefaultProgressBar(playedPercent, '');
  }

  renderControlBar() {
    const {
      duration, primaryButton, playhead, volume, live, width, height, fullscreen, isPipActivated, isPipButtonVisible,
      onPress, handleControlsTouch, showWatermark, config, stereoSupported, showMoreOptionsButton, showAudioAndCCButton,
      showPlaybackSpeedButton, inCastMode,
    } = this.props;

    return (
      <ControlBar
        primaryButton={primaryButton}
        playhead={playhead}
        duration={duration}
        volume={volume}
        live={live}
        width={width - 2 * leftMargin}
        height={height}
        fullscreen={fullscreen}
        isPipActivated={isPipActivated}
        isPipButtonVisible={isPipButtonVisible}
        onPress={onPress}
        handleControlsTouch={handleControlsTouch}
        showWatermark={showWatermark}
        config={config}
        stereoSupported={stereoSupported}
        showMoreOptionsButton={showMoreOptionsButton}
        showAudioAndCCButton={showAudioAndCCButton}
        showPlaybackSpeedButton={showPlaybackSpeedButton}
        inCastMode={inCastMode}
      />
    );
  }

  renderBackground() {
    const { width } = this.props;
    const { height, opacity } = this.state;

    return (
      <Animated.View
        accessible={false}
        style={[
          styles.background,
          { height, opacity, width },
        ]}
      />
    );
  }

  renderMarkersContainer() {
    const { config, duration, markers } = this.props;
    const { markersContainerHeight, opacity } = this.state;
    const progressBarWidth = this.calculateProgressBarWidth();

    return (
      <MarkersContainer
        accentColor={config.general.accentColor}
        duration={duration}
        markers={markers}
        onSeek={this.handleMarkerSeek}
        style={{
          bottom: -1 * this.constructor.calculateTopOffset(progressBarHeight),
          // Accessing Animated.Value provides number, so it can be used in arithmetic operations.
          // $FlowFixMe
          height: markersContainerHeight,
          left: leftMargin,
          opacity,
          width: progressBarWidth,
        }}
      />
    );
  }

  renderDefault() {
    const { width } = this.props;
    const { height, opacity } = this.state;

    return (
      <Animated.View
        accessible={false}
        style={[
          styles.container,
          { height, opacity, width },
        ]}
      >

        {this.renderCompleteProgressBar()}

        <View style={styles.bottomOverlayFlexibleSpace} />

        {this.renderControlBar()}

        <View style={styles.bottomOverlayFlexibleSpace} />

      </Animated.View>
    );
  }

  renderLiveWithoutDVR() {
    const { width } = this.props;
    const { height, opacity } = this.state;

    return (
      <Animated.View
        style={[
          styles.container,
          {
            // Accessing Animated.Value provides number, so it can be used in arithmetic operations.
            // $FlowFixMe
            height: height - 6,
            opacity,
            width,
          },
        ]}
      >
        {this.renderControlBar()}
      </Animated.View>
    );
  }

  render() {
    const { config, live } = this.props;

    if (live && (config.live && config.live.forceDvrDisabled)) {
      return this.renderLiveWithoutDVR();
    }

    // MarkersContainer is rendering in a separate stack to prevent overflowing by default controls. It's also placed
    // behind the main bar so it will not impact on main bar controls touches.
    return (
      <React.Fragment>

        {this.renderBackground()}

        {this.renderMarkersContainer()}

        {this.renderDefault()}

      </React.Fragment>
    );
  }
}
