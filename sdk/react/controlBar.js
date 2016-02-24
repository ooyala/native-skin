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

var Log = require('./log');
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
    volume: React.PropTypes.number,
    onPress: React.PropTypes.func,
    showClosedCaptionsButton: React.PropTypes.bool,
    live: React.PropTypes.object, // a label to display and a function to handle golive.
    shouldShowLandscape: React.PropTypes.bool,
    config: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {playhead: 0, duration: 0};
  },
  getPlayHeadTimeString: function() {
    if (this.props.live) {
      return this.props.live.label;
    } else {
      return (Utils.secondsToString(this.props.playhead) + " -");
    }
  },
  getDurationString: function() {
    if (this.props.live) {
      return this.props.live.label;
    } else {
      return Utils.secondsToString(this.props.duration);
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
    var waterMarkName;
    if(this.props.platform == Constants.PLATFORMS.ANDROID) {
      waterMarkName = this.props.config.controlBar.watermark.imageResource.androidResource;
    }
    if(this.props.platform == Constants.PLATFORMS.IOS) {
      waterMarkName = this.props.config.controlBar.watermark.imageResource.iosResource;
    }
    var controlBarWidgets = [];

    var widgetOptions = {
      playPause: {
        onPress: this.onPlayPausePress,
        style: [styles.icon, {"fontSize": iconFontSize}, this.props.config.controlBar.iconStyle.active],
        playIcon: this.props.config.icons.play,
        pauseIcon: this.props.config.icons.pause,
        replayIcon: this.props.config.icons.replay,
        primaryActionButton: this.props.primaryButton
      },
      volume: {
        onPress: this.onVolumePress,
        style: this.state.showVolume ? [styles.icon, {"fontSize": iconFontSize}, styles.iconHighlighted, this.props.config.controlBar.iconStyle.active] : [styles.icon, {"fontSize": iconFontSize}, this.props.config.controlBar.iconStyle.active],
        iconOn: this.props.config.icons.volume,
        iconOff: this.props.config.icons.volumeOff,
        showVolume: this.state.showVolume && this.props.platform !== Constants.PLATFORMS.ANDROID, //TODO: Hide volume until it is implemented
        volume: this.props.volume,
        scrubberStyle: styles.volumeSlider,
        volumeControlColor:this.props.config.controlBar.volumeControl.color,
      },
      timeDuration: {
        onPress: this.props.live ? this.props.live.onGoLive : null,
        durationStyle: [styles.durationLabel, {"fontSize": labelFontSize}],
        playHeadTimeStyle: [styles.playheadLabel, {"fontSize": labelFontSize}],
        playHeadTimeString: this.getPlayHeadTimeString(),
        durationString: this.getDurationString()
      },
      fullscreen: {
        onPress: this.onFullscreenPress,
        style: [styles.icon, {"fontSize": iconFontSize}, this.props.config.controlBar.iconStyle.active],
        icon: this.props.fullscreen ? this.props.config.icons.compress : this.props.config.icons.expand
      },
      moreOptions: {
        onPress: this.onMorePress,
        style: [styles.icon, {"fontSize": iconFontSize}, this.props.config.controlBar.iconStyle.active],
        icon: this.props.config.icons.ellipsis
      },
      discovery: {
        onPress: this.onDiscoveryPress,
        style: [styles.icon, {"fontSize": iconFontSize}, this.props.config.controlBar.iconStyle.active],
        icon: this.props.config.icons.discovery
      },
      share: {
        onPress: this.onSocialSharePress,
        style: [styles.icon, {"fontSize": iconFontSize}, this.props.config.controlBar.iconStyle.active],
        icon: this.props.config.icons.share
      },
      closedCaption: {
        onPress: this.onClosedCaptionsPress,
        style: [styles.icon, {"fontSize": iconFontSize}, this.props.config.controlBar.iconStyle.active],
        icon: this.props.config.icons.cc
      },
      watermark: {
        shouldShow: Utils.shouldShowLandscape(this.props.width, this.props.height),
        style: styles.waterMarkImage,
        icon:waterMarkName,
        resizeMode: Image.resizeMode.contain
      }
    };

    var itemCollapsingResults = CollapsingBarUtils.collapse( this.props.width, this.props.config.buttons );
    // Log.verbose(itemCollapsingResults);  even more than verbose.  see what is being placed in the control bar

    for(var i = 0; i < itemCollapsingResults.fit.length; i++) {
      var widget = itemCollapsingResults.fit[i];
      controlBarWidgets.push(<ControlBarWidget
        key={i}
        widgetType={widget}
        options={widgetOptions}/>);
    }

    var paddingTopStyle = ResponsiveDesignManager.makeResponsiveValues(this.props.width, [17, 12, 6]);

    var widthStyle = {width:this.props.width};
    return (
      <View style={[styles.controlBarContainer, {bottom: paddingTopStyle}, widthStyle]}>
        {controlBarWidgets}
      </View>
    );
  }
});

module.exports = ControlBar;
