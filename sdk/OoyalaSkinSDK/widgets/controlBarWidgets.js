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
  ICONS,
  BUTTON_NAMES,
  IMG_URLS,
  } = Constants;

var controlBarWidget = React.createClass({

  propTypes: {
    widgetType: React.PropTypes.string,
    options: React.PropTypes.object
  },

  playPauseWidget: function (options) {
    return (
      <TouchableHighlight onPress={options.onPress}>
        <Text style={options.style}>{options.primaryActionButton}</Text>
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

    var widget = null;

    switch (this.props.widgetType) {
      case "playPause":
        widget = this.playPauseWidget(this.props.options[this.props.widgetType]);
        break;
      case "volume":
        widget = this.volumeWidget(this.props.options[this.props.widgetType]);
        break;
      case "timeDuration":
        widget = this.timeDurationWidget(this.props.options[this.props.widgetType]);
        break;
      case "flexibleSpace":
        widget = this.flexibleSpaceWidget(this.props.options[this.props.widgetType]);
        break;
      case "discovery":
        widget = this.discoveryWidget(this.props.options[this.props.widgetType]);
        break;
      case "fullscreen":
        widget = this.fullscreenWidget(this.props.options[this.props.widgetType]);
        break;
      case "moreOptions":
        widget = this.moreOptionsWidget(this.props.options[this.props.widgetType]);
        break;
      case "watermark":
        widget = this.watermarkWidget(this.props.options[this.props.widgetType]);
        break;
      case "share":
        widget = this.shareWidget(this.props.options[this.props.widgetType]);
        break;
      case "closedCaption":
        widget = this.closedCaptionWidget(this.props.options[this.props.widgetType]);
        break;
      case "bitrateSelector":
        widget = this.bitrateSelectorWidget(this.props.options[this.props.widgetType]);
        break;
    }

    return widget;
  }

});

module.exports = controlBarWidget;