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
  BUTTON_NAMES,
  IMG_URLS,
  UI_SIZES
} = Constants;

var Utils = require('./utils');
var ControlBarWidget = require('./widgets/controlBarWidgets');
var CollapsingBarUtils = require('./collapsingBarUtils');
var VolumeView = require('./widgets/VolumeView');
var ResponsiveDesignManager = require('./responsiveDesignManager');

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
    primaryButton: React.PropTypes.string,
    fullscreen: React.PropTypes.bool,
    playhead: React.PropTypes.number,
    duration: React.PropTypes.number,
    onPress: React.PropTypes.func,
    showClosedCaptionsButton: React.PropTypes.bool,
    live: React.PropTypes.object, // a label to display and a function to handle golive.
    shouldShowLandscape: React.PropTypes.bool,
    config: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {playhead: 0, duration: 0};
  },

  getDurationString: function() {
    if (this.props.live) {
      return this.props.live.label;
    } else {
      return Utils.secondsToString(this.props.playhead) + "/" + Utils.secondsToString(this.props.duration);
    }
  },

  onPlayPausePress: function() {
    this.props.onPress(BUTTON_NAMES.PLAY_PAUSE);
  },

  onVolumePress: function() {
    this.setState({showVolume:!this.state.showVolume});
  },

  onSocialSharePress: function() {
    this.props.onPress && this.props.onPress(BUTTON_NAMES.SHARE);
  },

  onClosedCaptionsPress: function() {
    this.props.onPress && this.props.onPress(BUTTON_NAMES.CLOSED_CAPTIONS);
  },

  onDiscoveryPress: function() {
    this.props.onPress && this.props.onPress(BUTTON_NAMES.DISCOVERY);
  },

  onFullscreenPress: function() {
    this.props.onPress && this.props.onPress(BUTTON_NAMES.FULLSCREEN);
  },

  onMorePress: function() {
    this.props.onPress && this.props.onPress(BUTTON_NAMES.MORE);
  },

  render: function() {

    var iconFontSize = ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.CONTROLBAR_ICONSIZE);
    var labelFontSize = ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.CONTROLBAR_LABELSIZE);

    var controlBarWidgets = [];

    var widgetOptions = {
      playPause: {
        onPress: this.onPlayPausePress,
        style: [styles.icon, {"fontSize": iconFontSize}, this.props.config.controlBar.iconStyle],
        playIcon: this.props.config.icons.play,
        pauseIcon: this.props.config.icons.pause,
        replayIcon: this.props.config.icons.replay,
        primaryActionButton: this.props.primaryButton
      },
      volume: {
        onPress: this.onVolumePress,
        style: this.state.showVolume ? [styles.icon, {"fontSize": iconFontSize}, styles.iconHighlighted, this.props.config.controlBar.iconStyle] : [styles.icon, {"fontSize": iconFontSize}, this.props.config.controlBar.iconStyle],
        icon: this.props.config.icons.volume,
        showVolume: this.state.showVolume,
        scrubberStyle: styles.volumeSlider
      },
      timeDuration: {
        onPress: this.props.live ? this.props.live.onGoLive : null,
        style: [styles.label, {"fontSize": labelFontSize}],
        durationString: this.getDurationString()
      },
      fullscreen: {
        onPress: this.onFullscreenPress,
        style: [styles.icon, {"fontSize": iconFontSize}, this.props.config.controlBar.iconStyle],
        icon: this.props.fullscreen ? this.props.config.icons.compress : this.props.config.icons.expand
      },
      moreOptions: {
        onPress: this.onMorePress,
        style: [styles.icon, {"fontSize": iconFontSize}, this.props.config.controlBar.iconStyle],
        icon: this.props.config.icons.ellipsis
      },
      discovery: {
        onPress: this.onDiscoveryPress,
        style: [styles.icon, {"fontSize": iconFontSize}, this.props.config.controlBar.iconStyle],
        icon: this.props.config.icons.discovery
      },
      share: {
        onPress: this.onSocialSharePress,
        style: [styles.icon, {"fontSize": iconFontSize}, this.props.config.controlBar.iconStyle],
        icon: this.props.config.icons.share
      },
      closedCaption: {
        onPress: this.onClosedCaptionsPress,
        style: [styles.icon, {"fontSize": iconFontSize}, this.props.config.controlBar.iconStyle],
        icon: this.props.config.icons.cc
      },
      watermark: {
        shouldShow: Utils.shouldShowLandscape(this.props.width, this.props.height),
        style: styles.waterMarkImage,
        resizeMode: Image.resizeMode.contain
      }
    };


    console.log("Width: " + this.props.width);

    var itemCollapsingResults = CollapsingBarUtils.collapse( this.props.width, this.props.config.buttons );
    console.log(itemCollapsingResults);
    for(var i = 0; i < itemCollapsingResults.fit.length; i++) {
      var widget = itemCollapsingResults.fit[i];
      controlBarWidgets.push(<ControlBarWidget
        widgetType={widget}
        options={widgetOptions}/>);
    }

    var paddingTopStyle = ResponsiveDesignManager.makeResponsiveValues(this.props.width, [0, 4, 6]);

    var widthStyle = {width:this.props.width};
    return (
      <View style={[styles.container, {bottom: paddingTopStyle}, widthStyle]}>
        {controlBarWidgets}
      </View>
    );
  }
});

module.exports = ControlBar;