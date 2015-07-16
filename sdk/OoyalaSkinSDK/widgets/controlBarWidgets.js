/**
 * Created by dkao on 7/7/15.
 */
'use strict';

var React = require('react-native');
var {
  Text,
  View,
  Image,
  StyleSheet,
  SliderIOS,
  TouchableHighlight
} = React;
var VolumeView = require('./VolumeView');

var Constants = require('./../constants');
var {
  BUTTON_NAMES,
  IMG_URLS,
  } = Constants;

var controlBarWidget = React.createClass({

  propTypes: {
    widgetType: React.PropTypes.string,
    options: React.PropTypes.object
  },

  playPauseWidget: function (options) {
    var iconMap = {
      "play": options.playIcon,
      "pause": options.pauseIcon,
      "replay": options.replayIcon
    };

    return (
      <TouchableHighlight onPress={options.onPress}>
        <Text style={options.style}>{iconMap[options.primaryActionButton]}</Text>
      </TouchableHighlight>
    );
  },

  volumeWidget: function (options) {
    var volumeScrubber = null;
    if (options.showVolume) {
      volumeScrubber = <VolumeView style={options.scrubberStyle} />;
    }
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableHighlight onPress={options.onPress}>
          <Text style={options.style}>{options.volumeIcon}</Text>
        </TouchableHighlight>
        {volumeScrubber}
      </View>
    );
  },

  timeDurationWidget: function (options) {
    return (<Text style={options.style}>{options.durationString}</Text>);
  },

  flexibleSpaceWidget: function (options) {
    return (<View style={{flex: 1}} />);
  },

  discoveryWidget: function (options) {
    // TODO implement
    return null;
  },

  fullscreenWidget: function(options) {
    return (<TouchableHighlight onPress={options.onPress}>
      <Text style={options.style}>{options.icon}</Text>
    </TouchableHighlight>);
  },

  moreOptionsWidget: function (options) {
    return (<TouchableHighlight onPress={options.onPress}>
      <Text style={options.style}>{options.icon}</Text>
    </TouchableHighlight>);
  },

  watermarkWidget: function (options) {
    if(options.shouldShow) {
      return (<Image style={options.style}
        source={{uri: IMG_URLS.OOYALA_LOGO}}
        resizeMode={options.resizeMode}>
      </Image>);
    }
    else {
      return null;
    }
  },

  shareWidget: function(options) {
    // TODO implement
    return null;
  },

  closedCaptionWidget: function(options) {
    // TODO implement
    return null;
  },

  bitrateSelectorWidget: function(options) {
    // TODO implement
    return null;
  },

  render: function() {

    var widgetsMap = {
      "playPause": this.playPauseWidget,
      "volume": this.volumeWidget,
      "timeDuration": this.timeDurationWidget,
      "flexibleSpace": this.flexibleSpaceWidget,
      "discovery": this.discoveryWidget,
      "fullscreen": this.fullscreenWidget,
      "moreOptions": this.moreOptionsWidget,
      "watermark": this.watermarkWidget,
      "share": this.shareWidget,
      "closedCaption": this.closedCaptionWidget,
      "bitrateSelector": this.bitrateSelectorWidget
    };
    var widgetOptions = this.props.options[this.props.widgetType];

    return widgetsMap[this.props.widgetType](widgetOptions);
  }

});

module.exports = controlBarWidget;