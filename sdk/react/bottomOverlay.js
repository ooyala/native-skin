import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  View,
  Slider,
  NativeModules,
  AccessibilityInfo,
  Platform
} from 'react-native';

import {
  VIEW_NAMES,
  UI_SIZES,
  VALUES,
  ANNOUNCER_TYPES,
  VIEW_ACCESSIBILITY_NAMES
} from './constants';
import AccessibilityUtils from './accessibilityUtils';
import Log from './log';
import Utils from './utils';
import ProgressBar from './common/progressBar';
import ControlBar from './controlBar';
import ResponsiveDesignManager from './responsiveDesignManager';

import bottomOverlayStyles from './style/bottomOverlayStyles.json';
const styles = Utils.getStyles(bottomOverlayStyles);
const AndroidAccessibility = NativeModules.AndroidAccessibility;

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

class BottomOverlay extends Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    primaryButton: PropTypes.string,
    fullscreen: PropTypes.bool,
    cuePoints: PropTypes.array,
    playhead: PropTypes.number,
    duration: PropTypes.number,
    ad: PropTypes.object,
    volume: PropTypes.number.isRequired,
    onPress: PropTypes.func,
    onScrub: PropTypes.func,
    handleControlsTouch: PropTypes.func.isRequired,
    isShow: PropTypes.bool,
    shouldShowProgressBar: PropTypes.bool,
    live: PropTypes.object,
    shouldShowLandscape: PropTypes.bool,
    screenReaderEnabled: PropTypes.bool,
    config: PropTypes.object,
    stereoSupported: PropTypes.bool,
    showMoreOptionsButton: PropTypes.bool,
    showAudioAndCCButton: PropTypes.bool,
    showPlaybackSpeedButton: PropTypes.bool,
    inCastMode: PropTypes.bool
  };

  static defaultProps = {
    shouldShowProgressBar: true,
    showMoreOptionsButton: true,
    showAudioAndCCButton: true
  };

  state = {
    touch: false,
    opacity: new Animated.Value(this.props.isShow ? 1 : 0),
    height: new Animated.Value(this.props.isShow ?
                               ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.CONTROLBAR_HEIGHT) : 0),
    cachedPlayhead: -1
  };

  componentDidUpdate(prevProps, prevState) {
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
  }

  componentDidMount() {
    AccessibilityInfo.fetch().done((isEnabled) => {
      this.setState({
        accessibilityEnabled: isEnabled
      });
    });
  }

  /*
  If the playhead position has changed, reset the cachedPlayhead to -1 so that it is not used when rendering the scrubber
  */
  componentWillReceiveProps(nextProps) {
    if (this.props.playhead !== nextProps.playhead) {
      this.setState({
        cachedPlayhead: -1.0
      });
    }
  }

  _calculateProgressBarWidth() {
    return this.props.width - 2 * leftMargin;
  }

  _calculateTopOffset(componentSize) {
    return topMargin + padding + progressBarHeight / 2 - componentSize / 2;
  }

  _calculateLeftOffset(componentSize, percent, progressBarWidth) {
    return leftMargin + percent * progressBarWidth - componentSize / 2
  }

  _renderProgressScrubber(percent) {
    const progressBarWidth = this._calculateProgressBarWidth();
    const topOffset = this._calculateTopOffset(scrubberSize);
    const leftOffset = this._calculateLeftOffset(scrubberSize, percent, progressBarWidth);
    const positionStyle = { top: topOffset, left: leftOffset };
    const scrubberStyle = this._customizeScrubber();

    return (
      <View
        testID={VIEW_NAMES.TIME_SEEK_BAR_THUMB}
        accessible={false}
        importantForAccessibility='no-hide-descendants'
        accessibilityLabel={VIEW_NAMES.TIME_SEEK_BAR_THUMB}
        style={[scrubberStyle, positionStyle, { width: scrubberSize, height: scrubberSize }]}>
      </View>
    );
  }

  getScrubberHandleColor() {
    if (this.props.config.general.accentColor) {
      return this.props.config.general.accentColor;
    } else if (this.props.config.controlBar.scrubberBar.scrubberHandleColor) {
      return this.props.config.controlBar.scrubberBar.scrubberHandleColor;
    } else {
      Log.error('controlBar.scrubberBar.scrubberHandleColor is not defined in your skin.json.  Please update your skin.json file to the latest provided file, or add this to your skin.json');
      return '#4389FF';
    }
  }

  _customizeScrubber() {
    let scrubberHandleBorderColor = this.props.config.controlBar.scrubberBar.scrubberHandleBorderColor;
    if (!scrubberHandleBorderColor) {
      Log.error('controlBar.scrubberBar.scrubberHandleBorderColor is not defined in your skin.json.  Please update your skin.json file to the latest provided file, or add this to your skin.json');
      scrubberHandleBorderColor = 'white';
    }
    const scrubberStyle = {
      flex: 0,
      position: 'absolute',
      backgroundColor: this.getScrubberHandleColor(),
      borderRadius: 100,
      borderWidth: 1.5,
      borderColor: scrubberHandleBorderColor
    };
    return scrubberStyle;
  }

  _renderProgressBar(percent) {
    return (
      <View
        style={styles.progressBarContainer}
        accessible={false}>
          <ProgressBar
            accessible={false}
            ref='progressBar'
            percent={percent}
            config={this.props.config}
            ad={this.props.ad}
            renderDuration={false}>
          </ProgressBar>
      </View>
    );
  }

  _renderCompleteProgressBar() {
    if (!this.props.shouldShowProgressBar) {
      return;
    }
    let playedPercent = this.playedPercent(this.props.playhead, this.props.duration);
    if (this.state.cachedPlayhead >= 0.0) {
      playedPercent = this.playedPercent(this.state.cachedPlayhead, this.props.duration);
    }

    const currentPercent = parseInt(playedPercent * 100, 10);
    const scrubberBarAccessibilityLabel = Platform.select({
      ios: VIEW_ACCESSIBILITY_NAMES.PROGRESS_BAR,
      android: VIEW_ACCESSIBILITY_NAMES.PROGRESS_BAR + currentPercent +
               VIEW_ACCESSIBILITY_NAMES.PROGRESS_BAR_ANDROID_SPECIFIC
    });

    if (Platform.OS === 'ios' && this.props.screenReaderEnabled) {
      const minimumTrackTintColor = this.props.config.controlBar.scrubberBar.playedColor || this.props.config.general.accentColor;
      const maximumTrackTintColor = this.props.config.controlBar.scrubberBar.bufferedColor;

      return (
        <Slider
          style={[{flexDirection: 'row', height: 5, marginVertical: 6, marginHorizontal: 20}]}
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
      const currentAnnouncing = new Date().getTime();

      if ((previousAnnouncing === 0 || currentAnnouncing - previousAnnouncing > accessibilityProgressDelay)
              && currentPercent !== VALUES.MAX_PROGRESS_PERCENT) {
        previousAnnouncing = currentAnnouncing;
        // return this._renderDefaultProgressBar(playedPercent, scrubberBarAccessibilityLabel)
      } else {
        if (Platform.OS === 'android' && currentPercent === VALUES.MAX_PROGRESS_PERCENT && previousAnnouncing !== 0) {
          AndroidAccessibility.announce(scrubberBarAccessibilityLabel);
          previousAnnouncing = 0;
        }
        return this._renderDefaultProgressBar(playedPercent, scrubberBarAccessibilityLabel);
      }
    }
  }

  _renderDefaultProgressBar(playedPercent, scrubberBarAccessibilityLabel) {
    return (
      <Animated.View
        testID={VIEW_NAMES.TIME_SEEK_BAR}
        accessible={this.state.accessibilityEnabled}
        accessibilityLabel={scrubberBarAccessibilityLabel}
        importantForAccessibility='yes'
        onTouchStart={(event) => this.handleTouchStart(event)}
        onTouchMove={(event) => this.handleTouchMove(event)}
        onTouchEnd={(event) => this.handleTouchEnd(event)}
        style={styles.progressBarStyle}>
        {this._renderProgressBar(playedPercent)}
        {this._renderProgressScrubber(!this.props.ad && this.state.touch ? this.touchPercent(this.state.x) : playedPercent)}
        {this._renderCuePoints(this.props.cuePoints)}
      </Animated.View>
    );
  }

  _onValueChange(value) {
    // increase or decrease playhead by X seconds
    let newPlayhead = this.props.playhead - value;
    if (newPlayhead >= 0) {
      newPlayhead = this.props.playhead - VALUES.SEEK_VALUE;
    } else {
      newPlayhead = this.props.playhead + VALUES.SEEK_VALUE;
    }

    const seekPercent = this.playedPercent(newPlayhead, this.props.duration);
    this.props.onScrub(seekPercent);
  }

  _calculateCuePointsLeftOffset(cuePoint, progressBarWidth) {
    let cuePointPercent = cuePoint / this.props.duration;
    if (cuePointPercent > 1) {
      cuePointPercent = 1;
    }
    if (cuePointPercent < 0) {
      cuePointPercent = 0;
    }
    const leftOffset = this._calculateLeftOffset(cuePointSize, cuePointPercent, progressBarWidth);
    return leftOffset;
  }

  _renderCuePoints(cuePoints) {
    if (!cuePoints) {
      return;
    }
    const cuePointsView = [];
    const progressBarWidth = this._calculateProgressBarWidth();
    const topOffset = this._calculateTopOffset(cuePointSize);
    let leftOffset = 0;
    let positionStyle;
    let cuePointView;

    for (let i = 0; i < cuePoints.length; i++) {
      let cuePoint = cuePoints[i];
      leftOffset = this._calculateCuePointsLeftOffset(cuePoint, progressBarWidth);
      positionStyle = { top: topOffset, left: leftOffset };
      cuePointView = (
        <View
          accessible={false}
          key={i}
          style={[styles.cuePoint, positionStyle, { width: cuePointSize, height: cuePointSize }]} />
      );
      cuePointsView.push(cuePointView);
    }

    return cuePointsView;
  }

  _renderControlBar() {
    return (
      <ControlBar
        ref='controlBar'
        primaryButton={this.props.primaryButton}
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
        stereoSupported={this.props.stereoSupported}
        showMoreOptionsButton={this.props.showMoreOptionsButton}
        showAudioAndCCButton={this.props.showAudioAndCCButton}
        showPlaybackSpeedButton={this.props.showPlaybackSpeedButton}
        inCastMode={this.props.inCastMode}
        />
    );
  }

  playedPercent(playhead, duration) {
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
  }

  touchPercent(x) {
    let percent = (x - leftMargin) / (this.props.width - 2 * leftMargin);
    if (percent > 1) {
      percent = 1;
    } else if (percent < 0) {
      percent = 0;
    }
    return percent;
  }

  handleTouchStart(event) {
    this.props.handleControlsTouch();
    let touchableDistance = ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, scrubTouchableDistance);
    if ((this.props.height - event.nativeEvent.pageY) < touchableDistance) {
      return;
    }
    this.setState({
      touch: true,
      x: event.nativeEvent.pageX
    });
  }

  handleTouchMove(event) {
    this.props.handleControlsTouch();
    this.setState({
      x: event.nativeEvent.pageX
    });
    if (Platform.OS === 'android') {
      const playedPercent =  this.touchPercent(event.nativeEvent.pageX);
      const currentPercent = parseInt(playedPercent * 100, 10);
      const announcingLabel = AccessibilityUtils.createAccessibilityAnnouncers(ANNOUNCER_TYPES.MOVING, currentPercent);
      const currentAnnouncing = new Date().getTime();
      if (previousAnnouncing === 0 || currentAnnouncing - previousAnnouncing > accessibilityDelay) {
        previousAnnouncing = currentAnnouncing;
        AndroidAccessibility.announce(announcingLabel);
      }
    }
  }

  handleTouchEnd(event) {
    this.props.handleControlsTouch();
    if (this.state.touch && this.props.onScrub) {
      this.props.onScrub(this.touchPercent(event.nativeEvent.pageX));
      this.setState({
        cachedPlayhead: this.touchPercent(event.nativeEvent.pageX) * this.props.duration
      });
    }
    this.setState({
      touch: false,
      x: null
    });

    if (Platform.OS === 'android') {
      const playedPercent =  this.touchPercent(event.nativeEvent.pageX);
      const currentPercent = parseInt(playedPercent * 100, 10);
      const announcingLabel = AccessibilityUtils.createAccessibilityAnnouncers(ANNOUNCER_TYPES.MOVED, currentPercent);
      AndroidAccessibility.announce(announcingLabel);
      previousAnnouncing = 0;
    }
  }

  renderDefault(widthStyle) {
    return (
      <Animated.View
        accessible={false}
        style={[styles.container, widthStyle, {'height': this.state.height}]}>
        {this._renderCompleteProgressBar()}
        {<View style ={[styles.bottomOverlayFlexibleSpace]}/>}
        {this._renderControlBar()}
        {<View style ={[styles.bottomOverlayFlexibleSpace]}/>}
      </Animated.View>
    );
  }

  renderLiveWithoutDVR(widthStyle) {
    return (
      <Animated.View style={[styles.container, widthStyle, {'height': this.state.height - 6}]}>
        {this._renderControlBar()}
      </Animated.View>
    );
  }

  render() {
    const widthStyle = {width: this.props.width, opacity: this.state.opacity};
    if (this.props.live && (this.props.config.live && this.props.config.live.forceDvrDisabled)) {
      return this.renderLiveWithoutDVR(widthStyle);
    }
    return this.renderDefault(widthStyle);
  }
}

module.exports = BottomOverlay;
