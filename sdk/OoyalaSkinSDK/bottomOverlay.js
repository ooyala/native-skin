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
var ProgressBar = require('./progressBar');
var ControlBar = require('./controlBar');
var styles = Utils.getStyles(require('./style/bottomOverlayStyles.json'));

var BottomOverlay = React.createClass({

  propTypes: {
    width: React.PropTypes.number,
    primaryButton: React.PropTypes.string,
    fullscreen: React.PropTypes.bool,
    playhead: React.PropTypes.number,
    duration: React.PropTypes.number,
    onPress: React.PropTypes.func,
    showClosedCaptionsButton: React.PropTypes.bool,
    isShow: React.PropTypes.bool,
    live: React.PropTypes.string,
    shouldShowLandscape: React.PropTypes.bool,
    shouldShowCCOptions: React.PropTypes.bool,
    config: React.PropTypes.object,
    onScrub: React.PropTypes.func
  },

  componentDidUpdate: function(prevProps, prevState) {
    if(prevProps.isShow != this.props.isShow) {
      LayoutAnimation.configureNext(animations.layout.controlBarHideShow);
    }
  },

  handleTouchStart: function(event) {
    this.setState({sliderX:event.nativeEvent.pageX});
  },

  handleTouchMove: function(event) {
    this.setState({sliderX:event.nativeEvent.pageX});   
  },

  handleTouchEnd: function(event) {
    if (this.props.onScrub) {
      this.props.onScrub(event.nativeEvent.pageX / this.props.width);
    }
  },

  _renderProgressBar: function(percent) {
    return (<ProgressBar ref='progressBar'
      percent={percent}
      width={this.props.width}
      onScrub={this.props.onScrub} />);
  },

  _renderControlBar: function() {
    return (<ControlBar
      ref='controlBar'
      primaryButton={this.props.showPlay ? "play" : "pause"}
      playhead={this.props.playhead}
      duration={this.props.duration}
      live={this.props.live}
      width={this.props.width}
      height={this.props.height}
      fullscreen = {this.props.fullscreen}
      onPress={this.props.onPress}
      showClosedCaptionsButton={this.props.showClosedCaptionsButton}
      showWatermark={this.props.showWatermark}
      config={this.props.config} />);
  },

  playedPercent: function(playhead, duration) {
    if (this.props.duration == 0) {
      return 0;
    }
    var percent = playhead / duration;
    if (percent > 1) {
      percent = 1;
    } else if (percent < 0) {
      percent = 0;
    }
    return percent;
  },

  render: function() {
    if (this.props.isShow) {
      var playedPercent = this.playedPercent(this.props.playhead, this.props.duration);
      var widthStyle = {width:this.props.width};
      return (
        <View style={[styles.container, widthStyle]}>
          {this._renderProgressBar(playedPercent)}
          {this._renderControlBar()}
        </View>
      );
    } else {
      return null;
    }
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

module.exports = BottomOverlay;