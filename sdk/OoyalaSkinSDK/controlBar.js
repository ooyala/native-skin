/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  View,
  LayoutAnimation
} = React;

var Constants = require('./constants');
var {
  ICONS,
  BUTTON_NAMES,
  IMG_URLS,
} = Constants;

var Utils = require('./utils');
var ControlBarWidget = require('./widgets/controlBarWidgets');
var VolumeView = require('./widgets/VolumeView');

var styles = Utils.getStyles(require('./style/controlBarStyles.json'));

var ControlBar = React.createClass({
  getInitialState: function() {
    return {
      showVolume: false,
    };
  },

  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    primaryActionButton: React.PropTypes.string,
    fullscreenButton: React.PropTypes.string,
    playhead: React.PropTypes.number,
    duration: React.PropTypes.number,
    onPress: React.PropTypes.func,
    showClosedCaptionsButton: React.PropTypes.bool,
    isShow: React.PropTypes.bool,
    live: React.PropTypes.string,
    shouldShowLandscape: React.PropTypes.bool,
    config: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {playhead: 0, duration: 0};
  },

  getDurationString: function() {
    if (this.props.live) {
      return this.props.live
    } else {
      return Utils.secondsToString(this.props.playhead) + Constants.UI_TEXT.SEPERATOR + Utils.secondsToString(this.props.duration);
    }
  },

  onPlayPausePress: function() {
    this.props.onPress(BUTTON_NAMES.PLAY_PAUSE);
  },

  onVolumePress: function() {
    this.setState({showVolume:!this.state.showVolume});
  },

  onSocialSharePress: function() {
    this.props.onPress && this.props.onPress(BUTTON_NAMES.SOCIAL_SHARE);
  },

  onClosedCaptionsPress: function() {
    this.props.onPress && this.props.onPress(BUTTON_NAMES.CLOSED_CAPTIONS);
  },

  onFullscreenPress: function() {
    this.props.onPress && this.props.onPress(BUTTON_NAMES.FULLSCREEN);
  },

  onMorePress: function() {
    this.props.onPress && this.props.onPress(BUTTON_NAMES.MORE);
  },

  componentDidUpdate: function(prevProps, prevState) {
    if(prevProps.isShow != this.props.isShow) {
      LayoutAnimation.configureNext(animations.layout.controlBarHideShow);
    }
  },

  render: function() {
    var volumeIcon = this.state.showVolume ? ICONS.VOLUMEUP : ICONS.VOLUMEDOWN;
    var shareIcon = ICONS.SHARE;
    var menuIcon = ICONS.ELLIPSIS;
    var closedCaptionsIcon = ICONS.CC;
    var volumeScrubber;
    var controlBarView;
    var durationString = this.getDurationString();
    if (this.state.showVolume) {
      volumeScrubber = <VolumeView style={styles.volumeSlider}/>;
    }

    var controlBarWidgets = [];

    var options = {
      playPause: {
        onPress: this.onPlayPausePress,
        style: styles.icon,
        primaryActionButton: this.props.primaryActionButton
      },
      volume: {
        onPress: this.onVolumePress,
        style: this.state.showVolume ? [styles.icon, styles.iconHighlighted] : styles.icon,
        volumeIcon: this.state.showVolume ? ICONS.VOLUMEUP : ICONS.VOLUMEDOWN,
        showVolume: this.state.showVolume,
        scrubberStyle: styles.volumeSlider
      },
      timeDuration: {
        style: styles.label,
        durationString: this.getDurationString()
      },
      fullscreen: {
        onPress: this.onFullscreenPress,
        style: styles.icon,
        icon: this.props.fullscreenButton
      },
      moreOptions: {
        onPress: this.onMorePress,
        style: styles.icon,
        icon: ICONS.ELLIPSIS
      },
      watermark: {
        shouldShow: Utils.shouldShowLandscape(this.props.width, this.props.height),
        style: styles.waterMarkImage,
        resizeMode: Image.resizeMode.contain
      }
    };

    var displayStyle = styles.container;
    if (this.props.isShow){
      displayStyle = styles.container;
    }
    else {
      displayStyle = styles.containerHidden;
    }

    for(var i in this.props.config.items) {
      controlBarWidgets.push(<ControlBarWidget
        widgetType={this.props.config.items[i]}
        options={options}
      />);
    }

    return (
      <View style={displayStyle}>
        {controlBarWidgets}
      </View>
    );
  }
});

var animations = {
  layout: {
    controlBarHideShow: {
      duration: 400,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleXY
      },
      update: {
        delay: 100,
        type: LayoutAnimation.Types.easeInEaseOut
      }
    }
  }
};

module.exports = ControlBar;