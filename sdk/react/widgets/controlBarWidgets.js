'use strict';

/**
 * Created by dkao on 7/7/15.
 */
import PropTypes from 'prop-types';

import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  SliderIOS,
  TouchableHighlight
} from 'react-native';
import * as Utils from "../utils";

const VolumeView = require('./VolumeView');
const styles = require('../utils').getStyles(require('./style/controlBarWidgetStyles.json'));
const Log = require('../log');

const Constants = require('../constants');
const {
  BUTTON_NAMES,
  STRING_CONSTANTS
} = Constants;

class controlBarWidget extends React.Component {
  static propTypes = {
    widgetType: PropTypes.object,
    options: PropTypes.object
  };

  playPauseWidget = (options) => {
    const iconMap = {
      "play": options.playIcon,
      "pause": options.pauseIcon,
      "replay": options.replayIcon
    };
    const fontFamilyStyle = {fontFamily: iconMap[options.primaryActionButton].fontFamilyName};
    return (
      <TouchableHighlight onPress={options.onPress}>
        testID={BUTTON_NAMES.PLAY_PAUSE}
        accessible={true}
        accessibilityLabel={BUTTON_NAMES.PLAY_PAUSE}
        <Text
          style={[options.style, fontFamilyStyle]}>
          {iconMap[options.primaryActionButton].fontString}
        </Text>
      </TouchableHighlight>
    );
  };

  volumeWidget = (options) => {
    let volumeScrubber = null;
    const scrubberStyle = [options.scrubberStyle];
    if (options.platform === Constants.PLATFORMS.IOS) {
      scrubberStyle.push({top: 5});
    }
    if (options.showVolume) {
      let volumeAccessibleLabel = Utils.makeAccessibilityLabelWithParams(
        Constants.VIEW_ACCESSIBILITY_NAMES.VOLUME_VIEW,
        Constants.ACCESSIBILITY_LABELS.SEEK_BAR_INFO,
        Constants.ACCESSIBILITY_LABELS_TYPE.SEEK_VIEWS
      );
      volumeScrubber = <VolumeView
        accessibilityLabel={volumeAccessibleLabel}
        style={scrubberStyle}
        color={options.volumeControlColor}
        volume={options.volume}/>;
    }

    const iconConfig = (options.volume > 0) ? options.iconOn : options.iconOff;
    const fontFamilyStyle = {fontFamily: iconConfig.fontFamilyName};
    return (
      <View
        style={[{flexDirection: 'row'}]}>
        <TouchableHighlight
          testID={BUTTON_NAMES.VOLUME}
          accessible={true}
          accessibilityLabel={BUTTON_NAMES.VOLUME}
          style={[options.iconTouchableStyle]}
          onPress={options.onPress}>
          <Text style={[options.style, fontFamilyStyle]}>
            {iconConfig.fontString}
          </Text>
        </TouchableHighlight>
        {volumeScrubber}
      </View>
    );
  };

  timeDurationWidget = (options) => {
    if (options.onPress) {
      return (
        <TouchableHighlight
          onPress={options.onPress}>
          <Text style={options.style}>
            {options.durationString}
          </Text>
        </TouchableHighlight>);
    } else {
      const playheadAccessibilityLabel = options.playHeadTimeString + STRING_CONSTANTS.SECONDS;
      const playHead = <Text
        style={options.playHeadTimeStyle}
        accessible={true}
        accessibilityLabel={playheadAccessibilityLabel}>
        {options.playHeadTimeString}
      </Text>;
      const durationAccessibilityLabel = options.durationString + STRING_CONSTANTS.TOTAL_SECONDS;
      const duration = <Text
        style={options.durationStyle} accessible={true}
        accessibilityLabel={durationAccessibilityLabel}>
        {options.durationString}
      </Text>;
      return (
        <View style={options.completeTimeStyle}>
          {playHead}
          {duration}
        </View>
      );
    }
  };

  flexibleSpaceWidget = (options) => {
    return <View
      style={{flex: 1}}
    />;
  };

  discoveryWidget = (options) => {
    const fontFamilyStyle = {fontFamily: options.icon.fontFamilyName};
    return (
      <TouchableHighlight
        testID={BUTTON_NAMES.DISCOVERY}
        accessible={true}
        accessibilityLabel={BUTTON_NAMES.DISCOVERY}
        accessibilityComponentType="button"
        style={[options.iconTouchableStyle]}
        onPress={options.onPress}>
        <Text style={[options.style, fontFamilyStyle]}>
          {options.icon.fontString}
        </Text>
      </TouchableHighlight>
    );
  };

  fullscreenWidget = (options) => {
    const fontFamilyStyle = {fontFamily: options.icon.fontFamilyName};
    const nameLabel = options.fullscreen ? BUTTON_NAMES.FULLSCREEN_CLOSE : BUTTON_NAMES.FULLSCREEN;
    return (
      <TouchableHighlight
        testID={nameLabel}
        accessible={true}
        accessibilityLabel={nameLabel}
        accessibilityComponentType="button"
        style={[options.iconTouchableStyle]}
        onPress={options.onPress}>
        <Text style={[options.style, fontFamilyStyle]}>
          {options.icon.fontString}
        </Text>
      </TouchableHighlight>
    );
  };

  moreOptionsWidget = (options) => {
    const fontFamilyStyle = {fontFamily: options.icon.fontFamilyName};
    return (
      <TouchableHighlight
        testID={BUTTON_NAMES.MORE}
        accessible={true}
        accessibilityLabel={BUTTON_NAMES.MORE}
        accessibilityComponentType="button"
        style={[options.iconTouchableStyle]}
        onPress={options.onPress}>
        <Text style={[options.style, fontFamilyStyle]}>
          {options.icon.fontString}
        </Text>
      </TouchableHighlight>
    );
  };

  rewindWidget = (options) => {
    const fontFamilyStyle = {fontFamily: options.icon.fontFamilyName};
    return (
      <TouchableHighlight
        style={[options.iconTouchableStyle]}
        onPress={options.onPress}>
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
            source={{uri: options.icon}}
            resizeMode={options.resizeMode}/>
        </View>);
    }
    else {
      return null;
    }
  };

  shareWidget = (options) => {
    const fontFamilyStyle = {fontFamily: options.icon.fontFamilyName};
    return (
      <TouchableHighlight
        testID={BUTTON_NAMES.SHARE}
        accessible={true}
        accessibilityLabel={BUTTON_NAMES.SHARE}
        accessibilityComponentType="button"
        style={[options.iconTouchableStyle]}
        onPress={options.onPress}>
        <Text style={[options.style, fontFamilyStyle]}>
          {options.icon.fontString}
        </Text>
      </TouchableHighlight>
    );
  };

  bitrateSelectorWidget = (options) => {
    // TODO implement
    return null;
  };

  liveWidget = (options) => {
    // TODO implement
    return null;
  };

  stereoscopicWidget = (options) => {
    const fontFamilyStyle = {fontFamily: options.icon.fontFamilyName};
    return (
      <TouchableHighlight
        testID={BUTTON_NAMES.STEREOSCOPIC}
        accessible={true}
        accessibilityLabel={BUTTON_NAMES.STEREOSCOPIC}
        accessibilityComponentType="button"
        style={[options.iconTouchableStyle]}
        onPress={options.onPress}>
        <Text style={[options.style, fontFamilyStyle]}>
          {options.icon.fontString}
        </Text>
      </TouchableHighlight>
    );
  };

  audioAndCCWidget = (options) => {
    const fontFamilyStyle = {fontFamily: options.icon.fontFamilyName};
    return (
      <TouchableHighlight
        testID={BUTTON_NAMES.AUDIO_AND_CC}
        accessible={true}
        accessibilityLabel={BUTTON_NAMES.AUDIO_AND_CC}
        accessibilityComponentType="button"
        style={[options.iconTouchableStyle]}
        onPress={options.onPress}>
        <Text style={[options.style, fontFamilyStyle]}>
          {options.icon.fontString}
        </Text>
      </TouchableHighlight>
    );
  };

  render() {
    const widgetsMap = {
      "playPause": this.playPauseWidget,
      "volume": this.volumeWidget,
      "timeDuration": this.timeDurationWidget,
      "flexibleSpace": this.flexibleSpaceWidget,
      "rewind": this.rewindWidget,
      "discovery": this.discoveryWidget,
      "fullscreen": this.fullscreenWidget,
      "moreOptions": this.moreOptionsWidget,
      "watermark": this.watermarkWidget,
      "share": this.shareWidget,
      "bitrateSelector": this.bitrateSelectorWidget,
      "live": this.liveWidget,
      "stereoscopic": this.stereoscopicWidget,
      "audioAndCC": this.audioAndCCWidget
    };
    if (this.props.widgetType.name in widgetsMap) {
      const widgetOptions = this.props.options[this.props.widgetType.name];
      return widgetsMap[this.props.widgetType.name](widgetOptions);
    }
    else {
      Log.warn("WARNING: unsupported widget name: " + this.props.widgetType.name);
      return <View/>;
    }
  }
}

module.exports = controlBarWidget;