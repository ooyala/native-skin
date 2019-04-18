import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Image, Platform, Text, TouchableHighlight, View,
} from 'react-native';

import { BUTTON_NAMES, STRING_CONSTANTS, VIEW_ACCESSIBILITY_NAMES } from '../../constants';
import * as Accessibility from '../../lib/accessibility';
import * as Utils from '../../lib/utils';
import SkipButton from '../SkipButton';
import VolumeView from './VolumeView';

import styles from './ControlBarWidgets.styles';

export default class ControlBarWidgets extends Component {
  static propTypes = {
    widgetType: PropTypes.object,
    options: PropTypes.object,
  };

  playPauseWidget = (options) => {
    const iconMap = {
      play: options.playIcon,
      pause: options.pauseIcon,
      replay: options.replayIcon,
    };

    const fontFamilyStyle = { fontFamily: iconMap[options.primaryActionButton].fontFamilyName };
    const onPressF = options.primaryActionButton === 'replay'
      ? options.onReplay : options.onPress;
    return (
      <TouchableHighlight
        onPress={onPressF}
        testID={BUTTON_NAMES.PLAY_PAUSE}
        accessible
        accessibilityLabel={BUTTON_NAMES.PLAY_PAUSE}
      >
        <Text
          style={[options.style, fontFamilyStyle]}
        >
          {iconMap[options.primaryActionButton].fontString}
        </Text>
      </TouchableHighlight>
    );
  };

  seekBackwardsWidget = options => this._renderSeekButton(options, false);

  seekForwardWidget = options => this._renderSeekButton(options, true);

  _renderSeekButton = (options, isForward) => {
    const fontStyle = {
      fontSize: options.size,
      fontFamily: options.icon.fontFamilyName,
    };
    const sizeStyle = {
      width: options.size,
      height: options.size,
    };
    const opacity = { opacity: 1 };
    const animate = { transform: [{ scale: 1 }] };
    const buttonColor = { color: 'white' };

    const seekValue = Utils.restrictSeekValueIfNeeded(options.seekValue);

    return (
      <SkipButton
        disabled={false}
        isForward={isForward}
        timeValue={seekValue}
        onSeek={options.onPress}
        icon={options.icon.fontString}
        fontStyle={fontStyle}
        sizeStyle={sizeStyle}
        opacity={isForward ? options.opacity : opacity}
        animate={animate}
        buttonColor={buttonColor}
      />
    );
  };

  volumeWidget = (options) => {
    let volumeScrubber;
    const scrubberStyle = [options.scrubberStyle];
    if (Platform.OS === 'ios') {
      scrubberStyle.push({ top: 5 });
    }
    if (options.showVolume) {
      volumeScrubber = (
        <VolumeView
          accessibilityLabel={VIEW_ACCESSIBILITY_NAMES.VOLUME_BAR}
          style={scrubberStyle}
          color={options.volumeControlColor}
          volume={options.volume}
        />
      );
    }

    const iconConfig = (options.volume > 0) ? options.iconOn : options.iconOff;
    const fontFamilyStyle = { fontFamily: iconConfig.fontFamilyName };
    return (
      <View
        style={[{ flexDirection: 'row' }]}
      >
        <TouchableHighlight
          testID={BUTTON_NAMES.VOLUME}
          accessible
          accessibilityLabel={BUTTON_NAMES.VOLUME}
          style={[options.iconTouchableStyle]}
          onPress={options.onPress}
        >
          <Text style={[options.style, fontFamilyStyle]}>
            {iconConfig.fontString}
          </Text>
        </TouchableHighlight>
        {volumeScrubber}
      </View>
    );
  };

  _renderLiveCircle = (options) => {
    if (options.liveCircle) {
      return (<View style={options.liveCircle} />);
    }
    return null;
  };

  timeDurationWidget = (options) => {
    const playHead = (
      <Text
        style={options.playHeadTimeStyle}
        accessibilityLabel={options.playHeadTimeString + STRING_CONSTANTS.SECONDS}
      >
        {options.playHeadTimeString}
      </Text>
    );
    const duration = (
      <Text
        style={options.durationStyle}
        accessibilityLabel={options.durationString + STRING_CONSTANTS.TOTAL_SECONDS}
      >
        {options.durationString}
      </Text>
    );
    return (
      <View
        style={options.completeTimeStyle}
        accessible
      >
        {this._renderLiveCircle(options)}
        {playHead}
        {duration}
      </View>
    );
  };

  flexibleSpaceWidget = options => (
    <View
      style={{ flex: 1 }}
    />
  );

  discoveryWidget = (options) => {
    const fontFamilyStyle = { fontFamily: options.icon.fontFamilyName };
    return (
      <TouchableHighlight
        testID={BUTTON_NAMES.DISCOVERY}
        accessible
        accessibilityLabel={BUTTON_NAMES.DISCOVERY}
        accessibilityComponentType="button"
        style={[options.iconTouchableStyle]}
        onPress={options.onPress}
      >
        <Text style={[options.style, fontFamilyStyle]}>
          {options.icon.fontString}
        </Text>
      </TouchableHighlight>
    );
  };

  fullscreenWidget = (options) => {
    const fontFamilyStyle = { fontFamily: options.icon.fontFamilyName };
    const nameLabel = options.fullscreen ? VIEW_ACCESSIBILITY_NAMES.EXIT_FULLSCREEN
      : VIEW_ACCESSIBILITY_NAMES.ENTER_FULLSCREEN;
    return (
      <TouchableHighlight
        testID={nameLabel}
        accessible
        accessibilityLabel={nameLabel}
        style={[options.iconTouchableStyle]}
        onPress={options.onPress}
      >
        <Text style={[options.style, fontFamilyStyle]}>
          {options.icon.fontString}
        </Text>
      </TouchableHighlight>
    );
  };

  pipButtonWidget = (options) => {
    const fontFamilyStyle = { fontFamily: options.icon.fontFamilyName };
    const nameLabel = options.isActive ? VIEW_ACCESSIBILITY_NAMES.EXIT_PIP : VIEW_ACCESSIBILITY_NAMES.ACTIVE_PIP;
    let widget;
    if (options.enabled) {
      widget = (
        <TouchableHighlight
          testID={nameLabel}
          accessible
          accessibilityLabel={nameLabel}
          style={[options.iconTouchableStyle]}
          onPress={options.onPress}
        >
          <Text style={[options.style, fontFamilyStyle]}>
            {options.icon.fontString}
          </Text>
        </TouchableHighlight>
      );
    }
    return widget;
  };

  moreOptionsWidget = (options) => {
    const fontFamilyStyle = { fontFamily: options.icon.fontFamilyName };
    return (
      <TouchableHighlight
        testID={BUTTON_NAMES.MORE}
        accessible
        accessibilityLabel={BUTTON_NAMES.MORE}
        style={[options.iconTouchableStyle]}
        onPress={options.onPress}
      >
        <Text style={[options.style, fontFamilyStyle]}>
          {options.icon.fontString}
        </Text>
      </TouchableHighlight>
    );
  };

  castWidget = (options) => {
    const fontFamilyStyle = { fontFamily: options.icon.fontFamilyName };
    if (!options.enabled || options.enabled === undefined) {
      return null;
    }
    return (
      <TouchableHighlight
        testID={BUTTON_NAMES.CAST}
        accessible
        accessibilityLabel={BUTTON_NAMES.CAST}
        style={[options.iconTouchableStyle, options.enabled]}
        onPress={options.onPress}
      >
        <Text style={[options.style, fontFamilyStyle]}>
          {options.icon.fontString}
        </Text>
      </TouchableHighlight>
    );
  };

  rewindWidget = (options) => {
    const fontFamilyStyle = { fontFamily: options.icon.fontFamilyName };
    return (
      <TouchableHighlight
        style={[options.iconTouchableStyle]}
        onPress={options.onPress}
      >
        <Text style={[options.style, fontFamilyStyle]}>
          {options.icon.fontString}
        </Text>
      </TouchableHighlight>
    );
  };

  watermarkWidget = (options) => {
    if (options.shouldShow) {
      return (
        <View style={styles.watermark}>
          <Image
            style={options.style}
            source={{ uri: options.icon }}
            resizeMode={options.resizeMode}
          />
        </View>
      );
    }
    return null;
  };

  shareWidget = (options) => {
    const fontFamilyStyle = { fontFamily: options.icon.fontFamilyName };
    return (
      <TouchableHighlight
        testID={BUTTON_NAMES.SHARE}
        accessible
        accessibilityLabel={BUTTON_NAMES.SHARE}
        accessibilityComponentType="button"
        style={[options.iconTouchableStyle]}
        onPress={options.onPress}
      >
        <Text style={[options.style, fontFamilyStyle]}>
          {options.icon.fontString}
        </Text>
      </TouchableHighlight>
    );
  };

  bitrateSelectorWidget = options =>
    // TODO implement
    null
  ;

  liveWidget = options =>
    // TODO implement
    null
  ;

  stereoscopicWidget = (options) => {
    const fontFamilyStyle = { fontFamily: options.icon.fontFamilyName };
    return (
      <TouchableHighlight
        testID={BUTTON_NAMES.STEREOSCOPIC}
        accessible
        accessibilityLabel={BUTTON_NAMES.STEREOSCOPIC}
        accessibilityComponentType="button"
        style={[options.iconTouchableStyle]}
        onPress={options.onPress}
      >
        <Text style={[options.style, fontFamilyStyle]}>
          {options.icon.fontString}
        </Text>
      </TouchableHighlight>
    );
  };

  audioAndCCWidget = (options) => {
    const fontFamilyStyle = { fontFamily: options.icon.fontFamilyName };
    let widget;
    if (options.enabled) {
      widget = (
        <TouchableHighlight
          testID={BUTTON_NAMES.AUDIO_AND_CC}
          accessible
          accessibilityLabel={BUTTON_NAMES.AUDIO_AND_CC}
          accessibilityComponentType="button"
          style={[options.iconTouchableStyle]}
          onPress={options.onPress}
        >
          <Text style={[options.style, fontFamilyStyle]}>
            {options.icon.fontString}
          </Text>
        </TouchableHighlight>
      );
    }
    return widget;
  };

  playbackSpeedWidget = (options) => {
    let widget;

    // Create accessibility label for selected playback speed rate button
    const playbackSpeedRateWithoutPostfix = options.selectedPlaybackSpeedRate.slice(0, -1);
    const selectedPlaybackSpeedAccessiblityLabel = Accessibility.createAccessibilityLabelForSelectedObject(
      playbackSpeedRateWithoutPostfix,
    );
    const accessibilityLabel = VIEW_ACCESSIBILITY_NAMES.PLAYBACK_SPEED_BUTTON + selectedPlaybackSpeedAccessiblityLabel;

    if (options.enabled) {
      widget = (
        <TouchableHighlight
          testID={BUTTON_NAMES.PLAYBACK_SPEED}
          accessible
          accessibilityLabel={accessibilityLabel}
          accessibilityComponentType="button"
          style={[options.iconTouchableStyle]}
          onPress={options.onPress}
        >
          <Text style={[options.style]}>
            {options.selectedPlaybackSpeedRate}
          </Text>
        </TouchableHighlight>
      );
    }
    return widget;
  };

  render() {
    const { options, widgetType } = this.props;

    const widgetsMap = {
      playPause: this.playPauseWidget,
      volume: this.volumeWidget,
      timeDuration: this.timeDurationWidget,
      flexibleSpace: this.flexibleSpaceWidget,
      rewind: this.rewindWidget,
      discovery: this.discoveryWidget,
      fullscreen: this.fullscreenWidget,
      chromecast: this.castWidget,
      pipButton: this.pipButtonWidget,
      moreOptions: this.moreOptionsWidget,
      watermark: this.watermarkWidget,
      share: this.shareWidget,
      bitrateSelector: this.bitrateSelectorWidget,
      live: this.liveWidget,
      stereoscopic: this.stereoscopicWidget,
      audioAndCC: this.audioAndCCWidget,
      playbackSpeed: this.playbackSpeedWidget,
      seekBackwards: this.seekBackwardsWidget,
      seekForward: this.seekForwardWidget,
    };

    if (widgetType.name in widgetsMap) {
      const widgetOptions = options[widgetType.name];

      return widgetsMap[widgetType.name](widgetOptions);
    }

    // Log.warn('WARNING: unsupported widget name: ' + this.props.widgetType.name);
    return <View />;
  }
}
