/**
 * Created by dkao on 7/7/15.
 */
'use strict';

import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  SliderIOS,
  TouchableHighlight
} from 'react-native';

var VolumeView = require('./VolumeView');
var styles = require('../utils').getStyles(require('./style/controlBarWidgetStyles.json'));
var Log = require('../log');

var Constants = require('../constants');
var {
  BUTTON_NAMES,
  IMG_URLS,
  STRING_CONSTANTS
  } = Constants;

const VOLUME_MAX_LEVEL = 15;
var controlBarWidget = React.createClass({
  propTypes: {
    widgetType: React.PropTypes.object,
    options: React.PropTypes.object
  },

  playPauseWidget: function (options) {
    var iconMap = {
      "play": options.playIcon,
      "pause": options.pauseIcon,
      "replay": options.replayIcon
    };
    var fontFamilyStyle = {fontFamily: iconMap[options.primaryActionButton].fontFamilyName};
    return (
      <TouchableHighlight onPress={options.onPress}>
         testID={BUTTON_NAMES.PLAY_PAUSE}
         accessible={true} accessibilityLabel={BUTTON_NAMES.PLAY_PAUSE}
        <Text style={[options.style, fontFamilyStyle]}>{iconMap[options.primaryActionButton].fontString}</Text>
      </TouchableHighlight>
    );
  },

  volumeWidget: function (options) {
    var volumeScrubber = null;
    const scrubberStyle = [options.scrubberStyle];
    if (options.platform === Constants.PLATFORMS.IOS) {
        scrubberStyle.push({top: 5});
    }
    if (options.showVolume) {
      var percenValue;
      if (options.platform === Constants.PLATFORMS.ANDROID) {
        percenValue = parseInt((options.volume * 100) / VOLUME_MAX_LEVEL);
      } else {
        percenValue = parseInt(options.volume * 100);
      }
      let volumePercentLabel = "Volume percent is: " + percenValue;
      volumeScrubber = <VolumeView
        accessibilityLabel={volumePercentLabel}
        style={scrubberStyle}
        color={options.volumeControlColor}
        volume={options.volume}/>;
    }

    var iconConfig = (options.volume > 0) ? options.iconOn : options.iconOff;
    var fontFamilyStyle = {fontFamily: iconConfig.fontFamilyName};
    return (
      <View 
        style={[{flexDirection: 'row'}]}>
        <TouchableHighlight
          testID={BUTTON_NAMES.VOLUME}
          accessible={true} accessibilityLabel={BUTTON_NAMES.VOLUME}
          style={[options.iconTouchableStyle]} onPress={options.onPress}>
          <Text style={[options.style, fontFamilyStyle]}>{iconConfig.fontString}</Text>
        </TouchableHighlight>
        {volumeScrubber}
      </View>
    );
  },

  timeDurationWidget: function (options) {
    if (options.onPress) {
      return (
        <TouchableHighlight onPress={options.onPress}>
          <Text style={options.style}>{options.durationString}</Text>
        </TouchableHighlight>);
    } else {
      var playHead = <Text style={options.playHeadTimeStyle} accessible={true} accessibilityLabel={options.playHeadTimeString + STRING_CONSTANTS.SECONDS}>{options.playHeadTimeString}</Text>;
      var duration = <Text style={options.durationStyle} accessible={true} accessibilityLabel={options.durationString + STRING_CONSTANTS.TOTAL_SECONDS}>{options.durationString}</Text>;
      return (
        <View style={options.completeTimeStyle}>
        {playHead}
        {duration}
        </View>
        );
    }

  },

  flexibleSpaceWidget: function (options) {
    return (<View style={{flex: 1}} />);
  },

  discoveryWidget: function (options) {
    var fontFamilyStyle = {fontFamily: options.icon.fontFamilyName};
    return (<TouchableHighlight
      testID={BUTTON_NAMES.DISCOVERY}
      accessible={true} accessibilityLabel={BUTTON_NAMES.DISCOVERY} accessibilityComponentType="button"
      style={[options.iconTouchableStyle]} onPress={options.onPress}>
      <Text style={[options.style, fontFamilyStyle]}>{options.icon.fontString}</Text>
    </TouchableHighlight>);
    return null;
  },

  fullscreenWidget: function(options) {
    var fontFamilyStyle = {fontFamily: options.icon.fontFamilyName};
    var nameLabel = options.fullscreen ? BUTTON_NAMES.FULLSCREEN_CLOSE : BUTTON_NAMES.FULLSCREEN;
    return (
    <TouchableHighlight 
      testID={nameLabel}
      accessible={true} accessibilityLabel={nameLabel} accessibilityComponentType="button" 
      style={[options.iconTouchableStyle]} onPress={options.onPress}>
      <Text style={[options.style, fontFamilyStyle]}>{options.icon.fontString}</Text>
    </TouchableHighlight>);
  },

  moreOptionsWidget: function (options) {
    var fontFamilyStyle = {fontFamily: options.icon.fontFamilyName};
    return (
    <TouchableHighlight 
      testID={BUTTON_NAMES.MORE}
      accessible={true} accessibilityLabel={BUTTON_NAMES.MORE} accessibilityComponentType="button" 
      style={[options.iconTouchableStyle]} onPress={options.onPress}>
      <Text style={[options.style, fontFamilyStyle]}>{options.icon.fontString}</Text>
    </TouchableHighlight>);
  },

  rewindWidget: function (options) {
    var fontFamilyStyle = {fontFamily: options.icon.fontFamilyName};
    return (<TouchableHighlight style={[options.iconTouchableStyle]} onPress={options.onPress}>
      <Text style={[options.style, fontFamilyStyle]}>{options.icon.fontString}</Text>
    </TouchableHighlight>);
  },

  watermarkWidget: function (options) {
    if(options.shouldShow) {
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
  },

  shareWidget: function(options) {
    var fontFamilyStyle = {fontFamily: options.icon.fontFamilyName};
    return (<TouchableHighlight
      testID={BUTTON_NAMES.SHARE}
      accessible={true} accessibilityLabel={BUTTON_NAMES.SHARE} accessibilityComponentType="button"
      style={[options.iconTouchableStyle]} onPress={options.onPress}>
      <Text style={[options.style, fontFamilyStyle]}>{options.icon.fontString}</Text>
    </TouchableHighlight>);
  },

  bitrateSelectorWidget: function(options) {
    // TODO implement
    return null;
  },

  liveWidget: function(options) {
    // TODO implement
    return null;
  },

  stereoscopicWidget: function (options) {
    var fontFamilyStyle = {fontFamily: options.icon.fontFamilyName};
    return (<TouchableHighlight
      testID={BUTTON_NAMES.STEREOSCOPIC}
      accessible={true} accessibilityLabel={BUTTON_NAMES.STEREOSCOPIC} accessibilityComponentType="button"
      style={[options.iconTouchableStyle]} onPress={options.onPress}>
      <Text style={[options.style, fontFamilyStyle]}>{options.icon.fontString}</Text>
    </TouchableHighlight>);
  },

  audioAndCCWidget: function (options) {
    var fontFamilyStyle = {fontFamily: options.icon.fontFamilyName};
    return (<TouchableHighlight
      testID={BUTTON_NAMES.AUDIO_AND_CC}
      accessible={true} accessibilityLabel={BUTTON_NAMES.AUDIO_AND_CC} accessibilityComponentType="button"
      style={[options.iconTouchableStyle]} onPress={options.onPress}>
      <Text style={[options.style, fontFamilyStyle]}>{options.icon.fontString}</Text>
    </TouchableHighlight>);
  },

  render: function() {

    var widgetsMap = {
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
    if( this.props.widgetType.name in widgetsMap ) {
      var widgetOptions = this.props.options[this.props.widgetType.name];
      return widgetsMap[this.props.widgetType.name](widgetOptions);
    }
    else {
      Log.warn( "WARNING: unsupported widget name: " + this.props.widgetType.name );
      return <View></View>;
    }
  }

});

module.exports = controlBarWidget;