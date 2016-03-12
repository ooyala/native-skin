/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

var Constants = require('./constants');
var {
  BUTTON_NAMES,
  IMG_URLS,
  UI_SIZES
} = Constants;

var Utils = require('./utils');
var ProgressBar = require('./progressBar');
var ControlBar = require('./controlBar');
var ResponsiveDesignManager = require('./responsiveDesignManager');

var styles = Utils.getStyles(require('./style/bottomOverlayStyles.json'));
var progressBarStyles = Utils.getStyles(require('./style/progressBarStyles.json'));
var topMargin = 6;
var leftMargin = 20;
var progressBarHeight = 6;
var scrubberSize = 18;
var scrubTouchableDistance = 45;
var cuePointSize = 12;
var BottomOverlay = React.createClass({

  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    primaryButton: React.PropTypes.string,
    fullscreen: React.PropTypes.bool,
    cuePoints: React.PropTypes.array,
    playhead: React.PropTypes.number,
    duration: React.PropTypes.number,
    ad: React.PropTypes.object,
    volume: React.PropTypes.number,
    onPress: React.PropTypes.func,
    onScrub: React.PropTypes.func,
    showClosedCaptionsButton: React.PropTypes.bool,
    isShow: React.PropTypes.bool,
    shouldShowProgressBar: React.PropTypes.bool,
    live: React.PropTypes.object,
    shouldShowLandscape: React.PropTypes.bool,
    config: React.PropTypes.object,
  },
  
  getDefaultProps: function() {
    return {"shouldShowProgressBar": true};
  },
  getInitialState: function() {
    if (this.props.isShow) {
      return {
        touch: false,
        opacity: new Animated.Value(1),
        height: new Animated.Value(ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.CONTROLBAR_HEIGHT))
      };
    }
    return {
      touch: false,
      opacity: new Animated.Value(0),
      height: new Animated.Value(0),
    };
  },

  componentDidUpdate: function(prevProps, prevState) {
    if(prevProps.width != this.props.width && this.props.isShow) {
      this.state.height.setValue(ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.CONTROLBAR_HEIGHT));
    }
    if(prevProps.isShow != this.props.isShow ) {
      this.state.opacity.setValue(this.props.isShow? 0 : 1);
      this.state.height.setValue(this.props.isShow? 1 : ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.CONTROLBAR_HEIGHT));
      Animated.parallel([
        Animated.timing(
          this.state.opacity,
          {
            toValue: this.props.isShow ? 1 : 0,
            duration: 500,
            delay: 0
          }),
        Animated.timing(
          this.state.height,
          {
            toValue: this.props.isShow ? ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.CONTROLBAR_HEIGHT) : 1,
            duration: 500,
            delay: 0
          })
      ]).start();
    }
  },

  _renderProgressBarWidth: function() {
    return this.props.width - 2 * leftMargin;
  },

  _renderTopOffset: function(componentSize) {
    return topMargin + progressBarHeight / 2 - componentSize / 2;
  },

  _renderLeftOffset: function(componentSize, percent, progressBarWidth) {
    return leftMargin + percent * progressBarWidth - componentSize / 2
  },

  _renderProgressScrubber: function(percent) {
    var progressBarWidth = this._renderProgressBarWidth();
    var topOffset = this._renderTopOffset(scrubberSize);
    var leftOffset = this._renderLeftOffset(scrubberSize, percent, progressBarWidth);
    var positionStyle = {top:topOffset, left:leftOffset};

    return (
      <Text style={[styles.progressScrubber, positionStyle]} >{"\uf111"}
      </Text>);
  },

  _renderProgressBar: function(percent) {
    return (<ProgressBar ref='progressBar' percent={percent} />);
  },

  _renderCompleteProgressBar: function() {
    if (!this.props.shouldShowProgressBar) {
      return;
    }
    var playedPercent = this.playedPercent(this.props.playhead, this.props.duration);
    return (
      <View
        onTouchStart={(event) => this.handleTouchStart(event)}
        onTouchMove={(event) => this.handleTouchMove(event)}
        onTouchEnd={(event) => this.handleTouchEnd(event)} style={styles.progressBarStyle}>
    {this._renderProgressBar(playedPercent)}
    {this._renderProgressScrubber(!this.props.ad && this.state.touch ? this.touchPercent(this.state.x) : playedPercent)}
    {this._renderCuePoints(this.props.cuePoints)}
    </View>);
  },
  _getCuePointLeftOffset: function(cuePoint, progressBarWidth) {
    var cuePointPercent = cuePoint / this.props.duration;
    if (cuePointPercent > 1) {
      cuePointPercent = 1;
    }
    if (cuePointPercent < 0) {
      cuePointPercent = 0;
    }
    var leftOffset = this._renderLeftOffset(cuePointSize, cuePointPercent, progressBarWidth);
    return leftOffset;
  },

  _renderCuePoints: function(cuePoints) {
    if (!cuePoints) {
      return;
    }
    var cuePointsView = [];
    var progressBarWidth = this._renderProgressBarWidth();
    var topOffset = this._renderTopOffset(cuePointSize);
    var leftOffset = 0;
    var positionStyle;
    var cuePointView;

    for (var i = 0; i < cuePoints.length; i++) {
      var cuePoint = cuePoints[i];
      leftOffset = this._getCuePointLeftOffset(cuePoint, progressBarWidth);
      positionStyle = {top:topOffset, left:leftOffset};
      cuePointView = (<Text key={i} style={[styles.cuePoint, positionStyle]} >{"\uf111"}
                        </Text>);
      cuePointsView.push(cuePointView);
    }

    return cuePointsView;
  },

  _renderControlBar: function() {
    return (<ControlBar
      ref='controlBar'
      primaryButton={this.props.primaryButton}
      platform={this.props.platform}
      playhead={this.props.playhead}
      duration={this.props.duration}
      volume={this.props.volume}
      live={this.props.live}
      width={this.props.width - 2 * leftMargin}
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
    if (this.isMounted()) {
      var touchableDistance = ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, scrubTouchableDistance);
      if ((this.props.height - event.nativeEvent.pageY) < touchableDistance) {
        return;
      }
      this.setState({touch:true, x:event.nativeEvent.pageX});
      this.props.onPress(BUTTON_NAMES.RESET_AUTOHIDE);
    }
  },

  handleTouchMove: function(event) {
    if (this.isMounted()) {
      this.setState({x:event.nativeEvent.pageX});
      this.props.onPress(BUTTON_NAMES.RESET_AUTOHIDE);
    }
  },

  handleTouchEnd: function(event) {
    if (this.isMounted()) {
      if (this.state.touch && this.props.onScrub) {
        this.props.onScrub(this.touchPercent(event.nativeEvent.pageX));
      }
      this.setState({touch:false, x:null});
      this.props.onPress(BUTTON_NAMES.RESET_AUTOHIDE);
    }
  },

  renderDefault: function(widthStyle) {
    return (
      <Animated.View style={[styles.container, widthStyle, {"height": this.state.height}]}>
        <View style ={[styles.bottomOverlayFlexibleSpace]}></View>
        {this._renderCompleteProgressBar()}
        {this._renderControlBar()}
      </Animated.View>
    );
  },

  renderLiveWithoutDVR: function(widthStyle) {
    return (
      <Animated.View style={[styles.container, widthStyle, {"height": this.state.height - 6}]}>
        {this._renderControlBar()}
      </Animated.View>
    );
  },

  render: function() {
    var widthStyle = {width:this.props.width, opacity:this.state.opacity};
    if (this.props.live && (this.props.config.live != null && !this.props.config.live.dvrEnabled)) {
      return this.renderLiveWithoutDVR(widthStyle);
    }

    return this.renderDefault(widthStyle);
  },
});

module.exports = BottomOverlay;