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
var progressBarStyles = Utils.getStyles(require('./style/progressBarStyles.json'));
var topMargin = 16;
var leftMargin = 20;
var progressBarHeight = 6;
var scrubberSize = 18;
var BottomOverlay = React.createClass({

  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    primaryButton: React.PropTypes.string,
    fullscreen: React.PropTypes.bool,
    playhead: React.PropTypes.number,
    duration: React.PropTypes.number,
    onPress: React.PropTypes.func,
    onScrub: React.PropTypes.func,
    showClosedCaptionsButton: React.PropTypes.bool,
    isShow: React.PropTypes.bool,
    live: React.PropTypes.string,
    shouldShowLandscape: React.PropTypes.bool,
    shouldShowCCOptions: React.PropTypes.bool,
    config: React.PropTypes.object,
    
  },

  getInitialState: function() {
    return {
      touch: false
    };
  },

  componentDidUpdate: function(prevProps, prevState) {
    if(prevProps.isShow != this.props.isShow) {
      LayoutAnimation.configureNext(animations.layout.controlBarHideShow);
    }
  },

  handleProgress: function(touch, percent) {
    this.setState({touch:touch, percent:percent});
    if (!touch && this.onScrub) {
      this.onScrub(this.state.percent);
    }
  },

  _renderProgressScrubber: function(percent) {
    var topOffset = topMargin + progressBarHeight / 2 - scrubberSize / 2;
    var progressBarWidth = this.props.width - 2 * leftMargin;
    var leftOffset = leftMargin + percent * progressBarWidth - scrubberSize / 2;
    var positionStyle = {top:topOffset, left:leftOffset};
    
    return (
      <Image
        source={{uri:"doc-gray-circle.png"}}
        style={[styles.progressScrubber, positionStyle]} >
      </Image>);
  },

  _renderProgressBar: function(percent) {
    return (<ProgressBar ref='progressBar' percent={percent} />);
  },

  _renderControlBar: function() {
    return (<ControlBar
      ref='controlBar'
      primaryButton={this.props.primaryButton}
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

  touchPercent: function(x) {
    var percent = (x - leftMargin) / (this.props.width - 2 * leftMargin);
    if (percent > 1) {
      percent = 1;
    } else if (percent < 0) {
      percent = 0;
    }
    return percent;
  },

  handleTouchStart: function(event) {
    if ((this.props.height - event.nativeEvent.pageY) < 50) {
      return;
    }
    this.setState({touch:true, x:event.nativeEvent.pageX});
    this.props.onPress(BUTTON_NAMES.RESET_AUTOHIDE);
  },

  handleTouchMove: function(event) {
    this.setState({x:event.nativeEvent.pageX});  
    this.props.onPress(BUTTON_NAMES.RESET_AUTOHIDE); 
  },

  handleTouchEnd: function(event) {
    if (this.state.touch && this.props.onScrub) {
      this.props.onScrub(this.touchPercent(event.nativeEvent.pageX));
    }
    this.setState({touch:false, x:null});
    this.props.onPress(BUTTON_NAMES.RESET_AUTOHIDE);
  },

  render: function() {
    if (this.props.isShow) {
      var playedPercent = this.playedPercent(this.props.playhead, this.props.duration);
      var widthStyle = {width:this.props.width};
      return (
        <View style={[styles.container, widthStyle]}
          onTouchStart={(event) => this.handleTouchStart(event)}
          onTouchMove={(event) => this.handleTouchMove(event)}
          onTouchEnd={(event) => this.handleTouchEnd(event)}>
          {this._renderProgressBar(playedPercent)}
          {this._renderControlBar()}
          {this._renderProgressScrubber(this.state.touch? this.touchPercent(this.state.x) : playedPercent)}
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