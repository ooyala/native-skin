/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  ActivityIndicatorIOS,
  ProgressBarAndroid,
  Image,
  Text,
  View,
  StyleSheet,
  TouchableHighlight
} = React;

var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
var BottomOverlay = require('../bottomOverlay');
var AdBar = require('../adBar');
var UpNext = require('../upNext');
var RectButton = require('../widgets/RectButton');
var VideoViewPlayPause = require('../widgets/VideoViewPlayPause');
var Constants = require('../constants');
var Log = require('../log');
var Utils = require('../utils');
var styles = Utils.getStyles(require('./style/videoViewStyles.json'));
var ResponsiveDesignManager = require('../responsiveDesignManager');
var VideoWaterMark = require('../widgets/videoWaterMark');
var autohideDelay = 5000;
var panelStyles = require('./style/panelStyles.json');

var {
  BUTTON_NAMES,
  PLATFORMS,
  IMG_URLS,
  UI_SIZES,
  AUTOHIDE_DELAY
} = Constants;

var VideoView = React.createClass({
  propTypes: {
    rate: React.PropTypes.number,
    platform: React.PropTypes.string,
    playhead: React.PropTypes.number,
    buffered: React.PropTypes.number,
    duration: React.PropTypes.number,
    adOverlay: React.PropTypes.object,
    live: React.PropTypes.bool,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    volume: React.PropTypes.number,
    fullscreen: React.PropTypes.bool,
    cuePoints: React.PropTypes.array,
    handlers:  React.PropTypes.shape({
      onPress: React.PropTypes.func,
      onAdOverlay: React.PropTypes.func,
      onAdOverlayDismiss: React.PropTypes.func,
      onScrub: React.PropTypes.func,
      handleVideoTouch: React.PropTypes.func,
      handleControlsTouch: React.PropTypes.func,
    }),
    lastPressedTime: React.PropTypes.any,
    closedCaptionsLanguage: React.PropTypes.string,
    availableClosedCaptionsLanguages: React.PropTypes.array,
    caption: React.PropTypes.string,
    showWatermark: React.PropTypes.bool,
    config: React.PropTypes.object,
    nextVideo: React.PropTypes.object,
    upNextDismissed: React.PropTypes.bool,
    localizableStrings: React.PropTypes.object,
    locale: React.PropTypes.string,
    playing: React.PropTypes.bool,
    loading: React.PropTypes.bool,
    initialPlay: React.PropTypes.bool,
  },

  componentWillReceiveProps: function(nextProps) {

  },

  getInitialState: function() {
    return {
    };
  },

  generateLiveObject: function() {
    if (this.props.live) {
      var isLive = this.props.playhead >= this.props.duration * 0.95;
      return ({
        label:
          isLive ? Utils.localizedString(this.props.locale, "LIVE", this.props.localizableStrings) :
          Utils.localizedString(this.props.locale, "GO LIVE", this.props.localizableStrings),
        onGoLive: isLive? null : this.onGoLive});
    } else {
      return null;
    }
  },

  onGoLive: function() {
    Log.log("onGoLive");
    if (this.props.handlers.onScrub) {
      this.props.handlers.onScrub(1);
    }
  },

  handlePress: function(name) {
    Log.verbose("VideoView Handle Press: " + name);
    if (this.state.showControls) {
      if (name == "LIVE") {
        this.props.handlers.onScrub(1);
      } else {
        this.props.handlers.onPress(name);
      }
    } else {
      this.props.handlers.onPress(name);
    }
  },

  _createOnIcon: function(index, func) {
    return function() {
      func(index);
    }
  },

  _renderBottomOverlay: function(show) {
    var shouldShowClosedCaptionsButton =
      this.props.availableClosedCaptionsLanguages &&
      this.props.availableClosedCaptionsLanguages.length > 0;

    return (<BottomOverlay
      width={this.props.width}
      height={this.props.height}
      primaryButton={this.props.playing ? "play" : "pause"}
      fullscreen = {this.props.fullscreen}
      cuePoints = {this.props.cuePoints}
      playhead={this.props.playhead}
      platform={this.props.platform}
      duration={this.props.duration}
      volume={this.props.volume}
      live={this.generateLiveObject()}
      onPress={(name) => this.handlePress(name)}
      onScrub={(value)=>this.handleScrub(value)}
      handleControlsTouch={() => this.props.handlers.handleControlsTouch()}
      showClosedCaptionsButton={shouldShowClosedCaptionsButton}
      showWatermark={this.props.showWatermark}
      isShow={show}
      config={{
        controlBar: this.props.config.controlBar,
        buttons: this.props.config.buttons,
        icons: this.props.config.icons,
        live: this.props.config.live
      }} />);
  },

  _renderPlaceholder: function() {
    return (
      <View
        style={styles.placeholder}
        onTouchEnd={(event) => this.props.handlers.handleVideoTouch(event)}>
      </View>);
  },

  _renderClosedCaptions: function() {
    if (this.props.caption) {
      return (
        <Text style={panelStyles.closedCaptions}>
          {this.props.caption}
        </Text>);
    }
    return null;
  },

  _renderUpNext: function() {
    if (this.props.live) {
      return null;
    }

    return <UpNext
      config={{
        upNext: this.props.config.upNext,
        icons: this.props.config.icons
      }}
      ad={this.props.ad}
      playhead={this.props.playhead}
      duration={this.props.duration}
      nextVideo={this.props.nextVideo}
      upNextDismissed={this.props.upNextDismissed}
      onPress={(value) => this.handlePress(value)}
      platform={this.props.platform}
      width={this.props.width}/>;
  },

  _renderPlayPause: function(show) {
    var iconFontSize = ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.VIDEOVIEW_PLAYPAUSE);
      return (
        <VideoViewPlayPause
          icons={{
            play: {
              icon: this.props.config.icons.play.fontString,
              fontFamily: this.props.config.icons.play.fontFamilyName
            },
            pause: {
              icon: this.props.config.icons.pause.fontString,
              fontFamily: this.props.config.icons.pause.fontFamilyName
            }
          }}
          position={"center"}
          onPress={(name) => this.handlePress(name)}
          frameWidth={this.props.width}
          frameHeight={this.props.height}
          buttonWidth={iconFontSize}
          buttonHeight={iconFontSize}
          platform={this.props.platform}
          fontSize={iconFontSize}
          showButton={show}
          rate={this.props.rate}
          playing={this.props.playing}
          loading={this.props.loading}
          initialPlay={this.props.initialPlay}>
        </VideoViewPlayPause>);
  },

  _renderVideoWaterMark: function() {
    var VideoWaterMarkSize = ResponsiveDesignManager.makeResponsiveMultiplier(UI_SIZES.VIDEOWATERMARK, UI_SIZES.VIDEOWATERMARK);
    var waterMarkName;
    if(this.props.platform == Constants.PLATFORMS.ANDROID) {
      waterMarkName = this.props.config.general.watermark.imageResource.androidResource;
    }
    if(this.props.platform == Constants.PLATFORMS.IOS) {
      waterMarkName = this.props.config.general.watermark.imageResource.iosResource;
    }
    return (
        <VideoWaterMark
          buttonWidth={VideoWaterMarkSize}
          buttonHeight={VideoWaterMarkSize}
          waterMarkName={waterMarkName}/>
          );
  },

  _renderAdOverlay: function() {
    if (!this.props.adOverlay) {
      return null;
    }

    var width = this.props.adOverlay.width;
    var height = this.props.adOverlay.height;
    if (width > this.props.width) {
      height = width / this.props.width * height;
      width = this.prop.width;
    }
    var left = (this.props.width - width) / 2;

    return (
      <TouchableHighlight 
        style={{height:height + 10, width:this.props.width}}
        onPress={this.handleOverlayClick}>
        <View style={{left: left, bottom: 10, width:width, height:height}}>
        <Image
          style={styles.container}
          source={{uri: this.props.adOverlay.resourceUrl}} >
        </Image>
        <TouchableHighlight 
          style={panelStyles.dismissOverlay}
          onPress={this.props.handlers.onAdOverlayDismiss}>
          <Text style={panelStyles.dismissIcon}>
            {this.props.config.icons.dismiss.fontString}
          </Text>
          </TouchableHighlight>
        </View>
      </TouchableHighlight>);
  },

  _renderLoading: function() {
    var loadingSize = ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.LOADING_ICON);
    var scaleMultiplier = this.props.platform == Constants.PLATFORMS.ANDROID ? 2 : 1;    
    var topOffset = Math.round((this.props.height - loadingSize * scaleMultiplier) * 0.5);
    var leftOffset = Math.round((this.props.width - loadingSize * scaleMultiplier) * 0.5);
    var loadingStyle = {position: 'absolute', top:topOffset, left:leftOffset, width: loadingSize, height: loadingSize};
    if (this.props.loading) {
      if(this.props.platform == Constants.PLATFORMS.ANDROID) {
        return (
          <View style={loadingStyle}>
            <ProgressBarAndroid styleAttr="Large"/>
          </View>
        );     
      }
      else if(this.props.platform == Constants.PLATFORMS.IOS){
        return (
        <View style={loadingStyle}>
          <ActivityIndicatorIOS
            animating={true}
            size="large">
          </ActivityIndicatorIOS>
        </View>);
      }
    }
  },

  handleScrub: function(value) {
    this.props.handlers.onScrub(value);
  },

  getDefaultProps: function() {
    return {playhead: 0, buffered: 0, duration: 1};
  },

  handleTouchEnd: function(event) {
    this.props.handlers.handleVideoTouch();
  },

  handleOverlayClick: function() {
    this.props.handlers.onAdOverlay(this.props.adOverlay.clickUrl);
  },

  render: function() {
    var isPastAutoHideTime = (new Date).getTime() - this.props.lastPressedTime > AUTOHIDE_DELAY;
    var shouldShowControls = !isPastAutoHideTime;

    return (
      <View
        style={styles.container}>
        {this._renderPlaceholder()}
        {this._renderClosedCaptions()}
        {this._renderVideoWaterMark()}
        {this._renderAdOverlay()}
        {this._renderPlayPause(shouldShowControls)}
        {this._renderUpNext()}
        {this._renderBottomOverlay(shouldShowControls)}
        {this._renderLoading()}
      </View>
    );
  }
});

module.exports = VideoView;
