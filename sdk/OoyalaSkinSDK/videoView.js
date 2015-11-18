/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  Text,
  View,
  StyleSheet
} = React;

var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
var BottomOverlay = require('./bottomOverlay');
var ClosedCaptionsView = require('./closedCaptionsView');
var SharePanel = require('./sharePanel');
var AdBar = require('./adBar');
var UpNext = require('./upNext');
var RectButton = require('./widgets/RectButton');
var VideoViewPlayPause = require('./widgets/VideoViewPlayPause');
var VideoViewPlayPauseAndroid = require('./widgets/VideoViewPlayPauseAndroid');
var Constants = require('./constants');
var Log = require('./log');
var Utils = require('./utils');
var styles = Utils.getStyles(require('./style/videoViewStyles.json'));
var ResponsiveDesignManager = require('./responsiveDesignManager');

var autohideDelay = 5000;

var {
  BUTTON_NAMES,
  IMG_URLS,
  UI_SIZES
} = Constants;

var VideoView = React.createClass({
  getInitialState: function() {
    return {
      showControls: false,
      showSharePanel: false,
    };
  },

  propTypes: {
    rate: React.PropTypes.number,
    isPlay: React.PropTypes.bool,
    playhead: React.PropTypes.number,
    buffered: React.PropTypes.number,
    duration: React.PropTypes.number,
    live: React.PropTypes.bool,
    ad: React.PropTypes.object,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    volume: React.PropTypes.number,
    fullscreen: React.PropTypes.bool,
    onPress: React.PropTypes.func,
    onScrub: React.PropTypes.func,
    closedCaptionsLanguage: React.PropTypes.string,
    availableClosedCaptionsLanguages: React.PropTypes.array,
    captionJSON: React.PropTypes.object,
    onSocialButtonPress: React.PropTypes.func,
    showWatermark: React.PropTypes.bool,
    lastPressedTime: React.PropTypes.number,
    config: React.PropTypes.object,
    nextVideo: React.PropTypes.object,
    upNextDismissed: React.PropTypes.bool,
    localizableStrings: React.PropTypes.object,
    platform: React.PropTypes.string,
    locale: React.PropTypes.string
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
    if (this.props.onScrub) {
      this.props.onScrub(1);
    }
  },

  onSocialButtonPress: function(socialType){
    this.props.onSocialButtonPress(socialType);
  },

  handlePress: function(name) {
    console.log("in handle press"+name);
    if (name == "LIVE") {
      this.props.onScrub(1);
    }
    else if (name == BUTTON_NAMES.PLAY_PAUSE && this.props.isPlay) {
      this.state.showControls = false;
    }
    else if (name == BUTTON_NAMES.RESET_AUTOHIDE) {
      this.state.showControls = true;
    }
    this.props.onPress(name);
  },

  _renderBottomOverlay: function() {
    var shouldShowClosedCaptionsButton =
      this.props.availableClosedCaptionsLanguages &&
      this.props.availableClosedCaptionsLanguages.length > 0;

    return (<BottomOverlay
      width={this.props.width}
      height={this.props.height}
      primaryButton={this.props.isPlay ? "play" : "pause"}
      fullscreen = {this.props.fullscreen}
      playhead={this.props.playhead}
      duration={this.props.duration}
      volume={this.props.volume}
      live={this.generateLiveObject()}
      onPress={(name) => this.handlePress(name)}
      onScrub={(value)=>this.handleScrub(value)}
      showClosedCaptionsButton={shouldShowClosedCaptionsButton}
      showWatermark={this.props.showWatermark}
      isShow={this.controlsVisible()}
      config={{
        controlBar: this.props.config.controlBar,
        buttons: this.props.config.buttons,
        icons: this.props.config.icons
      }} />);
  },

  _renderAdBar: function() {
    return (<AdBar
        ad={this.props.ad}
        playhead={this.props.playhead}
        duration={this.props.duration}
        onPress={this.handlePress}
        width={this.props.width}
        localizableStrings={this.props.localizableStrings}
        locale={this.props.locale} />
      );
  },

  _renderPlaceholder: function() {
    //console.log("in _renderPlaceholder method")
    var placeholder;
    if(this.state.showSharePanel){
      var socialButtonsArray=this.props.shareScreen;
      placeholder = (
        <View
          style={styles.fullscreenContainer}>
          <SharePanel
          isShow={this.state.showSharePanel}
          socialButtons={socialButtonsArray}
          onSocialButtonPress={(socialType) => this.onSocialButtonPress(socialType)} />
        </View>
      );
    } else {
      placeholder = (
        <View
          style={styles.placeholder}
          onTouchEnd={(event) => this.handleTouchEnd(event)}>
        </View>);
    }
    return placeholder;
  },

  _renderClosedCaptions: function() {
    //console.log("in _renderClosedCaptions method")
    var ccOpacity = this.props.closedCaptionsLanguage ? 1 : 0;
    return <ClosedCaptionsView
      style={[styles.closedCaptionStyle, {opacity:ccOpacity}]}
      captionJSON={this.props.captionJSON}
      onTouchEnd={(event) => this.handleTouchEnd(event)} />;
  },

  _renderUpNext: function() {
    //console.log("in upNext method")
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
      width={this.props.width}/>;
  },

  _renderPlayPause: function() {
    var buttonOpacity;
    var iconFontSize = ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.VIDEOVIEW_PLAYPAUSE);
    if(this.controlsVisible()) {
      buttonOpacity = 1;
    }
    else {
      buttonOpacity = 0;
    }
    if(this.props.platform == Constants.PLATFORMS.ANDROID)
    {
      return (
      <VideoViewPlayPauseAndroid
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
        playing={this.props.isPlay}
        onPress={(name) => this.handlePress(name)}
        frameWidth={this.props.width}
        frameHeight={this.props.height}
        buttonWidth={iconFontSize}
        buttonHeight={iconFontSize}
        fontSize={iconFontSize}
        opacity={buttonOpacity}
        showButton={this.controlsVisible()}
        rate={this.props.rate}
        playhead={this.props.playhead}>
      </VideoViewPlayPauseAndroid>);
    }
    else if(this.props.platform == Constants.PLATFORMS.IOS)
    {

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
        playing={this.props.isPlay}
        onPress={(name) => this.handlePress(name)}
        frameWidth={this.props.width}
        frameHeight={this.props.height}
        buttonWidth={iconFontSize}
        buttonHeight={iconFontSize}
        fontSize={iconFontSize}
        opacity={buttonOpacity}
        showButton={this.controlsVisible()}
        rate={this.props.rate}
        playhead={this.props.playhead}>
      </VideoViewPlayPause>);
  }
  return null;
  },

  _handleSocialShare: function() {
    //console.log("in _handleSocialShare method")
    this.setState({showSharePanel:!this.state.showSharePanel});
  },

  handleScrub: function(value) {
    this.props.onScrub(value);
  },

  getDefaultProps: function() {
    return {isPlay: true, playhead: 0, buffered: 0, duration: 1};
  },

  controlsVisible: function() {
    return this.state.showControls && (new Date).getTime() < this.props.lastPressedTime + autohideDelay;
  },

  toggleBottomOverlay: function() {
    this.setState({showControls:!this.controlsVisible()});
    this.props.onPress();
  },

  handleTouchEnd: function(event) {
    this.toggleBottomOverlay();
  },

  render: function() {
    var adBar = null;

    if (this.props.ad) {
      if (this.props.rate == 0) {
        this.state.showControls = true;
      } else {
        this.state.showControls = false;
      }

      adBar = this.props.ad.requireAdBar ? this._renderAdBar() : null;
      if(this.props.config.adScreen.showControlBar == false && this.state.showControls == false) {
        return adBar;
      }
    }
    return (
      <View
        style={styles.container}>
        {adBar}
        {this._renderPlaceholder()}
        {this._renderClosedCaptions()}
        {this._renderPlayPause()}
        {this._renderUpNext()}
        {this._renderBottomOverlay()}
      </View>
    );

  }
});

module.exports = VideoView;