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
} = Constants;

var Utils = require('./utils');
var ControlBarWidget = require('./widgets/controlBarWidgets');
var CollapsingBarUtils = require('./collapsingBarUtils');
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
    primaryButton: React.PropTypes.string,
    fullscreen: React.PropTypes.bool,
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

    var controlBarWidgets = [];

    var widgetOptions = {
      playPause: {
        onPress: this.onPlayPausePress,
        style: [styles.icon, this.props.config.controlBar.iconStyle],
        playIcon: this.props.config.icons.play,
        pauseIcon: this.props.config.icons.pause,
        replayIcon: this.props.config.icons.replay,
        primaryActionButton: this.props.primaryButton
      },
      volume: {
        onPress: this.onVolumePress,
        style: this.state.showVolume ? [styles.icon, styles.iconHighlighted, this.props.config.controlBar.iconStyle] : [styles.icon, this.props.config.controlBar.iconStyle],
        icon: this.props.config.icons.volumeDown,
        showVolume: this.state.showVolume,
        scrubberStyle: styles.volumeSlider
      },
      timeDuration: {
        style: styles.label,
        durationString: this.getDurationString()
      },
      fullscreen: {
        onPress: this.onFullscreenPress,
        style: [styles.icon, this.props.config.controlBar.iconStyle],
        icon: this.props.fullscreen ? this.props.config.icons.compress : this.props.config.icons.expand
      },
      moreOptions: {
        onPress: this.onMorePress,
        style: [styles.icon, this.props.config.controlBar.iconStyle],
        icon: this.props.config.icons.ellipsis
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

    var itemCollapsingResults = CollapsingBarUtils.collapse( this.props.width, this.props.config.buttons );
    for(var i = 0; i < itemCollapsingResults.fit.length; i++) {
      var widget = itemCollapsingResults.fit[i];
      controlBarWidgets.push(<ControlBarWidget
        widgetType={widget}
        options={widgetOptions}
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