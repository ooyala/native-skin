/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  SliderIOS,
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
    shouldShowLandscape: React.PropTypes.bool
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
      volumeScrubber = <SliderIOS style={styles.volumeSlider} />;
    }

    var watermark;
    // If is landscape
    if(Utils.shouldShowLandscape(this.props.width, this.props.height)) {
      watermark = (
        <Image style={styles.waterMarkImage}
          source={{uri: IMG_URLS.OOYALA_LOGO}}
          resizeMode={Image.resizeMode.contain}>
        </Image>);
    }

    var ccButton;
    if( this.props.showClosedCaptionsButton ) {
      ccButton = (<TouchableHighlight onPress={this.onClosedCaptionsPress}>
        <Text style={styles.icon}>{closedCaptionsIcon}</Text>
      </TouchableHighlight>);
    }

    var displayStyle = styles.container;
    if (this.props.isShow){
      displayStyle = styles.container;
    }
    else {
      displayStyle = styles.containerHidden;
    }

    return (
      <View style={displayStyle}>
        <TouchableHighlight onPress={this.onPlayPausePress}>
          <Text style={styles.icon}>{this.props.primaryActionButton}</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.onVolumePress}>
          <Text style={this.state.showVolume ? [styles.icon, styles.iconHighlighted] : styles.icon}>
            {volumeIcon}
          </Text>
        </TouchableHighlight>
        {volumeScrubber}
        <Text style={styles.label}>{durationString}</Text>
        <View style={styles.placeholder} />
        <TouchableHighlight onPress={this.onSocialSharePress}>
          <Text style={styles.icon}>{shareIcon}</Text>
        </TouchableHighlight>
        {ccButton}
        <TouchableHighlight onPress={this.onFullscreenPress}>
          <Text style={styles.icon}>{this.props.fullscreenButton}</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.onMorePress}>
          <Text style={styles.icon}>{menuIcon}</Text>
        </TouchableHighlight>
        {watermark}
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