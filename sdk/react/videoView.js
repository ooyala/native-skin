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
  propTypes: {
    rate: React.PropTypes.number,
    playhead: React.PropTypes.number,
    buffered: React.PropTypes.number,
    duration: React.PropTypes.number,
    ad: React.PropTypes.object,
    live: React.PropTypes.bool,
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
    config: React.PropTypes.object,
    nextVideo: React.PropTypes.object,
    upNextDismissed: React.PropTypes.bool,
    localizableStrings: React.PropTypes.object,
    locale: React.PropTypes.string,
    playing: React.PropTypes.bool,
    loading: React.PropTypes.bool,
    initialPlay: React.PropTypes.bool
  },

  componentWillReceiveProps: function(nextProps) {
    if (this.state.showControls) {
      if ((new Date).getTime() - this.state.lastPressedTime > autohideDelay) {
        this.setState({showControls: false});
      }
    }
    if (nextProps.ad) {
      if (nextProps.rate == 0) {
        this.setState({showControls: true});
      } else {
        this.setState({showControls: false});
      }
    }
  },

  getInitialState: function() {
    return {
      showControls: false,
      showSharePanel: false,
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
    if (this.props.onScrub) {
      this.props.onScrub(1);
    }
  },

  onSocialButtonPress: function(socialType){
    this.props.onSocialButtonPress(socialType);
  },

  handlePress: function(name) {
    this.setState({lastPressedTime: new Date().getTime()});
    if (this.state.showControls) {
      if (name == "LIVE") {
        this.props.onScrub(1);
      } else {
        this.props.onPress(name);
      } 
    } else {
      this.toggleControls();
    } 
  },

  toggleControls: function() {
    var nextShowControls = !this.state.showControls;
    if (this.props.ad) {
      if (!this.props.config.adScreen.showControlBar) {
        nextShowControls = false;
      }
    }
    this.setState({showControls:nextShowControls});
  },

  _renderBottomOverlay: function(show) {
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
      isShow={show}
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
    var ccOpacity = this.props.closedCaptionsLanguage ? 1 : 0;
    return <ClosedCaptionsView
      style={[styles.closedCaptionStyle, {opacity:ccOpacity}]}
      captionJSON={this.props.captionJSON}
      onTouchEnd={(event) => this.handleTouchEnd(event)} />;
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
      width={this.props.width}/>;
  },

  _renderPlayPause: function(show) {
    var iconFontSize = ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.VIDEOVIEW_PLAYPAUSE);
    
    if(this.props.platform == Constants.PLATFORMS.ANDROID) {
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
        showButton={show}
        rate={this.props.rate}
        playing={this.props.playing}
        loading={this.props.loading}
        initialPlay={this.props.initialPlay}>
      </VideoViewPlayPauseAndroid>);
    } else if(this.props.platform == Constants.PLATFORMS.IOS) {
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
          fontSize={iconFontSize}
          showButton={show}
          rate={this.props.rate}
          playing={this.props.playing}
          loading={this.props.loading}
          initialPlay={this.props.initialPlay}>
        </VideoViewPlayPause>);
    }
    return null;
  },

  _handleSocialShare: function() {
    this.setState({showSharePanel:!this.state.showSharePanel});
  },

  handleScrub: function(value) {
    this.props.onScrub(value);
  },

  getDefaultProps: function() {
    return {isPlay: true, playhead: 0, buffered: 0, duration: 1};
  },

  handleTouchEnd: function(event) {
    this.setState({lastPressedTime: new Date().getTime()});
    this.toggleControls();
  },

  render: function() {
    var adBar = null;
    if (this.props.ad) {
      if (!this.props.playing) {
        showPlayPauseButton = true;
      }
      adBar = this.props.ad.requireAdBar ? this._renderAdBar() : null;
    }
    return (
      <View
        style={styles.container}>
        {adBar}
        {this._renderPlaceholder()}
        {this._renderClosedCaptions()}
        {this._renderPlayPause(this.state.showControls)}
        {this._renderUpNext()}
        {this._renderBottomOverlay(this.state.showControls)}
      </View>
    );
  }
});

module.exports = VideoView;